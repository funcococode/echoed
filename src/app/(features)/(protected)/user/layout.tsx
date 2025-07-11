'use client'

import Header from '@/components/ui/header'
import LeftSidebar from '@/components/ui/sidebar/left-sidebar'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import React, { type ReactElement } from 'react'
import { TbBookmark, TbHome, TbHome2, TbTag } from 'react-icons/tb'

export default function FeedLayout({ children }: { children: ReactElement }) {
    return (
        <SessionProvider>
            <div className='space-y-4 flex flex-col h-screen'>
                <Header />
                <section className='py-5 flex relative flex-grow gap-4'>
                    <LeftSidebar slim />
                    <main className='flex-1'>
                        {children}
                    </main>
                </section>
            </div>
        </SessionProvider>
    )
}
