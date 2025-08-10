"use client";

import { motion } from "motion/react";

export default function ClickRipple({
    x,
    y,
    onDone,
    size = 24,
    scaleTo = 6,
    duration = 1.25,
}: {
    x: number;
    y: number;
    onDone: () => void;
    size?: number;
    scaleTo?: number;
    duration?: number;
}) {
    return (
        <motion.div
            className="absolute rounded-full"
            style={{ left: x, top: y, translateX: "-50%", translateY: "-50%", width: size, height: size }}
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: scaleTo, opacity: 0 }}
            transition={{ duration, ease: "easeOut" }}
            onAnimationComplete={onDone}
        >
            <div className="h-full w-full rounded-full border-2 border-cyan-300/70" />
            <div className="absolute inset-0 rounded-full blur bg-cyan-300/25" />
        </motion.div>
    );
}
