
export default function RippleGlow() {
    // Decorative animated ripples for the CTA card background
    return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <defs>
                <radialGradient id="g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
            {Array.from({ length: 6 }).map((_, i) => (
                <circle key={i} cx={600} cy={200} r={20 + i * 50} fill="none" stroke="url(#g)" strokeWidth={1.2}>
                    <animate attributeName="r" from={20 + i * 50} to={300 + i * 50} dur={`${6 + i * 0.8}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.35;0.15;0" dur={`${6 + i * 0.8}s`} repeatCount="indefinite" />
                </circle>
            ))}
        </svg>
    );
}