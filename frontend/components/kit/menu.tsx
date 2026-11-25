"use client"

import * as React from "react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/**
 * Menu item with an icon, a title and a one-line description, as in the
 * "Auto / Quick response / Deep research" reference. Use for choices where the
 * label alone is not enough (send now vs schedule, campaign types, export formats).
 */
export function RichMenuItem({
  icon: Icon,
  title,
  description,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & {
  icon?: React.ElementType
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <DropdownMenuItem
      className={cn("items-start gap-3 rounded-xl px-3 py-2.5", className)}
      {...props}
    >
      {Icon && <Icon className="mt-0.5 size-[18px] text-foreground" />}
      <span className="grid min-w-0 gap-0.5">
        <span className="text-[14px] font-medium">{title}</span>
        {description && (
          <span className="text-[12.5px] leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </DropdownMenuItem>
  )
}
