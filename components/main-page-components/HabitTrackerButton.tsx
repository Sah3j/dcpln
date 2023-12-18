//icons
import { MdDateRange } from "react-icons/md";

interface Props {
  activePage: string;
}

const HabitTrackerButton: React.FC<Props> = ({ activePage }) => {
  return (
    <div className={`flex flex-col justify-center items-center rounded border px-4 py-2
    ${activePage === 'habitTracker' ? 'bg-neutral-700 text-neutral-100 pointer-events-none' : 
    'border-neutral-700 text-neutral-700'}`}>
      <div className="">
        <MdDateRange size={24}/>
      </div>
      <h1 className="text-md font-bold ml-2">
        Habit Tracker
      </h1>
    </div>
  )
}

export default HabitTrackerButton