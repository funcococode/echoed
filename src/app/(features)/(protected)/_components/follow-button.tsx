'use client';

import { useEffect, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TbUserCheck, TbUserPlus } from 'react-icons/tb';
import { cn } from '@/utils/cn';
import { toggleFollow, isFollowing } from '@/actions/follow';

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
    const [pending, start] = useTransition();
    const [following, setFollowing] = useState(false);
    const [shine, setShine] = useState(false);

    useEffect(() => {
        isFollowing(targetUserId)
            .then((res) => setFollowing(Boolean(res.data?.isFollowing)))
            .catch(console.log);
    }, [targetUserId]);

    const onToggle = () =>
        start(async () => {
            const res = await toggleFollow(targetUserId);
            if (res.success) {
                setFollowing((prev) => {
                    const next = !prev;
                    if (next) {
                        setShine(true);
                        setTimeout(() => setShine(false), 420);
                    }
                    return next;
                });
            }
        });

    return (
        <motion.button
            type="button"
            aria-pressed={following}
            disabled={pending}
            onClick={onToggle}
            initial={false}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'relative overflow-hidden rounded-xl border px-4 py-2 text-sm w-32 flex justify-between',
                'border-slate-300 transition-colors',
                following ? 'text-success border-success-light' : 'text-slate-800',
                'disabled:bg-gray-100 disabled:text-gray-300'
            )}
        >
            {/* Success background layer */}
            <motion.span
                aria-hidden
                className={cn('absolute inset-0 -z-10 origin-left', 'bg-success-light')}
                initial={false}
                animate={{
                    scaleX: following ? 1 : 0,
                    opacity: following ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
            />

            {/* Shine sweep on follow */}
            <AnimatePresence>
                {shine && (
                    <motion.span
                        key="shine"
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 -left-1/3 -z-0 w-1/3 skew-x-12 bg-white/40"
                        initial={{ x: '-20%', opacity: 0 }}
                        animate={{ x: '140%', opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.42, ease: 'easeOut' }}
                    />
                )}
            </AnimatePresence>

            {/* Content */}
            <span className="relative inline-flex items-center gap-2 w-full justify-between">
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                        key={following ? 'Following' : 'Follow'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="transition-colors"
                    >
                        {following ? 'Following' : 'Follow'}
                    </motion.span>
                </AnimatePresence>

                <AnimatePresence initial={false} mode="popLayout">
                    {following ? (
                        <motion.span
                            key="icon-check"
                            initial={{ opacity: 0, y: 6, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.9 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="grid h-4 w-4 place-items-center text-current transition-colors"
                        >
                            <TbUserCheck className="h-4 w-4" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="icon-plus"
                            initial={{ opacity: 0, y: 6, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.9 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="grid h-4 w-4 place-items-center text-current transition-colors"
                        >
                            <TbUserPlus className="h-4 w-4" />
                        </motion.span>
                    )}
                </AnimatePresence>

            </span>
        </motion.button>
    );
}
