"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import useEchoNavigation, { type NavigationLinkProps } from "@/hooks/use-echo-navigation";
import useNavigationStore from "@/stores/navigation-store";
import { cn } from "@/utils/cn";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { TbPlus, TbHash } from "react-icons/tb";
import Logo from "@/components/ui/logo";
import SearchBar from "@/components/ui/search/search-bar";
import Icon from "@/components/ui/icon";
import { type ChamberType } from "@/actions/chambers";
import DarkModeSwitch from "@/components/ui/theme-toggle-button";
import MyAvatar from "@/components/ui/avatar/my-avatar";

interface Props {
    slim?: boolean;
    user?: {
        id: string;
        name: string;
    };
    chambers?: ChamberType;
}

/** Utility: path match that treats /path and /path/... as active */
const isActivePath = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(href + "/");

type SidebarNode =
    | { type: "header"; title: string; key: string }
    | { type: "link"; key: string; item: NavigationLinkProps };

export default function Sidebar({ slim = false, user, chambers }: Props) {
    const pathname = usePathname();
    const { navigationData } = useEchoNavigation();
    const { setCurrentPath, setIsChangingPath } = useNavigationStore();

    useEffect(() => {
        setIsChangingPath(false);
    }, [pathname, setIsChangingPath]);

    const handleClick = (item: NavigationLinkProps) => {
        setIsChangingPath(true);
        setCurrentPath({ ...item, current: true });
    };

    // Normalize + flatten: one list that contains headers + links (nav + chambers)
    const items: SidebarNode[] = useMemo(() => {
        const list: SidebarNode[] = [];

        // navigationData is assumed to be Record<section, NavigationLinkProps[]>
        const sections = navigationData ?? {};

        // Add nav sections (keep "default" with no header)
        for (const [section, links] of Object.entries(sections)) {
            if (section !== "default" && links?.length) {
                list.push({ type: "header", title: section, key: `hdr:${section}` });
            }
            links?.forEach((i) => {
                const item: NavigationLinkProps = {
                    ...i,
                    current: isActivePath(pathname, i.link),
                };
                list.push({ type: "link", key: i.link, item });
            });
        }

        // Chambers as another section in the same flat list
        if (Array.isArray(chambers) && chambers.length) {
            list.push({ type: "header", title: "Chambers", key: "hdr:chambers" });
            chambers.forEach((ch) => {
                const href = `/chambers/${ch.id}`;
                const item: NavigationLinkProps = {
                    title: ch.name,
                    link: href,
                    icon: <TbHash className="text-base" />,
                    current: isActivePath(pathname, href),
                } as any; // cast if your type is stricter
                list.push({ type: "link", key: href, item });
            });
        }

        return list;
    }, [navigationData, chambers, pathname]);

    if (slim) {
        // SLIM: still a single nav so the indicator can travel across all items
        return (
            <div className="hidden md:flex flex-col gap-4 px-4 py-6">
                <nav className="flex flex-col items-center gap-4">
                    {items.map((node) =>
                        node.type === "header" ? (
                            <div
                                key={node.key}
                                className="mt-2 text-[10px] uppercase tracking-wider text-gray-400"
                            >
                                {node.title}
                            </div>
                        ) : (
                            <Link
                                key={node.key}
                                onClick={() => handleClick(node.item)}
                                href={node.item.link}
                                title={node.item.title}
                                className={cn(
                                    "group relative flex flex-col items-center p-1",
                                    node.item.current && "text-primary"
                                )}
                            >
                                {node.item.current && (
                                    <motion.div
                                        layoutId="activeIndicatorSlim"
                                        className="absolute -left-2 h-6 w-1 rounded-full bg-primary"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <Icon icon={node.item.icon} hoverEffect size="small" />
                            </Link>
                        )
                    )}
                </nav>
            </div>
        );
    }

    // FULL: one nav for everything so the layoutId can interpolate across all links
    return (
        <div className="flex flex-col h-screen px-4 py-6 bg-white dark:bg-neutral-900">
            {/* Top Logo + Heading */}
            <div className="flex items-center gap-2 mb-5">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                    <h1 className="text-sm font-bold">Echoed</h1>
                </Link>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto space-y-3 pb-24 mb-4 scrollbar-hide">
                <Link
                    href="/post/new"
                    className="flex items-center text-sm font-semibold rounded-md bg-primary-light text-primary py-2 px-4 gap-4 mb-2"
                >
                    <TbPlus className="text-base" />
                    New Echo
                </Link>

                <nav className="flex flex-col ">
                    {items.map((node) =>
                        node.type === "header" ? (
                            <h2
                                key={node.key}
                                className="text-[11px] uppercase tracking-wider text-gray-400 pl-3 mt-3 mb-1"
                            >
                                {node.title}
                            </h2>
                        ) : (
                            <Link
                                key={node.key}
                                href={node.item.link}
                                onClick={() => handleClick(node.item)}
                                className={cn(
                                    "group relative flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-md",
                                    node.item.current
                                        ? "text-primary font-medium bg-primary/5 dark:bg-primary/30 dark:text-white"
                                        : "text-gray-500 hover:text-primary hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
                                )}
                            >
                                {node.item.current && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn("p-1 rounded-md", node.item.current && "text-primary dark:text-white")}
                                >
                                    {node.item.icon}
                                </motion.div>
                                <span className="text-sm truncate">{node.item.title}</span>
                            </Link>
                        )
                    )}
                </nav>
            </div>

            {/* Utility Section */}
            <div className="mt-auto space-y-1 pt-4 border-t border-gray-200 dark:border-neutral-800">
                <Link
                    href={`/user/${user?.id ?? ""}`}
                    className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-primary dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors capitalize"
                >
                    {/* <Avatar url={user?.image} username={user?.username} size="sm" shape="circle" /> */}
                    <MyAvatar />

                    <span className="text-sm">{user?.name}</span>
                </Link>
                <DarkModeSwitch label="Dark mode" size="sm" />

                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-primary dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                    <FiSettings />
                    <span className="text-sm">Settings</span>
                </Link>
                <button
                    onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                    className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-100 hover:bg-red-50 dark:hover:bg-red-800 rounded-md transition-colors w-full"
                >
                    <FiLogOut />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}
