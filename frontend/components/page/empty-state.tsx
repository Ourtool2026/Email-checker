import * as React from "react"

import { cn } from "@/lib/utils"

/** Calm empty state: a small icon tile, one line of title, one of help, one action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ElementType
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <span className="mb-2 flex size-11 items-center justify-center rounded-xl border bg-card text-muted-foreground shadow-card">
          <Icon className="size-5" />
        </span>
      )}
      <p className="text-[15px] font-semibold tracking-tight">{title}</p>
      {description && (
        <p className="max-w-[380px] text-[13.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}
