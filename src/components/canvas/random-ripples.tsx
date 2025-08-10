"use client";

import { useEffect, useRef, useState } from "react";
import ClickRipple from "./click-ripple";

type RR = { id: number; xPct: number; yPct: number; lifeMs: number };

export default function RandomRipples({
    spawnEveryMs = 1200,
    jitterMs = 800,
    maxAlive = 8,
}: {
    spawnEveryMs?: number;
    jitterMs?: number;
    maxAlive?: number;
}) {
    const [ripples, setRipples] = useState<RR[]>([]);
    const nextIdRef = useRef(1);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const schedule = () => {
            const jitter = (Math.random() - 0.5) * 2 * jitterMs;
            const wait = Math.max(300, spawnEveryMs + jitter);
            timeoutRef.current = window.setTimeout(() => {
                setRipples(prev => {
                    const id = nextIdRef.current++;
                    const xPct = Math.random() * 100;
                    const yPct = Math.random() * 100;
                    const lifeMs = 1200 + Math.random() * 700;
                    return [...prev.slice(-maxAlive + 1), { id, xPct, yPct, lifeMs }];
                });
                schedule();
            }, wait) as unknown as number;
        };
        schedule();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [spawnEveryMs, jitterMs, maxAlive]);

    return (
        <>
            {ripples.map(r => (
                <div
                    key={r.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${r.xPct}%`,
                        top: `${r.yPct}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <ClickRipple
                        x={0}
                        y={0}
                        onDone={() => setRipples(prev => prev.filter(p => p.id !== r.id))}
                        duration={r.lifeMs / 1000}
                    />
                </div>
            ))}
        </>
    );
}
