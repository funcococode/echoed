'use client'

import Header from '@/components/ui/header'
import { SessionProvider } from 'next-auth/react'
import React, { type ReactNode, type ReactElement } from 'react'

export default function FeedLayout({ children, modal }: { children: ReactElement, modal: ReactNode }) {
    return (
        <SessionProvider>
            <div className='space-y-4 flex flex-col'>
                <Header />
                <section className=''>
                    {children}
                    {modal}
                </section>
            </div>
        </SessionProvider>
    )
}
