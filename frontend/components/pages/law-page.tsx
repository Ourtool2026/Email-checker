"use client"

import { Fragment, useState } from "react"
import {
  BanIcon,
  BellRingIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  FileTextIcon,
  GavelIcon,
  PlusIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  XIcon,
} from "lucide-react"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input } from "@/components/hq/input"
import { Sheet } from "@/components/hq/sheet"
import { Switch } from "@/components/hq/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import { approvals, getUser, lawRequests } from "@/lib/data/core"
import { formatLivingId } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

const lawSteps: any[] = ["Received", "Legal review", "Second approval", "Done"]

export function LawPage({ nav }: { nav?: any }) {
  const [a, e] = useState(null)
  const [r, i] = useState(false)
  const o = a && lawRequests.find((l) => l.id === a)
  const n = o && o.subject && getUser(o.subject)
  return (
    <>
      <PageHeader
        title="Law enforcement"
        desc="Requests from police and courts. No live feed, no bulk search: one named person or hostel per request, a case number, and two MyStay approvals before anything is released."
      >
        <Button onClick={() => i(true)}>
          <PlusIcon />
          Log a request
        </Button>
      </PageHeader>
      <div className="mb-4 grid gap-3 lg:grid-cols-4">
        {(
          [
            [
              FileTextIcon,
              "Needs a case or GD number and the officer\u2019s ID",
            ],
            [UserCheckIcon, "Legal officer checks the scope"],
            [ShieldCheckIcon, "A second admin approves the release"],
            [BellRingIcon, "The person is told, unless a court says not to"],
          ] as any[]
        ).map(([l, d], u) => (
          <div
            className="flex items-start gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={u}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[12px] font-semibold text-primary">
              {u + 1}
            </span>
            <span className="text-[13px] leading-snug">{d}</span>
          </div>
        ))}
      </div>
      <Card flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>About</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Due</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {lawRequests.map((l) => {
              const d = l.subject && getUser(l.subject)
              return (
                <TableRow onClick={() => e(l.id)} key={l.id}>
                  <TableCell className="font-mono text-[13px] font-medium">
                    {l.id}
                  </TableCell>
                  <TableCell>
                    <div className="grid leading-tight">
                      <span className="font-medium">{l.agency}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {l.officer}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {l.caseNo}
                  </TableCell>
                  <TableCell>
                    {d ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={d.name} photo={d.photo} size={24} />
                        {d.name}
                      </div>
                    ) : (
                      <span className="font-medium text-destructive">
                        Bulk request
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {l.step >= 3 ? (
                      <Badge
                        tone={
                          l.outcome?.startsWith("Refused")
                            ? "danger"
                            : "success"
                        }
                      >
                        {l.outcome?.startsWith("Refused")
                          ? "Refused"
                          : "Released"}
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-1">
                        {lawSteps.slice(0, 3).map((u, s) => (
                          <span
                            title={u}
                            className={cn(
                              "h-1.5 w-7 rounded-full",
                              s <= l.step - 1
                                ? "bg-primary"
                                : s === l.step
                                  ? "bg-primary/40"
                                  : "bg-track"
                            )}
                            key={u}
                          />
                        ))}
                        <span className="ml-1.5 text-[12px] text-muted-foreground">
                          {lawSteps[l.step]}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{l.due}</TableCell>
                  <TableCell className="w-8">
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      {o && (
        <Sheet open onClose={() => e(null)} width="sm:max-w-[540px]">
          <div className="border-b p-5">
            <div className="font-mono text-[12.5px] text-muted-foreground">
              {o.id}
              {" \xB7 received "}
              {o.received}
            </div>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
              {o.agency}
            </h2>
            <div className="mt-4 flex items-center gap-1.5">
              {lawSteps.map((l, d) => (
                <Fragment key={l}>
                  {d > 0 && (
                    <span
                      className={cn(
                        "h-0.5 flex-1 rounded",
                        d <= o.step ? "bg-primary" : "bg-track"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap",
                      d <= o.step ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full text-[10.5px]",
                        d < o.step || (d === 3 && o.step === 3)
                          ? "bg-primary text-primary-foreground"
                          : d === o.step
                            ? "border-2 border-primary"
                            : "border"
                      )}
                    >
                      {d < o.step || (d === 3 && o.step === 3) ? (
                        <CheckIcon className="size-3" />
                      ) : (
                        d + 1
                      )}
                    </span>
                    {l}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="grid flex-1 content-start gap-4 overflow-auto p-5">
            <div className="divide-y rounded-xl border text-[13.5px]">
              {(
                [
                  ["Officer", `${o.officer} \xB7 ${o.badge}`],
                  ["Case", o.caseNo],
                  [
                    "About",
                    n
                      ? `${n.name} \xB7 Living ID ${formatLivingId(n.lid)}`
                      : "Not one named person",
                  ],
                  ["Due", o.due],
                ] as any[]
              ).map(([l, d]) => (
                <div className="flex gap-3 px-3.5 py-2.5" key={l}>
                  <span className="w-20 shrink-0 text-muted-foreground">
                    {l}
                  </span>
                  <span className="font-medium">{d}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-1.5">
              <span className="text-[12.5px] font-medium text-muted-foreground">
                Fields asked for (only these are released)
              </span>
              {o.scope.map((l) => (
                <div
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px]"
                  key={l}
                >
                  <CircleCheckIcon className="size-4 text-primary" />
                  {l}
                </div>
              ))}
            </div>
            {!n && (
              <Notice tone="danger" icon={BanIcon}>
                Bulk requests are always refused. Ask the agency for a named
                person and a case number.
              </Notice>
            )}
            <div className="grid gap-2">
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <IconTile
                  icon={ScaleIcon}
                  tone={o.legal ? "success" : "neutral"}
                  size="sm"
                />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">Legal review</span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {o.legal
                      ? `Checked by ${o.legal}`
                      : "Waiting for the legal officer"}
                  </span>
                </span>
                {!o.legal && (
                  <Button
                    size="xs"
                    onClick={() => {
                      o.legal = "Nadia Rahman"
                      o.step = 2
                      logAudit("Finished legal review", o.id, o.caseNo)
                      approvals.unshift({
                        id: "ap" + Date.now(),
                        action: "Release data to police",
                        target: `${o.id} \xB7 ${n?.name}`,
                        by: "Nadia Rahman",
                        reason: `${o.caseNo}, scope checked`,
                        when: "Just now",
                        status: "waiting",
                        link: "law",
                      })
                      refresh()
                      toast("Legal review done. Waiting for a second admin.")
                    }}
                  >
                    Mark reviewed
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <IconTile
                  icon={ShieldCheckIcon}
                  tone={o.second ? "success" : "neutral"}
                  size="sm"
                />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">
                    Second approval
                  </span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {o.second
                      ? `Approved by ${o.second}`
                      : o.legal
                        ? "A different admin must approve in Approvals"
                        : "After legal review"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <IconTile icon={BellRingIcon} tone="primary" size="sm" />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">
                    Tell the person
                  </span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {o.notify
                      ? "They get a notice when data is released"
                      : "Off only with a court order"}
                  </span>
                </span>
                <Switch
                  checked={o.notify}
                  onChange={(l) => {
                    if (!l) {
                      toast(
                        "Turning this off needs a court order number",
                        GavelIcon
                      )
                      return
                    }
                    o.notify = l
                    refresh()
                  }}
                  label="Tell the person"
                />
              </div>
            </div>
            {o.outcome && (
              <Notice
                tone={o.outcome.startsWith("Refused") ? "danger" : "primary"}
              >
                {o.outcome}
              </Notice>
            )}
          </div>
          <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
            {o.step < 3 && (
              <>
                <Button
                  size="sm"
                  disabled={!o.legal || !o.second}
                  onClick={() => {
                    o.step = 3
                    o.outcome = "Released"
                    logAudit(
                      "Released data to police",
                      o.id,
                      o.scope.join(", ")
                    )
                    refresh()
                    toast("Released through the secure link. Logged.")
                  }}
                >
                  <ShieldCheckIcon />
                  Release
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    o.step = 3
                    o.outcome = "Refused: scope not lawful"
                    logAudit("Refused police request", o.id, "\u2014")
                    refresh()
                    toast("Refused. The agency is told why.")
                  }}
                >
                  <XIcon />
                  Refuse
                </Button>
              </>
            )}
            {o.step >= 3 && (
              <span className="px-1 py-1.5 text-[12.5px] text-muted-foreground">
                Closed. Every step is in the audit log.
              </span>
            )}
          </div>
        </Sheet>
      )}
      <Dialog
        open={r}
        onClose={() => i(false)}
        title="Log a police or court request"
        description="Only official letters or emails from a government address. Never by phone."
        footer={
          <>
            <Button variant="outline" onClick={() => i(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                lawRequests.unshift({
                  id: "LR-01" + (43 + lawRequests.length),
                  agency: "Dakshinkhan Police Station, DMP",
                  officer: "SI Shafiqul Islam",
                  badge: "BP 8611023",
                  caseNo: "GD 1203/26",
                  subject: "u52",
                  scope: ["Name and Living ID", "Current hostel"],
                  received: "23 Nov",
                  due: "30 Nov",
                  step: 0,
                  legal: null,
                  second: null,
                  notify: true,
                })
                logAudit(
                  "Logged police request",
                  "GD 1203/26",
                  "Letter received"
                )
                i(false)
                refresh()
                toast("Request logged. Legal officer notified.")
              }}
            >
              <PlusIcon />
              Log request
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Agency">
            <Input defaultValue="Dakshinkhan Police Station, DMP" />
          </Field>
          <Field label="Officer and badge no.">
            <Input defaultValue="SI Shafiqul Islam · BP 8611023" />
          </Field>
          <Field label="Case or GD number">
            <Input defaultValue="GD 1203/26" />
          </Field>
          <Field label="Living ID of the person">
            <Input defaultValue="5•• •••" />
          </Field>
        </div>
        <Field label="Letter">
          <div className="flex h-16 items-center justify-center rounded-xl border border-dashed text-[12.5px] text-muted-foreground">
            Drop the signed letter (PDF)
          </div>
        </Field>
      </Dialog>
    </>
  )
}
