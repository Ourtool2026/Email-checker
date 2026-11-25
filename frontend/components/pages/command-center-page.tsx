"use client"

import { Fragment, useState } from "react"
import {
  ActivityIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BedDoubleIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  EyeIcon,
  FilterIcon,
  FlagIcon,
  HistoryIcon,
  IdCardIcon,
  InboxIcon,
  LayoutGridIcon,
  RadioIcon,
  RotateCcwIcon,
  ScaleIcon,
  ScanLineIcon,
  ServerIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  UserPlusIcon,
} from "lucide-react"
import { Funnel, Legend, LineChart, UptimeBars } from "@/components/charts"
import { KpiTile } from "@/components/shared/kpi-tile"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { IconTile } from "@/components/hq/icon-tile"
import { Switch } from "@/components/hq/switch"
import {
  adminTeam,
  approvals,
  auditLog,
  cases,
  currentAdmin,
  funnelSteps,
  incidents,
  lawRequests,
  listingReviews,
  safetyAlerts,
  services,
  supportTickets,
  verifications,
} from "@/lib/data/core"
import { announcements, calendarEvents, calendarKinds } from "@/lib/data/ops"
import { num } from "@/lib/format"
import { pctChange, rangeSlices, sumBy } from "@/lib/metrics"
import { cn } from "@/lib/utils"

const commandBlocks: any[] = (
  [
    ["incident", "Incident banner"],
    ["kpis", "Key numbers"],
    ["trend", "Sign-ups chart and HQ queue"],
    ["team", "Today on the calendar and latest announcement"],
    ["bottom", "Funnel, systems and audit log"],
  ] as any[]
).map(([t, a]) => ({
  k: t,
  l: a,
  on: true,
}))

function LayoutEditor({ lay, setLay }: { lay?: any; setLay?: any }) {
  const e = (r?, i?) => {
    const o = [...lay]
    ;[o[r], o[r + i]] = [o[r + i], o[r]]
    setLay(o)
  }
  return (
    <Card
      icon={LayoutGridIcon}
      title="Edit layout"
      description="Show, hide and reorder the blocks on this page. Saved for you in this browser."
      className="mb-4"
      actions={
        <Button size="sm" variant="ghost" onClick={() => setLay(commandBlocks)}>
          <RotateCcwIcon />
          Reset
        </Button>
      }
    >
      <div className="grid gap-1.5">
        {lay.map((r, i) => (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card px-3 py-2",
              !r.on && "opacity-60"
            )}
            key={r.k}
          >
            <span className="w-5 text-center text-[12px] text-muted-foreground tabular-nums">
              {i + 1}
            </span>
            <span className="flex-1 text-[13.5px] font-medium">{r.l}</span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Move up"
              disabled={i === 0}
              onClick={() => e(i, -1)}
            >
              <ArrowUpIcon />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Move down"
              disabled={i === lay.length - 1}
              onClick={() => e(i, 1)}
            >
              <ArrowDownIcon />
            </Button>
            <Switch
              checked={r.on}
              onChange={(o) =>
                setLay(
                  lay.map((n) =>
                    n.k === r.k
                      ? {
                          ...n,
                          on: o,
                        }
                      : n
                  )
                )
              }
              label={"Show " + r.l}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

function TodayStrip({ nav }: { nav?: any }) {
  const a = calendarEvents.filter((r) => r[0] === 23 && r[1] === 10)
  const e = announcements.find((r) => r.pin) || announcements[0]
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card
        icon={CalendarIcon}
        title="Today on the calendar"
        flush
        actions={
          <Button size="sm" variant="ghost" onClick={() => nav.go("calendar")}>
            Calendar
            <ChevronRightIcon />
          </Button>
        }
      >
        <div className="divide-y">
          {a.length ? (
            a.map((r, i) => (
              <div className="flex items-center gap-3 px-4 py-2.5" key={i}>
                <span
                  className="h-8 w-1 rounded-full"
                  style={{
                    background: calendarKinds[r[2]][1],
                  }}
                />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">{r[3]}</span>
                  <span className="text-[12px] text-muted-foreground">
                    {calendarKinds[r[2]][0]}
                    {" \xB7 "}
                    {r[4]}
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-[12.5px] text-muted-foreground">
              Nothing today
            </div>
          )}
        </div>
      </Card>
      <Card
        icon={RadioIcon}
        title="Latest announcement"
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => nav.go("announcements")}
          >
            All
            <ChevronRightIcon />
          </Button>
        }
      >
        <div className="grid gap-2">
          <div className="flex items-center gap-2.5">
            <Avatar
              name={e.by}
              photo={adminTeam.find((r) => r.name === e.by)?.photo}
              size={30}
            />
            <span className="grid leading-tight">
              <span className="text-[13px] font-semibold">{e.by}</span>
              <span className="text-[11.5px] text-muted-foreground">
                {e.when}
                {" \xB7 to "}
                {e.aud}
              </span>
            </span>
          </div>
          <div className="text-[14.5px] font-semibold">{e.title}</div>
          <p className="line-clamp-2 text-[13px] text-muted-foreground">
            {e.body}
          </p>
          {e.ack && (
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <EyeIcon className="size-3.5" />
              {e.reads.length}
              {" people confirmed they read it"}
            </span>
          )}
        </div>
      </Card>
    </div>
  )
}

export function CommandCenterPage({ nav, range }: { nav?: any; range?: any }) {
  const [e, r] = rangeSlices(range)
  const i: any[] = [
    [
      IdCardIcon,
      "ID checks",
      verifications.filter((f) => !f.done).length,
      "verify",
      "primary",
      "18 min median",
    ],
    [
      ClipboardListIcon,
      "Listings to review",
      listingReviews.filter((f) => !f.done).length,
      "listings",
      "violet",
      "oldest 1 day",
    ],
    [
      FlagIcon,
      "Cases open",
      cases.filter((f) => f.status !== "Resolved").length,
      "cases",
      "warning",
      `${cases.filter((f) => f.pri === "P1" && f.status !== "Resolved").length} are P1`,
    ],
    [
      TriangleAlertIcon,
      "Safety alerts",
      safetyAlerts.filter((f) => f.open).length,
      "alerts",
      "danger",
      "needs review",
    ],
    [
      ScaleIcon,
      "Police requests",
      lawRequests.filter((f) => f.step < 3).length,
      "law",
      "teal",
      "next due 24 Nov",
    ],
    [
      ShieldCheckIcon,
      "Approvals for you",
      approvals.filter(
        (f) => f.status === "waiting" && f.by !== currentAdmin.name
      ).length,
      "approvals",
      "orange",
      "two-admin rule",
    ],
    [
      InboxIcon,
      "Support tickets",
      supportTickets.filter((f) => f.status === "Open").length,
      "support",
      "indigo",
      "1 high priority",
    ],
  ]
  const o: any[] = [
    {
      key: "signups",
      label: "Sign-ups",
      color: "var(--primary)",
    },
    {
      key: "verified",
      label: "Verified",
      color: "var(--success)",
    },
  ]
  const [n, l] = useState(() => {
    try {
      const f = JSON.parse(localStorage.getItem("hq-cmd"))
      if (Array.isArray(f) && f.length === commandBlocks.length) {
        return f
      }
    } catch {}
    return commandBlocks
  })
  const d = (f?) => {
    l(f)
    try {
      localStorage.setItem("hq-cmd", JSON.stringify(f))
    } catch {}
  }
  const [u, s] = useState(false)
  const m = {
    incident: (
      <>
        {incidents[0].status !== "Resolved" && (
          <button
            onClick={() => nav.go("status")}
            className="flex w-full items-center gap-3 rounded-2xl border border-warning/40 bg-warning/[0.07] px-4 py-2.5 text-left text-[13px]"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-warning" />
            </span>
            <b className="font-semibold">{incidents[0].title}</b>
            <span className="hidden text-muted-foreground sm:inline">
              {"\xB7 "}
              {incidents[0].impact}
            </span>
            <span className="ml-auto font-medium text-warning">
              {incidents[0].status}
            </span>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </button>
        )}
      </>
    ),
    kpis: (
      <>
        {"    "}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <KpiTile
            label="New sign-ups"
            value={num(sumBy(e, "signups"))}
            delta={pctChange(sumBy(e, "signups"), sumBy(r, "signups"))}
            icon={UserPlusIcon}
            tone="primary"
            data={e}
            k="signups"
            onClick={() => nav.go("analytics")}
          />
          <KpiTile
            label="Daily active users"
            value={num(e.at(-1).dau)}
            delta={pctChange(e.at(-1).dau, r.at(-1).dau)}
            icon={ActivityIcon}
            tone="violet"
            data={e}
            k="dau"
            onClick={() => nav.go("analytics")}
          />
          <KpiTile
            label="Living ID scans"
            value={num(sumBy(e, "scans"))}
            delta={pctChange(sumBy(e, "scans"), sumBy(r, "scans"))}
            icon={ScanLineIcon}
            tone="teal"
            data={e}
            k="scans"
            onClick={() => nav.go("analytics")}
          />
          <KpiTile
            label="Move-ins"
            value={num(sumBy(e, "moveins"))}
            delta={pctChange(sumBy(e, "moveins"), sumBy(r, "moveins"))}
            icon={BedDoubleIcon}
            tone="success"
            data={e}
            k="moveins"
            onClick={() => nav.go("hostels")}
          />
        </div>
      </>
    ),
    trend: (
      <>
        {"    "}
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card
            icon={ActivityIcon}
            title="Sign-ups and verified Living IDs"
            description="Hover to see each day"
            actions={<Legend series={o} />}
          >
            <LineChart data={e} series={o} height={262} />
          </Card>
          <Card icon={InboxIcon} title="Waiting on HQ" flush>
            <div className="divide-y">
              {i.map(([f, h, B, y, W, x]) => (
                <button
                  onClick={() => nav.go(y)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
                  key={h}
                >
                  <IconTile icon={f} tone={B ? W : "neutral"} size="sm" />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13.5px]">{h}</span>
                    <span className="text-[11.5px] text-muted-foreground">
                      {x}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-[15px] font-semibold tabular-nums",
                      !B && "text-muted-foreground"
                    )}
                  >
                    {B}
                  </span>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </>
    ),
    team: <TodayStrip nav={nav} />,
    bottom: (
      <>
        {"    "}
        <div className="grid gap-4 xl:grid-cols-3">
          <Card
            icon={FilterIcon}
            title="From sign-up to move-in"
            description="All time"
          >
            <Funnel steps={funnelSteps.slice(1)} />
          </Card>
          <Card
            icon={ServerIcon}
            title="Systems"
            actions={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => nav.go("status")}
              >
                Status
                <ChevronRightIcon />
              </Button>
            }
          >
            <div className="grid gap-3">
              {services.slice(0, 5).map((f) => (
                <div className="grid gap-1.5" key={f.n}>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="font-medium">{f.n}</span>
                    <span
                      className={cn(
                        "tabular-nums",
                        f.status === "OK"
                          ? "text-muted-foreground"
                          : "font-semibold text-warning"
                      )}
                    >
                      {f.status === "OK" ? f.up + "%" : f.status}
                    </span>
                  </div>
                  <UptimeBars bars={f.bars.slice(-40)} />
                </div>
              ))}
            </div>
          </Card>
          <Card
            icon={HistoryIcon}
            title="Latest in the audit log"
            flush
            actions={
              <Button size="sm" variant="ghost" onClick={() => nav.go("audit")}>
                All
                <ChevronRightIcon />
              </Button>
            }
          >
            <div className="divide-y">
              {auditLog.slice(0, 7).map((f) => {
                const h = adminTeam.find((B) => B.name === f.by)
                return (
                  <div
                    className="flex items-center gap-3 px-4 py-2.5"
                    key={f.id}
                  >
                    <Avatar name={f.by} photo={h?.photo} size={28} />
                    <span className="grid min-w-0 flex-1 leading-tight">
                      <span className="truncate text-[13px]">
                        <b className="font-medium">{f.by.split(" ")[0]}</b>{" "}
                        {f.act.toLowerCase()}
                        {" \xB7 "}
                        {f.target}
                      </span>
                      <span className="text-[11.5px] text-muted-foreground">
                        {f.when}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </>
    ),
  }
  return (
    <>
      <PageHeader
        title="Good afternoon, Sabbir"
        desc={`Monday 23 November \xB7 ${range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 90 days"} across the MyStay ID app and MyStay for Business`}
      >
        <Button variant="outline" onClick={() => nav.go("analytics")}>
          <ActivityIcon />
          Analytics
        </Button>
        <Button variant="outline" onClick={() => s(!u)}>
          <LayoutGridIcon />
          {u ? "Done" : "Edit layout"}
        </Button>
        <Button onClick={() => nav.go("cases")}>
          <FlagIcon />
          Open cases
        </Button>
      </PageHeader>
      {u && <LayoutEditor lay={n} setLay={d} />}
      <div className="grid gap-4">
        {n
          .filter((f) => f.on)
          .map((f) => (
            <Fragment key={f.k}>{m[f.k]}</Fragment>
          ))}
      </div>
    </>
  )
}
