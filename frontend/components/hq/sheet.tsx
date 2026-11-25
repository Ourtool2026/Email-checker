"use client"

import * as React from "react"

import {
  Sheet as UISheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/** Floating side panel on the right (drawers for users, hostels, cases, tasks). Appears in place. */
export function Sheet({
  open,
  onClose,
  children,
  width = "sm:max-w-[460px]",
  title = "Details",
}: {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
  width?: string
  title?: string
}) {
  return (
    <UISheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="right"
        className={cn(
          "inset-y-2 right-2 h-auto w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-2xl border bg-card p-0 shadow-float",
          width
        )}
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <SheetDescription className="sr-only">{title}</SheetDescription>
        {children}
      </SheetContent>
    </UISheet>
  )
}
