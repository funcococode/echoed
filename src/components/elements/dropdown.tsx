"use client";

import * as React from "react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "../form/button";

type BaseItem = {
    label: string;
    value: string;
    icon?: React.ReactNode;
    shortcut?: string;
    disabled?: boolean;
    href?: string;
    separatorAbove?: boolean;
    onClick?: (item: MenuItem) => void;
};

export type MenuItem = BaseItem & {
    submenu?: BaseItem[];
};

export type MenuGroup = {
    label?: string;
    items: MenuItem[];
};

type ContentProps = {
    /** shadcn/radix positioning props */
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    className?: string;
};

interface DropdownProps {
    groups: Array<MenuGroup> | MenuItem[]; // you can pass a flat array or groups
    /** Global click handler when any item is picked */
    onAction?: (value: string, item: MenuItem) => void;
    /** Custom trigger; defaults to your <Button text="Open" /> */
    trigger?: React.ReactNode;
    /** Control open state if needed */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Pass-through content props */
    contentProps?: ContentProps;
}

export function Dropdown({
    groups,
    onAction,
    trigger,
    open,
    onOpenChange,
    contentProps,
}: DropdownProps) {
    // Normalize `groups` so both arrays and grouped inputs work
    const normalizedGroups: MenuGroup[] = Array.isArray(groups) && "items" in (groups[0] as any)
        ? (groups as MenuGroup[])
        : [{ items: groups as MenuItem[] }];

    const handleAction = React.useCallback(
        (item: MenuItem) => {
            item.onClick?.(item);
            onAction?.(item.value, item);
        },
        [onAction]
    );

    const renderItem = (item: MenuItem, key: React.Key) => {
        const content = (
            <>
                <div className="flex items-center gap-2">
                    {item.icon && <span className="grid place-items-center">{item.icon}</span>}
                    <span>{item.label}</span>
                </div>
                {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
            </>
        );

        // Submenu:
        if (item.submenu?.length) {
            return (
                <React.Fragment key={key}>
                    {item.separatorAbove && <DropdownMenuSeparator />}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger disabled={item.disabled}>
                            {content}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {item.submenu.map((sub, i) => (
                                    <React.Fragment key={`${item.value}-sub-${sub.value}-${i}`}>
                                        {sub.separatorAbove && <DropdownMenuSeparator />}
                                        <DropdownMenuItem
                                            disabled={sub.disabled}
                                            onSelect={() => handleAction({ ...sub, submenu: undefined } as MenuItem)}
                                            {...(sub.href ? { asChild: true } : {})}
                                        >
                                            {sub.href ? (
                                                <Link href={sub.href}>{/* keep content inside link */}
                                                    <div className="flex items-center gap-2">
                                                        {sub.icon && <span className="grid place-items-center">{sub.icon}</span>}
                                                        <span>{sub.label}</span>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        {sub.icon && <span className="grid place-items-center">{sub.icon}</span>}
                                                        <span>{sub.label}</span>
                                                    </div>
                                                    {sub.shortcut && (
                                                        <DropdownMenuShortcut>{sub.shortcut}</DropdownMenuShortcut>
                                                    )}
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </React.Fragment>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </React.Fragment>
            );
        }

        // Regular item (optionally as a Link)
        return (
            <React.Fragment key={key}>
                {item.separatorAbove && <DropdownMenuSeparator />}
                <DropdownMenuItem
                    disabled={item.disabled}
                    onSelect={() => handleAction(item)}
                    {...(item.href ? { asChild: true } : {})}
                >
                    {item.href ? <Link href={item.href}>{content}</Link> : content}
                </DropdownMenuItem>
            </React.Fragment>
        );
    };

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                {trigger ?? <Button text="Open" />}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={contentProps?.className ?? "w-56"}
                align={contentProps?.align ?? "start"}
                side={contentProps?.side}
                sideOffset={contentProps?.sideOffset}
            >
                {normalizedGroups.map((group, gi) => (
                    <React.Fragment key={`grp-${gi}`}>
                        {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                        <DropdownMenuGroup>
                            {group.items.map((item, i) => renderItem(item, `${gi}-${i}-${item.value}`))}
                        </DropdownMenuGroup>
                        {gi < normalizedGroups.length - 1 && <DropdownMenuSeparator />}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
