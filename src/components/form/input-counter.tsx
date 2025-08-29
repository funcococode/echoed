'use client'
import { cn } from "@/lib/utils";

export default function Counter({ value, max }: { value: number; max: number }) {
    const pct = Math.min(100, Math.round((value / max) * 100))
    return (
        <div className="flex items-center gap-2 text-[10px]">
            <div className="h-1 w-20 rounded bg-gray-200">
                <div
                    style={{ width: `${pct}%` }}
                    className={cn(
                        'h-1 rounded transition-all',
                        pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500',
                    )}
                />
            </div>
            <span className={cn('tabular-nums', value > max ? 'text-rose-600' : 'text-gray-500')}>
                {value}/{max}
            </span>
        </div>
    )
}