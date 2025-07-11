'use client';

import { type ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { TbX } from 'react-icons/tb';
import Button from '../form/button';

interface Props {
    title?: string,
    children: React.ReactNode,
    primaryButtonText?: string,
    primaryButtonAction?: () => void
    secondaryButtonText?: string,
    secondaryButtonAction?: () => void
}


export function Modal({ title = 'Action', children, primaryButtonAction, primaryButtonText, secondaryButtonAction, secondaryButtonText }: Props) {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        if (secondaryButtonAction) {
            secondaryButtonAction()

        }
        router.back();
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/10">
            <dialog ref={dialogRef} className="rounded-md p-4 space-y-4" onClose={onDismiss}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold text-sm'>{title}</h1>
                    <button onClick={onDismiss} className="text-gray-400 outline-none bg-gray-100 hover:bg-black hover:text-white p-1 text-sm rounded-md "><TbX /></button>
                </div>
                <main>
                    {children}
                </main>
                <footer>
                    <div className="space-x-4 flex justify-end">
                        {secondaryButtonAction && secondaryButtonText && <Button text={secondaryButtonText} onClick={onDismiss} variant='secondary' />}
                        {primaryButtonAction && primaryButtonText && <Button text={primaryButtonText} onClick={primaryButtonAction} />}
                    </div>
                </footer>
            </dialog>
        </div>,
        document.getElementById('overlays')!
    );
}