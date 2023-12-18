'use client'

import React from 'react'
import EditTask from './EditTask';

// icons
import { CheckCircle2 } from 'lucide-react';



interface TaskbarProps {
  taskDescription: string,
  taskID: number,
  hasNote: boolean,
  noteDescription: string,
  isCompleted: boolean,
  triggerFetch: boolean,
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Taskbar: React.FC<TaskbarProps> = (props) => {

  const {taskDescription, taskID, hasNote, noteDescription, isCompleted, triggerFetch, setTriggerFetch} = props

  //handle complete task
  const handleTaskCompletion = async (taskID: number) => {
    let API, consoleMessage
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (props.isCompleted === false) {
      API = `${apiUrl}/api/task-completed/${taskID}`;
      consoleMessage = "Task Comepleted SUccessfully"
    } else {
      API = `${apiUrl}/api/task-not-completed/${taskID}`;
      consoleMessage = "Task marked incomplete successfully"
    }

    try {
      const response = await fetch(API);

      if (response.ok) {
        console.log(consoleMessage)
        setTriggerFetch(!props.triggerFetch)
      } else {
        console.log('Error changing task status:', response.statusText)
      }
    } catch (error) {
      console.log('Task status update error:', error)
    }
  }

  return (
    <div className=''>
      <div className='flex items-center'>
        <div onClick={() => handleTaskCompletion(taskID)}
          className={`${isCompleted && 'text-green-500'}`}>
          <CheckCircle2 size={20}/>
        </div>
        <div className="flex flex-grow items-center justify-between ml-2">
          <p className={`leading-7 [&:not(:first-child)]:mt-6 ${isCompleted && 'line-through text-muted-foreground'}`}>
            {taskDescription}
          </p>
          <div>
            <EditTask
              taskID={taskID} 
              taskDescription={taskDescription} 
              hasNote={hasNote} 
              noteDescription={noteDescription}
              triggerFetch={triggerFetch} 
              setTriggerFetch={setTriggerFetch}
            />
          </div>
        </div>
      </div>
      { hasNote && (
        <div className='flex rounded'>
          <p className={`text-sm italic text-muted-foreground ${isCompleted && 'line-through'}`}>
            {noteDescription}
          </p>
        </div>
      )}
    </div>
  )
}

export default Taskbar