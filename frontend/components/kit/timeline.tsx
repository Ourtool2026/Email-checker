import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * Timeline: a rail with state nodes and optional nested cards, for sequence
 * history, automation runs and activity logs. Pattern from the 21st.dev
 * "Activity Timeline" (@olewandowski1/timeline-3), restyled to Tirik Send tokens.
 *
 *   <Timeline>
 *     <TimelineItem state="done" title="Enrolled by Talk to sales form" />
 *     <TimelineItem state="done" title="Automated email" time="3 days ago">
 *       <TimelineCard title="Re: Talk to sales">Hi Sophia…</TimelineCard>
 *     </TimelineItem>
 *     <TimelineItem state="current" title="Wait 4 business days" />
 *   </Timeline>
 */

export type TimelineState = "done" | "current" | "upcoming" | "failed"

export function Timeline({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <ol className={cn("relative flex flex-col", className)}>{children}</ol>
}

function Node({ state }: { state: TimelineState }) {
  if (state === "done")
    return (
      <span className="flex size-[18px] items-center justify-center rounded-full bg-success text-card">
        <Check className="size-3" strokeWidth={3} />
      </span>
    )
  if (state === "failed")
    return (
      <span className="size-[18px] rounded-full bg-destructive ring-4 ring-destructive/20" />
    )
  if (state === "current")
    return (
      <span className="flex size-[18px] items-center justify-center rounded-full border-2 border-primary bg-card">
        <span className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
      </span>
    )
  return (
    <span className="size-[18px] rounded-full border-2 border-dashed border-border bg-card" />
  )
}

export function TimelineItem({
  state = "done",
  title,
  time,
  icon: Icon,
  children,
  last,
}: {
  state?: TimelineState
  title: React.ReactNode
  time?: React.ReactNode
  icon?: React.ElementType
  children?: React.ReactNode
  /** Hide the rail below this node. Defaults to the last item via CSS. */
  last?: boolean
}) {
  return (
    <li className="group/tl relative flex gap-3.5 pb-5 last:pb-0">
      <span
        aria-hidden
        className={cn(
          "absolute top-6 bottom-0 left-[8.5px] w-px group-last/tl:hidden",
          state === "done" ? "bg-success/40" : "bg-border",
          last && "hidden"
        )}
      />
      <span className="relative z-10 mt-0.5 shrink-0">
        <Node state={state} />
      </span>
      <div className="grid min-w-0 flex-1 gap-2.5">
        <div className="flex min-w-0 items-center gap-2 text-[13.5px]">
          {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
          <span
            className={cn(
              "min-w-0 flex-1",
              state === "upcoming" ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {title}
          </span>
          {time && (
            <span className="shrink-0 text-[12px] text-muted-foreground tabular-nums">
              {time}
            </span>
          )}
        </div>
        {children}
      </div>
    </li>
  )
}

/** A nested message/details card inside a timeline item. */
export function TimelineCard({
  title,
  meta,
  children,
  className,
}: {
  title?: React.ReactNode
  meta?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border bg-card p-3.5 shadow-card",
        className
      )}
    >
      {(title || meta) && (
        <div className="mb-1 flex items-center gap-2">
          {title && (
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">
              {title}
            </span>
          )}
          {meta && (
            <span className="shrink-0 text-[12px] text-muted-foreground">
              {meta}
            </span>
          )}
        </div>
      )}
      {children && (
        <div className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  )
}
