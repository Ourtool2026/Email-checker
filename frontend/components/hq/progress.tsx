"use client"

import { Progress as UIProgress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const INDICATOR = {
  primary: "[&>[data-slot=progress-indicator]]:bg-primary",
  success: "[&>[data-slot=progress-indicator]]:bg-success",
  warning: "[&>[data-slot=progress-indicator]]:bg-warning",
  danger: "[&>[data-slot=progress-indicator]]:bg-destructive",
}

export function Progress({
  value,
  className,
  tone = "primary",
}: {
  value: number
  className?: string
  tone?: keyof typeof INDICATOR
}) {
  return (
    <UIProgress
      value={Math.max(0, Math.min(100, value))}
      className={cn(
        "h-1.5 bg-track",
        INDICATOR[tone] ?? INDICATOR.danger,
        className
      )}
    />
  )
}
