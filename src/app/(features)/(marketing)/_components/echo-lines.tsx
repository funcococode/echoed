
export default function EchoLines() {
    // Animated stroke offset for the "ripple" effect
    return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <defs>
                <linearGradient id="stroke" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.45)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0.45)" />
                </linearGradient>
            </defs>
            {Array.from({ length: 14 }).map((_, i) => {
                const r = 180 + i * 70;
                const dash = 18 + i * 1.2;
                const gap = 10 + i;
                const duration = 9 + i * 0.5;
                return (
                    <circle
                        key={i}
                        cx={720}
                        cy={420}
                        r={r}
                        fill="none"
                        stroke="url(#stroke)"
                        strokeOpacity={0.25}
                        strokeWidth={1}
                        strokeDasharray={`${dash} ${gap}`}
                    >
                        <animate attributeName="stroke-dashoffset" from="0" to={-dash - gap} dur={`${duration}s`} repeatCount="indefinite" />
                    </circle>
                );
            })}
        </svg>
    );
}