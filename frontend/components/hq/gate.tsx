"use client"

import * as React from "react"
import { EyeIcon } from "lucide-react"

import {
  type Gate,
  textOf,
  useActionGate,
} from "@/components/shell/access-context"
import { toast } from "@/components/hq/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Right } from "@/lib/access"

/** The gate for a control, from its aria-label or its visible text. */
export function useControlGate(
  props: { children?: React.ReactNode; "aria-label"?: string },
  right?: Right
): Gate {
  return useActionGate(props["aria-label"] ?? textOf(props.children), right)
}

/** Click handler that shows the preview notice instead of acting. */
export const previewClick =
  (reason: string) => (event: React.SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toast(reason, EyeIcon)
  }

/** Wraps a disabled control so its reason still shows on hover. */
export function Locked({
  reason,
  children,
}: {
  reason: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className="inline-flex cursor-not-allowed rounded-md outline-none"
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  )
}

/** A plain <button> for page actions that respects access and View as. */
export function ActionButton({
  right,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<"button"> & { right?: Right }) {
  const gate = useControlGate(props, right)
  if (gate?.kind === "disabled")
    return (
      <Locked reason={gate.reason}>
        <button
          {...props}
          disabled
          aria-disabled
          className={[props.className, "pointer-events-none opacity-50"].join(
            " "
          )}
        />
      </Locked>
    )
  return (
    <button
      {...props}
      disabled={disabled}
      onClick={gate ? previewClick(gate.reason) : onClick}
    />
  )
}
