import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Panel: the two-tier card from the Tirik Send studio look. A gray shell carries the
 * header (icon, title, actions); the content sits on a white inner surface.
 *
 *   <Panel icon={Mail} title="Recent campaigns" actions={<Button …/>}>
 *     <PanelBody>…</PanelBody>
 *   </Panel>
 *
 * Use `PanelBody flush` for tables and lists that run edge to edge.
 */
export function Panel({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
}: {
  icon?: React.ElementType
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-3xl border border-surface-border bg-surface p-1.5 shadow-card",
        className
      )}
    >
      {(title || actions) && (
        <header
          className={cn(
            "flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 px-3.5 pt-2 pb-2.5",
            headerClassName
          )}
        >
          <div className="flex min-w-0 flex-1 basis-[180px] items-center gap-2.5">
            {Icon && (
              <Icon className="size-[18px] shrink-0 text-foreground/80" />
            )}
            <div className="grid min-w-0">
              {title && (
                <h2 className="truncate text-[15px] font-semibold tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="truncate text-[12.5px] text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex max-w-full min-w-0 flex-wrap items-center gap-1.5">
              {actions}
            </div>
          )}
        </header>
      )}
      {children}
    </section>
  )
}

export function PanelBody({
  children,
  className,
  flush,
}: {
  children: React.ReactNode
  className?: string
  /** No inner padding: for tables, lists and charts that run edge to edge. */
  flush?: boolean
}) {
  return (
    <div
      data-slot="panel-body"
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card",
        !flush && "p-5",
        className
      )}
    >
      {children}
    </div>
  )
}

/** A plain white card (no gray shell) for smaller, secondary blocks. */
export function Tile({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-card",
        className
      )}
    >
      {children}
    </div>
  )
}
