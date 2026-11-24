"use client";

export function ScoreRing({ value, size = 44, stroke = 5, tone }) {
  let i = (size - stroke) / 2;
  let o = 2 * Math.PI * i;
  let n =
    tone ||
    (value >= 85 ? "var(--success)" : value >= 70 ? "var(--warning)" : "var(--destructive)");
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={i}
          fill="none"
          stroke="var(--track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={i}
          fill="none"
          stroke={n}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(o * value) / 100} ${o}`}
        />
      </svg>
      <span
        className="absolute text-[12px] font-semibold tabular-nums"
        style={{
          fontSize: size < 40 ? 10.5 : 12.5,
        }}
      >
        {value}
      </span>
    </span>
  );
}
