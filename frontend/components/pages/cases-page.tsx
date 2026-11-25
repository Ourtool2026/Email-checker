"use client"

import { useState } from "react"
import {
  ChevronRightIcon,
  ClockIcon,
  LayoutGridIcon,
  LinkIcon,
  ListIcon,
  MessageSquareIcon,
  PlusIcon,
  UserPlusIcon,
} from "lucide-react"
import { CaseDrawer } from "@/components/drawers/case-drawer"
import { FilterChips } from "@/components/shared/filter-chips"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Badge, Tag } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { Field, Input, Select } from "@/components/hq/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { Tabs } from "@/components/hq/tabs"
import { toast } from "@/components/hq/toast"
import { Tooltip } from "@/components/hq/tooltip"
import {
  adminTeam,
  cases,
  currentAdmin,
  getHostel,
  getUser,
  reports,
} from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export const priorityTones: Record<string, any> = {
  P1: "danger",
  P2: "warning",
  P3: "neutral",
}

export const caseStages: any[] = [
  "New",
  "Investigating",
  "Waiting on police",
  "Waiting on hostel",
  "Resolved",
]

export const slaHours: Record<string, any> = {
  P1: 8,
  P2: 24,
  P3: 72,
}

const slaLabel = (t?) =>
  t.status === "Resolved"
    ? "Closed"
    : t.sla <= 0
      ? "Overdue"
      : t.sla < 1
        ? `${Math.round(t.sla * 60)} min left`
        : `${t.sla < 10 ? t.sla.toFixed(1) : Math.round(t.sla)} h left`

export const resolveLink = (t?) => {
  if (t[0] === "u") {
    return {
      k: "user",
      o: getUser(t),
    }
  }
  if (t[0] === "h") {
    return {
      k: "hostel",
      o: getHostel(t),
    }
  }
  return {
    k: "report",
    o: reports.find((a) => a.id === t),
  }
}

export function SlaBar({ c: t }: { c?: any }) {
  const a =
    t.status === "Resolved"
      ? 100
      : Math.min(100, (1 - t.sla / slaHours[t.pri]) * 100)
  const e = t.status !== "Resolved" && t.sla / slaHours[t.pri] < 0.5 /* .5 */
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] font-medium tabular-nums",
        t.status === "Resolved"
          ? "text-muted-foreground"
          : e
            ? "text-destructive"
            : "text-foreground/80"
      )}
    >
      <ClockIcon className="size-3.5" />
      {slaLabel(t)}
    </span>
  )
}

export function CasesPage({ nav }: { nav?: any }) {
  const [a, e] = useState("board")
  const [r, i] = useState("all")
  const [o, n] = useState(null)
  const [l, d] = useState(false)
  const [u, s] = useState(null)
  const m = cases.filter(
    (h) =>
      r === "all" ||
      (r === "me"
        ? h.who === currentAdmin.name
        : r === "none"
          ? !h.who
          : h.pri === "P1")
  )
  const f = o && cases.find((h) => h.id === o)
  return (
    <>
      <PageHeader
        title="Cases"
        desc="One place for every trust and safety investigation. Each case has a priority, an owner and a response deadline (P1: 8 hours, P2: 24, P3: 72)."
      >
        <Tabs
          size="sm"
          value={a}
          onChange={e}
          items={[
            {
              value: "board",
              label: "Board",
              icon: LayoutGridIcon,
            },
            {
              value: "list",
              label: "List",
              icon: ListIcon,
            },
          ]}
        />
        <Button onClick={() => d(true)}>
          <PlusIcon />
          New case
        </Button>
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          value={r}
          onChange={i}
          items={[
            [
              "all",
              "All open",
              cases.filter((h) => h.status !== "Resolved").length,
            ],
            [
              "p1",
              "P1 only",
              cases.filter((h) => h.pri === "P1" && h.status !== "Resolved")
                .length,
            ],
            [
              "me",
              "Mine",
              cases.filter((h) => h.who === currentAdmin.name).length,
            ],
            ["none", "Unassigned", cases.filter((h) => !h.who).length],
          ]}
        />
        <div className="flex gap-4 text-[12.5px] text-muted-foreground">
          <span>
            <b className="font-semibold text-foreground">92%</b>
            {" answered within deadline (30 days)"}
          </span>
          <span>
            <b className="font-semibold text-foreground">6.1 h</b>
            {" median to first action"}
          </span>
        </div>
      </div>
      {a === "board" ? (
        <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
          {caseStages.map((h) => {
            const B = m.filter((y) => y.status === h)
            return (
              <section
                onDragOver={(y) => y.preventDefault()}
                onDrop={() => {
                  if (u) {
                    const y = cases.find((W) => W.id === u)
                    y.status = h
                    logAudit("Moved case", y.id, h)
                    s(null)
                    refresh()
                  }
                }}
                className="flex w-[290px] shrink-0 flex-col gap-1.5 rounded-3xl border border-surface-border bg-surface p-1.5"
                key={h}
              >
                <header className="flex items-center gap-2 px-3 pt-2 pb-1">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      h === "New"
                        ? "bg-primary"
                        : h === "Resolved"
                          ? "bg-success"
                          : h.startsWith("Waiting")
                            ? "bg-warning"
                            : "bg-violet"
                    )}
                  />
                  <h3 className="flex-1 text-[13.5px] font-semibold">{h}</h3>
                  <span className="rounded-md border bg-card px-1.5 text-[12px] tabular-nums">
                    {B.length}
                  </span>
                </header>
                {B.map((y) => (
                  <article
                    draggable
                    onDragStart={() => s(y.id)}
                    onClick={() => n(y.id)}
                    className="grid cursor-pointer gap-2.5 rounded-2xl border bg-card p-3 shadow-card hover:border-ring/40"
                    key={y.id}
                  >
                    <div className="flex items-center gap-2">
                      <Badge tone={priorityTones[y.pri]} dot={false}>
                        {y.pri}
                      </Badge>
                      <span className="font-mono text-[11.5px] text-muted-foreground">
                        {y.id}
                      </span>
                      <span className="ml-auto">
                        <SlaBar c={y} />
                      </span>
                    </div>
                    <span className="text-[13.5px] leading-snug font-medium">
                      {y.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <Tag>{y.type}</Tag>
                      <span className="ml-auto flex items-center gap-2 text-[12px] text-muted-foreground">
                        {y.notes > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquareIcon className="size-3.5" />
                            {y.notes}
                          </span>
                        )}
                        {y.links.length > 0 && (
                          <span className="flex items-center gap-1">
                            <LinkIcon className="size-3.5" />
                            {y.links.length}
                          </span>
                        )}
                      </span>
                      {y.who ? (
                        <Tooltip label={y.who}>
                          <span>
                            <Avatar
                              name={y.who}
                              photo={
                                adminTeam.find((W) => W.name === y.who)?.photo
                              }
                              size={22}
                            />
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="flex size-[22px] items-center justify-center rounded-full border border-dashed text-muted-foreground">
                          <UserPlusIcon className="size-3" />
                        </span>
                      )}
                    </div>
                  </article>
                ))}
                {!B.length && (
                  <div className="rounded-2xl border border-dashed px-3 py-6 text-center text-[12.5px] text-muted-foreground">
                    Drop cases here
                  </div>
                )}
              </section>
            )
          })}
        </div>
      ) : (
        <Card flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {m.map((h) => (
                <TableRow onClick={() => n(h.id)} key={h.id}>
                  <TableCell>
                    <div className="grid leading-tight">
                      <span className="font-medium">{h.title}</span>
                      <span className="font-mono text-[11.5px] text-muted-foreground">
                        {h.id}
                        {" \xB7 opened "}
                        {h.opened}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge tone={priorityTones[h.pri]} dot={false}>
                      {h.pri}
                    </Badge>
                  </TableCell>
                  <TableCell>{h.type}</TableCell>
                  <TableCell>
                    {h.who ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={h.who}
                          photo={adminTeam.find((B) => B.name === h.who)?.photo}
                          size={22}
                        />
                        {h.who}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        h.status === "Resolved"
                          ? "success"
                          : h.status === "New"
                            ? "primary"
                            : "warning"
                      }
                    >
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <SlaBar c={h} />
                  </TableCell>
                  <TableCell className="w-8">
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {f && <CaseDrawer c={f} onClose={() => n(null)} nav={nav} />}
      <Dialog
        open={l}
        onClose={() => d(false)}
        title="New case"
        footer={
          <>
            <Button variant="outline" onClick={() => d(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                cases.unshift({
                  id: "CS-10" + (49 + cases.length),
                  title: "Visitor without Living ID entered at Green Nest",
                  type: "Hostel conduct",
                  pri: "P2",
                  status: "New",
                  who: currentAdmin.name,
                  sla: 24,
                  opened: "23 Nov, 16:05",
                  links: ["h1"],
                  notes: 0,
                })
                logAudit(
                  "Opened case",
                  "Green Nest Boys Hostel",
                  "Visitor without Living ID"
                )
                d(false)
                refresh()
                toast("Case opened")
              }}
            >
              <PlusIcon />
              Open case
            </Button>
          </>
        }
      >
        <Field label="Title">
          <Input defaultValue="Visitor without Living ID entered at Green Nest" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Type">
            <Select>
              <option>Hostel conduct</option>
              <option>Identity</option>
              <option>Safety</option>
              <option>Fake accounts</option>
              <option>Listing</option>
            </Select>
          </Field>
          <Field label="Priority">
            <Select defaultValue="P2">
              <option>P1</option>
              <option>P2</option>
              <option>P3</option>
            </Select>
          </Field>
          <Field label="Owner">
            <Select defaultValue={currentAdmin.name}>
              {adminTeam.map((h) => (
                <option key={h.name}>{h.name}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Link a user or hostel">
          <Input
            placeholder="Name, Living ID or hostel"
            defaultValue="Green Nest Boys Hostel"
          />
        </Field>
      </Dialog>
    </>
  )
}
