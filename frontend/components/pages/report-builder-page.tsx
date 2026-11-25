"use client"

import { useState } from "react"
import {
  CalendarClockIcon,
  ChartColumnIcon,
  ChartLineIcon,
  DownloadIcon,
  FileChartColumnIcon,
  HashIcon,
  HistoryIcon,
  MailIcon,
  SaveIcon,
  SendIcon,
  TableIcon,
} from "lucide-react"
import { BarList, LineChart } from "@/components/charts"
import { photoOf } from "@/components/pages/announcements-page"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Tag } from "@/components/hq/badge"
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
  areaUsers,
  currentAdmin,
  dailyMetrics,
  signupSources,
} from "@/lib/data/core"
import { savedReports } from "@/lib/data/ops"
import { num } from "@/lib/format"
import { copyText, refresh } from "@/lib/store"

const metricKeys: Record<string, any> = {
  "Sign-ups": "signups",
  Verified: "verified",
  "Seat requests": "requests",
  "Move-ins": "moveins",
  "Daily active users": "dau",
  "Living ID scans": "scans",
}

export function ReportBuilderPage() {
  const [t, a] = useState({
    name: "Untitled report",
    metric: "Seat requests",
    by: "Day",
    range: "30d",
    chart: "line",
  })
  const [e, r] = useState(null)
  const i = t.range === "7d" ? 7 : t.range === "30d" ? 30 : 90
  const o = dailyMetrics.slice(-i)
  const n = metricKeys[t.metric]
  const l = areaUsers.map(([s, m]) => [
    s,
    Math.round(
      (m / 100) *
        (n === "dau"
          ? 25
          : n === "scans"
            ? 140
            : n === "signups"
              ? 2.2
              : n === "verified"
                ? 1.9
                : n === "requests"
                  ? 1.3
                  : 0.8) /* .8 */
    ),
  ])
  const d = signupSources.map(([s, m]) => [
    s,
    Math.round(m / (n === "dau" ? 1 : 6)),
  ])
  const u = o.reduce((s, m) => s + m[n], 0)
  return (
    <>
      <PageHeader
        title="Reports builder"
        desc="Build a chart from any number in HQ, save it, and have it sent to people or Slack on a schedule."
      />
      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Card icon={FileChartColumnIcon} title="Build">
          <div className="grid gap-4">
            <Field label="Name">
              <Input
                value={t.name}
                onChange={(s) =>
                  a({
                    ...t,
                    name: s.target.value,
                  })
                }
              />
            </Field>
            <Field label="Measure">
              <Select
                value={t.metric}
                onChange={(s) =>
                  a({
                    ...t,
                    metric: s.target.value,
                  })
                }
              >
                {Object.keys(metricKeys).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Split by">
              <Tabs
                size="sm"
                value={t.by}
                onChange={(s) =>
                  a({
                    ...t,
                    by: s,
                    chart: s === "Day" ? t.chart : "bar",
                  })
                }
                className="w-full"
                items={["Day", "Area", "Channel"].map((s) => ({
                  value: s,
                  label: s,
                }))}
              />
            </Field>
            <Field label="Time range">
              <Tabs
                size="sm"
                value={t.range}
                onChange={(s) =>
                  a({
                    ...t,
                    range: s,
                  })
                }
                className="w-full"
                items={[
                  {
                    value: "7d",
                    label: "7 days",
                  },
                  {
                    value: "30d",
                    label: "30 days",
                  },
                  {
                    value: "90d",
                    label: "90 days",
                  },
                ]}
              />
            </Field>
            <Field label="Show as">
              <Tabs
                size="sm"
                value={t.chart}
                onChange={(s) =>
                  a({
                    ...t,
                    chart: s,
                  })
                }
                className="w-full"
                items={[
                  {
                    value: "line",
                    label: "Line",
                    icon: ChartLineIcon,
                  },
                  {
                    value: "bar",
                    label: "Bars",
                    icon: ChartColumnIcon,
                  },
                  {
                    value: "table",
                    label: "Table",
                    icon: TableIcon,
                  },
                ]}
              />
            </Field>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  savedReports.unshift({
                    id: "RP-" + (savedReports.length + 1),
                    ...t,
                    owner: currentAdmin.name,
                    sched: "Not scheduled",
                    to: [],
                    fmt: "PDF",
                    last: "Just now",
                  })
                  refresh()
                  toast("Report saved")
                }}
              >
                <SaveIcon />
                Save
              </Button>
              <Button variant="outline" onClick={() => r(t)}>
                <CalendarClockIcon />
                Schedule
              </Button>
            </div>
          </div>
        </Card>
        <Card
          icon={ChartLineIcon}
          title={t.name}
          description={`${t.metric} by ${t.by.toLowerCase()} \xB7 last ${i} days${t.by === "Day" ? ` \xB7 total ${num(u)}` : ""}`}
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                copyText(
                  (t.by === "Day"
                    ? o.map((s) => [s.date, s[n]])
                    : t.by === "Area"
                      ? l
                      : d
                  ).map((s) => s.join(",")).join(`
  `),
                  "Copied as CSV"
                )
              }
            >
              <DownloadIcon />
              CSV
            </Button>
          }
        >
          {t.by === "Day" && t.chart === "line" && (
            <LineChart
              data={o}
              series={[
                {
                  key: n,
                  label: t.metric,
                  color: "var(--primary)",
                },
              ]}
              height={340}
            />
          )}
          {t.by === "Day" && t.chart === "bar" && (
            <div className="flex h-[300px] items-end gap-[3px]">
              {o.map((s) => {
                const m = Math.max(...o.map((f) => f[n]))
                return (
                  <Tooltip label={`${s.date}: ${num(s[n])}`} key={s.date}>
                    <div
                      className="w-full min-w-[3px] flex-1 rounded-t-[3px] bg-primary/80 hover:bg-primary"
                      style={{
                        height: (s[n] / m) * 280,
                      }}
                    />
                  </Tooltip>
                )
              })}
            </div>
          )}
          {t.by !== "Day" && t.chart !== "table" && (
            <BarList items={t.by === "Area" ? l : d} />
          )}
          {t.chart === "table" && (
            <div className="max-h-[320px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.by}</TableHead>
                    <TableHead className="text-right">{t.metric}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(t.by === "Day"
                    ? o
                        .slice()
                        .reverse()
                        .map((s) => [s.date, s[n]])
                    : t.by === "Area"
                      ? l
                      : d
                  ).map(([s, m]) => (
                    <TableRow key={s}>
                      <TableCell>{s}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {num(m)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
      <Card flush icon={HistoryIcon} title="Saved reports" className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Sent to</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Last sent</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedReports.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="grid leading-tight">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-[12px] text-muted-foreground">
                      {s.metric}
                      {" by "}
                      {s.by.toLowerCase()}
                      {" \xB7 "}
                      {s.range}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar name={s.owner} photo={photoOf(s.owner)} size={22} />
                    {s.owner}
                  </div>
                </TableCell>
                <TableCell>
                  {s.sched === "Not scheduled" ? (
                    <span className="text-muted-foreground">Not scheduled</span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <CalendarClockIcon className="size-3.5 text-primary" />
                      {s.sched}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-[12.5px]">
                  {s.to.join(", ") || "\u2014"}
                </TableCell>
                <TableCell>
                  <Tag>{s.fmt}</Tag>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {s.last}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        a({
                          name: s.name,
                          metric: s.metric,
                          by: s.by,
                          range: s.range,
                          chart: s.chart,
                        })
                      }
                    >
                      Open
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        s.last = "Just now"
                        refresh()
                        toast(`Sent to ${s.to.join(", ") || "you"}`, SendIcon)
                      }}
                    >
                      <SendIcon />
                      Send now
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {e && (
        <Dialog
          open
          onClose={() => r(null)}
          title={`Schedule \u201C${e.name}\u201D`}
          footer={
            <>
              <Button variant="outline" onClick={() => r(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  savedReports.unshift({
                    id: "RP-" + (savedReports.length + 1),
                    ...e,
                    owner: currentAdmin.name,
                    sched: "Every Sunday, 9:00 am",
                    to: ["Sabbir Ahmed", "#leadership"],
                    fmt: "PDF",
                    last: "\u2014",
                  })
                  r(null)
                  refresh()
                  toast("Scheduled")
                }}
              >
                <CalendarClockIcon />
                Schedule
              </Button>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="How often">
              <Select>
                <option>Every week</option>
                <option>Every day</option>
                <option>Every month</option>
              </Select>
            </Field>
            <Field label="Day">
              <Select>
                <option>Sunday</option>
                <option>Monday</option>
              </Select>
            </Field>
            <Field label="Time">
              <Input type="time" defaultValue="09:00" />
            </Field>
          </div>
          <Field label="Send to">
            <div className="flex flex-wrap gap-1.5">
              {["Sabbir Ahmed", "#leadership", "Farah Kabir"].map((s) => (
                <Tag icon={s.startsWith("#") ? HashIcon : MailIcon} key={s}>
                  {s}
                </Tag>
              ))}
              <button className="text-[12.5px] font-medium text-primary">
                + Add
              </button>
            </div>
          </Field>
          <Field label="Format">
            <Tabs
              size="sm"
              value="PDF"
              onChange={() => {}}
              items={["PDF", "CSV", "Slack"].map((s) => ({
                value: s,
                label: s,
              }))}
            />
          </Field>
        </Dialog>
      )}
    </>
  )
}
