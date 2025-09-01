// components/form/radio-pill.tsx
'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/utils/cn';
import React from 'react';

type Option<T extends string = string> = {
    value: T;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export default function PillRadioGroup<T extends string>({
    name,
    value,
    onChange,
    options,
    layoutId,
    animate = true, // 👈 new
}: {
    name: string;
    value: T;
    onChange: (v: T) => void;
    options: Array<Option<T>>;
    layoutId: string;
    animate?: boolean;
}) {
    return (
        <div className="flex w-full flex-wrap gap-2 sm:max-w-xl">
            {options.map((opt) => {
                const selected = value === opt.value;
                const id = `${name}-${String(opt.value).toLowerCase()}`;
                return (
                    <label
                        key={opt.value}
                        htmlFor={id}
                        className={cn(
                            'relative cursor-pointer select-none rounded-full px-4 py-2 text-sm',
                            'border border-gray-200 text-slate-700',
                            'transition-colors ',
                            'hover:border-slate-400',
                            opt.disabled && 'pointer-events-none opacity-50'
                        )}
                    >
                        <input
                            id={id}
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={selected}
                            onChange={() => onChange(opt.value)}
                            disabled={opt.disabled}
                            className="sr-only"
                        />

                        {/* Selected background */}
                        {selected &&
                            (animate ? (
                                <AnimatePresence initial={false}>
                                    <motion.span
                                        layoutId={layoutId}
                                        className="absolute inset-0 z-10 rounded-full border-primary bg-primary"
                                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                    />
                                </AnimatePresence>
                            ) : (
                                // static (no animation on first paint)
                                <span className="absolute inset-0 -z-10 rounded-full bg-indigo-500/10" />
                            ))}

                        <span className="flex items-center gap-2 relative z-20 ">
                            {opt.icon && <span className={cn(selected && "text-white")}>{opt.icon}</span>}
                            <span className={cn('transition-colors', selected && 'text-white font-medium')}>
                                {opt.label}
                            </span>
                        </span>
                    </label>
                );
            })}
        </div>
    );
}
