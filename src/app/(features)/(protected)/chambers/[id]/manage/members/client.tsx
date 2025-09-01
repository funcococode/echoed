"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { type ColumnDef, type PaginationState, type RowSelectionState } from "@tanstack/react-table";
import { motion } from "motion/react";
import { TbDots, TbSearch, TbTrash, TbEye } from "react-icons/tb";

import { DataTable } from "@/components/elements/table"; // ← your reusable table
import { Dropdown } from "@/components/elements/dropdown";
import Button from "@/components/form/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { removeMemberFromChamber } from "./actions";

type MemberItem = {
    id: string;
    username: string;
    name: string;
    email: string | null;
    image: string | null;
    createdAt: Date | null;
};

export default function ManageMembersClient({
    chamber,
    initial,
}: {
    chamber: { id: string; name: string, description: string; };
    initial: {
        items: MemberItem[];
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
    const [rows, setRows] = React.useState<MemberItem[]>(initial.items);
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
                        await removeMemberFromChamber([item.id], chamber.id);
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
        () => Object.keys(rowSelection).filter(k => (rowSelection)[k]),
        [rowSelection]
    );
    const selectedIds = React.useMemo(
        () => selectedIdx.map(k => rows[Number(k)]?.id).filter(Boolean) as string[],
        [selectedIdx, rows]
    );
    const bulkRemove = async () => {
        if (!selectedIds.length) return;
        setRowSelection({});
        try {
            await removeMemberFromChamber(selectedIds, chamber.id);
        } catch {
            router.refresh();
        }
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
    const columns = React.useMemo<ColumnDef<MemberItem>[]>(() => [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-5">
                    <div className="min-w-0 max-w-[24rem]">
                        <div className="truncate font-medium text-slate-800">{row.original.name}</div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "username",
            header: "Username",
            cell: ({ row }) => (
                <div className="min-w-0 max-w-[34rem]">
                    <Link href={`/user/${row.original.id}`} className="text-primary">@{row.original.username}</Link>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.email}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => {
                const d = new Date((row.original.createdAt ?? row.original.createdAt) as unknown as string);
                return <span className="text-sm text-slate-700">{d.toLocaleDateString()}</span>;
            },
            sortingFn: (a, b) => {
                const da = new Date((a.original.createdAt ?? a.original.createdAt) as unknown as string).getTime();
                const db = new Date((b.original.createdAt ?? b.original.createdAt) as unknown as string).getTime();
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
                                { label: "View Profile", value: "view", icon: <TbEye />, href: `/user/${row.original.id}` },
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
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="px-5"
            >
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="relative w-full max-w-md">
                        <TbSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            defaultValue={initial.q}
                            onChange={(e) => {
                                const v = e.target.value;
                                window.clearTimeout((window as unknown as { __qto: number | undefined }).__qto);
                                (window as unknown as { __qto: number | undefined }).__qto = window.setTimeout(() => setParam("q", v), 300);
                            }}
                            placeholder="Search members…"
                            className="w-full rounded-xl border border-slate-300 bg-white px-9 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                            aria-label="Search members"
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
                <DataTable<MemberItem, unknown>
                    tableTitle="Manage Members"
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
                    <p className="text-sm text-slate-600">No members match your filters.</p>
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
