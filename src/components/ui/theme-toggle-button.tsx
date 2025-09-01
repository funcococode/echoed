'use client';

import { useEffect, useMemo, useState } from 'react';
import { TbMoon, TbSun, TbSunMoon } from 'react-icons/tb';
import { cn } from '@/utils/cn';

type Size = 'sm' | 'md' | 'lg';
const SIZING: Record<Size, { w: number; h: number; pad: number; knob: number }> = {
    sm: { w: 36, h: 20, pad: 2, knob: 16 },
    md: { w: 44, h: 24, pad: 3, knob: 18 },
    lg: { w: 56, h: 32, pad: 4, knob: 24 },
};

export default function DarkModeSwitch({
    id = 'dark-mode-switch',
    label = 'Dark mode',
    description,
    size = 'md',
    className,
}: {
    id?: string;
    label?: string;
    description?: string;
    size?: Size;
    className?: string;
}) {
    const s = SIZING[size];
    const maxOffset = useMemo(() => s.w - s.pad * 3 - s.knob, [s]);

    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setMounted(true);
        try {
            const root = document.documentElement;
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = stored ? stored === 'dark' : prefersDark;
            root.classList.toggle('dark', initial);
            setIsDark(initial);
        } catch { }
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        const root = document.documentElement;
        root.classList.toggle('dark', next);
        try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { }
    };

    // knob left position (use left, not transform, to avoid clobbering translateY)
    const knobLeft = s.pad + (isDark ? maxOffset : 0);

    return (
        <label
            htmlFor={id}
            className={cn(
                'flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 ',
                'dark:border-white/15 dark:bg-white/5',
                className
            )}
        >
            {/* Left: label */}
            <div className="min-w-0">
                <div className="text-sm font-medium text-slate-500 dark:text-white flex items-center gap-3">
                    <TbSunMoon />
                    {label}
                </div>
                {description && (
                    <div className="text-xs text-slate-500 dark:text-white/70">{description}</div>
                )}
            </div>

            {/* Right: switch */}
            <div className="relative" style={{ width: s.w, height: s.h }}>
                <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    className="peer sr-only"
                    aria-checked={isDark}
                    checked={mounted && isDark}
                    onChange={toggle}
                />

                {/* Track */}
                <div
                    className={cn(
                        'absolute inset-0 rounded-full transition-colors',
                        'bg-gray-300 peer-checked:bg-slate-900',
                        'dark:bg-white/20 dark:peer-checked:bg-primary/90'
                    )}
                />

                {/* Icons */}
                <TbMoon
                    className={cn(
                        ' z-40 pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-opacity',
                        isDark ? 'opacity-0' : 'opacity-60',
                        'text-slate-700 dark:text-neutral-800'
                    )}
                />
                <TbSun
                    className={cn(
                        'z-40 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-opacity',
                        isDark ? 'opacity-80' : 'opacity-0',
                        'text-white dark:text-slate-800'
                    )}
                />

                {/* Knob */}
                <div
                    className={cn(
                        'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left]',
                        'dark:bg-neutral-100'
                    )}
                    style={{ width: s.knob, height: s.knob, left: knobLeft }}
                />
            </div>
        </label>
    );
}
