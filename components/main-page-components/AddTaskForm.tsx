'use client'

import { useState } from 'react';
import { format } from 'date-fns'

// shadcn imports
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import CategorySelect from './CategorySelect';
import DatePicker from './DatePicker';

interface props {
  triggerFetch: boolean,
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>,
}

const AddTaskForm: React.FC<props> = (props) => {

  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')
  const [category, setCategory] = useState('')

  // dialog state
  const [open, setOpen] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const task = {
      date: date && format(date, 'yyyy-MM-dd'),
      taskDescription: description,
      category: category,
      note: note,
      
    }
    
    console.log('Task to be added:', task);

    const API = 'http://127.0.0.1:5000/api/add-task'

    try {
      const response = await fetch(API , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        console.log('Task added successfully');
        props.setTriggerFetch(!props.triggerFetch)
        setOpen(false)

        //reset form data
        setDescription('')
        setNote('')
        setCategory('')
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error('Error:', error)
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className='flex justify-center border-t p-2'>
            <Button>Add Task</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add task</DialogTitle>
            <DialogDescription>
              Enter task details. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className='mt-2'>
                  <DatePicker date={date} setDate={setDate}/>
                </div>
              </div>
              <div className="">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <CategorySelect setCategory={setCategory}/>
              </div>
              <div className="">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" placeholder="Enter task description here..." value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 mt-2" required/>
              </div>
              <div className="">
                <Label htmlFor="note" className="text-right">
                  Note
                </Label>
                <Textarea
                id = "note"
                placeholder="Enter task notes here..."
                className="resize-none mt-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              </div>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddTaskForm