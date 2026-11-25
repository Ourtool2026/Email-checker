import * as React from "react"

import { Locked, previewClick, useControlGate } from "@/components/hq/gate"
import { Button as UIButton } from "@/components/ui/button"
import type { Right } from "@/lib/access"
import { cn } from "@/lib/utils"

type Props = Omit<React.ComponentProps<typeof UIButton>, "variant"> & {
  variant?: React.ComponentProps<typeof UIButton>["variant"] | "soft"
  /** The named right this action needs, when its label doesn't say. */
  right?: Right
}

const SOFT =
  "border-primary/30 bg-primary/[0.06] text-primary shadow-none hover:bg-primary/10 hover:text-primary"

/**
 * HQ button: the shadcn/ui button, plus a `soft` tint for secondary actions that
 * still belong to the primary colour. Inside a page it follows the access of the
 * person on screen: locked when they can't act, a preview notice during View as.
 */
export function Button({
  variant,
  className,
  right,
  onClick,
  ...props
}: Props) {
  const gate = useControlGate(props, right)
  const button = (
    <UIButton
      variant={variant === "soft" ? "outline" : variant}
      className={cn(variant === "soft" && SOFT, className)}
      {...props}
      disabled={props.disabled || gate?.kind === "disabled"}
      onClick={gate?.kind === "preview" ? previewClick(gate.reason) : onClick}
    />
  )
  return gate?.kind === "disabled" ? (
    <Locked reason={gate.reason}>{button}</Locked>
  ) : (
    button
  )
}
