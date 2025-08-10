
import { motion } from "framer-motion";
import { Users, PenLine, Compass } from "lucide-react";
export default function Features() {
    const items = [
        {
            icon: <PenLine className="w-5 h-5" />,
            title: "Frictionless writing",
            body: "A focused editor with keyboard shortcuts, slash commands, and zero clutter.",
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Chambers, not chaos",
            body: "Join targeted spaces where discovery is signal-first, not algorithm-first.",
        },
        {
            icon: <Compass className="w-5 h-5" />,
            title: "Smart routing",
            body: "Your echo finds readers who care via tags, topics, and an intent-aware graph.",
        },
    ];

    return (
        <section id="features" className="relative py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20%" }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                        >
                            <div className="inline-flex items-center gap-2 text-indigo-300">
                                <span className="grid place-items-center w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-400/10">
                                    {f.icon}
                                </span>
                                <span className="text-sm font-medium">{f.title}</span>
                            </div>
                            <p className="mt-3 text-zinc-300">{f.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}