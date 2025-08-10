'use client'
import { motion } from 'motion/react'
export default function FloatingGlows() {
    return (
        <div className="absolute inset-0">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 12, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute top-1/4 right-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl"
            />
        </div>
    );
}