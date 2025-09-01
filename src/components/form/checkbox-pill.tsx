// components/form/checkbox-pill.tsx
'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils/cn';
import { TbCheck } from 'react-icons/tb';
import React from 'react';

export default function PillCheckbox({
    id,
    checked,
    onChange,
    icon,
    children,
    disabled,
    animate = true, // 👈 new
}: {
    id: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    icon?: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
    animate?: boolean;
}) {
    return (
        <label
            htmlFor={id}
            className={cn(
                'relative inline-flex max-w-full cursor-pointer select-none items-center gap-2 rounded-full px-4 py-2 text-sm',
                'border border-gray-200 bg-white text-slate-700',
                'transition-all',
                'hover:border-slate-400',
                disabled && 'pointer-events-none opacity-50'
            )}
        >
            <input
                id={id}
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
            />

            {/* highlight */}
            {checked &&
                (animate ? (
                    <AnimatePresence initial={false}>
                        <motion.span
                            key="bg"
                            className="absolute inset-0 z-10 rounded-full bg-primary/20"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                        />
                    </AnimatePresence>
                ) : (
                    <span className="absolute inset-0 z-10 rounded-full border border-primary bg-primary" />
                ))}

            {icon && <span className={cn("text-slate-700", checked && 'text-primary')}>{icon}</span>}

            <span className={cn('transition-colors z-20', checked && 'text-primary font-medium')}>
                {children}
            </span>

            <span
                aria-hidden
                className={cn(
                    'z-20 ml-1 grid h-4 w-4 place-items-center rounded-full border transition-colors',
                    checked
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-400 bg-white text-white'
                )}
            >
                <TbCheck className="h-3 w-3" />
            </span>
        </label>
    );
}
