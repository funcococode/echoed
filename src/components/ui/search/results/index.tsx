'use client';

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbX } from "react-icons/tb";
import { ResultsList } from "./ResultsList";
import type { AnySearchItem, GroupedSearchData } from "@/actions/types/search";
import { SearchTabs } from "./SearchTabs";

interface Props {
    data: GroupedSearchData | null;
    setData: Dispatch<SetStateAction<GroupedSearchData | null>>;
    query?: string;
}

export type TabKey = "all" | "user" | "tag" | "echo";

export default function SearchResults({ data, setData, query }: Props) {
    const [active, setActive] = useState<TabKey>("all");

    const grouped = useMemo(() => ({
        user: data?.user ?? [],
        tag: data?.tag ?? [],
        echo: data?.echo ?? [],
    }), [data]);

    const counts = useMemo(() => ({
        all: grouped.user.length + grouped.tag.length + grouped.echo.length,
        user: grouped.user.length,
        tag: grouped.tag.length,
        echo: grouped.echo.length,
    }), [grouped]);

    const hasAny = counts.all > 0;

    const itemsForTab: AnySearchItem[] = useMemo(() => {
        if (!hasAny) return [];
        if (active === "all") return [...grouped.user, ...grouped.tag, ...grouped.echo];
        return grouped[active] as AnySearchItem[];
    }, [active, grouped, hasAny]);

    if (!hasAny) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
            >
                <div className="w-full max-w-2xl h-[75vh] bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col overflow-hidden">
                    <h1 className="text-sm font-semibold px-4 py-4 text-gray-500">Search Results</h1>
                    <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50/60">
                        <SearchTabs
                            active={active}
                            counts={counts}
                            onChange={setActive}
                        />
                        <motion.button
                            onClick={() => setData(null)}
                            whileTap={{ scale: 0.96 }}
                            className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100"
                            title="Clear results"
                        >
                            <TbX className="w-4 h-4" />
                            Clear
                        </motion.button>
                    </div>

                    <ResultsList
                        active={active}
                        grouped={grouped}
                        items={itemsForTab}
                        query={query}
                        onRowClick={() => setData(null)}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
