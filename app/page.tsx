'use client'

import { useState} from 'react'

// components
import DailyTasksButton from '@/components/main-page-components/DailyTasksButton'
import HabitTrackerButton from '@/components/main-page-components/HabitTrackerButton'
import DailyTasksMain from '@/components/main-page-components/DailyTasksMain'
import HabitTrackerMain from '@/components/main-page-components/HabitTrackerMain'

export default function Home() {

  const [activePage, setActivePage] = useState('dailyTasks')

  return (
    <main className="flex min-h-screen w-screen bg-blue-950 flex-col items-center p-2 sm:p-8 md:px-16 xl:px-48">
      <div className='bg-blue-50 rounded w-full p-1'>
        <div className='flex'>
          <div className="flex-1 m-1 rounded" onClick={() => setActivePage('dailyTasks')}>
            <DailyTasksButton activePage={activePage}/>
          </div>
          <div className="flex-1 m-1 rounded" onClick={() => setActivePage('habitTracker')}>
            <HabitTrackerButton activePage={activePage}/>
          </div>
        </div>
      </div>
      <div className='bg-blue-700 rounded w-full m-1'>
        { activePage === 'dailyTasks' ? (
          <DailyTasksMain/>
        ) : (
          <HabitTrackerMain/>
        )}
      </div>
    </main>
  )
}
