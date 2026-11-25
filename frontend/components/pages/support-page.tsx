"use client"

import { useState } from "react"
import {
  ArrowUpRightIcon,
  CheckIcon,
  InboxIcon,
  MessageSquareIcon,
  SendIcon,
} from "lucide-react"
import { FilterChips } from "@/components/shared/filter-chips"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { EmptyState } from "@/components/hq/empty-state"
import { Input, Select } from "@/components/hq/input"
import { toast } from "@/components/hq/toast"
import { adminTeam, getHostel, getUser, supportTickets } from "@/lib/data/core"
import { refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function SupportPage({ nav }: { nav?: any }) {
  const [a, e] = useState("Open")
  const r = supportTickets.filter(
    (m) =>
      a === "all" ||
      m.status === a ||
      (a === "mine" && m.who === "Sabbir Ahmed")
  )
  const [i, o] = useState(supportTickets[0].id)
  const [n, l] = useState("")
  const d = supportTickets.find((m) => m.id === i)
  const u = d.fromType === "user" ? getUser(d.from) : getHostel(d.from)
  const s = [
    "Thanks, we\u2019re looking into it now.",
    "You can change this in Settings in the app.",
    "We\u2019ve fixed it. Please try again.",
  ]
  return (
    <>
      <PageHeader
        title="Support inbox"
        desc="Questions from users in the app and owners in the business web app, in one place."
      />
      <FilterChips
        value={a}
        onChange={e}
        items={[
          [
            "Open",
            "Open",
            supportTickets.filter((m) => m.status === "Open").length,
          ],
          ["Waiting on user", "Waiting on them"],
          ["Solved", "Solved"],
          ["all", "All"],
        ]}
      />
      <div className="mt-4 grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card flush>
          <div className="divide-y">
            {r.map((m) => {
              const f =
                m.fromType === "user" ? getUser(m.from) : getHostel(m.from)
              const h = m.id === i
              return (
                <button
                  onClick={() => o(m.id)}
                  className={cn(
                    "relative flex w-full gap-3 px-4 py-3 text-left hover:bg-muted/50",
                    h && "bg-primary/[0.05]"
                  )}
                  key={m.id}
                >
                  {h && (
                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary" />
                  )}
                  {m.fromType === "user" ? (
                    <Avatar name={f.name} photo={f.photo} size={34} />
                  ) : (
                    <img
                      src={f.photo}
                      alt=""
                      className="size-[34px] rounded-lg object-cover"
                    />
                  )}
                  <span className="grid min-w-0 flex-1 gap-0.5 leading-tight">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-medium">
                        {m.subj}
                      </span>
                      {m.pri === "High" && (
                        <Badge tone="danger" dot={false}>
                          High
                        </Badge>
                      )}
                    </span>
                    <span className="truncate text-[12px] text-muted-foreground">
                      {f.name}
                      {" \xB7 "}
                      {m.ch}
                      {" \xB7 "}
                      {m.when}
                    </span>
                  </span>
                </button>
              )
            })}
            {!r.length && (
              <EmptyState
                icon={InboxIcon}
                title="Nothing here"
                text="Inbox zero."
              />
            )}
          </div>
        </Card>
        <Card
          icon={MessageSquareIcon}
          title={d.subj}
          description={`${d.id} \xB7 ${d.ch} \xB7 ${d.fromType === "user" ? "MyStay ID app" : "MyStay for Business"}`}
          actions={
            <div className="flex items-center gap-2">
              <Select
                className="h-8 w-[150px]"
                value={d.who || ""}
                onChange={(m) => {
                  d.who = m.target.value || null
                  refresh()
                }}
              >
                <option value="">Unassigned</option>
                {adminTeam
                  .filter((m) =>
                    [
                      "Support",
                      "Super admin",
                      "Trust & safety",
                      "Operations",
                    ].includes(m.role)
                  )
                  .map((m) => (
                    <option key={m.name}>{m.name}</option>
                  ))}
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  d.fromType === "user" ? nav.user(u.id) : nav.hostel(u.id)
                }
              >
                Profile
                <ArrowUpRightIcon />
              </Button>
            </div>
          }
        >
          <div className="grid gap-3">
            {d.msgs.map((m, f) => (
              <div
                className={cn(
                  "flex gap-2.5",
                  m[0] === "us" && "flex-row-reverse"
                )}
                key={f}
              >
                {m[0] === "them" ? (
                  d.fromType === "user" ? (
                    <Avatar name={u.name} photo={u.photo} size={28} />
                  ) : (
                    <img
                      src={u.photo}
                      alt=""
                      className="size-7 rounded-lg object-cover"
                    />
                  )
                ) : (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#2CB8FF] to-[#2B6BFF]">
                    <span
                      className="size-4 bg-white"
                      style={{
                        WebkitMask: "var(--mark) center/contain no-repeat",
                        mask: "var(--mark) center/contain no-repeat",
                      }}
                    />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13.5px]",
                    m[0] === "us"
                      ? "rounded-tr-md bg-primary text-primary-foreground"
                      : "rounded-tl-md bg-muted"
                  )}
                >
                  {m[1]}
                </div>
              </div>
            ))}
            <div className="mt-2 grid gap-2 border-t pt-3">
              <div className="flex flex-wrap gap-1.5">
                {s.map((m) => (
                  <button
                    onClick={() => l(m)}
                    className="rounded-full border px-2.5 py-1 text-[12px] hover:bg-accent"
                    key={m}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(m) => {
                  m.preventDefault()
                  if (n.trim()) {
                    d.msgs.push(["us", n.trim()])
                    d.status = "Waiting on user"
                    l("")
                    refresh()
                  }
                }}
              >
                <Input
                  value={n}
                  onChange={(m) => l(m.target.value)}
                  placeholder="Write a reply"
                />
                <Button type="submit">
                  <SendIcon />
                  Send
                </Button>
              </form>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    d.status = "Solved"
                    refresh()
                    toast("Marked solved")
                  }}
                >
                  <CheckIcon />
                  Mark solved
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
