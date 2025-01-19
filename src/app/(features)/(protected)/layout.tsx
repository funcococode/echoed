'use client'

import Button from '@/components/form/button'
import Header from '@/components/ui/header'
import LeftSidebar from '@/components/ui/sidebar/left-sidebar'
import RightSidebar from '@/components/ui/sidebar/right-sidebar'
import { SessionProvider, signOut } from 'next-auth/react'
import React, { type ReactElement } from 'react'
import { TbBell } from 'react-icons/tb'

export default function FeedLayout({children}: {children: ReactElement}) {
  return (
    <SessionProvider>
        <div className='space-y-4 flex flex-col h-screen'>
            <Header />
            <section className='py-5 flex sticky flex-grow '>
                <aside className='w-1/6 shadow-md shadow-gray-500/10 h-fit rounded'>
                    <LeftSidebar />
                </aside>
                <main className='flex-1 px-4'>
                    {children}
                </main> 
                <aside className='w-1/6'>
                    <RightSidebar />
                </aside>
            </section>
        </div>
    </SessionProvider>
  )
}
