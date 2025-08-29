import { SessionProvider } from 'next-auth/react'
import React, { type ReactElement } from 'react'

export default function FeedLayout({ children }: { children: ReactElement }) {
    return (
        <SessionProvider>
            <div className='space-y-4 flex flex-col h-screen'>
                <section className='py-5 flex relative flex-grow gap-4'>
                    <main className='flex-1'>
                        {children}
                    </main>
                </section>
            </div>
        </SessionProvider>
    )
}
