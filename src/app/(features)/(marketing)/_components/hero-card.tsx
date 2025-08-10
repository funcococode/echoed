
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PreviewTile from "./preview-tiles";
export default function HeroPreviewCard() {
    const cards = useMemo(
        () => [
            {
                title: "Ask better. Learn faster.",
                tag: "Chambers",
                body: "Join topic-focused groups where signals are strong and distractions are low.",
            },
            {
                title: "Write with flow.",
                tag: "Editor",
                body: "A clean, keyboard-first editor that fades away while you think.",
            },
            {
                title: "Your ideas travel.",
                tag: "Echo graph",
                body: "Highlights ripple through the network so great ideas reach further.",
            },
        ],
        []
    );

    const [index, setIndex] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % cards.length), 3600);
        return () => clearInterval(id);
    }, [cards.length]);

    return (
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <div className="absolute inset-px rounded-[calc(theme(borderRadius.3xl)-1px)] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                    className="relative"
                >
                    <div className="inline-flex items-center gap-2 text-xs text-indigo-300/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/90" /> {cards[index].tag}
                    </div>
                    <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">{cards[index].title}</h3>
                    <p className="mt-2 text-zinc-300 max-w-md">{cards[index].body}</p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <PreviewTile title="Draft → Publish" meta="1-click" />
                        <PreviewTile title="Topic routes" meta="Smart" />
                        <PreviewTile title="Reader highlights" meta="Live" />
                        <PreviewTile title="Collab notes" meta="Async" />
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center gap-2">
                {cards.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Show card ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-indigo-400" : "w-2 bg-white/20 hover:bg-white/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}