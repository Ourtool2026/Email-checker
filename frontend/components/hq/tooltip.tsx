"use client"

import * as React from "react"

import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Tooltip around one element (every icon-only button gets one). */
export function Tooltip({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactElement
}) {
  return (
    <UITooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </UITooltip>
  )
}
