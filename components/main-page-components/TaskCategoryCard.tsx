import { useState } from 'react'
import Taskbar from './Taskbar';

// icons
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaPen } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const TaskCategoryCard = () => {

  const [categoryTitle, setCategoryTitle] = useState('')
  const [isEdit, setIsEdit] = useState(true)

  return (
    <div>
      <div className="bg-blue-50 m-2 rounded border border-blue-500">
        <div className="flex items-center justify-between p-2 bg-blue-400 text-blue-50 text-lg border-b border-blue-50 font-bold">
          {isEdit ? (
            <>
              <input placeholder='Enter category title...' className='bg-transparent placeholder-blue-200 w-full border-b focus:outline-none'
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}/>
            </>
          ) : (
            <>
              <h1>{categoryTitle}</h1>
            </>
          )}
          
          <div className="flex">
            <div className="mr-2 text-green-700">
              <FaCheck />
            </div>
            <div className="mr-2 text-slate-950"
              onClick={() => setIsEdit(!isEdit)}>
              <FaPen />
            </div>
            <div className="text-red-700">
              <ImCross />
            </div>
          </div>
        </div>
        <div className="bg-blue-300 p-2 text-blue-400">
          <Taskbar/>
        </div>
        <div className="flex items-center justify-center bg-blue-400 p-2 border-t font-bold border-blue-50 text-blue-700">
          <FaPlus/>
          <div className="ml-2">
            <button>Add Task</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCategoryCard