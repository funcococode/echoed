"use client"

import { memo, useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { TbChevronRight, TbChevronLeft, TbDots } from "react-icons/tb";

/**
 * EchoedBreadcrumbs — v2 (Glass + Gradient)
 * A more opinionated, elegant breadcrumb for Echoed's brand.
 *
 * Design goals
 * - Frosted glass bar with soft inner glow
 * - Animated gradient "path" that subtly flows left→right
 * - Capsules for each crumb with micro‑lift on hover
 * - Auto‑collapse long trails to an ellipsis popover (keeps it minimal)
 * - Accessible & keyboard friendly
 *
 * Usage:
 * <EchoedBreadcrumbs
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Chambers", href: "/chambers" },
 *     { label: "Design", href: "/chambers/design" },
 *     { label: "Posts", href: "/chambers/design/posts" },
 *     { label: "Micro‑interactions" },
 *   ]}
 * />
 */

export type Crumb = {
    label: string;
    href?: string;
    onClick?: () => void;
};

export default memo(function EchoBreadcrumbs({
    items,
    className = "",
    maxVisible = 4,
    glass = true,
}: {
    items: Crumb[];
    className?: string;
    /** How many crumbs to show before collapsing middle into an ellipsis */
    maxVisible?: number;
    /** Enable frosted glass container */
    glass?: boolean;
}) {
    if (!items?.length) return null;
    const lastIndex = items.length - 1;

    const collapsed = useMemo(() => {
        if (items.length <= maxVisible) return { head: items, middle: [], tail: [] };
        return {
            head: [items[0]],
            middle: items.slice(1, lastIndex - 1),
            tail: [items[lastIndex - 1], items[lastIndex]],
        } as const;
    }, [items, maxVisible, lastIndex]);

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <div
                className={[
                    "relative w-full",
                    glass
                        ? "rounded-2xl bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5 ring-1 ring-secondary-light"
                        : "",
                ].join(" ")}
            >
                {/* Animated gradient path */}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:linear-gradient(to_right,transparent,black,transparent)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                >
                    <motion.div
                        className="absolute inset-y-0 -left-full w-[200%]"
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        style={{
                            background:
                                "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.10) 25%, rgba(236,72,153,0.12) 50%, rgba(56,189,248,0.10) 75%, transparent 100%)",
                        }}
                    />
                </motion.div>

                <ol className="relative z-10 flex items-center gap-1 p-1">
                    {/* Mobile back */}
                    <li className="md:hidden">
                        <BackButton previous={items[lastIndex - 1]} />
                    </li>

                    {/* Desktop / larger: trail with collapse */}
                    <li className="hidden md:flex w-full items-center">
                        {items.length <= maxVisible ? (
                            <Trail items={items} lastIndex={lastIndex} />
                        ) : (
                            <>
                                <Trail items={collapsed.head} lastIndex={-1} />
                                <EllipsisPopover items={collapsed.middle} />
                                <Trail items={collapsed.tail} lastIndex={collapsed.tail.length - 1} />
                            </>
                        )}
                    </li>

                    {/* Mobile current */}
                    <li className="ml-auto md:hidden">
                        <CurrentBadge label={items[lastIndex].label} />
                    </li>
                </ol>
            </div>
        </nav>
    );
});

function Trail({ items, lastIndex }: { items: Crumb[]; lastIndex: number }) {
    return (
        <ol className="flex items-center gap-1 text-sm">
            {items.map((item, i) => (
                <Capsule key={`${item.label}-${i}`} item={item} isLast={i === lastIndex} />
            ))}
        </ol>
    );
}

function Capsule({ item, isLast }: { item: Crumb; isLast: boolean }) {
    const base =
        "relative inline-flex items-center gap-2 px-3 h-9 rounded transition will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40";

    const capsule = (
        <motion.span
            layout
            initial={{ y: 2, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ y: -1 }}
            className={[
                base,
                isLast
                    ? "text-primary "
                    : "bg-white/0 hover:bg-white/5 ring-1 ring-white/10 text-gray-400",
            ].join(" ")}
        >
            <span className="truncate max-w-[18ch]">{item.label}</span>
            {!isLast && (
                <motion.span
                    aria-hidden
                    initial={{ opacity: 0, x: -2 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-zinc-500"
                >
                    <TbChevronRight />
                </motion.span>
            )}
        </motion.span>
    );

    if (isLast) return <span aria-current="page">{capsule}</span>;
    if (item.href)
        return (
            <Link href={item.href} className="group">
                {capsule}
            </Link>
        );
    return (
        <button type="button" onClick={item.onClick} className="group">
            {capsule}
        </button>
    );
}

function BackButton({ previous }: { previous?: Crumb }) {
    const Comp = previous?.href ? (
        <Link
            href={previous.href}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-white/10 text-zinc-300 hover:text-white"
        >
            <TbChevronLeft />
        </Link>
    ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-white/10 text-zinc-500">
            <TbChevronLeft />
        </span>
    );
    return (
        <motion.span whileHover={{ x: -2 }} className="inline-flex">{Comp}</motion.span>
    );
}

function CurrentBadge({ label }: { label: string }) {
    return (
        <span
            aria-current="page"
            className="inline-flex max-w-[60vw] truncate rounded-xl bg-zinc-950/60 px-3 h-9 items-center text-sm text-white ring-1 ring-white/10"
        >
            {label}
        </span>
    );
}

function EllipsisPopover({ items }: { items: Crumb[] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div ref={ref} className="relative mx-0.5">
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-2 rounded-xl px-2 ring-1 ring-white/10 text-zinc-300 hover:text-white"
            >
                <motion.span whileHover={{ rotate: 90 }} className="inline-flex"><TbDots /></motion.span>
                <span className="sr-only">Show more breadcrumbs</span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="absolute left-0 mt-2 min-w-[220px] rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur p-1 shadow-xl"
                    >
                        <ol className="grid gap-1">
                            {items.map((it, idx) => (
                                <li key={`${it.label}-${idx}`}>
                                    {it.href ? (
                                        <Link
                                            href={it.href}
                                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                                        >
                                            <span className="truncate">{it.label}</span>
                                            <TbChevronRight className="text-zinc-500" />
                                        </Link>
                                    ) : (
                                        <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-400">
                                            <span className="truncate">{it.label}</span>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}