import * as React from "react"

import { cn } from "@/lib/utils"

export type Device = "desktop" | "tablet" | "mobile"

/** Frame widths for the builders' device switch. */
export const FRAME_W: Record<Device, number> = {
  desktop: 980,
  tablet: 720,
  mobile: 390,
}

/**
 * A browser window around a builder preview: traffic lights, the site's address
 * (or an action when there is none) and a skeleton page behind the content.
 */
export function BrowserFrame({
  device,
  address,
  action,
  minHeight = 520,
  className,
  children,
}: {
  device: Device
  /** Shown in the address bar; null shows "No website connected". */
  address: string | null
  /** Shown at the end of the address bar, e.g. a "Connect a website" link. */
  action?: React.ReactNode
  minHeight?: number
  className?: string
  /** Drawn over the skeleton page; position it with `absolute`/`relative` as needed. */
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "isolate mx-auto max-w-full overflow-hidden rounded-2xl border bg-card shadow-card transition-[width]",
        className
      )}
      style={{ width: FRAME_W[device] }}
    >
      <div className="flex items-center gap-3 border-b bg-muted/60 px-3.5 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
        </span>
        <span className="flex h-6 min-w-0 flex-1 items-center rounded-md border bg-card px-2.5 text-[12px] text-muted-foreground">
          <span className="truncate">{address ?? "No website connected"}</span>
        </span>
        {action}
      </div>
      <div className="relative isolate" style={{ minHeight }}>
        <div className="absolute inset-0 flex flex-col gap-3 p-7" aria-hidden>
          <span className="h-3.5 w-2/5 rounded bg-muted" />
          <span className="h-2.5 w-[70%] rounded bg-muted/70" />
          <span className="h-2.5 w-[62%] rounded bg-muted/70" />
          <span className="h-40 w-full rounded-lg bg-muted/70" />
          <span className="h-2.5 w-[55%] rounded bg-muted/70" />
          <span className="h-2.5 w-[66%] rounded bg-muted/70" />
        </div>
        {children}
      </div>
    </div>
  )
}
