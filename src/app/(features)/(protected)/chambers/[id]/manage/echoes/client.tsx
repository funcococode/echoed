"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { type ColumnDef, type PaginationState, type RowSelectionState } from "@tanstack/react-table";
import { motion } from "motion/react";
import { TbDots, TbSearch, TbTrash, TbEye, TbPin, TbPinFilled } from "react-icons/tb";

import { DataTable } from "@/components/elements/table"; // ← your reusable table
import { Dropdown } from "@/components/elements/dropdown";
import Button from "@/components/form/button";
import { pinEchoToChamber, removeEchoFromChamber } from "./actions";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type EchoItem = {
    id: string,
    title: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
    user: {
        id: string,
        image: string | null,
        email: string | null,
        username: string
    },
    views: number,
    _count: {
        saves: number,
        votes: number,
        tags: number
    }
    isPinned?: boolean
};

export default function ManageEchoesClient({
    chamber,
    initial,
}: {
    chamber: { id: string; name: string };
    initial: {
        items: EchoItem[];
        total: number;
        page: number;      // 1-based
        pageSize: number;
        q: string;
    };
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Data + selection
    const [rows, setRows] = React.useState<EchoItem[]>(initial.items);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    React.useEffect(() => setRows(initial.items), [initial.items]);

    const setParam = React.useCallback(
        (key: string, value: string | null) => {
            const sp = new URLSearchParams(searchParams.toString());
            if (value == null || value === "") sp.delete(key);
            else sp.set(key, value);
            if (key !== "page") sp.set("page", "1");
            router.replace(`${pathname}?${sp.toString()}`);
        },
        [router, searchParams, pathname]
    );

    // Row actions
    const handleAction = React.useCallback(
        async (value: string, item: { id?: string }) => {
            if (!item?.id) return;
            switch (value) {
                case "view":
                    router.push(`/post/${item.id}`);
                    break;
                case "delete": {
                    setRows(prev => prev.filter(p => p.id !== item.id));
                    try {
                        await removeEchoFromChamber([item.id], chamber.id);
                    } catch {
                        router.refresh();
                    }
                    break;
                }
            }
        },
        [router, chamber.id]
    );

    // Bulk remove (selected on current page)
    const selectedIdx = React.useMemo(
        () => Object.keys(rowSelection).filter(k => (rowSelection as any)[k]),
        [rowSelection]
    );
    const selectedIds = React.useMemo(
        () => selectedIdx.map(k => rows[Number(k)]?.id).filter(Boolean) as string[],
        [selectedIdx, rows]
    );
    const bulkRemove = async () => {
        if (!selectedIds.length) return;
        // const toRemove = new Set(selectedIds);
        // setRows(prev => prev.filter(r => !toRemove.has(r.id)));
        setRowSelection({});
        try {
            await removeEchoFromChamber(selectedIds, chamber.id);
        } catch {
            router.refresh();
        }
    };

    const handlePinEcho = (echoIds: string | string[], chamberId: string, pinAll: 'pin' | 'unpin' | 'toggle' | undefined) => {
        pinEchoToChamber(echoIds, chamberId, pinAll).then(() => { }).catch(err => console.log(err))
    };

    // Server pagination wiring
    const pageCount = Math.max(1, Math.ceil(initial.total / initial.pageSize));
    const onPaginationChange = (
        updater: PaginationState | ((old: PaginationState) => PaginationState)
    ) => {
        const current: PaginationState = { pageIndex: initial.page - 1, pageSize: initial.pageSize };
        const next = typeof updater === "function" ? updater(current) : updater;
        const nextPage = next.pageIndex + 1;
        if (next.pageSize !== initial.pageSize) setParam("pageSize", String(next.pageSize));
        if (nextPage !== initial.page) setParam("page", String(nextPage));
    };

    // Columns (clean, airy, with an actions menu)
    const columns = React.useMemo<ColumnDef<EchoItem>[]>(() => [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="flex items-center gap-5">
                    <div className="min-w-0 max-w-[24rem]">
                        <div className="truncate font-medium text-slate-800">{row.original.title}</div>
                        {row.original.description && (
                            <div className="mt-0.5 line-clamp-1 text-xs text-slate-500 truncate">
                                {row.original.description}
                            </div>
                        )}
                    </div>
                    {row.original.isPinned && (<div className="flex items-center gap-2 text-warning"><TbPinFilled /></div>)}
                </div>
            ),
        },
        {
            accessorKey: "user.username",
            header: "Author",
            cell: ({ row }) => (
                <div className="min-w-0 max-w-[34rem]">
                    <Link href={`/user/${row.original.user.id}`} className="text-primary">@{row.original.user.username}</Link>
                </div>
            ),
        },
        // add saves, views, tags, and views count as well
        {
            accessorKey: "views",
            header: "Views",
            cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.views}</span>,
        },
        {
            accessorKey: "_count.saves",
            header: "Saves",
            cell: ({ row }) => <span className="text-sm text-slate-700">{row.original._count.saves}</span>,
        },
        {
            accessorKey: "_count.votes",
            header: "Votes",
            cell: ({ row }) => <span className="text-sm text-slate-700">{row.original._count.votes}</span>,
        },
        {
            accessorKey: "_count.tags",
            header: "Tags",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original._count.tags}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Updated",
            cell: ({ row }) => {
                const d = new Date((row.original.updatedAt ?? row.original.createdAt) as any);
                return <span className="text-sm text-slate-700">{d.toLocaleDateString()}</span>;
            },
            sortingFn: (a, b) => {
                const da = new Date((a.original.updatedAt ?? a.original.createdAt) as any).getTime();
                const db = new Date((b.original.updatedAt ?? b.original.createdAt) as any).getTime();
                return da - db;
            },
        },
        {
            id: "actions",
            header: "",
            enableSorting: false,
            enableHiding: false,
            size: 48,
            cell: ({ row }) => (
                <Dropdown
                    trigger={
                        <button
                            aria-label="More"
                            className="rounded-md p-2 hover:bg-slate-100 transition-colors"
                        >
                            <TbDots className="h-5 w-5 text-slate-600" />
                        </button>
                    }
                    groups={[
                        {
                            items: [
                                { label: row.original.isPinned ? 'Unpin from Chamber' : "Pin to Chamber", value: "pin", icon: <TbPin />, onClick: () => handlePinEcho(row.original.id, chamber.id, undefined) },
                                { label: "View", value: "view", icon: <TbEye /> },
                                { label: "Remove", value: "remove", icon: <TbTrash />, separatorAbove: true, },
                            ],
                        },
                    ]}
                    onAction={(value) => handleAction(value, { id: row.original.id })}
                    contentProps={{ align: "end", sideOffset: 6 }}
                />
            ),
        },
    ], [handleAction]);

    return (
        <div className="">
            {/* Header (soft gradient, subtle motion) */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="pt-15 px-5"
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-2xl text-primary font-semibold">Chamber: {chamber.name}</p>
                </div>

                {/* Search + Bulk actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative w-full max-w-md">
                        <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            defaultValue={initial.q}
                            onChange={(e) => {
                                const v = e.target.value;
                                window.clearTimeout((window as any).__qto);
                                (window as any).__qto = window.setTimeout(() => setParam("q", v), 300);
                            }}
                            placeholder="Search echoes…"
                            className="w-full rounded-xl border border-slate-300 bg-white px-9 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                            aria-label="Search echoes"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Table card */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut", delay: 0.05 }}
                className="p-5"
            >
                <DataTable<EchoItem, unknown>
                    tableTitle="Manage Echoes"
                    className="rounded-xl"
                    columns={columns}
                    data={rows}
                    enableRowSelection
                    enableSorting
                    enablePagination
                    enableFiltering={false}
                    enableViewOptions
                    manualPagination
                    pageCount={pageCount}
                    onPaginationChange={onPaginationChange}
                    state={{ rowSelection }}
                    onRowSelectionChange={setRowSelection}
                    initialPageSize={initial.pageSize}
                    toolbarRight={
                        !!Object.keys(rowSelection)?.length && <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="hidden sm:flex items-center gap-2">
                            <Button
                                text={`Pin (${selectedIds.length})`}
                                variant="secondary"
                                onClick={() => handlePinEcho(selectedIds, chamber.id, selectedIds?.length !== rows.length ? undefined : 'pin')}
                                disabled={!selectedIds.length}
                                classNames="rounded-lg bg-warning-light text-warning  border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary-light disabled:text-gray-600 disabled:border-secondary"
                            />
                            <Button
                                text={`Remove (${selectedIds.length})`}
                                variant="secondary"
                                onClick={bulkRemove}
                                disabled={!selectedIds.length}
                                classNames="rounded-lg bg-danger-light text-danger border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary-light disabled:text-gray-600 disabled:border-secondary"
                            />
                        </motion.div>
                    }
                />
            </motion.div>

            {/* Empty state */}
            {rows.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm"
                >
                    <p className="text-sm text-slate-600">No echoes match your filters.</p>
                    <div className="mt-4">
                        <Button
                            text="Create your first Echo"
                            onClick={() => router.push(`/create?chamberId=${chamber.id}`)}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
