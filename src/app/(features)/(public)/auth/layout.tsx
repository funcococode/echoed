'use client'
import React, { type ReactElement } from 'react'
import AuthTransition from './auth-transition'

export default function AuthLayout({ children }: { children: ReactElement }) {
  return (
    <div className='h-screen flex flex-col max-w-[80vw] mx-auto'>
      <main className='flex-1 grid grid-cols-2 place-content-center'>
        <AuthTransition>
          {children}
        </AuthTransition>
      </main>
    </div>
  )
}
