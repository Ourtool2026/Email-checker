"use client";

import { LuX } from "react-icons/lu";
import { useEscape } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Dialog({
  open: t,
  onClose,
  title,
  description,
  children,
  footer,
  width = "max-w-[480px]",
}) {
  useEscape(t, onClose);
  return t ? (
    <>
      <div
        className="anim-fade fixed inset-0 z-[55] bg-black/30 dark:bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "anim-dlg fixed top-1/2 left-1/2 z-[60] flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border bg-popover shadow-float",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
          <div className="grid gap-1">
            <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
            {description && <p className="text-muted-foreground text-[13px]">{description}</p>}
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LuX className="size-4" />
          </button>
        </div>
        <div className="grid gap-4 overflow-auto px-5 pb-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 rounded-b-2xl border-t bg-muted/40 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </>
  ) : null;
}
