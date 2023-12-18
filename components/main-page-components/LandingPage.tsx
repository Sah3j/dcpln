import React, { useState } from 'react'
import LoginPage from '@/components/main-page-components/LoginPage'
import RegistrationForm from './RegistrationForm'


const LandingPage = () => {

  const [activeForm, setActiveForm] = useState('login')

  return (
    <div className='h-screen w-full'>
      <div className='flex flex-col md:flex-row h-full justify-center'>
        <div className='flex md:flex-1 h-full justify-center items-center'>
          <h1 className='text-6xl'>DCPLN.</h1>
        </div>
        <div className='flex-initial w-full md:w-80 justify-center h-full flex items-center px-8 bg-neutral-800 border-t md:border-l md:border-t-0 border-neutral-700'>
          {activeForm === 'login' ? <LoginPage setActiveForm={setActiveForm}/> : <RegistrationForm setActiveForm={setActiveForm}/>}
        </div>
      </div>
    </div>
  )
}

export default LandingPage