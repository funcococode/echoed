
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import HeroPreviewCard from "./hero-card";
export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight"
                        >
                            Where ideas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">echo</span> into impact.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="mt-5 text-lg text-zinc-300 max-w-xl"
                        >
                            Echoed is a clean, community-first space to publish posts ("echoes"), join chambers, and turn thoughtful conversations into momentum.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="mt-8 flex flex-wrap items-center gap-3"
                        >
                            <a
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 px-5 py-3 text-sm font-medium transition shadow-[0_0_0_0_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_6px_rgba(99,102,241,0.25)]"
                            >
                                Create your first Echo <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#showcase"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 hover:border-white/20 px-5 py-3 text-sm font-medium text-zinc-200 hover:text-white transition"
                            >
                                Explore the feed
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.8 }}
                            className="mt-8 flex items-center gap-6 text-sm text-zinc-400"
                        >
                            <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" /> Built for thoughtful communities</span>
                            <span className="hidden sm:inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> No ads, no noise</span>
                        </motion.div>
                    </div>

                    <div className="relative">
                        <HeroPreviewCard />
                    </div>
                </div>
            </div>
        </section>
    );
}