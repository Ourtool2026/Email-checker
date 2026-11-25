import * as React from "react"

import { cn } from "@/lib/utils"

/* People: initials avatars, overlapping stacks and the "person row" from the references. */

const TINTS = [
  "bg-primary/12 text-primary",
  "bg-success/12 text-success",
  "bg-violet/12 text-violet",
  "bg-warning/14 text-warning",
  "bg-destructive/10 text-destructive",
  "bg-foreground/[0.07] text-foreground/70",
]

export function initialsOf(name: string) {
  const base = name.includes("@")
    ? name.split("@")[0].replace(/[._-]+/g, " ")
    : name
  const parts = base.trim().split(/\s+/).filter(Boolean)
  return (
    (parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "")
  ).toUpperCase()
}

function tintOf(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return TINTS[h % TINTS.length]
}

const SIZE = {
  xs: "size-5 text-[9px]",
  sm: "size-7 text-[10.5px]",
  md: "size-8 text-[11.5px]",
  lg: "size-10 text-[13px]",
  xl: "size-12 text-[15px]",
}

export function PersonAvatar({
  name,
  size = "md",
  className,
  status,
}: {
  name: string
  size?: keyof typeof SIZE
  className?: string
  /** Small presence dot: online / away. */
  status?: "online" | "away"
}) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold tracking-tight select-none",
          SIZE[size],
          tintOf(name)
        )}
      >
        {initialsOf(name)}
      </span>
      {status && (
        <span
          className={cn(
            "absolute -right-px -bottom-px size-2.5 rounded-full ring-2 ring-card",
            status === "online" ? "bg-success" : "bg-warning"
          )}
        />
      )}
    </span>
  )
}

export function AvatarStack({
  names,
  max = 3,
  size = "sm",
  className,
}: {
  names: string[]
  max?: number
  size?: keyof typeof SIZE
  className?: string
}) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  return (
    <span
      className={cn("flex items-center -space-x-1.5", className)}
      aria-label={names.join(", ")}
    >
      {shown.map((n) => (
        <PersonAvatar
          key={n}
          name={n}
          size={size}
          className="rounded-full ring-2 ring-card"
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground tabular-nums ring-2 ring-card",
            SIZE[size]
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  )
}

/**
 * One person with a status line and a time, like
 * "Dianne Russell · ⏸ Paused · 2 hours ago". Clickable when `onClick` or `href` given.
 */
export function PersonRow({
  name,
  meta,
  metaIcon,
  time,
  trailing,
  selected,
  onClick,
  className,
}: {
  name: string
  meta?: React.ReactNode
  /** A StateGlyph or icon element shown before the meta line. */
  metaIcon?: React.ReactNode
  time?: React.ReactNode
  trailing?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}) {
  const Comp = onClick ? "button" : "div"
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left",
        onClick && "outline-none hover:bg-muted/60 focus-visible:bg-muted/60",
        selected && "bg-primary/[0.05]",
        className
      )}
    >
      <PersonAvatar name={name} />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate text-[14px] font-medium">{name}</span>
        {meta && (
          <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-muted-foreground">
            {metaIcon}
            <span className="truncate">{meta}</span>
          </span>
        )}
      </span>
      {time && (
        <span className="shrink-0 text-[12.5px] text-muted-foreground tabular-nums">
          {time}
        </span>
      )}
      {trailing}
    </Comp>
  )
}
