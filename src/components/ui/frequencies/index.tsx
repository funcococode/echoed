"use client";

import { useState } from "react";
import { motion } from "motion/react";

const tabs = ["For You", "Following", "Featured", "Topics"];

export default function EchoTabs() {
    const [active, setActive] = useState("For You");

    return (
        <div className="flex items-center w-full">
            <motion.div
                className="relative flex gap-6"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.12, // 👈 stagger timing
                        },
                    },
                }}
            >
                {tabs.map((tab) => {
                    const isActive = active === tab;
                    return (
                        <motion.button
                            key={tab}
                            onClick={() => setActive(tab)}
                            className={`relative px-1 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-gray-400 "
                                }`}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
                            }}
                        >
                            {tab}

                            {/* Animated underline */}
                            {isActive && (
                                <motion.div
                                    layoutId="echo-tab-underline"
                                    className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-primary"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
