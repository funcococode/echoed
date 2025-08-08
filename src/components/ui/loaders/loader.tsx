'use client'
import { motion } from "motion/react";
import clsx from "clsx";


interface EchoLoaderProps {
    size?: number;       // diameter of largest ripple
    color?: string;      // tailwind color class
    overlay?: boolean;
    inline?: boolean;
    message?: string;
    speed?: number;      // time for one ripple cycle
}

export default function EchoLoader({
    size = 80,
    color = "text-indigo-800",
    overlay = false,
    inline = false,
    message,
    speed = 2
}: EchoLoaderProps) {
    const rippleCount = 3;

    const loaderElement = (
        <div
            className="relative flex flex-col items-center gap-3"
            style={{ width: size, height: size }}
        >
            {[...Array(rippleCount)].map((_, i) => (
                <motion.span
                    key={i}
                    className={clsx(
                        "absolute rounded-full border-4 border-current",
                        "blur-xs", // soft edges
                        color
                    )}
                    style={{
                        width: size,
                        height: size
                    }}
                    animate={{
                        scale: [0.5, 1.6],
                        opacity: [0, 1, 0] // smooth fade in/out
                    }}
                    transition={{
                        duration: speed,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: (i * speed) / rippleCount,
                        ease: "easeInOut"
                    }}
                />
            ))}
            {message && <span className="text-sm text-gray-500 mt-2">{message}</span>}
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
                {loaderElement}
            </div>
        );
    }

    if (inline) {
        return <span className="inline-flex items-center">{loaderElement}</span>;
    }

    return <div className="flex justify-center p-6">{loaderElement}</div>;
}