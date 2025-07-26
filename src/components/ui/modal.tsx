'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TbX } from 'react-icons/tb';

interface Props {
    title?: string,
    description?: string,
    children: React.ReactNode,
    open?: boolean
    onClose?: () => void
}


export function Modal({ title = 'Action', description, children, open = false, onClose }: Props) {
    const [isOpen, setIsOpen] = useState(open);

    function toggleOpen() {
        setIsOpen(false);
        onClose?.();
    }

    return createPortal(
        <dialog open={isOpen} className="rounded-md p-4 space-y-4" onClose={toggleOpen}>
            <div className="fixed inset-0 bg-black/30 grid place-content-center z-50">
                <div className='bg-white rounded-md p-4 w-full space-y-4'>
                    <div className='flex items-center justify-between relative z-10 '>
                        <div className='flex flex-col gap-1'>
                            <h1 className='font-semibold text-sm'>{title}</h1>
                            {!!description && <h2 className='font-medium text-xs text-gray-400'>{description}</h2>}
                        </div>
                        <button onClick={toggleOpen} className="text-gray-400 outline-none bg-gray-100 hover:bg-black hover:text-white p-1 text-sm rounded-md "><TbX /></button>
                    </div>
                    <main className='relative z-10'>
                        {children}
                    </main>
                </div>
            </div>
        </dialog>,
        document.getElementById('overlays')!
    );
}