'use client'

import Header from '@/components/ui/header'
import LeftSidebar from '@/components/ui/sidebar/left-sidebar'
import { SessionProvider } from 'next-auth/react'
import React, { type ReactElement } from 'react'

export default function FeedLayout({children}: {children: ReactElement}) {
  return (
    <SessionProvider>
        <div className='space-y-4 flex flex-col h-screen'>
            <Header />
            <section className='py-5 flex sticky flex-grow gap-4'>
                <aside className='w-1/6 shadow-md shadow-gray-500/10 h-fit rounded'>
                    <LeftSidebar />
                </aside>
                <main className='flex-1'>
                    {children}
                </main> 
            </section>
        </div>
    </SessionProvider>
  )
}
