"use client";

import * as React from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";

import { TbSearch, TbArrowsSort, TbArrowUp, TbArrowDown } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectInput } from "../form/select-input";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type DataTableFeatureFlags = {
    /** Adds a selection column with checkboxes */
    enableRowSelection?: boolean;
    /** Enables column sorting (default true) */
    enableSorting?: boolean;
    /** Shows a search input that filters one column (provide `filterKey`) */
    enableFiltering?: boolean;
    /** Shows pagination UI (client by default or manual if provided) */
    enablePagination?: boolean;
    /** Shows "View" menu to toggle column visibility */
    enableViewOptions?: boolean;
};

type DataTableServerish = {
    /**
     * When true, TanStack runs in manual pagination mode.
     * Provide `pageCount` and handle `onPaginationChange`.
     */
    manualPagination?: boolean;
    /** Only used in manual mode */
    pageCount?: number;
    /** Controlled pagination handler (used in manual mode) */
    onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
};

export type DataTableProps<TData, TValue> = DataTableFeatureFlags &
    DataTableServerish & {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
        tableTitle?: string;

        /** Column key to run the search/filter against, e.g., "title" */
        filterKey?: string;

        /** Page size (default 10) & options */
        initialPageSize?: number;
        pageSizeOptions?: number[];

        // Optional controlled states if you want to drive from parent
        state?: Partial<{
            sorting: SortingState;
            columnFilters: ColumnFiltersState;
            columnVisibility: VisibilityState;
            rowSelection: RowSelectionState;
            pagination: PaginationState;
        }>;

        // Callbacks
        onSortingChange?: (updater: SortingState) => void;
        onRowSelectionChange?: (updater: RowSelectionState) => void;
        onColumnVisibilityChange?: (updater: VisibilityState) => void;
        onColumnFiltersChange?: (updater: ColumnFiltersState) => void;

        /** Toolbar slot on the right side (e.g., action buttons) */
        toolbarRight?: React.ReactNode;

        /** Class names */
        className?: string;
    };

// Small util
function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

export function DataTable<TData, TValue>({
    columns,
    data,
    tableTitle,

    // Feature flags
    enableRowSelection = false,
    enableSorting = true,
    enableFiltering = false,
    enablePagination = true,
    enableViewOptions = true,

    // Filtering
    filterKey,

    // Pagination config
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],

    // Manual/server-ish pagination
    manualPagination = false,
    pageCount,
    onPaginationChange,

    // Controlled State (optional)
    state,
    onSortingChange,
    onRowSelectionChange,
    onColumnVisibilityChange,
    onColumnFiltersChange,

    toolbarRight,
    className,
}: DataTableProps<TData, TValue>) {
    // Local states (uncontrolled fallback)
    const [sorting, setSorting] = React.useState<SortingState>(state?.sorting ?? []);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(state?.columnFilters ?? []);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(state?.columnVisibility ?? {});
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(state?.rowSelection ?? {});
    const [pagination, setPagination] = React.useState<PaginationState>(
        state?.pagination ?? { pageIndex: 0, pageSize: initialPageSize }
    );

    // Keep in sync if parent controls them
    React.useEffect(() => {
        if (state?.sorting) setSorting(state.sorting);
        if (state?.columnFilters) setColumnFilters(state.columnFilters);
        if (state?.columnVisibility) setColumnVisibility(state.columnVisibility);
        if (state?.rowSelection) setRowSelection(state.rowSelection);
        if (state?.pagination) setPagination(state.pagination);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(state)]);

    // Selection column (prepended)
    const selectionCol: ColumnDef<TData, any> | null = enableRowSelection
        ? {
            id: "__select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 32,
        }
        : null;

    const finalColumns = selectionCol ? ([selectionCol, ...columns] as ColumnDef<TData, TValue>[]) : columns;

    const table = useReactTable({
        data,
        columns: finalColumns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        enableSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination,
        pageCount: manualPagination ? pageCount : undefined,
        // Updaters
        onSortingChange: (updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater;
            setSorting(next);
            onSortingChange?.(next);
        },
        onColumnFiltersChange: (updater) => {
            const next = typeof updater === "function" ? updater(columnFilters) : updater;
            setColumnFilters(next);
            onColumnFiltersChange?.(next);
        },
        onColumnVisibilityChange: (updater) => {
            const next = typeof updater === "function" ? updater(columnVisibility) : updater;
            setColumnVisibility(next);
            onColumnVisibilityChange?.(next);
        },
        onRowSelectionChange: (updater) => {
            const next = typeof updater === "function" ? updater(rowSelection) : updater;
            setRowSelection(next);
            onRowSelectionChange?.(next);
        },
        onPaginationChange: (updater) => {
            const next = typeof updater === "function" ? updater(pagination) : updater;
            setPagination(next);
            onPaginationChange?.(updater);
        },
    });

    // Search input controls specified column's filter value
    const filterCol = filterKey ? table.getColumn(filterKey) : undefined;
    const filterValue = (filterCol?.getFilterValue() as string) ?? "";

    return (
        <div className={cn("space-y-3 rounded-md border", className)}>
            {/* Toolbar */}
            {(enableFiltering || enableViewOptions || toolbarRight) && (
                <div className="flex flex-wrap items-center justify-between gap-3 m-4 ">
                    {tableTitle && <h1 className="text-lg font-semibold">{tableTitle}</h1>}
                    <div className="flex items-center gap-2">
                        {enableFiltering && filterCol && (
                            <div className="relative">
                                <TbSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={filterValue}
                                    onChange={(e) => filterCol.setFilterValue(e.target.value)}
                                    placeholder={`Search ${filterKey}…`}
                                    className="pl-8 w-64"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {toolbarRight}
                        {enableViewOptions && (
                            <ColumnVisibilityMenu table={table} />
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="border-y">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    const sorted = header.column.getIsSorted() as false | "asc" | "desc";
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                canSort && "cursor-pointer select-none",
                                                "whitespace-nowrap"
                                            )}
                                            onClick={
                                                canSort ? header.column.getToggleSortingHandler() : undefined
                                            }
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {canSort && (
                                                        <>
                                                            {sorted === "asc" ? (
                                                                <TbArrowUp className="h-4 w-4 opacity-70" />
                                                            ) : sorted === "desc" ? (
                                                                <TbArrowDown className="h-4 w-4 opacity-70" />
                                                            ) : (
                                                                <TbArrowsSort className="h-4 w-4 opacity-40" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(enableRowSelection && "hover:bg-muted/40")}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={finalColumns.length} className="h-24 text-center text-muted-foreground">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {enablePagination && (
                <div className="flex items-center justify-between px-4 pb-2">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {manualPagination && typeof pageCount === "number"
                                ? pageCount
                                : table.getPageCount()}
                        </div>

                        <SelectInput
                            label="Echoes per page"
                            onChange={(value) => table.setPageSize(Number(value))}
                            options={pageSizeOptions.map((opt) => ({
                                label: `${opt} / page`,
                                value: opt,
                                selected: opt === table.getState().pagination.pageSize
                            })) || []}
                        />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Prev
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// Column visibility dropdown
// ──────────────────────────────────────────────────────────────────────────────

function ColumnVisibilityMenu<TData>({ table }: { table: ReturnType<typeof useReactTable<TData>> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">View Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllLeafColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                        <DropdownMenuCheckboxItem
                            key={col.id}
                            className="capitalize"
                            checked={col.getIsVisible()}
                            onCheckedChange={(v) => col.toggleVisibility(!!v)}
                        >
                            {col.columnDef.header as React.ReactNode}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
