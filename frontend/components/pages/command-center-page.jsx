"use client";

import { Fragment, useState } from "react";
import {
  LuActivity,
  LuArrowDown,
  LuArrowUp,
  LuBedDouble,
  LuCalendar,
  LuChevronRight,
  LuClipboardList,
  LuEye,
  LuFilter,
  LuFlag,
  LuHistory,
  LuIdCard,
  LuInbox,
  LuLayoutGrid,
  LuRadio,
  LuRotateCcw,
  LuScale,
  LuScanLine,
  LuServer,
  LuShieldCheck,
  LuTriangleAlert,
  LuUserPlus,
} from "react-icons/lu";
import { Funnel, Legend, LineChart, UptimeBars } from "@/components/charts";
import { KpiTile } from "@/components/shared/kpi-tile";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Switch } from "@/components/ui/switch";
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
} from "@/lib/data/core";
import { announcements, calendarEvents, calendarKinds } from "@/lib/data/ops";
import { num } from "@/lib/format";
import { pctChange, rangeSlices, sumBy } from "@/lib/metrics";
import { cn } from "@/lib/utils";

const commandBlocks = [
  ["incident", "Incident banner"],
  ["kpis", "Key numbers"],
  ["trend", "Sign-ups chart and HQ queue"],
  ["team", "Today on the calendar and latest announcement"],
  ["bottom", "Funnel, systems and audit log"],
].map(([t, a]) => ({
  k: t,
  l: a,
  on: true,
}));

function LayoutEditor({ lay, setLay }) {
  let e = (r, i) => {
    let o = [...lay];
    [o[r], o[r + i]] = [o[r + i], o[r]];
    setLay(o);
  };
  return (
    <Card
      icon={LuLayoutGrid}
      title="Edit layout"
      description="Show, hide and reorder the blocks on this page. Saved for you in this browser."
      className="mb-4"
      actions={
        <Button size="sm" variant="ghost" onClick={() => setLay(commandBlocks)}>
          <LuRotateCcw />
          Reset
        </Button>
      }
    >
      <div className="grid gap-1.5">
        {lay.map((r, i) => (
          <div
            className={cn(
              "bg-card flex items-center gap-3 rounded-xl border px-3 py-2",
              !r.on && "opacity-60",
            )}
            key={r.k}
          >
            <span className="text-muted-foreground w-5 text-center text-[12px] tabular-nums">
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
              <LuArrowUp />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Move down"
              disabled={i === lay.length - 1}
              onClick={() => e(i, 1)}
            >
              <LuArrowDown />
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
                      : n,
                  ),
                )
              }
              label={"Show " + r.l}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

function TodayStrip({ nav }) {
  let a = calendarEvents.filter((r) => r[0] === 23 && r[1] === 10);
  let e = announcements.find((r) => r.pin) || announcements[0];
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card
        icon={LuCalendar}
        title="Today on the calendar"
        flush
        actions={
          <Button size="sm" variant="ghost" onClick={() => nav.go("calendar")}>
            Calendar
            <LuChevronRight />
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
                  <span className="text-muted-foreground text-[12px]">
                    {calendarKinds[r[2]][0]}
                    {" \xB7 "}
                    {r[4]}
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground px-4 py-6 text-center text-[12.5px]">
              Nothing today
            </div>
          )}
        </div>
      </Card>
      <Card
        icon={LuRadio}
        title="Latest announcement"
        actions={
          <Button size="sm" variant="ghost" onClick={() => nav.go("announcements")}>
            All
            <LuChevronRight />
          </Button>
        }
      >
        <div className="grid gap-2">
          <div className="flex items-center gap-2.5">
            <Avatar name={e.by} photo={adminTeam.find((r) => r.name === e.by)?.photo} size={30} />
            <span className="grid leading-tight">
              <span className="text-[13px] font-semibold">{e.by}</span>
              <span className="text-muted-foreground text-[11.5px]">
                {e.when}
                {" \xB7 to "}
                {e.aud}
              </span>
            </span>
          </div>
          <div className="text-[14.5px] font-semibold">{e.title}</div>
          <p className="text-muted-foreground line-clamp-2 text-[13px]">{e.body}</p>
          {e.ack && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-[12px]">
              <LuEye className="size-3.5" />
              {e.reads.length}
              {" people confirmed they read it"}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}

export function CommandCenterPage({ nav, range }) {
  let [e, r] = rangeSlices(range);
  let i = [
    [
      LuIdCard,
      "ID checks",
      verifications.filter((f) => !f.done).length,
      "verify",
      "primary",
      "18 min median",
    ],
    [
      LuClipboardList,
      "Listings to review",
      listingReviews.filter((f) => !f.done).length,
      "listings",
      "violet",
      "oldest 1 day",
    ],
    [
      LuFlag,
      "Cases open",
      cases.filter((f) => f.status !== "Resolved").length,
      "cases",
      "warning",
      `${cases.filter((f) => f.pri === "P1" && f.status !== "Resolved").length} are P1`,
    ],
    [
      LuTriangleAlert,
      "Safety alerts",
      safetyAlerts.filter((f) => f.open).length,
      "alerts",
      "danger",
      "needs review",
    ],
    [
      LuScale,
      "Police requests",
      lawRequests.filter((f) => f.step < 3).length,
      "law",
      "teal",
      "next due 24 Nov",
    ],
    [
      LuShieldCheck,
      "Approvals for you",
      approvals.filter((f) => f.status === "waiting" && f.by !== currentAdmin.name).length,
      "approvals",
      "orange",
      "two-admin rule",
    ],
    [
      LuInbox,
      "Support tickets",
      supportTickets.filter((f) => f.status === "Open").length,
      "support",
      "indigo",
      "1 high priority",
    ],
  ];
  let o = [
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
  ];
  let [n, l] = useState(() => {
    try {
      let f = JSON.parse(localStorage.getItem("hq-cmd"));
      if (Array.isArray(f) && f.length === commandBlocks.length) {
        return f;
      }
    } catch {}
    return commandBlocks;
  });
  let d = (f) => {
    l(f);
    try {
      localStorage.setItem("hq-cmd", JSON.stringify(f));
    } catch {}
  };
  let [u, s] = useState(false);
  let m = {
    incident: (
      <>
        {incidents[0].status !== "Resolved" && (
          <button
            onClick={() => nav.go("status")}
            className="border-warning/40 bg-warning/[0.07] flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left text-[13px]"
          >
            <span className="relative flex size-2.5">
              <span className="bg-warning absolute inline-flex size-full animate-ping rounded-full opacity-60" />
              <span className="bg-warning relative inline-flex size-2.5 rounded-full" />
            </span>
            <b className="font-semibold">{incidents[0].title}</b>
            <span className="text-muted-foreground hidden sm:inline">
              {"\xB7 "}
              {incidents[0].impact}
            </span>
            <span className="text-warning ml-auto font-medium">{incidents[0].status}</span>
            <LuChevronRight className="text-muted-foreground size-4" />
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
            icon={LuUserPlus}
            tone="primary"
            data={e}
            k="signups"
            onClick={() => nav.go("analytics")}
          />
          <KpiTile
            label="Daily active users"
            value={num(e.at(-1).dau)}
            delta={pctChange(e.at(-1).dau, r.at(-1).dau)}
            icon={LuActivity}
            tone="violet"
            data={e}
            k="dau"
            onClick={() => nav.go("analytics")}
          />
          <KpiTile
            label="Living ID scans"
            value={num(sumBy(e, "scans"))}
            delta={pctChange(sumBy(e, "scans"), sumBy(r, "scans"))}
            icon={LuScanLine}
            tone="teal"
            data={e}
            k="scans"
            onClick={() => nav.go("analytics")}
          />
          <KpiTile
            label="Move-ins"
            value={num(sumBy(e, "moveins"))}
            delta={pctChange(sumBy(e, "moveins"), sumBy(r, "moveins"))}
            icon={LuBedDouble}
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
            icon={LuActivity}
            title="Sign-ups and verified Living IDs"
            description="Hover to see each day"
            actions={<Legend series={o} />}
          >
            <LineChart data={e} series={o} height={262} />
          </Card>
          <Card icon={LuInbox} title="Waiting on HQ" flush>
            <div className="divide-y">
              {i.map(([f, h, B, y, W, x]) => (
                <button
                  onClick={() => nav.go(y)}
                  className="hover:bg-muted/50 flex w-full items-center gap-3 px-4 py-2.5 text-left"
                  key={h}
                >
                  <IconTile icon={f} tone={B ? W : "neutral"} size="sm" />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13.5px]">{h}</span>
                    <span className="text-muted-foreground text-[11.5px]">{x}</span>
                  </span>
                  <span
                    className={cn(
                      "text-[15px] font-semibold tabular-nums",
                      !B && "text-muted-foreground",
                    )}
                  >
                    {B}
                  </span>
                  <LuChevronRight className="text-muted-foreground size-4" />
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
          <Card icon={LuFilter} title="From sign-up to move-in" description="All time">
            <Funnel steps={funnelSteps.slice(1)} />
          </Card>
          <Card
            icon={LuServer}
            title="Systems"
            actions={
              <Button size="sm" variant="ghost" onClick={() => nav.go("status")}>
                Status
                <LuChevronRight />
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
                        f.status === "OK" ? "text-muted-foreground" : "text-warning font-semibold",
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
            icon={LuHistory}
            title="Latest in the audit log"
            flush
            actions={
              <Button size="sm" variant="ghost" onClick={() => nav.go("audit")}>
                All
                <LuChevronRight />
              </Button>
            }
          >
            <div className="divide-y">
              {auditLog.slice(0, 7).map((f) => {
                let h = adminTeam.find((B) => B.name === f.by);
                return (
                  <div className="flex items-center gap-3 px-4 py-2.5" key={f.id}>
                    <Avatar name={f.by} photo={h?.photo} size={28} />
                    <span className="grid min-w-0 flex-1 leading-tight">
                      <span className="truncate text-[13px]">
                        <b className="font-medium">{f.by.split(" ")[0]}</b> {f.act.toLowerCase()}
                        {" \xB7 "}
                        {f.target}
                      </span>
                      <span className="text-muted-foreground text-[11.5px]">{f.when}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </>
    ),
  };
  return (
    <>
      <PageHeader
        title="Good afternoon, Sabbir"
        desc={`Monday 23 November \xB7 ${range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 90 days"} across the MyStay ID app and MyStay for Business`}
      >
        <Button variant="outline" onClick={() => nav.go("analytics")}>
          <LuActivity />
          Analytics
        </Button>
        <Button variant="outline" onClick={() => s(!u)}>
          <LuLayoutGrid />
          {u ? "Done" : "Edit layout"}
        </Button>
        <Button onClick={() => nav.go("cases")}>
          <LuFlag />
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
  );
}
