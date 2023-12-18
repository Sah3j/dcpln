'use client'

import Taskbar from './Taskbar';

// shadcn imports
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// icons

interface Task {
  task_id: number;
  description: string;
  hasnote: boolean;
  note: string;
  date: string;
  iscompleted: boolean;
}

interface Props {
  categoryTitle: string,
  categoryTasks: Task[] | null,
  triggerFetch: boolean,
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>,
}

const CategoryCard: React.FC<Props> = (props) => {

  const { categoryTitle, categoryTasks, triggerFetch, setTriggerFetch } = props

  if (!categoryTasks) {
    return null
  }

  return (
    <Card className='m-2'>
      <CardHeader>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {categoryTitle}
        </h4>
      </CardHeader>
      <CardContent>
        {categoryTasks?.map((task) => {
          const {task_id, description, hasnote, note, date, iscompleted} = task
          return(
            <div key={task_id} className="my-2">
              <Taskbar 
                taskID={task_id} 
                taskDescription={description} 
                hasNote={hasnote} 
                noteDescription={note} 
                isCompleted={iscompleted}
                triggerFetch={triggerFetch} 
                setTriggerFetch={setTriggerFetch}/>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default CategoryCard