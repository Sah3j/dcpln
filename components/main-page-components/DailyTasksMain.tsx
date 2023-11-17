import TaskCategoryCard from "./TaskCategoryCard"

//icon
import { FaPlus } from "react-icons/fa";

const DailyTasksMain = () => {
  return (
    <div>
      <div className="flex justify-center items-center p-4 m-2 bg-blue-50 rounded-lg text-blue-700 sm:w-48 hover:cursor-pointer hover:drop-shadow-md">
        <FaPlus size={18}/>
        <p className="ml-2 select-none">Add Category</p>
      </div>
      <TaskCategoryCard/>
    </div>
  )
}

export default DailyTasksMain