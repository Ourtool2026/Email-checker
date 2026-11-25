"use client"

import { cn } from "@/lib/utils"

export function FilterChips({
  value,
  onChange,
  items,
}: {
  value?: any
  onChange?: any
  items?: any
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([r, i, o]) => (
        <button
          onClick={() => onChange(r)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors",
            value === r
              ? "border-primary/40 bg-primary/10 text-primary"
              : "bg-card text-muted-foreground shadow-card hover:text-foreground"
          )}
          key={r}
        >
          {i}
          {o != null && <span className="tabular-nums opacity-70">{o}</span>}
        </button>
      ))}
    </div>
  )
}
