"use client"

import { useState } from "react"
import {
  CalendarClockIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { Field, Input, Select } from "@/components/hq/input"
import { toast } from "@/components/hq/toast"
import { calendarEvents, calendarKinds } from "@/lib/data/ops"
import { refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function CalendarPage() {
  const [t, a] = useState(10)
  const [e, r] = useState(Object.keys(calendarKinds))
  const [i, o] = useState(23)
  const [n, l] = useState(false)
  const d = new Date(Date.UTC(2026, t, 1)).getUTCDay()
  const u = t === 10 ? 30 : 31
  const s = Array.from(
    {
      length: Math.ceil((d + (t === 10 ? 30 : 31)) / 7) * 7,
    },
    (h, B) => B - d + 1
  )
  const m = (h?) =>
    calendarEvents.filter((B) => B[0] === h && B[1] === t && e.includes(B[2]))
  const f = calendarEvents
    .filter((h) => (h[1] > 10 || h[0] >= 23) && e.includes(h[2]))
    .sort((h, B) => h[1] - B[1] || h[0] - B[0])
    .filter((h, B, y) => y.findIndex((W) => W[3] === h[3]) === B)
    .slice(0, 8)
  return (
    <>
      <PageHeader
        title="Company calendar"
        desc="Meetings, releases, campaigns, leave, deadlines and incidents from every team, in one calendar."
      >
        <Button onClick={() => l(true)}>
          <PlusIcon />
          Add event
        </Button>
      </PageHeader>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Previous month"
          disabled={t === 10}
          onClick={() => a(10)}
        >
          <ChevronLeftIcon />
        </Button>
        <span className="w-36 text-center text-[15px] font-semibold">
          {t === 10 ? "November" : "December"}
          {" 2026"}
        </span>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Next month"
          disabled={t === 11}
          onClick={() => a(11)}
        >
          <ChevronRightIcon />
        </Button>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {Object.entries(calendarKinds).map(([h, [B, y]]) => {
            const W = e.includes(h)
            return (
              <button
                onClick={() => r(W ? e.filter((x) => x !== h) : [...e, h])}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium",
                  W ? "bg-card shadow-card" : "text-muted-foreground opacity-60"
                )}
                key={h}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    background: W ? y : "var(--muted-foreground)",
                  }}
                />
                {B}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="grid grid-cols-7 border-b text-center text-[12px] font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((h) => (
              <div className="py-2" key={h}>
                {h}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {s.map((h, B) => {
              const y = h >= 1 && h <= u
              const W = y ? m(h) : []
              const x = t === 10 && h === 23
              return (
                <button
                  disabled={!y}
                  onClick={() => o(h)}
                  className={cn(
                    "flex min-h-[64px] flex-col justify-start border-r border-b p-1.5 text-left sm:min-h-[96px] [&:nth-child(7n)]:border-r-0",
                    !y && "bg-muted/30",
                    y && "hover:bg-muted/40",
                    y && i === h && "bg-primary/[0.05]"
                  )}
                  key={B}
                >
                  {y && (
                    <>
                      <div
                        className={cn(
                          "mb-1 flex size-6 items-center justify-center rounded-full text-[12px] font-medium",
                          x
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {h}
                      </div>
                      <div className="flex flex-wrap gap-1 sm:hidden">
                        {W.map((k, N) => (
                          <span
                            className="size-2 rounded-full"
                            style={{
                              background: calendarKinds[k[2]][1],
                            }}
                            key={N}
                          />
                        ))}
                      </div>
                      <div className="hidden gap-0.5 sm:grid">
                        {W.slice(0, 3).map((k, N) => (
                          <span
                            className="truncate rounded px-1.5 py-0.5 text-[11px] font-medium"
                            style={{
                              background: `color-mix(in oklab, ${calendarKinds[k[2]][1]} 14%, transparent)`,
                              color: calendarKinds[k[2]][1],
                            }}
                            key={N}
                          >
                            {k[3]}
                          </span>
                        ))}
                        {W.length > 3 && (
                          <span className="px-1 text-[11px] text-muted-foreground">
                            +{W.length - 3}
                            {" more"}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="grid content-start gap-4">
          <Card
            icon={CalendarIcon}
            title={`${i} ${t === 10 ? "November" : "December"}`}
            flush
          >
            <div className="divide-y">
              {m(i).length ? (
                m(i).map((h, B) => (
                  <div className="flex items-center gap-3 px-4 py-2.5" key={B}>
                    <span
                      className="h-8 w-1 rounded-full"
                      style={{
                        background: calendarKinds[h[2]][1],
                      }}
                    />
                    <span className="grid flex-1 leading-tight">
                      <span className="text-[13px] font-medium">{h[3]}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {calendarKinds[h[2]][0]}
                        {" \xB7 "}
                        {h[4]}
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-[12.5px] text-muted-foreground">
                  Nothing on this day
                </div>
              )}
            </div>
          </Card>
          <Card icon={CalendarClockIcon} title="Coming up" flush>
            <div className="divide-y">
              {f.map((h, B) => (
                <div className="flex items-center gap-3 px-4 py-2.5" key={B}>
                  <span className="grid w-10 text-center leading-tight">
                    <span className="text-[15px] font-semibold">{h[0]}</span>
                    <span className="text-[10.5px] text-muted-foreground uppercase">
                      {h[1] === 10 ? "Nov" : "Dec"}
                    </span>
                  </span>
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background: calendarKinds[h[2]][1],
                    }}
                  />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13px] font-medium">{h[3]}</span>
                    <span className="text-[11.5px] text-muted-foreground">
                      {h[4]}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <Dialog
        open={n}
        onClose={() => l(false)}
        title="Add event"
        footer={
          <>
            <Button variant="outline" onClick={() => l(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                calendarEvents.push([
                  27,
                  10,
                  "meeting",
                  "Hostel owners meetup",
                  "Operations",
                ])
                l(false)
                refresh()
                toast("Added to 27 Nov")
              }}
            >
              <PlusIcon />
              Add
            </Button>
          </>
        }
      >
        <Field label="Title">
          <Input defaultValue="Hostel owners meetup" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date">
            <Input type="date" defaultValue="2026-11-27" />
          </Field>
          <Field label="Type">
            <Select>
              {Object.values(calendarKinds).map(([h]) => (
                <option key={h}>{h}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Who">
          <Select>
            <option>Operations</option>
            <option>Everyone</option>
          </Select>
        </Field>
      </Dialog>
    </>
  )
}
