
import { motion } from "framer-motion";
export default function Testimonials() {
    const quotes = [
        {
            by: "Aarav S.",
            role: "Founder, Builder's Circle",
            text: "Echoed feels calm but alive — the first place my long-form thoughts actually travel.",
        },
        {
            by: "Mia R.",
            role: "Writer & Editor",
            text: "The editor disappears. The conversations don't. That's the magic.",
        },
        {
            by: "Ken I.",
            role: "Community Designer",
            text: "Chambers nailed the balance: high-signal discussion without the performative noise.",
        },
    ];
    return (
        <section id="community" className="relative py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Loved by thoughtful communities</h2>
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    {quotes.map((q, i) => (
                        <motion.figure
                            key={i}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                        >
                            <blockquote className="text-zinc-300">“{q.text}”</blockquote>
                            <figcaption className="mt-4 text-sm text-zinc-400">{q.by} • {q.role}</figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    );
}