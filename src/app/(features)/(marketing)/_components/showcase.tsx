
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
export default function Showcase() {
    const posts = [
        {
            title: "Make your writing timeless by designing for re-readability",
            tag: "Craft",
        },
        {
            title: "What I learned building a 1,000-member chamber",
            tag: "Community",
        },
        {
            title: "Signal over noise: designing discovery for depth",
            tag: "Design",
        },
    ];
    return (
        <section id="showcase" className="relative py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">What echoes look like</h2>
                    <a href="/feed" className="text-sm text-indigo-300 hover:text-white transition">Open feed →</a>
                </div>
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    {posts.map((p, i) => (
                        <motion.article
                            key={i}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5"
                        >
                            <div className="inline-flex items-center gap-2 text-xs text-indigo-300/90">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/90" /> {p.tag}
                            </div>
                            <h3 className="mt-3 text-lg font-medium leading-snug text-zinc-100 group-hover:text-white">
                                {p.title}
                            </h3>
                            <p className="mt-2 text-sm text-zinc-400">5 min read • 120 highlights</p>
                            <div className="mt-4 inline-flex items-center text-sm text-indigo-300 opacity-0 group-hover:opacity-100 transition">
                                Read more <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}