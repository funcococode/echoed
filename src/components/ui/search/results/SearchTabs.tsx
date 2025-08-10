'use client';

import { motion } from "motion/react";
import type { TabKey } from "./index";
import { TbUser, TbTag, TbFileText, TbGridDots } from "react-icons/tb";


type Counts = Record<TabKey, number>;

interface Props {
    active: TabKey;
    counts: Counts;
    onChange: (k: TabKey) => void;
}

export function SearchTabs({ active, counts, onChange }: Props) {
    const tabs: { key: TabKey; label: string; icon: JSX.Element }[] = [
        { key: "all", label: "All", icon: <TbGridDots className="w-4 h-4" /> },
        { key: "user", label: "Users", icon: <TbUser className="w-4 h-4 text-blue-500" /> },
        { key: "tag", label: "Tags", icon: <TbTag className="w-4 h-4 text-green-500" /> },
        { key: "echo", label: "Echoes", icon: <TbFileText className="w-4 h-4 text-yellow-500" /> },
    ];

    return (
        <div className="flex items-center gap-1">
            {tabs.map((t) => {
                const isActive = active === t.key;
                return (
                    <motion.button
                        key={t.key}
                        onClick={() => onChange(t.key)}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5
              ${isActive ? "text-primary" : "text-gray-600 hover:text-gray-800"}`}
                    >
                        {t.icon}
                        <span className="flex items-center gap-1">
                            {t.label}
                            <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"}`}>
                                {counts[t.key]}
                            </span>
                        </span>
                        {isActive && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute inset-0 rounded-lg bg-primary/10"
                                transition={{ type: "spring", stiffness: 320, damping: 25 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
