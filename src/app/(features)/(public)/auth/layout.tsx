'use client'
import Link from 'next/link'
import React, { type ReactElement } from 'react'
import { Toaster } from 'sonner'

export default function AuthLayout({children} : {children: ReactElement}) {
  return (
    <div className='h-screen flex flex-col'>
        <header className='p-5 '>
            <Link href='/' className='text-lg font-bold'>Echoed</Link>
        </header>
        <main className='flex-1 grid place-content-center'>
            {children}
        </main>
    </div>
  )
}
