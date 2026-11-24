"use client";

import { Delta } from "@/components/charts";
import { Sparkline } from "@/components/shared/sparkline";
import { IconTile } from "@/components/ui/icon-tile";

export function KpiTile({ label, value, delta, icon, tone, data, k, invert, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-card hover:border-ring/40 flex min-w-0 flex-col gap-3 rounded-2xl border p-4 text-left shadow-card transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground truncate text-[13px] font-medium">{label}</span>
        <IconTile icon={icon} tone={tone} size="sm" />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="grid gap-1.5">
          <span className="text-[26px] leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {delta != null && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-[12px] whitespace-nowrap">
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
  );
}
