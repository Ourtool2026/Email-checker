"use client"

import { cn } from "@/lib/utils"

const TONES: Record<string, any> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  violet: "bg-violet/10 text-violet",
  teal: "bg-teal/10 text-teal",
  pink: "bg-pink/10 text-pink",
  orange: "bg-orange/10 text-orange",
  indigo: "bg-indigo/10 text-indigo",
}

export function IconTile({
  icon: Icon,
  tone = "neutral",
  className,
  size = "md",
}: {
  icon?: any
  tone?: any
  className?: any
  size?: any
}) {
  const i =
    size === "sm"
      ? "size-8 rounded-lg [&>svg]:size-4"
      : size === "lg"
        ? "size-11 rounded-xl [&>svg]:size-5"
        : "size-9 rounded-xl [&>svg]:size-[18px]"
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        tone === "neutral"
          ? "border bg-muted/60 text-foreground/75"
          : TONES[tone],
        i,
        className
      )}
    >
      <Icon />
    </span>
  )
}
