
import EchoLines from "./echo-lines";
import FloatingGlows from "./floating-glow";
export default function EchoBackground() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {/* Subtle radial gradient backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(99,102,241,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_10%,rgba(34,211,238,0.10),transparent_45%),radial-gradient(700px_circle_at_50%_90%,rgba(236,72,153,0.08),transparent_45%)]" />

            {/* Concentric echo lines */}
            <div className="absolute inset-0 opacity-40">
                <EchoLines />
            </div>

            {/* Floating soft glows */}
            <FloatingGlows />
        </div>
    );
}