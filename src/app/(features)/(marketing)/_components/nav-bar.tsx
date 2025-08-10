import { ArrowRight, Waves } from "lucide-react";

export default function NavBar() {
    return (
        <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/20 border-b border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <a href="#" className="inline-flex items-center gap-2 font-semibold tracking-tight">
                    <span className="relative grid place-items-center w-7 h-7 rounded-full bg-indigo-600/10">
                        <Waves className="w-4 h-4" />
                    </span>
                    <span className="text-zinc-100">Echoed</span>
                </a>
                <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
                    <a href="#features" className="hover:text-white transition">Features</a>
                    <a href="#showcase" className="hover:text-white transition">Showcase</a>
                    <a href="#community" className="hover:text-white transition">Community</a>
                    <a href="#pricing" className="hover:text-white transition">Pricing</a>
                </nav>
                <div className="flex items-center gap-3">
                    <a href="/login" className="text-sm text-zinc-300 hover:text-white transition">Sign in</a>
                    <a
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 px-4 py-2 text-sm font-medium transition shadow-[0_0_0_0_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_4px_rgba(99,102,241,0.25)]"
                    >
                        Get started <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}