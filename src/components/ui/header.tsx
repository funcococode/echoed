import React from 'react'
import { TbBell } from 'react-icons/tb'
import Button from '../form/button'
import { signOut } from 'next-auth/react'
import Logo from './logo'

export default function Header() {
  return (
    <header className='p-5 flex justify-between items-center sticky top-0 bg-white z-10 border rounded-b border-gray-100'>
      <div className='flex items-center gap-2'>
        <Logo />
        <h1 className='text-sm font-bold '>Echoed</h1>
      </div>
      <input className='text-sm bg-gray-100 rounded p-2 w-96 border outline-none' type='text' placeholder='Search for topics' />
      <div className='text-gray-500 text-sm font-medium flex items-center gap-4'>
        <button className='rounded-full p-2 bg-teal-500/10 text-teal-800'>
          <TbBell className='text-lg' />
        </button>
        <Button className='hover:text-red-500 ' onClick={() => signOut()} text='Logout' />
      </div>
    </header>
  )
}
