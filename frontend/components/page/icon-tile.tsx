import * as React from "react"

import { cn } from "@/lib/utils"
import type { Tone } from "./status-badge"

/*
 * Icon holder. Neutral by default (white tile, hairline, ink icon) so icons label
 * things without turning the page into a rainbow; only state tones keep a tint.
 */
const TONE: Record<Tone, string> = {
  neutral: "bg-card border text-foreground/70 shadow-card",
  primary: "bg-card border text-foreground/70 shadow-card",
  info: "bg-card border text-foreground/70 shadow-card",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
}

export function IconTile({
  icon: Icon,
  tone = "neutral",
  size = "md",
  className,
}: {
  icon: React.ElementType
  tone?: Tone
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        size === "sm" && "size-7 rounded-lg [&_svg]:size-3.5",
        size === "md" && "size-9 rounded-[10px] [&_svg]:size-4",
        size === "lg" && "size-11 rounded-xl [&_svg]:size-5",
        TONE[tone],
        className
      )}
    >
      <Icon />
    </span>
  )
}
