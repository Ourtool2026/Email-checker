"use client";

import { cn } from "@/lib/utils";

export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
        checked ? "bg-primary" : "bg-input dark:bg-input/80",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform",
          checked ? "translate-x-[calc(100%-2px)] dark:bg-primary-foreground" : "translate-x-0",
        )}
      />
    </button>
  );
}
