'use client'

import React from 'react';
import { format } from 'date-fns'
import { useEffect, useState } from "react";
import AddTaskForm from "./AddTaskForm";
import DatePicker from "./DatePicker";
import CategoryCard from './CategoryCard';
import { useAuth } from '@/context/AuthContext';

interface props {
  date: Date | undefined
}

const DailyTasksMain: React.FC<props> = (props) => {

  const { user } = useAuth()

  const {date} = props

  const [categories, setCategories] = useState([]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (date) {
        const apiDate = format(date, 'yyyy-MM-dd')
        console.log(apiDate)
        try {
          const API = `http://127.0.0.1:5000/api/fetch-tasks/${user.id}/${apiDate}`;
          const response = await fetch(API);
  
          if (response.ok) {
            const data = await response.json();
            setCategories(data);
          } else {
            console.error('Error fetching categories:', response.statusText);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchCategories();
  }, [date, user.id, triggerFetch])

  return (
    <div className="flex flex-col h-full justify-between">
      <div className=''>
        <div className=''>
          {
            categories.map((category) => {
              const { categoryID, categoryTasks, categoryTitle } = category
              return (
                <div key={categoryID}>
                  <CategoryCard 
                    categoryTitle={categoryTitle} 
                    categoryTasks={categoryTasks}
                    triggerFetch={triggerFetch} 
                    setTriggerFetch={setTriggerFetch}
                    />
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="fixed left-0 bottom-0 w-full z-20 p-2 sm:px-8 md:px-14 xl:px-48 bg-background">
          <AddTaskForm triggerFetch={triggerFetch} setTriggerFetch={setTriggerFetch}/>
      </div>
    </div>
  )
}

export default DailyTasksMain