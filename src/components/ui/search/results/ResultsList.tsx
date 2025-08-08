'use client';

import { motion } from "framer-motion";
import { ResultRow } from "./ResultRow";
import type { TabKey } from "./index";
import type { AnySearchItem, GroupedSearchData } from "@/actions/types/search";
import { TbMoodSad } from "react-icons/tb";
import { useSearchStore } from "@/stores/search";

interface Props {
    active: TabKey;
    grouped: Required<GroupedSearchData>;
    items: AnySearchItem[];
    onRowClick: () => void;
}

export function ResultsList({ active, grouped, items, onRowClick }: Props) {
    const { query } = useSearchStore();
    const Header = ({ children }: { children: React.ReactNode }) => (
        <h3 className="sticky top-0 z-10 px-4 py-4 text-xs font-semibold text-gray-500 tracking-wide bg-gray-50/90 backdrop-blur">
            {children}
        </h3>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="flex-1 overflow-y-auto"
        >
            {active === "all" ? (
                <>
                    {grouped.user.length > 0 && (
                        <>
                            <Header>Users</Header>
                            {grouped.user.map((item) => (
                                <ResultRow key={item.id} item={item} query={query} onClick={onRowClick} />
                            ))}
                        </>
                    )}
                    {grouped.tag.length > 0 && (
                        <>
                            <Header>Tags</Header>
                            {grouped.tag.map((item) => (
                                <ResultRow key={item.id} item={item} query={query} onClick={onRowClick} />
                            ))}
                        </>
                    )}
                    {grouped.echo.length > 0 && (
                        <>
                            <Header>Echoes</Header>
                            {grouped.echo.map((item) => (
                                <ResultRow key={item.id} item={item} query={query} onClick={onRowClick} />
                            ))}
                        </>
                    )}
                    {!grouped.echo.length && !grouped.tag.length && !grouped.user.length &&
                        <div className="h-44 grid place-content-center font-semibold text-sm text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                                <TbMoodSad className="text-2xl" />
                                Nothing found
                            </div>
                        </div>
                    }
                </>
            ) : (
                items?.length ? items.map((item) => (
                    <ResultRow key={item.id} item={item} query={query} onClick={onRowClick} />
                )) : <div className="h-44 grid place-content-center font-semibold text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <TbMoodSad className="text-2xl" />
                        Nothing found
                    </div>
                </div>
            )}
        </motion.div>
    );
}
