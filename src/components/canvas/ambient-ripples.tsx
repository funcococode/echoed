"use client";

import { motion, type MotionValue } from "motion/react";
import clsx from "clsx";

type RippleColor = "cyan" | "violet" | "sky" | "teal";

export default function AmbientRipples({
    x,
    y,
    delayOffset = 0,
    duration = 5.2,
    rings = 6,
    base = 160,
    ringDelay = 0.42,
    scaleFrom = 1,
    scaleTo = 3,
    opacity = 0.5,
    blend = "screen",
    color = "cyan",
    className,
}: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    delayOffset?: number;
    duration?: number;
    rings?: number;
    base?: number;
    ringDelay?: number;
    scaleFrom?: number;
    scaleTo?: number;
    opacity?: number;
    blend?: "screen" | "lighten" | "plus-lighter" | "normal";
    color?: RippleColor;
    className?: string;
}) {
    // slightly stronger strokes to be reliably visible on dark bgs
    const colorClasses: Record<RippleColor, { stroke: string; glow: string }> = {
        cyan: { stroke: "border-cyan-200/55", glow: "border-cyan-100/25" },
        violet: { stroke: "border-violet-300/55", glow: "border-violet-200/25" },
        sky: { stroke: "border-sky-300/55", glow: "border-sky-200/25" },
        teal: { stroke: "border-teal-300/55", glow: "border-teal-200/25" },
    };

    const { stroke, glow } = colorClasses[color];

    return (
        <div
            className={clsx("absolute inset-0 pointer-events-none", className)}
            style={{
                mixBlendMode: blend as any,
                opacity,
            }}
        >
            {Array.from({ length: rings }).map((_, i) => {
                // distribute animation so at least one ring is mid‑cycle at t=0
                const delay = delayOffset + i * ringDelay;

                return (
                    <motion.div
                        key={`${delayOffset}-${i}`}
                        style={{
                            x,
                            y,
                            translateX: "-50%",
                            translateY: "-50%",
                            width: base,
                            height: base,
                        }}
                        className="absolute rounded-full will-change-transform"
                        initial={false}
                        animate={{
                            scale: [scaleFrom + i * 0.08, scaleTo + i * 0.08],
                            opacity: [0, 0.32, 0], // a touch brighter at peak
                        }}
                        transition={{
                            duration,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeOut",
                            times: [0, 0.22, 1],
                            delay, // half‑phase the *other* instance in the parent
                        }}
                    >
                        {/* stroke ring */}
                        <div className={clsx("h-full w-full rounded-full border", stroke)} />
                        {/* soft glow outline */}
                        <div
                            className={clsx(
                                "absolute inset-0 rounded-full blur-[2.5px] border",
                                glow
                            )}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}
