from flask import Flask, jsonify, request
import bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import timedelta, timezone, datetime
import json

load_dotenv()

DATABASE = os.getenv('DATABASE')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')


app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "098b8da218069ab8eed25f86c98c83214bf5788baa8a7364853b40ad4ebe54a6"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=20)
jwt = JWTManager(app)

# database connection
try:
    con = psycopg2.connect(
        database=DATABASE,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        host="dcpln-postgres-1.cdimirwb1wjj.us-east-2.rds.amazonaws.com",
        port="5432")
    cur = con.cursor()
except Exception as e:
    print('Error:', e)

# register new user
@app.route('/api/register-user', methods=['GET', 'POST'])
def register_user():
  if request.method == 'POST':
    data = request.json
    name = data.get('display_name')
    email = data.get('email')
    password = data.get('password')

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    decoded_hashed_password = hashed_password.decode('utf-8')

    cur.execute('INSERT INTO users (email, password, name) VALUES (%s, %s, %s)', (email, decoded_hashed_password, name))

    con.commit()
    return 'User created successfully'
  else:
     return 'Failed to create new user'
  
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
  
# login
@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None).encode('utf-8')

    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if user and bcrypt.checkpw(password, user[2].encode('utf-8')):
            access_token = create_access_token(identity=email)
            response = {
                "access_token": access_token,
                "user_id": user[0],
                "name": user[3],
                "email": user[1]
            }
            return response
        else:
            return {"msg": "Wrong email or password"}, 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# logout
@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# fetch all categories based on the user
@app.route('/api/fetch-categories/<int:user_id>')
def fetch_user_categories(user_id=None):
  try:
    cur.execute(f'SELECT * FROM category WHERE user_id = {user_id}')
    rows = cur.fetchall()
    return jsonify(rows)
  except Exception as e:
    return jsonify({'error': str(e)}), 500
  
# fetch certain categories
@app.route('/api/fetch-some-categories/<int:user_id>/<string:date>')
def fetch_some_categories(user_id=None, date=None):
  try:
    query = """
        SELECT c.*
        FROM category c
        WHERE EXISTS (
            SELECT 1
            FROM task t
            WHERE t.cat_id = c.cat_id
            AND t.date = %s
        ) AND c.user_id = %s;
        """
    cur.execute(query, (date, user_id))
    rows = cur.fetchall()
    return jsonify(rows)
  except Exception as e:
    return jsonify({'error': str(e)}), 500
  
# fetch all tasks associated with a category
@app.route('/api/fetch-tasks/<int:user_id>/<string:date>')
def fetch_category_tasks(user_id=None, date=None):
    try:
        cur.execute("""
            SELECT
                c.cat_id as categoryID,
                c.title as categoryTitle,
                json_agg(
                    json_build_object(
                        'task_id', t.task_id,
                        'description', t.description,
                        'hasnote', t.hasnote,
                        'note', t.note,
                        'date', t.date,
                        'iscompleted', t.iscompleted
                    ) ORDER BY t.task_id
                ) FILTER (WHERE t.task_id IS NOT NULL) as categoryTasks
            FROM
                category c
            LEFT JOIN task t ON c.cat_id = t.cat_id AND t.date = %s
            WHERE
                c.user_id = %s
            GROUP BY c.cat_id, c.title
            """, (date, user_id))
        
        rows = cur.fetchall()
        
        # Convert query result to the desired format
        result = [
            {'categoryTitle': row[1], 'categoryID': row[0], 'categoryTasks': row[2]} 
            for row in rows
        ]
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#update task
@app.route('/api/update-task', methods=['GET', 'PUT'])
def update_task():
  if request.method == 'PUT':
    data = request.json
    task_id = data.get('task_id')
    task_description = data.get('task_description')
    note_description = data.get('note_description')
    hasNote = data.get('hasNote')

    cur.execute('UPDATE task SET description = %s, note = %s, hasnote = %s WHERE task_id = %s', (task_description, note_description, hasNote, task_id))
    con.commit()
    
    return 'Task Updated'
  else:
     return 'Failed to update task'
   
        
# add new category
@app.route('/api/add-category', methods=['GET', 'POST'])
def add_category():
  if request.method == 'POST':
    data = request.json
    title = data.get('category_title')
    user_id = data.get('user_id')
  
    cur.execute('INSERT INTO category (title, user_id) VALUES (%s, %s)', (title, user_id))

    con.commit()
    return 'Category Added'
  else:
     return 'Failed to add category'
  
# add new task 
@app.route('/api/add-task', methods=['GET', 'POST'])
def add_task():
  if request.method == 'POST':
    data = request.json
    description = data.get('taskDescription')
    cat_id = data.get('category')
    date = data.get('date')
    note = data.get('note')
    has_note = bool(note)
  
    cur.execute('INSERT INTO task (description, hasNote, note, date, cat_id) VALUES (%s, %s, %s, %s, %s)', (description, has_note, note, date, cat_id))

    con.commit()
    return 'Task Added'
  else:
     return 'Failed to add task'

# delete task
@app.route('/api/delete-task/<int:task_id>', methods=['GET', 'DELETE'])
def delete_task(task_id=None):
  cur.execute(f'DELETE FROM task WHERE task_id = {task_id}')
  con.commit()
  return 'Task Deleted'
   
# delete category
@app.route('/api/delete-category/<int:cat_id>', methods=['GET', 'DELETE'])
def delete_category(cat_id=None):
  cur.execute(f'DELETE FROM category WHERE cat_id = {cat_id}')
  con.commit()
  return 'Category Deleted'

# add task note
@app.route('/api/add-note', methods=['GET', 'PUT'])
def add_note():
  if request.method == 'PUT':
    data = request.json
    task_id = data.get('task_id')
    note = data.get('note')

    cur.execute('UPDATE task SET note = %s, hasnote = true WHERE task_id = %s', (note, task_id))
    con.commit()
    
    return 'Note Added'
  else:
     return 'Failed to add note'
  
# delete note
@app.route('/api/delete-note/<int:task_id>', methods=['GET', 'PUT'])
def delete_note(task_id=None):
   cur.execute(f'UPDATE task SET note = NULL, hasnote = false WHERE task_id = {task_id}')
   con.commit()
   return 'Note deleted'

# set task completed
@app.route('/api/task-completed/<int:task_id>', methods=['GET', 'PUT'])
def set_task_completed(task_id=None):
   cur.execute(f'UPDATE task SET iscompleted = true WHERE task_id = {task_id}')
   con.commit()
   return 'Task Completed'

# set task not completed
@app.route('/api/task-not-completed/<int:task_id>', methods=['GET', 'PUT'])
def set_task_not_completed(task_id=None):
   cur.execute(f'UPDATE task SET iscompleted = false WHERE task_id = {task_id}')
   con.commit()
   return 'Task Not Completed'

# update category title
@app.route('/api/update-category-title', methods=['GET', 'PUT'])
def update_category_title():
   if request.method == 'PUT':
      data = request.json
      title = data.get('title')
      cat_id = data.get('cat_id')

      cur.execute('UPDATE category SET title = %s WHERE cat_id = %s', (title, cat_id))
      con.commit()
      
      return 'Category title updated'
   else:
      return 'Category title not updated'

if __name__ == '__main__':
    app.run(debug=True)