"use client"

import {
  CheckIcon,
  FlaskConicalIcon,
  PauseIcon,
  PlusIcon,
  TrophyIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { IconTile } from "@/components/hq/icon-tile"
import { toast } from "@/components/hq/toast"
import { experiments } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ExperimentsPage() {
  const t = {
    Running: "primary",
    "Shipped B": "success",
    Stopped: "neutral",
  }
  return (
    <>
      <PageHeader
        title="Experiments"
        desc="Try two versions of a screen or message with real users and keep the one that works. We ship only at 95% confidence or more."
      >
        <Button
          onClick={() =>
            toast("New experiment: pick a feature switch and a goal")
          }
        >
          <PlusIcon />
          New experiment
        </Button>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        {experiments.map((a) => {
          const e = a.b[1] > a.a[1]
          const r = ((a.b[1] - a.a[1]) / a.a[1]) * 100
          return (
            <div
              className="grid gap-4 rounded-2xl border bg-card p-5 shadow-card"
              key={a.id}
            >
              <div className="flex items-start gap-3">
                <IconTile icon={FlaskConicalIcon} tone="violet" />
                <div className="grid flex-1 leading-tight">
                  <span className="text-[14.5px] font-semibold">{a.name}</span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {a.id}
                    {" \xB7 "}
                    {a.app}
                    {" \xB7 "}
                    {a.days}
                    {" days \xB7 split "}
                    {a.split}
                  </span>
                </div>
                <Badge tone={t[a.status]}>{a.status}</Badge>
              </div>
              <div className="text-[12.5px] text-muted-foreground">
                {"Goal: "}
                <span className="font-medium text-foreground">{a.metric}</span>
              </div>
              <div className="grid gap-2">
                {[
                  ["A", a.a, false],
                  ["B", a.b, true],
                ].map(([i, [o, n], l]) => {
                  const d = l === e
                  return (
                    <div className="grid gap-1" key={i}>
                      <div className="flex justify-between text-[13px]">
                        <span>
                          <b className="font-semibold">{i}</b>
                          {" \xB7 "}
                          {o}
                          {d && a.conf >= 95 && (
                            <TrophyIcon className="ml-1.5 inline size-3.5 text-amber-500" />
                          )}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {n}
                          {a.metric.includes("per") ? "" : "%"}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-track">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            d ? "bg-primary" : "bg-muted-foreground/40"
                          )}
                          style={{
                            width:
                              Math.min(
                                100,
                                (n / Math.max(a.a[1], a.b[1])) * 100
                              ) + "%",
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-[12.5px]">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-semibold",
                      r > 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {r > 0 ? "+" : ""}
                    {r.toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">
                    {"\xB7 confidence "}
                    {a.conf}%
                  </span>
                </span>
                {a.status === "Running" && (
                  <div className="flex gap-1.5">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        a.status = "Stopped"
                        logAudit("Stopped experiment", a.id, a.name)
                        refresh()
                      }}
                    >
                      <PauseIcon />
                      Stop
                    </Button>
                    <Button
                      size="xs"
                      disabled={a.conf < 95}
                      onClick={() => {
                        a.status = "Shipped B"
                        logAudit("Shipped experiment", a.id, "B")
                        refresh()
                        toast("B is now the default for everyone")
                      }}
                    >
                      <CheckIcon />
                      Ship B
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
