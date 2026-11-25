"use client"

import { IconTile } from "@/components/hq/icon-tile"
import { UnderlineTabs } from "@/components/hq/tabs"
import { adminTeam } from "@/lib/data/core"
import { TODAY, memberPhoto } from "@/lib/data/teams"

export const taskPriorityTones: Record<string, any> = {
  Urgent: "danger",
  High: "warning",
  Medium: "primary",
  Low: "neutral",
}

const monthsAbbr: any[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const formatDue = (t?) =>
  `${Number(t.slice(8))} ${monthsAbbr[Number(t.slice(5, 7)) - 1]}`

export const isOverdue = (t?) => t.status !== "Done" && t.due < TODAY

export const isDueSoon = (t?) =>
  t.status !== "Done" &&
  !isOverdue(t) &&
  (Date.parse(t.due) - Date.parse(TODAY)) / 86400000 /* 864e5 */ <= 2

export const personPhoto = (t?) =>
  memberPhoto(t) || adminTeam.find((a) => a.name === t)?.photo

export const stageDots: Record<string, any> = {
  Backlog: "bg-muted-foreground/40",
  "To do": "bg-primary",
  "In progress": "bg-violet",
  Review: "bg-warning",
  Done: "bg-success",
}

export function SectionTabs({
  value,
  onChange,
  items,
}: {
  value?: any
  onChange?: any
  items?: any
}) {
  return (
    <div className="no-scrollbar mb-5 overflow-x-auto">
      <div className="min-w-max">
        <UnderlineTabs value={value} onChange={onChange} items={items} />
      </div>
    </div>
  )
}

export function StatTile({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label?: any
  value?: any
  sub?: any
  icon?: any
  tone?: any
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card">
      <IconTile icon={icon} tone={tone} />
      <div className="grid min-w-0 leading-tight">
        <span className="text-[19px] font-semibold tabular-nums">{value}</span>
        <span className="truncate text-[12.5px] text-muted-foreground">
          {label}
          {sub && (
            <>
              {" \xB7 "}
              {sub}
            </>
          )}
        </span>
      </div>
    </div>
  )
}
