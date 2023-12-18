'use client'

import { useState} from 'react'

// components
import DailyTasksButton from '@/components/main-page-components/DailyTasksButton'
import HabitTrackerButton from '@/components/main-page-components/HabitTrackerButton'
import DailyTasksMain from '@/components/main-page-components/DailyTasksMain'
import HabitTrackerMain from '@/components/main-page-components/HabitTrackerMain'
import NavBar from '@/components/main-page-components/NavBar'
import DatePicker from '@/components/main-page-components/DatePicker'
import LandingPage from '@/components/main-page-components/LandingPage'

import { useAuth } from '@/context/AuthContext'

export default function Home() {

  const { user } = useAuth();

  const [date, setDate] = useState<Date>()

  const [activePage, setActivePage] = useState('dailyTasks')

  return (
    <>
      { user ? ( 
        <main className="flex flex-col h-screen dark:bg-background p-2 sm:p-8 md:px-16 xl:px-48">
          <div className='fixed top-0 left-0 z-10 w-full bg-background pb-0 p-2 sm:p-8 md:px-16 xl:px-48'>
            <NavBar/>
            <div className='flex'>
              <div className="flex-1 m-1 rounded" onClick={() => setActivePage('dailyTasks')}>
                <DailyTasksButton activePage={activePage}/>
              </div>
              <div className="flex-1 m-1 rounded" onClick={() => setActivePage('habitTracker')}>
                <HabitTrackerButton activePage={activePage}/>
              </div>
            </div>
            <div>
              <DatePicker date={date} setDate={setDate}/>
            </div>
          </div>
          <div className='mt-40 mb-20 sm:mt-48 flex-1 overflow-auto w-full '>
            { activePage === 'dailyTasks' ? (
              <DailyTasksMain date={date}/>
            ) : (
              <HabitTrackerMain/>
            )}
          </div>
        </main>
      ) : (
        <LandingPage/>
      )}
    </>
  )
}
