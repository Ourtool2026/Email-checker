"use client";

import { cn } from "@/lib/utils";

export function Sparkline({ data, className, color = "var(--primary)" }) {
  let r = Math.max(...data);
  let i = Math.min(...data);
  let o = 96;
  let n = 30;
  let d = data
    .map((u, s) => [(s / (data.length - 1)) * o, n - 3 - ((u - i) / (r - i || 1)) * (n - 6)])
    .map((u, s) => (s ? "L" : "M") + u[0].toFixed(1) + " " + u[1].toFixed(1))
    .join("");
  return (
    <svg viewBox={`0 0 ${o} ${n}`} className={cn("h-8 w-24", className)} preserveAspectRatio="none">
      <path d={d + `L${o} ${n}L0 ${n}Z`} fill={color} opacity=".1" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
