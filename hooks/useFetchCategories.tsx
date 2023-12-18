'use client'

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export function useFetchCategories(triggerCategoryFetch: boolean) {
  const [categories, setCategories] = useState([]);

  const { user } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API = `http://127.0.0.1:5000/api/fetch-categories/${user.id}`;
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
    };

    fetchCategories();
  }, [triggerCategoryFetch, user.id]);

  return categories;
}