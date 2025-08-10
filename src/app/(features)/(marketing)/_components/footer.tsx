import { Waves } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-zinc-400">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="inline-flex items-center gap-2">
                        <span className="relative grid place-items-center w-7 h-7 rounded-full bg-indigo-600/10">
                            <Waves className="w-4 h-4" />
                        </span>
                        <span>Echoed</span>
                    </div>
                    <nav className="flex flex-wrap gap-x-6 gap-y-3">
                        <a href="#features" className="hover:text-white transition">Features</a>
                        <a href="#showcase" className="hover:text-white transition">Showcase</a>
                        <a href="#community" className="hover:text-white transition">Community</a>
                        <a href="#pricing" className="hover:text-white transition">Pricing</a>
                        <a href="#" className="hover:text-white transition">Changelog</a>
                        <a href="#" className="hover:text-white transition">Docs</a>
                    </nav>
                </div>
                <div className="mt-6 text-xs">© {new Date().getFullYear()} Echoed. All rights reserved.</div>
            </div>
        </footer>
    );
}