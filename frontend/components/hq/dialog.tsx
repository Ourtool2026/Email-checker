"use client"

import * as React from "react"

import {
  Dialog as UIDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

/** Modal with a title, a scrolling body and an optional footer row. Appears in place. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "max-w-[480px]",
}: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  width?: string
}) {
  return (
    <UIDialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className={cn(
          "flex max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden p-0",
          width.replace(/(^|\s)max-w-/g, "$1sm:max-w-")
        )}
      >
        <DialogHeader className="gap-1 px-5 pt-5 pr-12 pb-3">
          <DialogTitle className="text-[17px] font-semibold tracking-tight">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-[13px]">
              {description}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>
        <div className="grid min-h-0 gap-4 overflow-auto px-5 pb-5">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-2 border-t bg-muted/40 px-5 py-3">
            {footer}
          </div>
        )}
      </DialogContent>
    </UIDialog>
  )
}
