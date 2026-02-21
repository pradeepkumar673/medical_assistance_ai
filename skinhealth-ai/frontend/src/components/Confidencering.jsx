export default function ConfidenceRing({ value, size = 80 }) {
  const strokeW = size < 80 ? 5 : 7;
  const r = size / 2 - strokeW;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;
  const id = `ring-grad-${size}`;

  const color =
    value >= 85 ? ["#0d9488", "#2dd4bf"] :
    value >= 60 ? ["#d97706", "#fbbf24"] :
                  ["#f43f5e", "#fb7185"];

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <svg width={size} height={size} aria-label={`${value}% confidence`}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color[0]} />
            <stop offset="100%" stopColor={color[1]} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeW}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 ${strokeW}px ${color[1]}60)`,
          }}
        />
        {/* Text */}
        <text
          x="50%" y="46%"
          textAnchor="middle" dominantBaseline="middle"
          style={{
            fontSize: size < 80 ? "13px" : "16px",
            fontWeight: 700,
            fill: color[0],
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {value.toFixed(0)}%
        </text>
        <text
          x="50%" y="64%"
          textAnchor="middle" dominantBaseline="middle"
          style={{
            fontSize: size < 80 ? "9px" : "10px",
            fill: "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          confidence
        </text>
      </svg>
    </div>
  );
}