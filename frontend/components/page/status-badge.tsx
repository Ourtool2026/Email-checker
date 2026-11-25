import * as React from "react"

import { Chip, statusDef, type ChipTone } from "@/components/kit/chip"

export type Tone =
  "neutral" | "success" | "warning" | "destructive" | "info" | "primary"

const TO_CHIP: Record<Tone, ChipTone> = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
  destructive: "danger",
  info: "primary",
  primary: "primary",
}

/**
 * Status chip (kept for existing callers). Picks the state glyph from the status
 * word when the children are a plain string; prefer `StatusChip` in new code.
 */
export function StatusBadge({
  tone = "neutral",
  dot,
  children,
  className,
}: {
  tone?: Tone
  dot?: boolean
  children: React.ReactNode
  className?: string
}) {
  const glyph =
    typeof children === "string"
      ? statusDef(children).glyph
      : dot
        ? "dot"
        : "none"
  return (
    <Chip
      tone={TO_CHIP[tone]}
      glyph={
        glyph === "dot" && !dot && typeof children !== "string" ? "none" : glyph
      }
      className={className}
    >
      {children}
    </Chip>
  )
}

/** Common status words → tone, so screens stay consistent. */
export function toneFor(status: string): Tone {
  const t = statusDef(status).tone
  if (t === "danger") return "destructive"
  return t === "neutral" ||
    t === "success" ||
    t === "warning" ||
    t === "primary"
    ? t
    : "primary"
}
