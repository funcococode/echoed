'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { TbUser } from 'react-icons/tb';
import { cn } from '@/utils/cn';

type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_MAP: Record<SizeToken, number> = {
    xs: 20,  // sidebar chips
    sm: 24,  // beside name
    md: 36,  // post cards
    lg: 48,  // settings/profile small
    xl: 64,  // profile header
    '2xl': 96, // big profile
};

export type AvatarProps = {
    /** Primary image url. If absent/failed -> fallback */
    url?: string | null;
    /** Used for initials + DiceBear seed + alt text */
    name?: string | null;
    /** Prefer this seed (e.g., @username) for generated fallback */
    username?: string | null;
    /** Token or px number */
    size?: SizeToken | number;
    /** Circle or rounded tile */
    shape?: 'circle' | 'rounded';
    /** Show a ring around the avatar */
    withRing?: boolean;
    /** Dot status */
    status?: 'online' | 'idle' | 'busy' | 'offline';
    /** Prioritize image loading (e.g., profile header) */
    priority?: boolean;
    className?: string;
    /** Force generated fallback even if url is provided */
    forceGenerated?: boolean;
};

export default function Avatar({
    url,
    name,
    username,
    size = 'md',
    shape = 'rounded',
    withRing = false,
    status,
    priority = false,
    className,
    forceGenerated = false,
}: AvatarProps) {
    const px = typeof size === 'number' ? size : SIZE_MAP[size] ?? SIZE_MAP.md;
    const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

    const initials = useMemo(() => {
        const str = (name ?? username ?? '').trim();
        if (!str) return '';
        const parts = str.split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const last = parts.length > 1 ? parts?.[parts?.length - 1]?.[0] ?? '' : '';
        return (first + last || first).toUpperCase();
    }, [name, username]);

    const seed = useMemo(
        () => encodeURIComponent(username ?? name ?? 'EchoedUser'),
        [username, name]
    );
    const dicebearUrl = useMemo(() => {
        // Adjust remotePatterns in next.config.js for api.dicebear.com
        // Optional: tweak background palette
        const radius = shape === 'circle' ? 50 : 24;
        return `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}&size=256&radius=${radius}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    }, [seed, shape]);

    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Reset load/error when URL changes
    useEffect(() => {
        setImgLoaded(false);
        setImgError(false);
    }, [url, forceGenerated]);

    const showUrl = !forceGenerated && url ? url : dicebearUrl;
    const alt = (name ?? username ?? 'Avatar').toString();

    // Status dot styles
    const statusMap: Record<NonNullable<AvatarProps['status']>, string> = {
        online: 'bg-emerald-500',
        idle: 'bg-amber-500',
        busy: 'bg-rose-500',
        offline: 'bg-slate-400',
    };

    return (
        <div
            className={cn(
                'relative overflow-hidden border border-gray-200 bg-gradient-to-br from-slate-50 to-white text-slate-700 shadow-sm',
                radiusClass,
                withRing && 'ring-2 ring-white',
                className
            )}
            style={{ width: px, height: px }}
            aria-label={alt}
        >
            {/* Shimmer while loading */}
            {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-100" aria-hidden />
            )}

            {/* Image (with graceful fallback to initials/icon) */}
            {!imgError ? (
                <Image
                    src={showUrl}
                    alt={alt}
                    fill
                    sizes={`${px}px`}
                    className={cn('object-cover', radiusClass)}
                    priority={priority}
                    onLoadingComplete={() => setImgLoaded(true)}
                    onError={() => {
                        setImgError(true);
                        setImgLoaded(true);
                    }}
                />
            ) : (
                <div className={cn('grid h-full w-full place-items-center', radiusClass)}>
                    {initials ? (
                        <span
                            className="select-none font-semibold"
                            style={{ fontSize: Math.max(10, Math.round(px * 0.42)) }}
                        >
                            {initials}
                        </span>
                    ) : (
                        <TbUser className="h-1/2 w-1/2 text-slate-400" />
                    )}
                </div>
            )}

            {/* Status dot */}
            {status && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 h-3 w-3 translate-x-1 translate-y-1 rounded-full ring-2 ring-white',
                        statusMap[status]
                    )}
                />
            )}
        </div>
    );
}
