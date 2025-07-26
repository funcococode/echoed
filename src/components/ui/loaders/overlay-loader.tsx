'use client'
import React from 'react'
import { createPortal } from 'react-dom'
import { TbLoader2 } from 'react-icons/tb'

interface Props {
    loading: boolean
}

export default function OverlayLoader({ loading }: Props) {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <>
            {loading ? <div className='fixed inset-0 bg-black/10 grid place-content-center z-50'>
                <TbLoader2 className='animate-spin text-4xl text-primary' />
            </div> : null}
        </>,
        document.getElementById('overlays')!
    )
}
