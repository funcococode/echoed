'use client'
import React, { type ReactElement } from 'react'
import AuthTransition from './auth-transition'

export default function AuthLayout({ children }: { children: ReactElement }) {
  return (
    <div className='h-screen flex flex-col'>
      <main className='flex-1 grid grid-cols-2 place-content-center'>
        <AuthTransition>
          {children}
        </AuthTransition>
      </main>
    </div>
  )
}
