import React from 'react'
import { useState } from 'react'

// shadcn imports
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFetchCategories } from '@/hooks/useFetchCategories'

// icons
import { Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'

interface props {
  setCategory: React.Dispatch<React.SetStateAction<string>>
}

const CategorySelect: React.FC<props> = (props) => {

  const { user } = useAuth()

  const [triggerCategoryFetch, setTriggerCategoryFetch] = useState(false)

  const categories = useFetchCategories(triggerCategoryFetch);

  const [newCategory, setNewCategory] = useState('')

  //handle add new category
  const handleAddNewCategory = async() => {
    if (newCategory !== '') {
      const API='http://127.0.0.1:5000/api/add-category'
      const data= {
        'category_title': newCategory,
        'user_id': user.id,
      }
      
      try {
        const response = await fetch(API , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
  
        if (response.ok) {
          console.log('Category added successfully');
  
          setNewCategory('');
          setTriggerCategoryFetch(!triggerCategoryFetch)
        } else {
          console.error("Failed to add task");
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  console.log(categories)

  const handleValueChange = (e: string) => {
    for (let category of categories) {
      category[1] === e && props.setCategory(category[0])
    }
  }

  return (
    <div className='mt-2'>
      <Select onValueChange={(e) => handleValueChange(e)} required>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <div className='flex px-4'>
              <Input type="text" placeholder="new category..." className='w-32'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button variant="outline" size="icon" className='ml-2'
                onClick={handleAddNewCategory}>
                <Check className="h-4 w-4"/>
              </Button>
            </div>
            {categories.map((category) => {
              const [categoryID, categoryTitle] = category
              return (
                <div key={categoryID}>
                  <SelectItem value={categoryTitle}>{categoryTitle}</SelectItem>
                </div>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default CategorySelect