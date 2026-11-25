"use client"

import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Notice({
  icon: Icon = InfoIcon,
  children,
  tone = "muted",
  className,
}: {
  icon?: any
  children?: any
  tone?: any
  className?: any
}) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12.5px] leading-snug",
        tone === "muted"
          ? "bg-muted/60 text-muted-foreground"
          : tone === "primary"
            ? "border-primary/25 bg-primary/[0.05]"
            : tone === "warning"
              ? "border-warning/30 bg-warning/[0.06]"
              : "border-destructive/30 bg-destructive/[0.05]",
        className
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "primary"
            ? "text-primary"
            : tone === "warning"
              ? "text-warning"
              : tone === "danger"
                ? "text-destructive"
                : ""
        )}
      />
      <div>{children}</div>
    </div>
  )
}
