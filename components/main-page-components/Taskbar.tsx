import React from 'react'
import { useState } from 'react'

// icons
import { PiNoteBlankFill } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaPen } from "react-icons/fa";

const Taskbar = () => {

  const [taskDescription, setTaskDescription] = useState('')

  const [isEdit, setIsEdit] = useState(true)
  const [hasNote, setHasNote] = useState(false)

  return (
    <div className='border-b border-blue-50'>
      <div className='flex items-center'>
        <div onClick={() => setHasNote(true)}>
          <PiNoteBlankFill/>
        </div>
        <div className="flex flex-grow items-center justify-between p-2 text-blue-50">
          {isEdit ? (
            <>
              <input placeholder='Enter category title...' className='bg-transparent placeholder-blue-200 w-full border-b focus:outline-none'
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}/>
            </>
          ) : (
            <>
              <h1>{taskDescription}</h1>
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
      </div>
      { hasNote && (
        <div className='flex bg-blue-200'>
          <textarea placeholder='enter task notes...' className='w-full rounded bg-transparent p-2 focus:outline-none'/>
          <div className="text-blue-500 p-2" onClick={() => setHasNote(false)}>
              <ImCross size={12}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default Taskbar