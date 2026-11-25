"use client"

import {
  ChevronRightIcon,
  CircleCheckIcon,
  ClockIcon,
  HourglassIcon,
  ListChecksIcon,
  MegaphoneIcon,
  ServerIcon,
  WalletIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import {
  StatTile,
  formatDue,
  isDueSoon,
  isOverdue,
  personPhoto,
  taskPriorityTones,
} from "@/components/teams/shared"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { tasks } from "@/lib/data/teams"
import { cn } from "@/lib/utils"

export function WorkPage({ nav }: { nav?: any }) {
  const a = (e?) => tasks.filter((r) => r.team === e && r.status !== "Done")
  return (
    <>
      <PageHeader
        title="All team work"
        desc="Every team's open tasks in one view. Overdue work is shown first."
      />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={ListChecksIcon}
          tone="primary"
          label="Open tasks"
          value={tasks.filter((e) => e.status !== "Done").length}
        />
        <StatTile
          icon={ClockIcon}
          tone="danger"
          label="Overdue"
          value={tasks.filter(isOverdue).length}
        />
        <StatTile
          icon={HourglassIcon}
          tone="warning"
          label="Due in 2 days"
          value={tasks.filter(isDueSoon).length}
        />
        <StatTile
          icon={CircleCheckIcon}
          tone="success"
          label="Done this week"
          value={tasks.filter((e) => e.status === "Done").length}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {(
          [
            ["marketing", "Marketing", MegaphoneIcon, "pink"],
            ["finance", "Finance", WalletIcon, "success"],
            ["tech", "Technical", ServerIcon, "primary"],
          ] as any[]
        ).map(([e, r, i, o]) => (
          <Card
            icon={i}
            title={r}
            description={`${a(e).length} open`}
            actions={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => nav.go(e === "tech" ? "technical" : e)}
              >
                Open
                <ChevronRightIcon />
              </Button>
            }
            flush
            key={e}
          >
            <div className="divide-y">
              {a(e)
                .sort(
                  (n, l) =>
                    Number(isOverdue(l)) - Number(isOverdue(n)) ||
                    n.due.localeCompare(l.due)
                )
                .map((n) => (
                  <button
                    onClick={() => nav.go(e === "tech" ? "technical" : e)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
                    key={n.id}
                  >
                    <Avatar name={n.who} photo={personPhoto(n.who)} size={26} />
                    <span className="grid min-w-0 flex-1 leading-tight">
                      <span className="truncate text-[13px] font-medium">
                        {n.title}
                      </span>
                      <span
                        className={cn(
                          "text-[11.5px]",
                          isOverdue(n)
                            ? "font-semibold text-destructive"
                            : "text-muted-foreground"
                        )}
                      >
                        {n.status}
                        {" \xB7 due "}
                        {formatDue(n.due)}
                      </span>
                    </span>
                    <Badge tone={taskPriorityTones[n.pri]} dot={false}>
                      {n.pri}
                    </Badge>
                  </button>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
