import * as React from "react"
import { Flag } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * Chips: small tinted labels with a state glyph, as in the references
 * ("Completed", "In progress", "In review", "No priority").
 */

export type ChipTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "violet"
  | "teal"
  | "pink"
  | "orange"
  | "indigo"
export type Glyph =
  | "none"
  | "dot"
  | "todo"
  | "half"
  | "progress"
  | "done"
  | "pause"
  | "clock"
  | "error"
  | "reply"

const TONE: Record<ChipTone, string> = {
  neutral: "bg-muted text-muted-foreground",
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

/** Text colour for each tone, for glyphs and icons outside a chip. */
export const TONE_TEXT: Record<ChipTone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  violet: "text-violet",
  teal: "text-teal",
  pink: "text-pink",
  orange: "text-orange",
  indigo: "text-indigo",
}

/** 12px state glyphs drawn in currentColor, so they follow the chip tone. */
export function StateGlyph({
  glyph,
  className,
}: {
  glyph: Glyph
  className?: string
}) {
  const c = cn("size-3 shrink-0", className)
  switch (glyph) {
    case "none":
      return null
    case "dot":
      return (
        <span
          className={cn("size-1.5 shrink-0 rounded-full bg-current", className)}
        />
      )
    case "todo":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 1.6"
          />
        </svg>
      )
    case "half":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M6 1.25a4.75 4.75 0 0 1 0 9.5z" fill="currentColor" />
        </svg>
      )
    case "progress":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".3"
            strokeWidth="1.5"
          />
          <path
            d="M6 1.25A4.75 4.75 0 0 1 10.75 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="6" cy="6" r="2" fill="currentColor" />
        </svg>
      )
    case "done":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle cx="6" cy="6" r="5.5" fill="currentColor" />
          <path
            d="m3.6 6.1 1.6 1.6 3.2-3.3"
            fill="none"
            stroke="var(--card)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "pause":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4.9 4.2v3.6M7.1 4.2v3.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )
    case "clock":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 3.6V6l1.6 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )
    case "error":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle cx="6" cy="6" r="5.5" fill="currentColor" />
          <path
            d="M6 3.4v3M6 8.3v.1"
            stroke="var(--card)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case "reply":
      return (
        <svg viewBox="0 0 12 12" className={c} aria-hidden>
          <circle
            cx="6"
            cy="6"
            r="4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7.6 6H4.6m1.2-1.4L4.4 6l1.4 1.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

export function Chip({
  tone = "neutral",
  glyph = "none",
  icon: Icon,
  children,
  className,
  size = "md",
}: {
  tone?: ChipTone
  glyph?: Glyph
  icon?: React.ElementType
  children: React.ReactNode
  className?: string
  size?: "sm" | "md"
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md font-medium whitespace-nowrap",
        size === "md" ? "h-6 px-2 text-[12px]" : "h-5 px-1.5 text-[11px]",
        TONE[tone],
        className
      )}
    >
      {Icon ? (
        <Icon className="size-3.5 shrink-0" />
      ) : (
        <StateGlyph glyph={glyph} />
      )}
      {children}
    </span>
  )
}

/** Plain outlined chip for neutral metadata ("No priority", a list name, a tag). */
export function MetaChip({
  icon: Icon,
  children,
  className,
}: {
  icon?: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-md border bg-card px-2 text-[12px] whitespace-nowrap text-muted-foreground",
        className
      )}
    >
      {Icon && <Icon className="size-3.5 shrink-0" />}
      {children}
    </span>
  )
}

/* -------------------------------------------------------------- status map */

type StatusDef = { tone: ChipTone; glyph: Glyph; label?: string }

const STATUS: Record<string, StatusDef> = {
  // campaigns & sending
  sent: { tone: "success", glyph: "done" },
  done: { tone: "success", glyph: "done", label: "Sent" },
  delivered: { tone: "success", glyph: "done" },
  completed: { tone: "success", glyph: "done" },
  finished: { tone: "success", glyph: "done" },
  sending: { tone: "primary", glyph: "progress" },
  running: { tone: "primary", glyph: "progress" },
  "in progress": { tone: "primary", glyph: "progress" },
  warming: { tone: "primary", glyph: "progress" },
  "warming up": { tone: "primary", glyph: "progress" },
  scheduled: { tone: "violet", glyph: "clock" },
  queued: { tone: "neutral", glyph: "clock" },
  "in review": { tone: "warning", glyph: "half" },
  review: { tone: "warning", glyph: "half" },
  planning: { tone: "neutral", glyph: "half" },
  draft: { tone: "neutral", glyph: "todo" },
  new: { tone: "neutral", glyph: "todo" },
  "not sent": { tone: "neutral", glyph: "todo" },
  "to-do": { tone: "neutral", glyph: "todo" },
  paused: { tone: "warning", glyph: "pause" },
  inactive: { tone: "neutral", glyph: "pause" },
  "not warming": { tone: "neutral", glyph: "pause" },
  disabled: { tone: "neutral", glyph: "pause" },
  // health
  active: { tone: "success", glyph: "dot" },
  connected: { tone: "success", glyph: "dot" },
  live: { tone: "success", glyph: "dot" },
  installed: { tone: "success", glyph: "done" },
  verified: { tone: "success", glyph: "done" },
  published: { tone: "success", glyph: "dot" },
  healthy: { tone: "success", glyph: "dot" },
  subscribed: { tone: "success", glyph: "dot" },
  paid: { tone: "success", glyph: "done" },
  available: { tone: "success", glyph: "dot" },
  open: { tone: "primary", glyph: "dot" },
  answered: { tone: "success", glyph: "reply" },
  "reply received": { tone: "primary", glyph: "reply" },
  replied: { tone: "primary", glyph: "reply" },
  waiting: { tone: "warning", glyph: "clock" },
  pending: { tone: "warning", glyph: "clock" },
  unconfirmed: { tone: "warning", glyph: "clock" },
  "on hold": { tone: "warning", glyph: "clock" },
  unverified: { tone: "warning", glyph: "error" },
  "not installed": { tone: "warning", glyph: "clock" },
  "needs dns": { tone: "warning", glyph: "error" },
  closed: { tone: "neutral", glyph: "done" },
  archived: { tone: "neutral", glyph: "done" },
  unsubscribed: { tone: "neutral", glyph: "dot" },
  // problems
  failed: { tone: "danger", glyph: "error" },
  error: { tone: "danger", glyph: "error" },
  bounced: { tone: "danger", glyph: "error" },
  blacklisted: { tone: "danger", glyph: "error" },
  blocked: { tone: "danger", glyph: "error" },
  spam: { tone: "danger", glyph: "error" },
  "spam reported": { tone: "danger", glyph: "error" },
  refunded: { tone: "neutral", glyph: "reply" },
  canceled: { tone: "neutral", glyph: "error" },
  cancelled: { tone: "neutral", glyph: "error" },
}

export function statusDef(status: string): StatusDef {
  const key = status.trim().toLowerCase()
  return (
    STATUS[key] ??
    STATUS[Object.keys(STATUS).find((k) => key.startsWith(k)) ?? ""] ?? {
      tone: "neutral",
      glyph: "dot",
    }
  )
}

/** A chip for any status word the app uses; picks tone and glyph from the status map. */
export function StatusChip({
  status,
  label,
  size,
  className,
}: {
  status: string
  label?: React.ReactNode
  size?: "sm" | "md"
  className?: string
}) {
  const d = statusDef(status)
  return (
    <Chip tone={d.tone} glyph={d.glyph} size={size} className={className}>
      {label ?? d.label ?? status}
    </Chip>
  )
}

/* --------------------------------------------------------------- priority */

export type Priority = "urgent" | "high" | "medium" | "normal" | "low" | "none"

const PRIORITY: Record<Priority, { tone: ChipTone; label: string }> = {
  urgent: { tone: "danger", label: "Urgent" },
  high: { tone: "warning", label: "High" },
  medium: { tone: "warning", label: "Medium" },
  normal: { tone: "primary", label: "Normal" },
  low: { tone: "primary", label: "Low" },
  none: { tone: "neutral", label: "No priority" },
}

export function PriorityChip({
  priority,
  className,
}: {
  priority: Priority | string
  className?: string
}) {
  const p = PRIORITY[priority.toLowerCase() as Priority] ?? PRIORITY.none
  if (p === PRIORITY.none)
    return <MetaChip className={className}>{p.label}</MetaChip>
  return (
    <Chip tone={p.tone} icon={Flag} className={className}>
      {p.label}
    </Chip>
  )
}

/* ------------------------------------------------------------------ delta */

/** "+15%" pill with a tinted fill and border, for change versus a previous period. */
export function DeltaBadge({
  value,
  suffix = "%",
  className,
  invert,
}: {
  value: number
  suffix?: string
  className?: string
  /** A rise is bad (bounces, unsubscribes). */
  invert?: boolean
}) {
  const good = invert ? value < 0 : value > 0
  const tone =
    value === 0
      ? "border-border bg-muted text-muted-foreground"
      : good
        ? "border-success/25 bg-success/10 text-success"
        : "border-destructive/25 bg-destructive/10 text-destructive"
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2 text-[12px] font-medium tabular-nums",
        tone,
        className
      )}
    >
      {value > 0 ? "+" : ""}
      {value}
      {suffix}
    </span>
  )
}

/** Counter pill used beside tab and column labels. */
export function Count({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground/[0.06] px-1.5 text-[11px] font-medium text-muted-foreground tabular-nums",
        className
      )}
    >
      {children}
    </span>
  )
}
