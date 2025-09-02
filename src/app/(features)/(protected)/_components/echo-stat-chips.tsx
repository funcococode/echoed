"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
    TbEye,
    TbArrowBigUp,
    TbArrowBigDown,
    TbShare3,
    TbBookmark,
} from "react-icons/tb";

// Optional: swap with your util
function cn(...s: (string | false | null | undefined)[]) {
    return s.filter(Boolean).join(" ");
}

// ——— Helpers ———
const formatNumber = (n: number) => {
    if (n < 1000) return `${n}`;
    if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
};

type EchoStats = {
    views: number;
    upvotes: number;
    downvotes: number;
    shares: number;
    bookmarks: number;
};

type EchoStatChipsProps = {
    stats: EchoStats;
    className?: string;
    /**
     * Size presets affect spacing and bar width.
     */
    size?: "sm" | "md";
    /**
     * If you want the bars to be relative to a custom max (e.g., site-wide max),
     * pass a number; otherwise the component uses the max of provided stats.
     */
    normalizeToMax?: number;
};

export default function EchoStatChips({
    stats,
    className,
    size = "sm",
    normalizeToMax,
}: EchoStatChipsProps) {
    const items = React.useMemo(
        () => [
            {
                key: "views",
                label: "Views",
                value: stats.views ?? 0,
                color: "#6366f1", // indigo-500
                Icon: TbEye,
            },
            {
                key: "upvotes",
                label: "Upvotes",
                value: stats.upvotes ?? 0,
                color: "#10b981", // emerald-500
                Icon: TbArrowBigUp,
            },
            {
                key: "downvotes",
                label: "Downvotes",
                value: stats.downvotes ?? 0,
                color: "#ef4444", // red-500
                Icon: TbArrowBigDown,
            },
            {
                key: "shares",
                label: "Shares",
                value: stats.shares ?? 0,
                color: "#0ea5e9", // sky-500
                Icon: TbShare3,
            },
            {
                key: "bookmarks",
                label: "Bookmarks",
                value: stats.bookmarks ?? 0,
                color: "#f59e0b", // amber-500
                Icon: TbBookmark,
            },
        ],
        [stats]
    );

    const maxVal =
        normalizeToMax ??
        items.reduce((m, it) => (it.value > m ? it.value : m), 0) ??
        0;

    const barW = size === "sm" ? 56 : 76;
    const barH = size === "sm" ? 6 : 8;
    const gap = size === "sm" ? "gap-2.5" : "gap-3";
    const padY = size === "sm" ? "py-1.5" : "py-2";
    const text = size === "sm" ? "text-[11px]" : "text-xs";
    const iconS = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

    return (
        <div
            className={cn(
                "flex flex-wrap w-full justify-between items-center gap-2",
                className
            )}
            role="group"
            aria-label="Echo interaction stats"
        >
            {items.map(({ key, label, value, color, Icon }) => {
                const pct = maxVal > 0 ? Math.max((value / maxVal) * 100, 0) : 0;

                return (
                    <motion.div
                        key={key}
                        className={cn(
                            "group relative flex items-center",
                            "rounded-xl border border-white/10 bg-white/5",
                            "dark:bg-black/30 dark:border-white/10",
                            padY,
                            gap,
                            "pl-2 pr-2.5"
                        )}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        title={`${label}: ${value}`}
                        aria-label={`${label} ${value}`}
                    >
                        {/* Faint glassy gradient wash */}
                        <div
                            className="pointer-events-none absolute inset-0 rounded-xl opacity-60"
                            style={{
                                background:
                                    "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                            }}
                        />

                        {/* Icon */}
                        <div
                            className={cn(
                                "grid place-items-center rounded-lg ring-1 ring-white/10",
                                "bg-white/10 dark:bg-white/5",
                                size === "sm" ? "h-6 w-6" : "h-7 w-7"
                            )}
                            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)" }}
                        >
                            <Icon className={cn(iconS)} style={{ color }} />
                        </div>

                        {/* Count + micro-bar */}
                        <div className="flex items-center gap-2">
                            <span className={cn("tabular-nums", text)}>{formatNumber(value)}</span>

                            <div
                                className="relative overflow-hidden rounded-full bg-white/8 ring-1 ring-white/10"
                                style={{ width: barW, height: barH }}
                                aria-hidden
                            >
                                {/* Track tint */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: `linear-gradient(90deg, rgba(255,255,255,0.14), ${hexToRgba(
                                            color,
                                            0.12
                                        )})`,
                                    }}
                                />
                                {/* Fill */}
                                <motion.div
                                    className="absolute left-0 top-0 h-full rounded-full"
                                    style={{ background: color, width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* Hover lift */}
                        <motion.div
                            className="absolute inset-0 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}

// ——— Tiny util to get rgba from hex ———
function hexToRgba(hex: string, alpha = 1) {
    const m = hex.replace("#", "");
    const bigint = parseInt(m.length === 3 ? m.split("").map(c => c + c).join("") : m, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
