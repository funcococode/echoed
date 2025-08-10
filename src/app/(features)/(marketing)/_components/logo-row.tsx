
export default function LogosRow() {
    return (
        <section aria-label="Trusted by creators" className="relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-y border-white/5">
                <p className="text-center text-sm text-zinc-400">Crafted for writers, builders, and curious minds</p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 opacity-70">
                    {"abcdef".split("").map((_, i) => (
                        <div key={i} className="h-10 rounded-lg border border-white/5 bg-white/[0.02] grid place-items-center text-xs tracking-wider">
                            LOGO
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}