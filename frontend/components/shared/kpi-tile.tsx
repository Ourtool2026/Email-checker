"use client"

import { Delta } from "@/components/charts"
import { Sparkline } from "@/components/shared/sparkline"
import { IconTile } from "@/components/hq/icon-tile"

export function KpiTile({
  label,
  value,
  delta,
  icon,
  tone,
  data,
  k,
  invert,
  onClick,
}: {
  label?: any
  value?: any
  delta?: any
  icon?: any
  tone?: any
  data?: any
  k?: any
  invert?: any
  onClick?: any
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-4 text-left shadow-card transition-colors hover:border-ring/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] font-medium text-muted-foreground">
          {label}
        </span>
        <IconTile icon={icon} tone={tone} size="sm" />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="grid gap-1.5">
          <span className="text-[26px] leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {delta != null && (
            <span className="flex items-center gap-1.5 text-[12px] whitespace-nowrap text-muted-foreground">
              <Delta value={delta} invert={invert} />
              vs prev.
            </span>
          )}
        </div>
        {data && (
          <Sparkline
            className="w-20 shrink-0"
            data={data.map((u) => u[k])}
            color={`var(--${tone === "primary" ? "primary" : tone})`}
          />
        )}
      </div>
    </button>
  )
}
