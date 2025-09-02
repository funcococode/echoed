// app/settings/client.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { TbAdjustments, TbBell, TbBrush, TbLock, TbUserCog, TbLayoutGrid } from 'react-icons/tb';
import { cn } from '@/utils/cn';

const NAV = [
    { href: '/settings/profile', label: 'Profile', icon: TbUserCog },
    { href: '/settings/account', label: 'Account', icon: TbLock },
    { href: '/settings/privacy', label: 'Privacy', icon: TbAdjustments },
    { href: '/settings/notifications', label: 'Notifications', icon: TbBell },
    { href: '/settings/content', label: 'Content & Feed', icon: TbLayoutGrid },
    { href: '/settings/appearance', label: 'Appearance', icon: TbBrush },
];

export default function SettingsClient({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        < div className="space-y-4" >
            {/* Top nav (segmented pills) */}
            < div className="sticky top-16 z-10 rounded-2xl border border-gray-200 dark:border-neutral-800 p-2 shadow-sm" >
                <nav className="flex w-full items-center gap-2 overflow-x-auto">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'relative rounded-full px-4 py-2 text-sm transition-colors',
                                    'border border-transparent text-slate-700 dark:text-neutral-400 hover:text-slate-950 ',
                                    active && 'text-white dark:text-neutral-100 hover:text-white'
                                )}
                            >
                                {/* Sliding pill background */}
                                {active && (
                                    <motion.span
                                        layoutId="settings-pill"
                                        className="absolute inset-0 -z-10 rounded-full bg-slate-900 dark:bg-primary/50"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 inline-flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div >

            {/* Right content with minimal transitions */}
            < div className="relative" >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="rounded-2xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-4 shadow-sm sm:p-6"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div >
        </div >

    );
}
