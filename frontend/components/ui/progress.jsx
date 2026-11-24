"use client";

import { cn } from "@/lib/utils";

export function Progress({ value, className, tone = "primary" }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-track", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all",
          tone === "primary"
            ? "bg-primary"
            : tone === "success"
              ? "bg-success"
              : tone === "warning"
                ? "bg-warning"
                : "bg-destructive",
        )}
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
        }}
      />
    </div>
  );
}
