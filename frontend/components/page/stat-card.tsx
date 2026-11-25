import * as React from "react"

import { cn } from "@/lib/utils"
import { GradientProgress } from "@/components/kit/stats"

/**
 * Compact metric tile (kept for existing callers). New code should prefer
 * InsightStats / MetricCard from @/components/kit and show fewer numbers.
 */
export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  progress,
  className,
}: {
  label: React.ReactNode
  value: React.ReactNode
  sub?: React.ReactNode
  icon?: React.ElementType
  progress?: number
  progressColor?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-2xl border bg-card px-4 py-3.5 shadow-card",
        className
      )}
    >
      <span className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </span>
      <span className="text-[22px] leading-tight font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {sub && (
        <span className="text-[12.5px] text-muted-foreground">{sub}</span>
      )}
      {progress !== undefined && (
        <GradientProgress value={progress} className="mt-1.5 h-1.5" />
      )}
    </div>
  )
}

/** auto-fit grid for StatCards; collapses cleanly without phantom tracks. */
export function StatGrid({
  children,
  min = 180,
  className,
}: {
  children: React.ReactNode
  min?: number
  className?: string
}) {
  return (
    <div
      className={cn("grid gap-3", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
      }}
    >
      {children}
    </div>
  )
}
