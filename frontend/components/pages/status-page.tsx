"use client"

import { useState } from "react"
import {
  CheckIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  RefreshCwIcon,
  SendIcon,
  ServerIcon,
  SirenIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { UptimeBars } from "@/components/charts"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input, Select, Textarea } from "@/components/hq/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import { backgroundJobs, incidents, services } from "@/lib/data/core"
import { copyText, logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function StatusPage() {
  const [t, a] = useState(false)
  const [e, r] = useState("")
  const i = incidents.filter((o) => o.status !== "Resolved")
  return (
    <>
      <PageHeader
        title="System status"
        desc="Health of every service both apps depend on, open incidents and background jobs."
        badge={
          i.length ? (
            <Badge tone="warning">
              {i.length}
              {" incident open"}
            </Badge>
          ) : (
            <Badge tone="success">All systems normal</Badge>
          )
        }
      >
        <Button
          variant="outline"
          onClick={() =>
            copyText(
              "https://status.mystayid.com",
              "Public status page link copied"
            )
          }
        >
          <CopyIcon />
          Public status page
        </Button>
        <Button variant="destructive" onClick={() => a(true)}>
          <SirenIcon />
          Declare incident
        </Button>
      </PageHeader>
      {i.map((o) => (
        <Card
          icon={SirenIcon}
          title={`${o.title}`}
          description={`${o.id} \xB7 ${o.sev} \xB7 started ${o.start}`}
          className="mb-4"
          actions={
            <div className="flex gap-1.5">
              <Badge tone="warning">{o.status}</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  o.status = "Resolved"
                  o.updates.unshift([
                    "Now",
                    "Resolved",
                    "Marked resolved from HQ.",
                  ])
                  logAudit("Resolved incident", o.id, o.title)
                  refresh()
                  toast("Incident resolved. Status page updated.")
                }}
              >
                <CheckIcon />
                Resolve
              </Button>
            </div>
          }
          key={o.id}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-3">
              {o.updates.map(([n, l, d], u) => (
                <div className="flex gap-3" key={u}>
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "mt-1 size-2.5 rounded-full",
                        u === 0 ? "bg-warning" : "bg-muted-foreground/40"
                      )}
                    />
                    {u < o.updates.length - 1 && (
                      <span className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="grid pb-1 leading-snug">
                    <span className="text-[13px] font-semibold">
                      {l}{" "}
                      <span className="font-normal text-muted-foreground">
                        {"\xB7 "}
                        {n}
                      </span>
                    </span>
                    <span className="text-[13px]">{d}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid content-start gap-2">
              <Notice tone="warning" icon={TriangleAlertIcon}>
                {o.impact}
              </Notice>
              <Textarea
                rows={2}
                value={e}
                onChange={(n) => r(n.target.value)}
                placeholder="Post an update to the status page"
              />
              <Button
                size="sm"
                disabled={!e.trim()}
                onClick={() => {
                  o.updates.unshift(["Now", o.status, e])
                  r("")
                  refresh()
                  toast("Update posted")
                }}
              >
                <SendIcon />
                Post update
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <Card
        icon={ServerIcon}
        title="Services"
        description="Last 60 days · each bar is one day"
        className="mb-4"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {services.map((o) => (
            <div className="grid gap-1.5" key={o.n}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      o.status === "OK" ? "bg-success" : "bg-warning"
                    )}
                  />
                  {o.n}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {o.up}% up{o.ms ? ` \xB7 ${o.ms} ms` : ""}
                </span>
              </div>
              <UptimeBars bars={o.bars} />
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card icon={RefreshCwIcon} title="Background jobs" flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">In queue</TableHead>
                <TableHead>Speed / schedule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backgroundJobs.map(([o, n, l, d]) => (
                <TableRow key={o}>
                  <TableCell className="font-medium">{o}</TableCell>
                  <TableCell>
                    <Badge tone={n === "running" ? "success" : "neutral"}>
                      {n === "running" ? "Running" : "Scheduled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {l.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Card icon={ClockIcon} title="Past incidents" flush>
          <div className="divide-y">
            {incidents
              .filter((o) => o.status === "Resolved")
              .map((o) => (
                <div className="flex items-start gap-3 px-4 py-3" key={o.id}>
                  <IconTile icon={CircleCheckIcon} tone="success" size="sm" />
                  <div className="grid flex-1 leading-snug">
                    <span className="text-[13.5px] font-medium">{o.title}</span>
                    <span className="text-[12.5px] text-muted-foreground">
                      {o.id}
                      {" \xB7 "}
                      {o.sev}
                      {" \xB7 "}
                      {o.start}
                      {" \xB7 "}
                      {o.impact}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
      <Dialog
        open={t}
        onClose={() => a(false)}
        title="Declare an incident"
        description="Posts to the status page, pages the on-call engineer and opens #incident in Slack."
        footer={
          <>
            <Button variant="outline" onClick={() => a(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                incidents.unshift({
                  id: "INC-32",
                  title: "Push notices delayed",
                  sev: "Minor",
                  status: "Investigating",
                  start: "23 Nov, 16:10",
                  impact: "Some push notices arrive late",
                  updates: [
                    [
                      "16:10",
                      "Investigating",
                      "We are looking into delayed push notices.",
                    ],
                  ],
                })
                logAudit("Declared incident", "INC-32", "Push notices delayed")
                a(false)
                refresh()
                toast("Incident declared. On-call paged.", SirenIcon)
              }}
            >
              <SirenIcon />
              Declare
            </Button>
          </>
        }
      >
        <Field label="Title">
          <Input defaultValue="Push notices delayed" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Severity">
            <Select>
              <option>Minor</option>
              <option>Major</option>
              <option>Critical</option>
            </Select>
          </Field>
          <Field label="Service">
            <Select>
              {services.map((o) => (
                <option key={o.n}>{o.n}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="What people notice">
          <Input defaultValue="Some push notices arrive late" />
        </Field>
      </Dialog>
    </>
  )
}
