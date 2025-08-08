"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../icon";
import useEchoNavigation, { type NavigationLinkProps } from "@/hooks/use-echo-navigation";
import useNavigationStore from "@/stores/navigation-store";
import { cn } from "@/utils/cn";
import { FiSettings, FiLogOut } from "react-icons/fi";
import Logo from "../logo";
import { signOut } from "next-auth/react";
import SearchBar from "../search/search-bar";

interface Props {
    slim?: boolean;
}

export default function LeftSidebar({ slim = false }: Props) {
    const pathname = usePathname();
    const { navigationData: data } = useEchoNavigation();
    const { setCurrentPath, setIsChangingPath } = useNavigationStore();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        setIsChangingPath(false);
    }, [pathname, setIsChangingPath]);

    const handleClick = (item: NavigationLinkProps) => {
        setIsChangingPath(true);
        setCurrentPath({ ...item, current: true });
    };

    if (slim) {
        return (
            <div className="hidden md:flex flex-col gap-4 px-4 py-6">
                {Object.entries(data)?.map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center gap-4">
                        {value.map((item) => (
                            <Link
                                key={item.link}
                                onClick={() => handleClick(item)}
                                href={item.link}
                                title={item.title}
                                className={cn(
                                    "group relative flex flex-col items-center p-1",
                                    item.current && "text-primary"
                                )}
                            >
                                <motion.div
                                    layoutId="activeIndicatorSlim"
                                    className={cn(
                                        "absolute -left-2 w-1 rounded-full bg-primary",
                                        item.current ? "h-6" : "h-0"
                                    )}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                                <Icon icon={item.icon} hoverEffect size="small" />
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen px-4 py-6 bg-white">
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
            <div className="flex-1 overflow-y-auto space-y-6">
                {Object.entries(data)?.map(([key, value]) => (
                    <div key={key} className="space-y-3">
                        {key !== "default" && (
                            <h1 className="text-[11px] uppercase tracking-wider text-gray-400 pl-3">
                                {key}
                            </h1>
                        )}
                        <nav className="flex flex-col">
                            {value.map((item) => {
                                const isActive = item.current;
                                return (
                                    <Link
                                        key={item.link}
                                        href={item.link}
                                        onClick={() => handleClick(item)}
                                        className={cn(
                                            "group relative flex items-center gap-3 px-3 py-2 transition-colors duration-200 rounded-md",
                                            isActive
                                                ? "text-primary font-medium bg-primary/5"
                                                : "text-gray-500 hover:text-primary hover:bg-gray-100"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-primary"
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            />
                                        )}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={cn("p-1 rounded-md", isActive && "text-primary")}
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <span className="text-sm">{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Utility Section */}
            <div className="mt-auto space-y-1 pt-4 border-t border-gray-200">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                >
                    <FiSettings />
                    <span className="text-sm">Settings</span>
                </Link>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
                >
                    <FiLogOut />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
}
