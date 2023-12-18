//icons
import { FaTasks } from "react-icons/fa";

interface Props {
  activePage: string;
}

const DailyTasksButton: React.FC<Props> = ({ activePage }) => {
  return (
    <div className={`flex flex-col justify-center items-center rounded border px-4 py-2
    ${activePage === 'dailyTasks' ? 'bg-neutral-900 text-neutral-100 pointer-events-none' : 
    'border-neutral-700 text-neutral-700'}`}>
      <div className="">
        <FaTasks size={24}/>
      </div>
      <h1 className="text-md font-semibold ml-2">
        Daily Tasks
      </h1>
    </div>
  )
}

export default DailyTasksButton