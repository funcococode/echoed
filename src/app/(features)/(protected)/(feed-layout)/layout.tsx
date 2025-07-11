'use client'

import Header from '@/components/ui/header'
import LeftSidebar from '@/components/ui/sidebar/left-sidebar'
import RightSidebar from '@/components/ui/sidebar/right-sidebar'
import { SessionProvider } from 'next-auth/react'
import React, { type ReactElement } from 'react'

interface Props {
    children: ReactElement
}

export default function FeedLayout({ children }: Props) {
    return (
        <SessionProvider>
            <div className='space-y-4 flex flex-col h-screen'>
                <Header />
                <section className='py-5 flex flex-col order-1 md:flex-row md:sticky flex-grow space-y-10 md:space-y-0'>
                    <aside className='md:w-1/6 shadow-md shadow-gray-500/10 h-fit rounded'>
                        <LeftSidebar />
                    </aside>
                    <main className='flex-1 md:px-4 order-3 md:order-2'>
                        {children}
                    </main>
                    <aside className='md:w-1/6 order-2 md:order-3'>
                        <RightSidebar />
                    </aside>
                </section>
            </div>
        </SessionProvider>
    )
}
