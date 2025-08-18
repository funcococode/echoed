'use client'

import { SessionProvider } from 'next-auth/react'
import React, { type ReactElement } from 'react'

interface Props {
    children: ReactElement
    pageHeading?: ReactElement | null
}

export default function FeedLayout({ children, pageHeading }: Props) {

    return (
        <SessionProvider>
            <div className='space-y-4 flex flex-col relative h-screen  '>
                <section id="page-heading" className='relative'>
                    {pageHeading || null}
                </section>
                <section className='pb-5 flex flex-col order-1 md:flex-row md:sticky flex-grow space-y-10 md:space-y-0'>
                    <main className='md:w-5/6 flex-1 order-3 space-y-4 relative'>
                        {children}
                    </main>
                </section>
            </div>
        </SessionProvider>
    )
}