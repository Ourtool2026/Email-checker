"use client"

import { Fragment, useEffect, useState } from "react"
import {
  ArrowRightLeftIcon,
  CalendarOffIcon,
  ChevronRightIcon,
  ClockIcon,
  ListChecksIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  PhoneCallIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "lucide-react"
import { Notice } from "@/components/shared/notice"
import { Avatar } from "@/components/hq/avatar"
import { Badge, Tag } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Dialog } from "@/components/hq/dialog"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Select } from "@/components/hq/input"
import { Sheet } from "@/components/hq/sheet"
import { toast } from "@/components/hq/toast"
import { adminTeam } from "@/lib/data/core"
import {
  chainOf,
  childrenOf,
  descendantsOf,
  loadOf,
  offices,
  orgPeople,
  orgPhoto,
  orgTeams,
  presence,
  workloadOf,
} from "@/lib/data/org"
import { copyText, logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function PersonDrawer({
  o: t,
  onClose,
  onPick,
  nav,
}: {
  o?: any
  onClose?: any
  onPick?: any
  nav?: any
}) {
  const [i, o] = useState(null)
  const [n, l] = useState(t.parent || "ceo")
  const [d, u] = useState(t.team)
  useEffect(() => {
    l(t.parent || "ceo")
    u(t.team)
    o(null)
  }, [t.id])
  const [s, m] = orgTeams[t.team]
  const f = chainOf(t)
  const h = childrenOf(t.id)
  const B = t.open ? [] : workloadOf(t.name)
  const y = adminTeam.find((W) => W.name === t.name)
  return t.open ? (
    <Sheet open onClose={onClose}>
      <div className="grid gap-4 p-6">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserPlusIcon className="size-6" />
        </span>
        <div className="grid gap-1">
          <h2 className="text-[18px] font-semibold">{t.title}</h2>
          <span className="text-[13px] text-muted-foreground">
            {s}
            {" \xB7 reports to "}
            {orgPeople.find((W) => W.id === t.parent).name}
            {" \xB7 "}
            {offices[t.loc][0]}
          </span>
        </div>
        <Notice>
          Open role. Post it from Marketing → Content calendar, or share the
          hiring link.
        </Notice>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              copyText(
                `https://mystayid.com/careers/${t.id}`,
                "Hiring link copied"
              )
            }
          >
            Copy hiring link
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              orgPeople.splice(orgPeople.indexOf(t), 1)
              onClose()
              refresh()
              toast("Role closed")
            }}
          >
            Close role
          </Button>
        </div>
      </div>
    </Sheet>
  ) : (
    <Sheet open onClose={onClose} width="sm:max-w-[520px]">
      <div className="relative border-b p-5">
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background: `var(--${m === "danger" ? "destructive" : m})`,
          }}
        />
        <div className="flex items-start gap-4 pt-1">
          <span className="relative">
            <Avatar
              name={t.name}
              photo={orgPhoto(t.name)}
              size={68}
              className="ring-4 ring-muted"
            />
            <span
              className={cn(
                "absolute right-1 bottom-1 size-3.5 rounded-full ring-2 ring-card",
                presence[t.status][1]
              )}
            />
          </span>
          <div className="grid min-w-0 gap-1 pr-6">
            <span className="text-[18px] font-semibold tracking-tight">
              {t.name}
            </span>
            <span className="text-[13px] text-muted-foreground">{t.title}</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge tone={m} dot={false}>
                {s}
              </Badge>
              <Tag icon={MapPinIcon}>
                {offices[t.loc][0]}
                {t.city ? ` \xB7 ${t.city}` : ""}
              </Tag>
              {t.oncall && <Tag icon={PhoneCallIcon}>On call</Tag>}
              {t.status === "leave" && (
                <Badge tone="danger">
                  {"On leave till "}
                  {t.leaveTill}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {f.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1 text-[12.5px] text-muted-foreground">
            <span className="mr-1">Reports to</span>
            {f.map((W, x) => (
              <Fragment key={W.id}>
                {x > 0 && <ChevronRightIcon className="size-3.5" />}
                <button
                  onClick={() => onPick(W.id)}
                  className="flex items-center gap-1.5 rounded-full py-0.5 pr-2 pl-0.5 font-medium text-foreground hover:bg-muted"
                >
                  <Avatar name={W.name} photo={orgPhoto(W.name)} size={20} />
                  {W.name}
                </button>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="grid flex-1 content-start gap-5 overflow-auto p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Open tasks", B.length],
            ["Workload", loadOf(t.name) + "%"],
            ["Joined", t.joined],
          ].map(([W, x]) => (
            <div className="rounded-xl border bg-muted/60 px-2 py-2" key={W}>
              <div className="text-[11.5px] text-muted-foreground">{W}</div>
              <div className="text-[14px] font-semibold">{x}</div>
            </div>
          ))}
        </div>
        {h.length > 0 && (
          <div className="grid gap-1.5">
            <span className="text-[12.5px] font-medium text-muted-foreground">
              {"Team \xB7 "}
              {h.length}
              {" direct"}
            </span>
            <div className="grid gap-1">
              {h.map((W) => (
                <button
                  onClick={() => onPick(W.id)}
                  className="flex items-center gap-3 rounded-xl border p-2 text-left hover:bg-muted/60"
                  key={W.id}
                >
                  {W.open ? (
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserPlusIcon className="size-4" />
                    </span>
                  ) : (
                    <Avatar name={W.name} photo={orgPhoto(W.name)} size={32} />
                  )}
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13px] font-medium">
                      {W.open ? "Hiring" : W.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {W.title}
                    </span>
                  </span>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-1.5">
          <span className="text-[12.5px] font-medium text-muted-foreground">
            Working on now
          </span>
          {B.length ? (
            B.map((W) => (
              <button
                onClick={() => nav.go(W.team === "tech" ? "technical" : W.team)}
                className="flex items-center gap-3 rounded-xl border p-2.5 text-left hover:bg-muted/60"
                key={W.id}
              >
                <IconTile
                  icon={ListChecksIcon}
                  tone={
                    W.pri === "Urgent"
                      ? "danger"
                      : W.pri === "High"
                        ? "warning"
                        : "primary"
                  }
                  size="sm"
                />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">{W.title}</span>
                  <span className="text-[12px] text-muted-foreground">
                    {W.id}
                    {" \xB7 "}
                    {W.status}
                    {" \xB7 due "}
                    {Number(W.due.slice(8))}{" "}
                    {
                      [
                        "",
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
                      ][Number(W.due.slice(5, 7))]
                    }
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed p-3 text-[12.5px] text-muted-foreground">
              No open tasks on the team boards.
              {y && " Works mostly in HQ queues."}
            </div>
          )}
        </div>
        <div className="divide-y rounded-xl border text-[13.5px]">
          {[
            [
              MailIcon,
              "Work email",
              t.email || `${t.name.split(" ")[0].toLowerCase()}@mystayid.com`,
            ],
            [
              ShieldCheckIcon,
              "HQ access",
              y ? y.role : orgTeams[t.team][0] + " workspace only",
            ],
            [ClockIcon, "Status", presence[t.status][0]],
          ].map(([W, x, k]) => (
            <div className="flex items-center gap-3 px-3.5 py-2.5" key={x}>
              <W className="size-4 text-muted-foreground" />
              <span className="w-24 text-muted-foreground">{x}</span>
              <span className="font-medium">{k}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast(`Message sent to ${t.name.split(" ")[0]} on Slack`)
          }
        >
          <MessageSquareIcon />
          Message
        </Button>
        {t.parent && (
          <Button size="sm" variant="outline" onClick={() => o("move")}>
            <ArrowRightLeftIcon />
            Change manager or team
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            t.status = t.status === "leave" ? "online" : "leave"
            t.leaveTill = "30 Nov"
            refresh()
            toast(t.status === "leave" ? "Marked on leave" : "Back from leave")
          }}
        >
          <CalendarOffIcon />
          {t.status === "leave" ? "Back from leave" : "Mark on leave"}
        </Button>
      </div>
      <Dialog
        open={i === "move"}
        onClose={() => o(null)}
        title={`Move ${t.name.split(" ")[0]}`}
        description="The chart, team boards and HQ access update together. Logged in the audit log."
        footer={
          <>
            <Button variant="outline" onClick={() => o(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                t.parent = n
                t.team = d
                logAudit(
                  "Changed reporting line",
                  t.name,
                  `Now reports to ${orgPeople.find((W) => W.id === n).name}`
                )
                o(null)
                refresh()
                toast("Moved")
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Field label="Reports to">
          <Select value={n} onChange={(W) => l(W.target.value)}>
            {orgPeople
              .filter(
                (W) =>
                  !W.open && W.id !== t.id && !descendantsOf(t.id).includes(W)
              )
              .map((W) => (
                <option value={W.id} key={W.id}>
                  {W.name}
                  {" \xB7 "}
                  {W.title}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Team">
          <Select value={d} onChange={(W) => u(W.target.value)}>
            {Object.entries(orgTeams)
              .filter(([W]) => W !== "exec")
              .map(([W, [x]]) => (
                <option value={W} key={W}>
                  {x}
                </option>
              ))}
          </Select>
        </Field>
      </Dialog>
    </Sheet>
  )
}
