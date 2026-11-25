import * as React from "react"

import { Chip, MetaChip, type ChipTone } from "@/components/kit/chip"

export type Tone = ChipTone

/** Status chip with a small dot, toned by meaning (kit `Chip`). */
export function Badge({
  tone = "neutral",
  children,
  dot = true,
  className,
}: {
  tone?: Tone
  children: React.ReactNode
  dot?: boolean
  className?: string
}) {
  return (
    <Chip tone={tone} glyph={dot ? "dot" : "none"} className={className}>
      {children}
    </Chip>
  )
}

/** Neutral outlined metadata label (kit `MetaChip`). */
export function Tag({
  children,
  className,
  icon,
}: {
  children: React.ReactNode
  className?: string
  icon?: React.ElementType
}) {
  return (
    <MetaChip icon={icon} className={className}>
      {children}
    </MetaChip>
  )
}
