import * as React from "react"

import { cn } from "@/lib/utils"
import { DeltaBadge } from "./chip"
import { Panel, PanelBody } from "./panel"

/* Numbers, shown sparingly and in context. */

/** Blue gradient bar on a white track, as in the references. Empty means empty. */
export function GradientProgress({
  value,
  className,
  tone = "primary",
}: {
  value: number
  className?: string
  tone?: "primary" | "success" | "warning" | "danger"
}) {
  const v = Math.max(0, Math.min(value, 100))
  const fill = {
    primary: "from-primary/55 to-primary",
    success: "from-success/55 to-success",
    warning: "from-warning/55 to-warning",
    danger: "from-destructive/55 to-destructive",
  }[tone]
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2.5 overflow-hidden rounded-full bg-track/70",
        className
      )}
    >
      {v > 0 && (
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", fill)}
          style={{ width: `${v}%` }}
        />
      )}
    </div>
  )
}

/**
 * Headline metric in a panel: icon + title on the shell, big number with a
 * delta, one sentence of context and an optional progress bar on the surface.
 */
export function MetricCard({
  icon,
  title,
  value,
  delta,
  invertDelta,
  description,
  progress,
  progressTone,
  footer,
  className,
}: {
  icon?: React.ElementType
  title: React.ReactNode
  value: React.ReactNode
  delta?: number
  invertDelta?: boolean
  description?: React.ReactNode
  progress?: number
  progressTone?: "primary" | "success" | "warning" | "danger"
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <Panel icon={icon} title={title} className={className}>
      <PanelBody className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[34px] leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {delta !== undefined && (
            <DeltaBadge value={delta} invert={invertDelta} />
          )}
        </div>
        {description && (
          <p className="text-[13.5px] leading-snug text-muted-foreground">
            {description}
          </p>
        )}
        {progress !== undefined && (
          <GradientProgress
            value={progress}
            tone={progressTone}
            className="mt-auto"
          />
        )}
        {footer}
      </PanelBody>
    </Panel>
  )
}

/**
 * A row of two to four numbers with their share, the first one highlighted.
 * Replaces rows of identical stat tiles: "75 Active 39% · 192 Enrolled · 117 Exited".
 */
export function InsightStats({
  items,
  className,
}: {
  items: {
    label: React.ReactNode
    value: React.ReactNode
    share?: React.ReactNode
    highlight?: boolean
    tone?: "primary" | "success" | "warning" | "danger"
  }[]
  className?: string
}) {
  return (
    <div
      className={cn("grid gap-2.5", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 150px), 1fr))`,
      }}
    >
      {items.map((it, i) => {
        const tone = it.tone ?? "success"
        const hl = it.highlight
        return (
          <div
            key={i}
            className={cn(
              "flex min-w-0 items-start justify-between gap-2 rounded-xl border px-4 py-3.5",
              hl
                ? {
                    primary:
                      "border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent",
                    success:
                      "border-success/20 bg-gradient-to-br from-success/[0.08] to-transparent",
                    warning:
                      "border-warning/20 bg-gradient-to-br from-warning/[0.08] to-transparent",
                    danger:
                      "border-destructive/20 bg-gradient-to-br from-destructive/[0.08] to-transparent",
                  }[tone]
                : "bg-card"
            )}
          >
            <div className="grid min-w-0 gap-0.5">
              <span
                className={cn(
                  "text-[24px] leading-tight font-semibold tracking-tight tabular-nums",
                  hl &&
                    {
                      primary: "text-primary",
                      success: "text-success",
                      warning: "text-warning",
                      danger: "text-destructive",
                    }[tone]
                )}
              >
                {it.value}
              </span>
              <span
                className={cn(
                  "truncate text-[13px]",
                  hl ? "text-foreground/70" : "text-muted-foreground"
                )}
              >
                {it.label}
              </span>
            </div>
            {it.share !== undefined && (
              <span className="shrink-0 pt-1 text-[13px] text-muted-foreground tabular-nums">
                {it.share}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Inline label/value pairs separated by hairlines, for compact summaries in headers. */
export function StatLine({
  items,
  className,
}: {
  items: { label: React.ReactNode; value: React.ReactNode }[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px]",
        className
      )}
    >
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline gap-1.5">
          <dt className="text-muted-foreground">{it.label}</dt>
          <dd className="font-semibold tabular-nums">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}
