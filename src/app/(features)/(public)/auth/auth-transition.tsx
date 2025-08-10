"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

/**
 * Page-to-page transition for /auth.
 * - Wrapper has a fixed min-height so absolute children can render.
 * - Slide-fade, no blur. GPU-friendly.
 */
export default function AuthTransition({ children }: PropsWithChildren) {
    const pathname = usePathname();

    return (
        <div className="relative min-h-[90vh] col-span-2"> {/* <-- keep the container tall */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pathname}
                    className="absolute inset-0"         // stack pages; no layout reflow
                    initial={{ opacity: 0, x: 24, scale: 0.995 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -24, scale: 0.995 }}
                    transition={{ duration: 0.28, ease: [0.22, 0.03, 0.26, 1] }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
