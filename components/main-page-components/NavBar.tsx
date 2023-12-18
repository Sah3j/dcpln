import React from 'react'
import ModeToggle from '../ui/toggle-theme'
import { useAuth } from '@/context/AuthContext'
import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

const NavBar = () => {

  const { user, logout } = useAuth()

  return (
    <div className='flex justify-between items-center'>
      <div>
        Welcome {user.name}
      </div>
      <div className='flex gap-2'>
        <Button variant="outline" size="icon" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
        <ModeToggle/>
      </div>
    </div>
  )
}

export default NavBar