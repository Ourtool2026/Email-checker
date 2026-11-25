"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Switch } from "@/components/hq/switch"
import { universityPartners } from "@/lib/data/core"
import { num } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"

export function PartnersPage() {
  const t = {
    Partner: "success",
    Talking: "warning",
    "Not yet": "neutral",
  }
  return (
    <>
      <PageHeader
        title="Partners"
        desc="Universities that confirm student IDs by email domain and share MyStay ID with new students."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {universityPartners.map((a) => (
          <div
            className="grid gap-3 rounded-2xl border bg-card p-4 shadow-card"
            key={a.name}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[12.5px] font-bold text-primary">
                {a.short}
              </span>
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="text-[14px] font-semibold">{a.name}</span>
                <span className="font-mono text-[12px] text-muted-foreground">
                  @{a.domain}
                </span>
              </div>
              <Badge tone={t[a.status]}>{a.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border bg-muted/60 p-2.5">
                <div className="text-[11.5px] text-muted-foreground">
                  Students on MyStay
                </div>
                <div className="text-[16px] font-semibold tabular-nums">
                  {num(a.students)}
                </div>
              </div>
              <div className="rounded-xl border bg-muted/60 p-2.5">
                <div className="text-[11.5px] text-muted-foreground">
                  Partner since
                </div>
                <div className="text-[16px] font-semibold">{a.since}</div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t pt-3">
              <span className="text-[13px]">Auto-confirm student email</span>
              <Switch
                checked={a.status === "Partner"}
                onChange={(e) => {
                  a.status = e ? "Partner" : "Talking"
                  logAudit(
                    e ? "Turned on email check" : "Turned off email check",
                    a.name,
                    "\u2014"
                  )
                  refresh()
                }}
                label="Auto-confirm"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
