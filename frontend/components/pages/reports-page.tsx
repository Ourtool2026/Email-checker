"use client"

import { useState } from "react"
import {
  CheckIcon,
  ChevronRightIcon,
  FlagIcon,
  ScaleIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { FilterChips } from "@/components/shared/filter-chips"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Textarea } from "@/components/hq/input"
import { Progress } from "@/components/hq/progress"
import { Sheet } from "@/components/hq/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import {
  approvals,
  currentAdmin,
  getHostel,
  getUser,
  reports,
} from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"

const reportStatusTones: Record<string, any> = {
  Disputed: "warning",
  Active: "primary",
  "Waiting for reply": "neutral",
  "HQ review": "violet",
  Faded: "neutral",
  Removed: "danger",
  Kept: "primary",
}

export function ReportsPage({ nav }: { nav?: any }) {
  const [a, e] = useState("open")
  const [r, i] = useState(null)
  const [o, n] = useState("")
  const l = (h?) =>
    !["Faded", "Removed", "Kept"].includes(h.status) || h.status === "Active"
  const d = reports.filter(
    (h) =>
      a === "all" ||
      (a === "open" ? !["Faded", "Removed"].includes(h.status) : h.status === a)
  )
  const u = r && reports.find((h) => h.id === r)
  const s = u && getUser(u.uid)
  const m = u && getHostel(u.by)
  const f = (h?, B?) => {
    u.status = h
    if (u.lab && window.MS) {
      window.MS.emit("report.decided", {
        id: u.id,
        status: h,
      })
    }
    logAudit(`Report: ${h.toLowerCase()}`, s.name, o || u.type)
    n("")
    i(null)
    refresh()
    toast(B)
  }
  return (
    <>
      <PageHeader
        title={"Reports & disputes"}
        desc="Reports hostels and landlords file against residents. Each has proof, a 14-day reply window and a fixed type. HQ steps in on disputes and serious cases."
      />
      <FilterChips
        value={a}
        onChange={e}
        items={[
          [
            "open",
            "Open",
            reports.filter((h) => !["Faded", "Removed"].includes(h.status))
              .length,
          ],
          [
            "Disputed",
            "Disputed",
            reports.filter((h) => h.status === "Disputed").length,
          ],
          [
            "HQ review",
            "HQ review",
            reports.filter((h) => h.status === "HQ review").length,
          ],
          ["all", "All"],
        ]}
      />
      <Card flush className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>About</TableHead>
              <TableHead>Filed by</TableHead>
              <TableHead>Filed</TableHead>
              <TableHead>Reply window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {d.map((h) => {
              const B = getUser(h.uid)
              const y = getHostel(h.by)
              return (
                <TableRow
                  onClick={() => {
                    i(h.id)
                    n("")
                  }}
                  key={h.id}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <IconTile
                        icon={
                          h.type.startsWith("Violence")
                            ? TriangleAlertIcon
                            : FlagIcon
                        }
                        tone={
                          h.type.startsWith("Violence") ? "danger" : "warning"
                        }
                        size="sm"
                      />
                      <span className="font-medium">{h.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={B.name} photo={B.photo} size={26} />
                      {B.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={y.photo}
                        alt=""
                        className="size-6 rounded-md object-cover"
                      />
                      <span className="max-w-[160px] truncate">{y.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{h.filed}</TableCell>
                  <TableCell>
                    {h.left > 0 ? (
                      <div className="grid w-24 gap-1">
                        <span className="text-[12px] tabular-nums">
                          {h.left}
                          {" days left"}
                        </span>
                        <Progress
                          value={((14 - h.left) / 14) * 100}
                          tone="warning"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Closed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge tone={reportStatusTones[h.status]}>{h.status}</Badge>
                  </TableCell>
                  <TableCell className="w-8">
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      {u && (
        <Sheet open onClose={() => i(null)} width="sm:max-w-[520px]">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <Badge tone={reportStatusTones[u.status]}>{u.status}</Badge>
              <span className="text-[12.5px] text-muted-foreground">
                {"Report "}
                {u.id.toUpperCase()}
                {" \xB7 filed "}
                {u.filed}
              </span>
            </div>
            <h2 className="mt-2 text-[18px] font-semibold tracking-tight">
              {u.type}
            </h2>
          </div>
          <div className="grid flex-1 content-start gap-4 overflow-auto p-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => nav.user(s.id)}
                className="flex items-center gap-2.5 rounded-xl border p-2.5 text-left hover:bg-muted/50"
              >
                <Avatar name={s.name} photo={s.photo} size={34} />
                <span className="grid leading-tight">
                  <span className="text-[11.5px] text-muted-foreground">
                    About
                  </span>
                  <span className="text-[13px] font-medium">{s.name}</span>
                </span>
              </button>
              <button
                onClick={() => nav.hostel(m.id)}
                className="flex items-center gap-2.5 rounded-xl border p-2.5 text-left hover:bg-muted/50"
              >
                <img
                  src={m.photo}
                  alt=""
                  className="size-[34px] rounded-lg object-cover"
                />
                <span className="grid min-w-0 leading-tight">
                  <span className="text-[11.5px] text-muted-foreground">
                    Filed by
                  </span>
                  <span className="truncate text-[13px] font-medium">
                    {m.name}
                  </span>
                </span>
              </button>
            </div>
            <div className="grid gap-1.5">
              <span className="text-[12.5px] font-medium text-muted-foreground">
                Proof from the hostel
              </span>
              <div className="rounded-xl border p-3.5 text-[13.5px]">
                {u.proof}
              </div>
            </div>
            <div className="grid gap-1.5">
              <span className="text-[12.5px] font-medium text-muted-foreground">
                Their reply
              </span>
              {u.reply ? (
                <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-3.5 text-[13.5px]">
                  “{u.reply}”
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-3.5 text-[13px] text-muted-foreground">
                  {u.left
                    ? `No reply yet \xB7 ${u.left} days left`
                    : "No reply was sent"}
                </div>
              )}
            </div>
            <Notice icon={ShieldCheckIcon}>
              Other owners only see the type and year. A report fades after 2
              years unless a police case backs it.
            </Notice>
            <Field label="Note for the record">
              <Textarea
                rows={2}
                value={o}
                onChange={(h) => n(h.target.value)}
                placeholder="Why you decided this"
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
            <Button
              size="sm"
              onClick={() => f("Kept", "Report kept. Both sides are told.")}
            >
              <CheckIcon />
              Keep report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                f(
                  "Disputed",
                  "Marked disputed. Owners see \u201Cdisputed\u201D next to it."
                )
              }
            >
              <ScaleIcon />
              Mark disputed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                approvals.unshift({
                  id: "ap" + Date.now(),
                  action: "Remove report",
                  target: `Report ${u.id} \xB7 ${u.type}`,
                  by: currentAdmin.name,
                  reason: o || "\u2014",
                  when: "Just now",
                  status: "waiting",
                  link: "reports",
                  mine: true,
                })
                logAudit("Asked to remove report", s.name, o || "\u2014")
                i(null)
                refresh()
                toast("Sent for a second approval")
              }}
            >
              <XIcon />
              Remove…
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => f("Faded", "Report faded early")}
            >
              Fade early
            </Button>
          </div>
        </Sheet>
      )}
    </>
  )
}
