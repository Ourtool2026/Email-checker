"use client";

import { cn } from "@/lib/utils";

export function Tabs({ value, onChange, items, className, size }) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        size === "sm" ? "h-8" : "h-9",
        className,
      )}
    >
      {items.map((o) => {
        let n = o.value === value;
        let Icon = o.icon;
        return (
          <button
            role="tab"
            aria-selected={n}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2.5 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none [&>svg]:size-4",
              n && "bg-background text-foreground shadow-sm dark:border-input dark:bg-input/30",
              size === "sm" && "text-[13px] px-2",
            )}
            key={o.value}
          >
            {Icon && <Icon />}
            {o.label}
            {o.count != null && (
              <span
                className={cn(
                  "rounded-md px-1 text-[11px] tabular-nums",
                  n ? "bg-muted text-muted-foreground" : "text-muted-foreground",
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function UnderlineTabs({ value, onChange, items }) {
  return (
    <div role="tablist" className="flex gap-1 border-b">
      {items.map((r) => {
        let i = r.value === value;
        let Icon = r.icon;
        return (
          <button
            role="tab"
            aria-selected={i}
            onClick={() => onChange(r.value)}
            className={cn(
              "relative -mb-px inline-flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground [&>svg]:size-4",
              i && "border-primary text-foreground",
            )}
            key={r.value}
          >
            {Icon && <Icon />}
            {r.label}
            {r.count ? (
              <span className="rounded-md bg-muted px-1.5 text-[11px] tabular-nums">{r.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
