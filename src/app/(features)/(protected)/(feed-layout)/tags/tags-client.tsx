// app/(dashboard)/tags/tags-client.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    TbSearch,
    TbArrowsSort,
    TbLayoutGrid,
    TbLayoutList,
} from "react-icons/tb";
import Input from "@/components/form/input"; // ← your Input component
import { useForm } from "react-hook-form";

type TagItem = {
    id: string;
    name: string;
    description: string | null;
    _count: { posts: number };
};

type LayoutMode = "chips" | "grid";

export default function TagsClient({ initialData }: { initialData: TagItem[] }) {
    const [query, setQuery] = React.useState("");
    const [sort, setSort] = React.useState<"popular" | "az">("popular");
    const [layout, setLayout] = React.useState<LayoutMode>("chips");

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = q
            ? initialData.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description?.toLowerCase().includes(q)
            )
            : initialData;

        const sorted = [...base].sort((a, b) => {
            if (sort === "popular") return b._count.posts - a._count.posts;
            return a.name.localeCompare(b.name);
        });

        return sorted;
    }, [initialData, query, sort]);

    return (
        <div className="space-y-5">
            <Toolbar
                onQuery={setQuery}
                sort={sort}
                onSort={setSort}
                layout={layout}
                onLayout={setLayout}
            />

            {filtered.length === 0 ? (
                <EmptyState />
            ) : layout === "chips" ? (
                <ChipWrap items={filtered} />
            ) : (
                <TileGrid items={filtered} />
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Minimal toolbar using your <Input /> and quiet pill controls
 * ──────────────────────────────────────────────────────────────────────────── */

function Toolbar({
    onQuery,
    sort,
    onSort,
    layout,
    onLayout,
}: {
    onQuery: (v: string) => void;
    sort: "popular" | "az";
    onSort: (v: "popular" | "az") => void;
    layout: "chips" | "grid";
    onLayout: (v: "chips" | "grid") => void;
}) {
    const { control, watch } = useForm<{ tags: string }>({
        defaultValues: {
            tags: ''
        }
    });

    const value = watch('tags');

    React.useEffect(() => {
        onQuery(value)
    }, [value, onQuery])

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1">
                <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    control={control}
                    placeholder="Search tags…"
                    aria-label="Search tags"
                    name="tags"
                    label="Search"
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                <PillTabs
                    ariaLabel="Sort"
                    value={sort}
                    onChange={(v) => onSort(v as typeof sort)}
                    options={[
                        { key: "popular", label: "Popular" },
                        { key: "az", label: "A–Z" },
                    ]}
                />
                <PillTabs
                    ariaLabel="Layout"
                    value={layout}
                    onChange={(v) => onLayout(v as "chips" | "grid")}
                    options={[
                        {
                            key: "chips",
                            label: "Chips",
                            icon: <TbLayoutList className="h-4 w-4" />,
                        },
                        {
                            key: "grid",
                            label: "Grid",
                            icon: <TbLayoutGrid className="h-4 w-4" />,
                        },
                    ]}
                    compact
                />
            </div>
        </div>
    );
}

function PillTabs({
    options,
    value,
    onChange,
    ariaLabel,
    compact,
}: {
    options: { key: string; label: string; icon?: React.ReactNode }[];
    value: string;
    onChange: (key: string) => void;
    ariaLabel?: string;
    compact?: boolean;
}) {
    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={[
                "inline-flex items-center gap-1 rounded-full border border-secondary bg-secondary p-1 font-semibold",
                compact ? "text-xs" : "text-sm",
            ].join(" ")}
        >
            {options.map((opt) => {
                const active = value === opt.key;
                return (
                    <button
                        key={opt.key}
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(opt.key)}
                        className={[
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-[background,border,color] cursor-pointer",
                            active
                                ? "bg-white"
                                : "hover:bg-secondary-light",
                        ].join(" ")}
                        title={opt.label}
                    >
                        {opt.icon}
                        {!compact && <span>{opt.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Minimal chips
 * ──────────────────────────────────────────────────────────────────────────── */

function ChipWrap({ items }: { items: TagItem[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
                {items.map((item, i) => (
                    <TagChip key={item.id} item={item} idx={i} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function TagChip({ item, idx }: { item: TagItem; idx: number }) {
    const hue = hueFromString(item.name);

    return (
        <motion.button
            type="button"
            title={item.description ?? undefined}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, delay: idx * 0.01 }}
            className="group inline-flex items-center gap-2 rounded-full border border-secondary bg-secondary-light/40 px-3.5 py-1.5 text-sm focus-visible:outline-none "
        // onClick={() => router.push(`/tags/${slugify(item.name)}`)}
        >
            <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: `hsl(${hue}, 70%, 60%)` }}
                aria-hidden
            />
            <span className="font-medium">{item.name}</span>
            <span className="rounded-full font-semibold px-2 py-0.5 text-sm tabular-nums text-gray-300">
                {item._count.posts}
            </span>
        </motion.button>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Minimal grid tiles
 * ──────────────────────────────────────────────────────────────────────────── */

function TileGrid({ items }: { items: TagItem[] }) {
    return (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence initial={false}>
                {items.map((item, idx) => {
                    const hue = hueFromString(item.name);
                    return <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 6, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.99 }}
                        transition={{ duration: 0.18, delay: idx * 0.008 }}
                        className="relative list-none border rounded-md border-secondary-light cursor-pointer"
                    >
                        <span
                            className="w-20 h-full inline-block absolute top-1/2 -translate-y-1/2 z-10"
                            style={{
                                background: `
                                    radial-gradient(24px 16px at 0% 50%, hsl(${hue} 70% 60% / .18), transparent 70%),
                                    linear-gradient(to right, #fff, hsl(${hue} 70% 60% / .14))
                                `
                            }}

                        ></span>
                        <button
                            type="button"
                            title={item.description ?? undefined}
                            className="w-full rounded-xl cursor-pointer z-20 relative p-4 text-left focus-visible:outline-none"
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <h3 className="line-clamp-1 font-semibold tracking-tight">
                                    {item.name}
                                </h3>
                                <span className="rounded-full px-2 py-0.5 text-sm font-semibold ">
                                    {item._count.posts}
                                </span>
                            </div>
                            {item.description ? (
                                <p className="line-clamp-2 text-sm text-gray-400">
                                    {item.description}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No description.</p>
                            )}
                        </button>
                    </motion.li>
                })}
            </AnimatePresence>
        </ul>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Empty state
 * ──────────────────────────────────────────────────────────────────────────── */

function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10">
                <TbArrowsSort className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold">No tags found</h3>
            <p className="mx-auto max-w-md text-sm text-gray-400">
                Try a different search, or create a new tag when you publish an Echo.
            </p>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Tiny util: deterministic hue per tag
 * ──────────────────────────────────────────────────────────────────────────── */

function hueFromString(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % 360;
}
