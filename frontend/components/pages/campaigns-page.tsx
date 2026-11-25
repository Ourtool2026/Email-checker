"use client"

import { useState } from "react"
import {
  BellRingIcon,
  GiftIcon,
  MessageSquareIcon,
  PlusIcon,
  RectangleHorizontalIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input, Select, Textarea } from "@/components/hq/input"
import { Progress } from "@/components/hq/progress"
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
import { areas, campaigns, universities } from "@/lib/data/core"
import { num, shortOrg } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"

const channelMeta: Record<string, any> = {
  Push: [BellRingIcon, "primary"],
  Banner: [RectangleHorizontalIcon, "violet"],
  SMS: [MessageSquareIcon, "teal"],
}

const campaignStatusTones: Record<string, any> = {
  Sent: "success",
  Running: "primary",
  Scheduled: "warning",
  Draft: "neutral",
}

export function CampaignsPage() {
  const [t, a] = useState(false)
  const [e, r] = useState("Push")
  const [i, o] = useState({
    type: "student",
    area: "Uttara",
    uni: "any",
    hostel: "none",
  })
  const [n, l] = useState("Seats are open near your campus")
  const [d, u] = useState(
    "Verified hostels in Uttara have seats from \u09F35,500. Ask for one in the app."
  )
  const [s, m] = useState(false)
  const f = Math.round(
    18420 *
      (i.type === "all"
        ? 1
        : i.type === "student"
          ? 0.65 /* .65 */
          : i.type === "job"
            ? 0.33 /* .33 */
            : 0.02) /* .02 */ *
      (i.area === "all" ? 1 : 0.22) /* .22 */ *
      (i.uni === "any" ? 1 : 0.3) /* .3 */ *
      (i.hostel === "any"
        ? 1
        : i.hostel === "none"
          ? 0.41 /* .41 */
          : 0.59) /* .59 */
  )
  return (
    <>
      <PageHeader
        title={"Campaigns & push"}
        desc="Push notices, in-app banners and SMS to chosen groups. Nobody gets more than 2 a week."
      >
        <Button onClick={() => a(true)}>
          <PlusIcon />
          New campaign
        </Button>
      </PageHeader>
      <Card flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Reach</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((h) => {
              const [B, y] = channelMeta[h.ch]
              return (
                <TableRow key={h.id}>
                  <TableCell>
                    <div className="grid leading-tight">
                      <span className="font-medium">{h.name}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {h.when}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <IconTile icon={B} tone={y} size="sm" />
                      {h.ch}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[260px] text-muted-foreground">
                    {h.aud}
                  </TableCell>
                  <TableCell className="tabular-nums">{num(h.reach)}</TableCell>
                  <TableCell>
                    {h.open ? (
                      <div className="grid w-20 gap-1">
                        <span className="text-[12.5px] tabular-nums">
                          {h.open}%
                        </span>
                        <Progress value={h.open} tone="success" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge tone={campaignStatusTones[h.status]}>
                      {h.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={t}
        onClose={() => a(false)}
        title="New campaign"
        width="max-w-[860px]"
        footer={
          <>
            <Button variant="outline" onClick={() => a(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                campaigns.unshift({
                  id: "c" + Date.now(),
                  name: n,
                  ch: e,
                  aud: "Draft audience",
                  reach: f,
                  open: 0,
                  status: "Draft",
                  when: "\u2014",
                })
                a(false)
                refresh()
                toast("Saved as draft")
              }}
            >
              Save draft
            </Button>
            <Button onClick={() => m(true)}>
              <SendIcon />
              Send…
            </Button>
          </>
        }
      >
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="grid gap-4">
            <Field label="Channel">
              <Tabs
                value={e}
                onChange={r}
                items={Object.keys(channelMeta).map((h) => ({
                  value: h,
                  label: h,
                  icon: channelMeta[h][0],
                }))}
              />
            </Field>
            <div className="grid gap-3 rounded-xl border p-3.5">
              <span className="text-[13px] font-semibold">Who gets it</span>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Type">
                  <Select
                    value={i.type}
                    onChange={(h) =>
                      o({
                        ...i,
                        type: h.target.value,
                      })
                    }
                  >
                    <option value="all">Everyone</option>
                    <option value="student">Students</option>
                    <option value="job">Job holders</option>
                    <option value="landlord">Landlords</option>
                  </Select>
                </Field>
                <Field label="Area">
                  <Select
                    value={i.area}
                    onChange={(h) =>
                      o({
                        ...i,
                        area: h.target.value,
                      })
                    }
                  >
                    <option value="all">All Dhaka</option>
                    {areas.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="University">
                  <Select
                    value={i.uni}
                    onChange={(h) =>
                      o({
                        ...i,
                        uni: h.target.value,
                      })
                    }
                  >
                    <option value="any">Any</option>
                    {universities.map((h) => (
                      <option key={h}>{shortOrg(h)}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Has a place to stay">
                  <Select
                    value={i.hostel}
                    onChange={(h) =>
                      o({
                        ...i,
                        hostel: h.target.value,
                      })
                    }
                  >
                    <option value="any">Any</option>
                    <option value="none">Still looking</option>
                    <option value="yes">Living in a hostel</option>
                  </Select>
                </Field>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/[0.06] px-3 py-2 text-[13px] font-medium text-primary">
                <UsersIcon className="size-4" />
                {"About "}
                {num(f)}
                {" people"}
              </div>
            </div>
            <Field label="Title">
              <Input value={n} onChange={(h) => l(h.target.value)} />
            </Field>
            <Field
              label="Message"
              hint={`${d.length}/${e === "SMS" ? 160 : 240}`}
            >
              <Textarea
                rows={3}
                value={d}
                onChange={(h) => u(h.target.value)}
              />
            </Field>
            <Field label="When">
              <Select>
                <option>Now</option>
                <option>Tomorrow 10:00 am</option>
                <option>Pick a time…</option>
              </Select>
            </Field>
          </div>
          <div className="grid content-start gap-2">
            <span className="text-[12.5px] font-medium text-muted-foreground">
              Preview
            </span>
            <div className="rounded-[26px] bg-gradient-to-b from-slate-700 to-slate-900 p-3 pt-10">
              {e === "Banner" ? (
                <div className="rounded-2xl bg-white p-3 text-gray-900">
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white">
                    <GiftIcon className="size-5" />
                    <div className="grid leading-tight">
                      <span className="text-[12.5px] font-semibold">{n}</span>
                      <span className="text-[11px] opacity-85">
                        {d.slice(0, 60)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-16 rounded-xl bg-gray-100" />
                </div>
              ) : (
                <div className="rounded-2xl bg-white/90 p-3 text-gray-900 backdrop-blur">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="flex size-4 items-center justify-center rounded bg-gradient-to-b from-[#2CB8FF] to-[#2B6BFF]" />
                    {e === "SMS" ? "MyStayID \xB7 SMS" : "MyStay ID \xB7 now"}
                  </div>
                  <div className="mt-1 text-[12.5px] font-semibold">{n}</div>
                  <div className="text-[12px] leading-snug text-gray-700">
                    {d}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={s}
        onClose={() => m(false)}
        title={`Send to about ${num(f)} people?`}
        description="This can’t be unsent."
        footer={
          <>
            <Button variant="outline" onClick={() => m(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                {
                  const h = "c" + Date.now()
                  const B = `${i.type === "all" ? "Everyone" : i.type} \xB7 ${i.area}`
                  campaigns.unshift({
                    id: h,
                    name: n,
                    ch: e,
                    aud: B,
                    reach: f,
                    open: 0,
                    status: "Sent",
                    when: "Just now",
                  })
                  if (window.MS) {
                    window.MS.emit("push.sent", {
                      id: h,
                      title: n,
                      body: d,
                      ch: e,
                      aud: B,
                      reach: f,
                    })
                  }
                }
                logAudit("Sent campaign", n, `${e} to ${f}`)
                m(false)
                a(false)
                refresh()
                toast("Campaign sent", SendIcon)
              }}
            >
              <SendIcon />
              Send now
            </Button>
          </>
        }
      >
        <Notice>
          {e}: “{n}”
        </Notice>
      </Dialog>
    </>
  )
}
