'use client'

import Header from '@/components/ui/header'
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
                    <div className='absolute px-10 left-0 -translate-x-full space-y-4'>
                        <Link href={'/'} className='grid place-content-center p-3 rounded-full bg-gray-400/10 text-gray-400 border border-gray-100 hover:bg-indigo-700 hover:text-white'><TbHome2 /></Link>
                        <Link href={'/saved'} className='grid place-content-center p-3 rounded-full bg-gray-400/10 text-gray-400 border border-gray-100 hover:bg-indigo-700 hover:text-white'><TbBookmark /></Link>
                        <Link href={'/tags'} className='grid place-content-center p-3 rounded-full bg-gray-400/10 text-gray-400 border border-gray-100 hover:bg-indigo-700 hover:text-white'><TbTag /></Link>
                    </div>
                    <main className='flex-1'>
                        {children}
                    </main>
                </section>
            </div>
        </SessionProvider>
    )
}
