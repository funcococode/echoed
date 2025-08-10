"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePathname } from "next/navigation";
import AmbientRipples from "./ambient-ripples";
import ClickRipple from "./click-ripple";
import RandomRipples from "./random-ripples";

type Click = { id: number; x: number; y: number };

export default function EchoCanvas() {
    const pathname = usePathname();
    const isRegister = pathname?.endsWith("/auth/register");

    const artRef = useRef<HTMLDivElement>(null);

    // Cursor-follow glow (sprung)
    const glowX = useMotionValue(0);
    const glowY = useMotionValue(0);
    const sx = useSpring(glowX, { stiffness: 120, damping: 24, mass: 0.7 });
    const sy = useSpring(glowY, { stiffness: 120, damping: 24, mass: 0.7 });

    // Ambient ripple origin (center)
    const cx = useMotionValue(0);
    const cy = useMotionValue(0);

    // Ensure first paint has a valid center before mounting ripples
    const [ready, setReady] = useState(false);

    // Click ripples
    const [clicks, setClicks] = useState<Click[]>([]);
    const [rid, setRid] = useState(0);

    // RAF guard should persist across renders
    const rafId = useRef<number>(0);

    // Center synchronously after layout; keep in sync with size via ResizeObserver
    useLayoutEffect(() => {
        const el = artRef.current;
        if (!el) return;

        const centerNow = () => {
            const rect = el.getBoundingClientRect();
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            cx.set(midX);
            cy.set(midY);
            glowX.set(midX);
            glowY.set(midY);
        };

        // First synchronous center (before paint)
        centerNow();
        setReady(true);

        // Keep centered on resize (including initial layout shifts)
        const ro = new ResizeObserver(() => {
            centerNow();
        });
        ro.observe(el);

        return () => ro.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Pointer handlers
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (rafId.current) return;
        rafId.current = requestAnimationFrame(() => {
            const rect = (e.currentTarget as HTMLDivElement)?.getBoundingClientRect?.();
            if (rect) {
                glowX.set(e.clientX - rect.left);
                glowY.set(e.clientY - rect.top);
            }
            rafId.current = 0;
        });
    };

    const handlePointerLeave = () => {
        // Glide back to center
        glowX.set(cx.get());
        glowY.set(cy.get());
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const next = rid + 1;
        setRid(next);
        setClicks(prev => [...prev.slice(-10), { id: next, x, y }]);
    };

    return (
        <section
            ref={artRef}
            className="relative hidden md:block col-span-3 overflow-hidden"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            aria-hidden
        >
            {/* ----- Backgrounds (switch per page) ----- */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {isRegister ? (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(90%_90%_at_80%_20%,rgba(34,211,238,0.28),transparent_60%),radial-gradient(75%_80%_at_25%_75%,rgba(168,85,247,0.28),transparent_60%),linear-gradient(180deg,#06070e_10%,#070914_55%,#05060d_100%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(59,130,246,0.18),transparent_70%)]" />
                        <div className="absolute inset-0 bg-black/35" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_75%_25%,rgba(37,99,235,0.18),transparent_60%),radial-gradient(65%_70%_at_20%_80%,rgba(124,58,237,0.18),transparent_60%),linear-gradient(180deg,#05060a_20%,#04050a_60%,#03040a_100%)]" />
                        <div className="absolute inset-0 bg-black/45" />
                    </>
                )}
            </div>

            {/* ----- Ambient ripples (mount only after we’ve centered once) ----- */}
            {ready && (
                <>
                    <AmbientRipples
                        x={cx}
                        y={cy}
                        duration={5.6}
                        delayOffset={0}
                        className="absolute inset-0 pointer-events-none z-10"
                        opacity={0.55}
                        blend="screen"
                        color={isRegister ? "teal" : "cyan"}
                    />
                    <AmbientRipples
                        x={cx}
                        y={cy}
                        duration={5.6}
                        delayOffset={2.8} // half-phase
                        className="absolute inset-0 pointer-events-none z-10"
                        opacity={0.45}
                        blend="screen"
                        color={isRegister ? "violet" : "sky"}
                    />
                </>
            )}

            {/* Random autonomous ripples — livelier on register */}
            <div className="absolute inset-0 pointer-events-none z-20">
                <RandomRipples
                    spawnEveryMs={isRegister ? 900 : 1400}
                    jitterMs={isRegister ? 700 : 900}
                    maxAlive={isRegister ? 14 : 10}
                />
            </div>

            {/* Cursor-follow glow */}
            <motion.div
                style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
                className={`pointer-events-none absolute rounded-full blur-3xl z-30 ${isRegister ? "h-56 w-56" : "h-44 w-44"
                    }`}
            >
                <div
                    className={`h-full w-full rounded-full ${isRegister
                        ? "bg-[conic-gradient(at_50%_50%,#22d3ee,25%,#a78bfa,50%,#60a5fa,75%,#22d3ee)] opacity-45"
                        : "bg-[conic-gradient(at_50%_50%,#60a5fa,25%,#a78bfa,50%,#22d3ee,75%,#60a5fa)] opacity-35"
                        }`}
                />
            </motion.div>

            {/* Click ripples */}
            {clicks.map(c => (
                <ClickRipple
                    key={c.id}
                    x={c.x}
                    y={c.y}
                    onDone={() => setClicks(prev => prev.filter(p => p.id !== c.id))}
                />
            ))}

            {/* Captions (switch per page) */}
            {!isRegister ? (
                <div className="absolute bottom-10 left-10 max-w-sm text-white/90 pointer-events-none z-40">
                    <h2 className="text-xl font-semibold">Echo your ideas</h2>
                    <p className="text-sm text-white/70 mt-1">
                        Every thought you share sends an echo—let yours inspire others.
                    </p>
                </div>
            ) : (
                <div className="absolute bottom-10 left-10 max-w-md text-white/90 pointer-events-none z-40">
                    <h2 className="text-3xl font-bold leading-snug">Welcome to Echoed.</h2>
                    <p className="mt-2 text-base text-white/85 leading-relaxed">
                        Publish your first echo, find your people in Chambers, and turn
                        sparks into conversations that travel.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-sm text-white/75 list-disc list-inside">
                        <li>Write without friction. Format as you think.</li>
                        <li>Discover voices that challenge and expand yours.</li>
                        <li>Own your narrative. Let it ripple outward.</li>
                    </ul>
                </div>
            )}
        </section>
    );
}
