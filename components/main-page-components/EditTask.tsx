import {useState} from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Pencil } from 'lucide-react';

interface props {
  taskDescription: string,
  taskID: number,
  hasNote: boolean,
  noteDescription: string,
  triggerFetch: boolean,
  setTriggerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTask: React.FC<props> = (props) => {

  const {taskDescription, taskID, hasNote, noteDescription, triggerFetch, setTriggerFetch} = props

  const [description, setDescription] = useState(taskDescription)
  const [checkNote, setCheckNote] = useState(hasNote)
  const [noteText, setNoteText] = useState(noteDescription)

  // dialog state
  const [open, setOpen] = useState(false);

  //handle task update request
  const editTask = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const API = `${apiUrl}/api/update-task`

    const payload = {
      task_id: taskID,
      task_description: description,
      note_description: noteText,
      hasNote: checkNote,
    };

    try {
      const response = await fetch(API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setTriggerFetch(!triggerFetch);
        setOpen(false);
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // handle delete task
  const deleteTask = async (taskID: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const API = `${apiUrl}/api/delete-task/${taskID}`;

    try {
      const response = await fetch(API);

      if (response.ok){
        console.log('Task Deleted Successfully')
        setTriggerFetch(!triggerFetch)
        setOpen(false);
      } else {
        console.log('Error deleting task:', response.statusText)
      }
    } catch (error) {
      console.log('Delete Error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Make changes and click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" value={description} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} 
              className="col-span-3 mt-2" />
          </div>
          <div className="">
            <Label htmlFor="note" className="text-right flex items-center justify-between">
              Note
              <Switch id="has-note" checked={checkNote} onCheckedChange={() => setCheckNote(!checkNote)}/>
            </Label>
            <Textarea
              disabled={!checkNote}
              id = "note"
              placeholder="Add more details about the task"
              value = {noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="resize-none mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={() => deleteTask(taskID)}>Delete Task</Button>
            <Button type="button" onClick={editTask}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditTask