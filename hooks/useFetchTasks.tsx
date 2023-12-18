'use client'

import { useEffect, useState } from 'react';

export function useFetchTasks(categoryID: number, triggerFetch: boolean = false, apiDate: string) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const API = `${apiUrl}/api/fetch-tasks/${categoryID}/${apiDate}`;
        console.log(API)
        const response = await fetch(API);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Error fetching tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    getTasks();
  }, [categoryID, triggerFetch, apiDate]);

  return tasks;
}