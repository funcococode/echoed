'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getIcon, highlightMatch } from "./utils";
import type { AnySearchItem } from "@/actions/types/search";

interface Props {
    item: AnySearchItem;
    query?: string;
    onClick: () => void;
}

export function ResultRow({ item, query, onClick }: Props) {
    return (
        <Link
            href={item.url ?? "#"}
            className="group flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            {item.avatar ? (
                <Image
                    src={item.avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover flex-shrink-0"
                />
            ) : (
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0"
                >
                    {getIcon(item.type)}
                </motion.div>
            )}

            <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900 truncate capitalize">
                    {highlightMatch(item.name, query)}
                </span>
                {item.desc && (
                    <span className="text-xs text-gray-500 truncate">
                        {highlightMatch(item.desc, query)}
                    </span>
                )}
            </div>
        </Link>
    );
}
