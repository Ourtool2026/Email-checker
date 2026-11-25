"use client"

import { useState } from "react"
import {
  AtSignIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  ClockIcon,
  FlagIcon,
  SendIcon,
  TriangleAlertIcon,
  UserCogIcon,
} from "lucide-react"
import {
  SlaBar,
  caseStages,
  priorityTones,
  resolveLink,
  slaHours,
} from "@/components/pages/cases-page"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Select, Textarea } from "@/components/hq/input"
import { Progress } from "@/components/hq/progress"
import { Sheet } from "@/components/hq/sheet"
import { toast } from "@/components/hq/toast"
import { adminTeam, currentAdmin, notesStore } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"

export function CaseDrawer({
  c: t,
  onClose,
  nav,
}: {
  c?: any
  onClose?: any
  nav?: any
}) {
  const [r, i] = useState("")
  const o =
    notesStore[t.id] ||
    (notesStore[t.id] = [
      [
        "Mitu Akter",
        "23 Nov, 11:20",
        "Opened from rule R-03. Two of the three reports have proof; the Sep one is disputed with a receipt.",
      ],
      [
        "Nadia Rahman",
        "23 Nov, 12:02",
        "Mirpur police asked about the same person (LR-0139). Keep this case linked.",
      ],
    ].slice(0, t.notes || 0))
  return (
    <Sheet open onClose={onClose} width="sm:max-w-[560px]">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <Badge tone={priorityTones[t.pri]} dot={false}>
            {t.pri}
          </Badge>
          <span className="font-mono text-[12.5px] text-muted-foreground">
            {t.id}
            {" \xB7 opened "}
            {t.opened}
          </span>
        </div>
        <h2 className="mt-2 pr-8 text-[18px] font-semibold tracking-tight">
          {t.title}
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Field label="Status">
            <Select
              className="h-8"
              value={t.status}
              onChange={(n) => {
                t.status = n.target.value
                logAudit("Changed case status", t.id, t.status)
                refresh()
              }}
            >
              {caseStages.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Select
              className="h-8"
              value={t.who || ""}
              onChange={(n) => {
                t.who = n.target.value || null
                logAudit("Assigned case", t.id, t.who || "nobody")
                refresh()
              }}
            >
              <option value="">Unassigned</option>
              {adminTeam.map((n) => (
                <option key={n.name}>{n.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select
              className="h-8"
              value={t.pri}
              onChange={(n) => {
                t.pri = n.target.value
                refresh()
              }}
            >
              <option>P1</option>
              <option>P2</option>
              <option>P3</option>
            </Select>
          </Field>
        </div>
      </div>
      <div className="grid flex-1 content-start gap-5 overflow-auto p-5">
        <div className="flex items-center gap-3 rounded-xl border p-3">
          <IconTile
            icon={ClockIcon}
            tone={
              t.status === "Resolved"
                ? "success"
                : t.sla / slaHours[t.pri] < 0.5 /* .5 */
                  ? "danger"
                  : "primary"
            }
            size="sm"
          />
          <div className="grid flex-1 gap-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="font-medium">
                {"Response deadline \xB7 "}
                {slaHours[t.pri]}
                {" h for "}
                {t.pri}
              </span>
              <SlaBar c={t} />
            </div>
            <Progress
              value={
                t.status === "Resolved"
                  ? 100
                  : (1 - t.sla / slaHours[t.pri]) * 100
              }
              tone={
                t.sla / slaHours[t.pri] < 0.5 /* .5 */ ? "warning" : "primary"
              }
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <span className="text-[12.5px] font-medium text-muted-foreground">
            Linked
          </span>
          {t.links.length ? (
            t.links.map((n) => {
              const l = resolveLink(n)
              return (
                <button
                  onClick={() => {
                    if (l.k === "user") {
                      return nav.user(n)
                    }
                    if (l.k === "hostel") {
                      return nav.hostel(n)
                    }
                    return nav.go("reports")
                  }}
                  className="flex items-center gap-3 rounded-xl border p-2.5 text-left hover:bg-muted/50"
                  key={n}
                >
                  {l.k === "user" ? (
                    <Avatar name={l.o.name} photo={l.o.photo} size={30} />
                  ) : l.k === "hostel" ? (
                    <img
                      src={l.o.photo}
                      alt=""
                      className="size-[30px] rounded-lg object-cover"
                    />
                  ) : (
                    <IconTile icon={FlagIcon} tone="warning" size="sm" />
                  )}
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13px] font-medium">
                      {l.k === "report" ? l.o.type : l.o.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground capitalize">
                      {l.k}
                    </span>
                  </span>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </button>
              )
            })
          ) : (
            <div className="rounded-xl border border-dashed p-3 text-[12.5px] text-muted-foreground">
              Nothing linked yet
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <span className="text-[12.5px] font-medium text-muted-foreground">
            Internal notes · only HQ sees these
          </span>
          {o.map(([n, l, d], u) => (
            <div className="flex gap-2.5" key={u}>
              <Avatar
                name={n}
                photo={adminTeam.find((s) => s.name === n)?.photo}
                size={28}
              />
              <div className="grid flex-1 gap-0.5 rounded-2xl rounded-tl-md bg-muted/60 px-3 py-2">
                <span className="text-[12px]">
                  <b className="font-semibold">{n}</b>{" "}
                  <span className="text-muted-foreground">
                    {"\xB7 "}
                    {l}
                  </span>
                </span>
                <span className="text-[13px]">{d}</span>
              </div>
            </div>
          ))}
          <form
            className="grid gap-2"
            onSubmit={(n) => {
              n.preventDefault()
              if (r.trim()) {
                o.push([currentAdmin.name, "Just now", r.trim()])
                t.notes = o.length
                i("")
                refresh()
              }
            }}
          >
            <Textarea
              rows={2}
              value={r}
              onChange={(n) => i(n.target.value)}
              placeholder="Add a note. Type @ to mention someone."
            />
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <AtSignIcon className="size-3.5" />
                Mentions notify by email and Slack
              </span>
              <Button size="sm" type="submit">
                <SendIcon />
                Add note
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
        <Button
          size="sm"
          onClick={() => {
            t.status = "Resolved"
            t.sla = 0
            logAudit("Resolved case", t.id, "\u2014")
            refresh()
            toast("Case resolved")
            onClose()
          }}
        >
          <CircleCheckIcon />
          Resolve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            t.who = currentAdmin.name
            refresh()
            toast("Assigned to you")
          }}
        >
          <UserCogIcon />
          Assign to me
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            t.pri = "P1"
            t.sla = Math.min(t.sla, 8)
            refresh()
            toast("Raised to P1. Slack #trust-safety notified.")
          }}
        >
          <TriangleAlertIcon />
          Raise to P1
        </Button>
      </div>
    </Sheet>
  )
}
