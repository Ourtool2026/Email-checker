import * as React from "react"

import { Button as UIButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = Omit<React.ComponentProps<typeof UIButton>, "variant"> & {
  variant?: React.ComponentProps<typeof UIButton>["variant"] | "soft"
}

/**
 * HQ button: the shadcn/ui button, plus a `soft` tint for secondary actions that
 * still belong to the primary colour (tinted border and fill, primary text).
 */
export function Button({ variant, className, ...props }: Props) {
  if (variant === "soft") {
    return (
      <UIButton
        variant="outline"
        className={cn(
          "border-primary/30 bg-primary/[0.06] text-primary shadow-none hover:bg-primary/10 hover:text-primary",
          className
        )}
        {...props}
      />
    )
  }
  return <UIButton variant={variant} className={className} {...props} />
}
