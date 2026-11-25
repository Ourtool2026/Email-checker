"use client"

import * as React from "react"

import {
  DropdownMenu as UIDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type MenuItem =
  | "-"
  | {
      icon?: React.ElementType
      label: React.ReactNode
      onClick?: () => void
      danger?: boolean
    }

/** Menu from a list of items; `"-"` is a separator. `trigger` renders the button. */
export function DropdownMenu({
  trigger,
  items,
  align = "right",
}: {
  trigger: (toggle: () => void) => React.ReactElement
  items: MenuItem[]
  align?: "left" | "right"
}) {
  return (
    <UIDropdownMenu>
      {/* Radix opens the menu itself; the trigger's own toggle is a no-op. */}
      <DropdownMenuTrigger asChild>{trigger(() => {})}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align === "right" ? "end" : "start"}
        className="min-w-[13rem]"
      >
        {items.map((item, i) =>
          item === "-" ? (
            <DropdownMenuSeparator key={i} />
          ) : (
            <DropdownMenuItem
              key={i}
              variant={item.danger ? "destructive" : "default"}
              onSelect={() => item.onClick?.()}
            >
              {item.icon && <item.icon />}
              {item.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </UIDropdownMenu>
  )
}
