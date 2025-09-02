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

type EchoStats = {
    views: number;
    upvotes: number;
    downvotes: number;
    shares: number;
    bookmarks: number;
};

type Props = {
    stats: EchoStats;
    size?: number;           // overall square size in px
    thickness?: number;      // ring stroke width
    gap?: number;            // gap between rings
    className?: string;
    normalizeToMax?: number; // optional global max for stable scaling
    showLegend?: boolean;    // inline legend under the rings
    animate?: boolean;
};

const METRICS = [
    { key: "views", label: "Views", color: "#8B5CF6", Icon: TbEye },
    { key: "upvotes", label: "Upvotes", color: "#10B981", Icon: TbArrowBigUp },
    { key: "shares", label: "Shares", color: "#0EA5E9", Icon: TbShare3 },
    { key: "bookmarks", label: "Bookmarks", color: "#F59E0B", Icon: TbBookmark },
    { key: "downvotes", label: "Downvotes", color: "#F43F5E", Icon: TbArrowBigDown, dashed: true },
] as const;

export default function EchoRippleStats({
    stats,
    size = 152,
    thickness = 7,
    gap = 7,
    className,
    normalizeToMax,
    showLegend = true,
    animate = true,
}: Props) {
    // Prepare data (keep order stable for rings)
    const items = METRICS.map((m) => ({
        ...m,
        value: (stats as any)[m.key] ?? 0,
    }));

    const maxVal =
        normalizeToMax ??
        Math.max(1, items.reduce((m, it) => (it.value > m ? it.value : m), 0));

    // Layout math
    const pad = 10; // outer padding
    const center = size / 2;
    const ringCount = items.length;
    const totalRingDepth = ringCount * thickness + (ringCount - 1) * gap;
    const outerR = Math.min(center - pad, center - pad);
    const innerR = outerR - totalRingDepth + thickness / 2;

    const radiusForIndex = (i: number) => outerR - i * (thickness + gap) - thickness / 2;

    const totalEngagement =
        stats.upvotes + stats.downvotes + stats.shares + stats.bookmarks;

    // For accessibility
    const aria = `Echo stats: ${items.map(i => `${i.label} ${i.value}`).join(", ")}`;

    return (
        <div
            className={[
                "inline-flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-3  w-full",
                "dark:bg-black/30 dark:border-white/10",
                className,
            ].join(" ")}
            role="img"
            aria-label={aria}
            title={items.map(i => `${i.label}: ${i.value}`).join(" • ")}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block" }}
            >
                {/* subtle background ring */}
                <circle
                    cx={center}
                    cy={center}
                    r={innerR - gap}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={Math.max(2, thickness - 3)}
                />

                {/* soft pulsing halo */}
                {animate && (
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={outerR}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={2}
                        initial={{ opacity: 0.25, scale: 0.95, transformOrigin: "50% 50%" }}
                        animate={{ opacity: [0.25, 0.05, 0.25], scale: [0.95, 1.02, 0.95] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}

                {/* rings (outer -> inner) */}
                {items.map((it, idx) => {
                    const r = radiusForIndex(idx);
                    const c = 2 * Math.PI * r;
                    const ratio = Math.max(0, Math.min(1, it.value / maxVal));
                    const dash = c * ratio;
                    const gapDash = c - dash;
                    const stroke = it.color;

                    const circleProps = {
                        cx: center,
                        cy: center,
                        r,
                        fill: "none" as const,
                        strokeLinecap: "round" as const,
                        transform: "rotate(-90 " + center + " " + center + ")", // start at 12 o'clock
                    };

                    return (
                        <g key={it.key}>
                            {/* track */}
                            <circle
                                {...circleProps}
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth={thickness}
                            />
                            {/* value arc */}
                            <motion.circle
                                {...circleProps}
                                stroke={stroke}
                                strokeWidth={thickness}
                                strokeDasharray={`${dash} ${gapDash}`}
                                strokeDashoffset={0}
                                style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.12))" }}
                                initial={{ strokeDasharray: `0 ${c}` }}
                                animate={animate ? { strokeDasharray: [`0 ${c}`, `${dash} ${gapDash}`] } : undefined}
                                transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                                opacity={0.95}
                            />
                            {/* visual difference for downvotes */}
                            {it.dashed && (
                                <circle
                                    {...circleProps}
                                    stroke={stroke}
                                    strokeWidth={Math.max(1, thickness - 4)}
                                    strokeDasharray="2 6"
                                    opacity={0.35}
                                />
                            )}
                            {/* small tick to indicate arc end (improves reading) */}
                            {ratio > 0 && (
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={r}
                                    fill="none"
                                    stroke="transparent"
                                    strokeWidth={thickness}
                                >
                                    <title>{`${it.label}: ${it.value}`}</title>
                                </circle>
                            )}
                        </g>
                    );
                })}

                {/* rotating sweep highlight (subtle) */}
                {animate && (
                    <motion.g
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: `${center}px ${center}px` }}
                        opacity={0.35}
                    >
                        <circle
                            cx={center}
                            cy={center}
                            r={outerR}
                            fill="none"
                            stroke="url(#sweep)"
                            strokeWidth={2}
                        />
                    </motion.g>
                )}

                {/* defs */}
                <defs>
                    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>

                {/* center label */}
                <g>
                    <text
                        x={center}
                        y={center - 2}
                        fontSize="13"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.9)"
                        style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" as any }}
                    >
                        {/* {formatNumber(totalEngagement)} */}
                    </text>
                </g>
            </svg>

            {showLegend && (
                <div className="mt-2 flex items-center gap-4 ">
                    {items.map(({ key, label, color, Icon, value }) => (
                        <div
                            key={key}
                            className="flex items-center text-sm"
                            title={`${label}: ${value}`}
                        >
                            <Icon className="" style={{ color }} />
                            <span className="tabular-nums">{formatNumber(value)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function formatNumber(n: number) {
    if (n < 1000) return `${n}`;
    if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
}
