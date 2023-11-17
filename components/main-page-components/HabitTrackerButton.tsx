//icons
import { MdDateRange } from "react-icons/md";

interface Props {
  activePage: string;
}

const HabitTrackerButton: React.FC<Props> = ({ activePage }) => {
  return (
    <div className={`flex flex-row md:flex-col justify-center items-center rounded border border-blue-400 text-blue-400 hover:text-blue-600 hover:border-blue-600 p-4
      ${activePage === 'habitTracker' && 'bg-blue-700 text-blue-50 pointer-events-none'}`}>
      <div className="">
        <MdDateRange size={30}/>
      </div>
      <h1 className="text-md md:text-lg font-bold ml-2">
        Habit Tracker
      </h1>
    </div>
  )
}

export default HabitTrackerButton