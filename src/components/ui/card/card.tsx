'use client'

import { cn } from "@/utils/cn";
import { type ReactNode } from "react";

interface CardProps {
    children?: ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    return (
        <div className={cn(`space-y-4 list-none p-5 rounded border border-gray-100 bg-gray-50 flex flex-col justify-between`, className)}>
            {children}
        </div>
    )
}
