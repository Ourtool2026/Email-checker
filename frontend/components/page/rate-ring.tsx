import * as React from "react"

import { cn } from "@/lib/utils"

/** Tiny donut for a percentage (campaign rates, warmup progress). */
export function RateRing({
  value,
  size = 18,
  color = "var(--primary)",
  className,
}: {
  value: number
  size?: number
  color?: string
  className?: string
}) {
  const stroke = Math.max(2, Math.round(size / 7))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(value, 100))
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0 -rotate-90", className)}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--track)"
        strokeWidth={stroke}
      />
      {pct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
