
import { ArrowRight } from "lucide-react";
import RippleGlow from "./ripple-glow";
export default function CTA() {
    return (
        <section id="pricing" className="relative py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-cyan-500/10 to-transparent p-8">
                    <div className="absolute inset-0 pointer-events-none" aria-hidden>
                        <RippleGlow />
                    </div>
                    <div className="relative grid lg:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Start free. Grow with the right people.</h3>
                            <p className="mt-2 text-zinc-300 max-w-xl">Create, join, and collaborate. Upgrade when your chamber needs more power.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                            <a href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-5 py-3 text-sm font-medium hover:bg-zinc-100 transition">
                                Create your account <ArrowRight className="w-4 h-4" />
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-200 hover:text-white hover:border-white/20 transition">
                                View pricing
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}