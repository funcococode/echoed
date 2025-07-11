'use client'

import Header from '@/components/ui/header'
import LeftSidebar from '@/components/ui/sidebar/left-sidebar'
import { SessionProvider } from 'next-auth/react'
import React, { type ReactNode, type ReactElement } from 'react'

export default function FeedLayout({ children, modal }: { children: ReactElement, modal: ReactNode }) {
    return (
        <SessionProvider>
            <div className='space-y-4 flex flex-col h-screen'>
                <Header />
                <section className='py-5 md:flex relative flex-grow gap-4'>
                    <LeftSidebar slim />
                    <main className='flex-1'>
                        {children}
                        {modal}
                    </main>
                </section>
            </div>
        </SessionProvider>
    )
}
