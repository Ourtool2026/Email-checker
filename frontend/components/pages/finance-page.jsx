"use client";

import { Fragment, useState } from "react";
import {
  LuBriefcase,
  LuCalculator,
  LuChartLine,
  LuCheck,
  LuChevronRight,
  LuCircleCheck,
  LuClock,
  LuDownload,
  LuFileText,
  LuHourglass,
  LuListChecks,
  LuPiggyBank,
  LuReceipt,
  LuSend,
  LuTrendingUp,
  LuTriangleAlert,
  LuTrophy,
  LuWallet,
  LuX,
} from "react-icons/lu";
import { Delta, Donut, compact } from "@/components/charts";
import { KpiTile } from "@/components/shared/kpi-tile";
import { Notice } from "@/components/shared/notice";
import { PageHeader } from "@/components/shared/page-header";
import { SectionTabs, StatTile, personPhoto } from "@/components/teams/shared";
import { TeamBoard } from "@/components/teams/team-board";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { getHostel } from "@/lib/data/core";
import {
  budgetLines,
  expenses,
  monthlyFinance,
  receivablesAging,
  spendRequests,
  teamMembers,
  unitCosts,
} from "@/lib/data/teams";
import { taka } from "@/lib/format";
import { copyText, logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FinancePage({ nav }) {
  let [a, e] = useState("overview");
  let r = monthlyFinance.at(-1);
  let i = monthlyFinance.at(-2);
  let o = budgetLines.reduce((s, m) => s + m[1], 0);
  let n = budgetLines.reduce((s, m) => s + m[2], 0);
  let l = 4860000; /* 486e4 */
  let d = o - r.v;
  let u = Math.max(...monthlyFinance.map((s) => s.v));
  return (
    <>
      <PageHeader
        title="Finance"
        desc="MyStay's own money: what hostels pay for plans, what we spend, and how long the cash lasts. Rent between residents and hostels never appears here."
        badge={
          <span className="flex -space-x-1.5">
            {teamMembers.finance.map((s) => (
              <Avatar name={s[0]} photo={s[2]} size={26} ring key={s[0]} />
            ))}
          </span>
        }
      >
        <Button
          variant="outline"
          onClick={() =>
            copyText(
              budgetLines.map((s) => s.join(",")).join(`
  `),
              "Spending copied as CSV",
            )
          }
        >
          <LuDownload />
          Export
        </Button>
      </PageHeader>
      <Notice tone="warning" icon={LuTriangleAlert} className="mb-4">
        All money figures here are sample numbers for the prototype.
      </Notice>
      <SectionTabs
        value={a}
        onChange={e}
        items={[
          {
            value: "overview",
            label: "Overview",
            icon: LuChartLine,
          },
          {
            value: "revenue",
            label: "Revenue",
            icon: LuTrendingUp,
          },
          {
            value: "collections",
            label: "Collections",
            icon: LuReceipt,
          },
          {
            value: "spending",
            label: "Spending & budget",
            icon: LuWallet,
          },
          {
            value: "approvals",
            label: "Spend approvals",
            icon: LuCheck,
            count: spendRequests.filter((s) => !s.done).length,
          },
          {
            value: "unit",
            label: "Unit costs",
            icon: LuCalculator,
          },
          {
            value: "tasks",
            label: "Tasks",
            icon: LuListChecks,
          },
          {
            value: "reports",
            label: "Reports",
            icon: LuFileText,
          },
        ]}
      />
      {a === "overview" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KpiTile
              label="Monthly recurring revenue"
              value={taka(r.v)}
              delta={((r.v - i.v) / i.v) * 100}
              icon={LuTrendingUp}
              tone="success"
            />
            <KpiTile
              label="Spent in November"
              value={taka(o)}
              delta={6.4}
              invert
              icon={LuWallet}
              tone="warning"
            />
            <KpiTile label="Cash in bank" value={taka(l)} icon={LuPiggyBank} tone="primary" />
            <KpiTile
              label="Months of cash left"
              value={(l / d).toFixed(1)}
              icon={LuHourglass}
              tone={l / d < 6 ? "danger" : "violet"}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Card
              icon={LuTrendingUp}
              title="Recurring revenue from hostel plans"
              description="Bars = revenue at month end · new, upgrades and lost plans below"
            >
              <div className="flex h-[220px] items-end gap-4">
                {monthlyFinance.map((s) => (
                  <div
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                    key={s.m}
                  >
                    <span className="text-[11.5px] font-semibold tabular-nums">{compact(s.v)}</span>
                    <div
                      className={cn(
                        "w-full max-w-14 rounded-t-lg",
                        s.m === "Nov" ? "bg-success" : "bg-success/30",
                      )}
                      style={{
                        height: (s.v / u) * 170,
                      }}
                    />
                    <span className="text-muted-foreground text-[11.5px]">{s.m}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-center text-[12.5px]">
                {[
                  ["New plans", r.n, "success"],
                  ["Upgrades", r.e, "primary"],
                  ["Lost plans", -r.c, "danger"],
                ].map(([s, m, f]) => (
                  <div key={s}>
                    <div
                      className={cn(
                        "text-[15px] font-semibold tabular-nums",
                        f === "danger"
                          ? "text-destructive"
                          : f === "success"
                            ? "text-success"
                            : "text-primary",
                      )}
                    >
                      {m > 0 ? "+" : "\u2212"}
                      {taka(Math.abs(m))}
                    </div>
                    <div className="text-muted-foreground">{s}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card
              icon={LuWallet}
              title="Budget used · November"
              description={`${taka(o)} of ${taka(n)}`}
            >
              <div className="grid gap-3">
                {budgetLines.map(([s, m, f]) => (
                  <div className="grid gap-1" key={s}>
                    <div className="flex justify-between text-[12.5px]">
                      <span>{s}</span>
                      <span
                        className={cn("tabular-nums", m > f && "text-destructive font-semibold")}
                      >
                        {Math.round((m / f) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(m / f) * 100}
                      tone={m > f ? "danger" : m / f > 0.9 /* .9 */ ? "warning" : "primary"}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {a === "revenue" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card flush icon={LuTrendingUp} title="Revenue by month">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Recurring revenue</TableHead>
                  <TableHead className="text-right">New</TableHead>
                  <TableHead className="text-right">Upgrades</TableHead>
                  <TableHead className="text-right">Lost</TableHead>
                  <TableHead className="text-right">Net change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyFinance
                  .slice()
                  .reverse()
                  .map((s) => (
                    <TableRow key={s.m}>
                      <TableCell className="font-medium">
                        {s.m}
                        {" 2026"}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {taka(s.v)}
                      </TableCell>
                      <TableCell className="text-success text-right tabular-nums">
                        +{taka(s.n)}
                      </TableCell>
                      <TableCell className="text-primary text-right tabular-nums">
                        +{taka(s.e)}
                      </TableCell>
                      <TableCell className="text-destructive text-right tabular-nums">
                        −{taka(s.c)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {taka(s.n + s.e - s.c)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
          <Card icon={LuReceipt} title="By plan">
            <Donut
              items={[
                ["Pro", 66 * 1500, "primary"],
                ["Plus", 21 * 3500, "violet"],
              ]}
              center={compact(r.v)}
            />
            <p className="text-muted-foreground mt-3 text-[12.5px]">
              {"Yearly run rate "}
              {taka(r.v * 12)}. 61 hostels on Free.
            </p>
          </Card>
        </div>
      )}
      {a === "collections" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {receivablesAging.map(([s, m, f], h) => (
              <StatTile
                icon={h ? LuClock : LuCircleCheck}
                tone={["success", "warning", "orange", "danger"][h]}
                label={`${s} \xB7 ${f} invoices`}
                value={taka(m)}
                key={s}
              />
            ))}
          </div>
          <Card
            flush
            icon={LuReceipt}
            title="Late invoices"
            description="Reminders go out on day 1, 7 and 14; on day 30 the plan drops to Free (the hostel keeps working)"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostel</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Reminders</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["h3", "INV-261103", 3500, 12],
                  ["h9", "INV-261109", 1500, 34],
                  ["h5", "INV-261105", 1500, 6],
                ].map(([s, m, f, h]) => {
                  let B = getHostel(s);
                  let y = h >= 30 || h >= 14 ? 3 : h >= 7 ? 2 : 1;
                  return (
                    <TableRow key={m}>
                      <TableCell>
                        <button
                          className="flex items-center gap-2 hover:underline"
                          onClick={() => nav.hostel(s)}
                        >
                          <img src={B.photo} alt="" className="size-6 rounded-md object-cover" />
                          {B.name}
                        </button>
                      </TableCell>
                      <TableCell className="font-mono text-[12.5px]">{m}</TableCell>
                      <TableCell className="text-right tabular-nums">{taka(f)}</TableCell>
                      <TableCell>
                        <Badge tone={h >= 30 ? "danger" : h >= 14 ? "warning" : "neutral"}>
                          {h}
                          {" days"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {["Day 1", "Day 7", "Day 14"].map((W, x) => (
                            <span
                              className={cn(
                                "rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                                x < y
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground",
                              )}
                              key={W}
                            >
                              {W}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => toast(`Reminder sent to ${B.owner}`)}
                          >
                            <LuSend />
                            Remind
                          </Button>
                          {h >= 30 && (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => {
                                B.plan = "Free";
                                logAudit("Moved to Free plan", B.name, "Unpaid 30+ days");
                                refresh();
                                toast(`${B.name} moved to Free`);
                              }}
                            >
                              Move to Free
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
      {a === "spending" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <Card icon={LuWallet} title="Budget vs spent · November">
            {budgetLines.map(([s, m, f]) => (
              <div className="mb-3 grid gap-1" key={s}>
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium">{s}</span>
                  <span className="tabular-nums">
                    {taka(m)}{" "}
                    <span className="text-muted-foreground">
                      {"/ "}
                      {taka(f)}
                    </span>
                  </span>
                </div>
                <div className="bg-track relative h-2.5 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full rounded-full", m > f ? "bg-destructive" : "bg-primary")}
                    style={{
                      width: Math.min(100, (m / f) * 100) + "%",
                    }}
                  />
                </div>
                {m > f && (
                  <span className="text-destructive text-[12px]">
                    {"Over by "}
                    {taka(m - f)}
                    {" \xB7 see FIN-058"}
                  </span>
                )}
              </div>
            ))}
          </Card>
          <Card flush icon={LuReceipt} title="Recent spending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Paid to</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Paid by</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((s, m) => (
                  <TableRow key={m}>
                    <TableCell className="whitespace-nowrap">{s[0]}</TableCell>
                    <TableCell className="font-medium">{s[1]}</TableCell>
                    <TableCell className="text-muted-foreground">{s[2]}</TableCell>
                    <TableCell className="text-right tabular-nums">{taka(s[3])}</TableCell>
                    <TableCell>{s[4]}</TableCell>
                    <TableCell>
                      {s[5] ? (
                        <Badge tone="success">Attached</Badge>
                      ) : (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            s[5] = true;
                            refresh();
                            toast("Receipt attached");
                          }}
                        >
                          Attach
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
      {a === "approvals" && (
        <div className="grid gap-3">
          {spendRequests.map((s) => (
            <div
              className="bg-card flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-card"
              key={s.id}
            >
              <Avatar name={s.who} photo={personPhoto(s.who)} size={40} />
              <div className="grid min-w-0 flex-1 gap-0.5">
                <span className="text-[14px] font-semibold">{s.what}</span>
                <span className="text-muted-foreground text-[12.5px]">
                  {s.id}
                  {" \xB7 "}
                  {s.who}
                  {" \xB7 "}
                  {s.cat}
                  {" \xB7 "}
                  {s.when}
                </span>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {s.steps.map(([m, f], h) => (
                    <Fragment key={m}>
                      {h > 0 && <LuChevronRight className="text-muted-foreground size-3.5" />}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] font-medium",
                          f === "done"
                            ? "bg-success/10 text-success"
                            : f === "wait"
                              ? "bg-warning/10 text-warning"
                              : f === "skip"
                                ? "bg-muted text-muted-foreground line-through"
                                : "bg-muted text-muted-foreground",
                        )}
                      >
                        {f === "done" ? (
                          <LuCheck className="size-3" />
                        ) : f === "wait" ? (
                          <LuClock className="size-3" />
                        ) : null}
                        {m}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <span className="text-[17px] font-semibold tabular-nums">{taka(s.amt)}</span>
              {s.done ? (
                <Badge tone={s.done === "Approved" ? "success" : "danger"}>{s.done}</Badge>
              ) : (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      s.done = "Rejected";
                      logAudit("Rejected spend", s.id, s.what);
                      refresh();
                      toast("Rejected. They are told why.");
                    }}
                  >
                    <LuX />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      s.steps = s.steps.map((f) => (f[1] === "wait" ? [f[0], "done"] : f));
                      let m = s.steps.find((f) => f[1] === "todo");
                      if (m) {
                        m[1] = "wait";
                      } else {
                        s.done = "Approved";
                      }
                      logAudit("Approved spend step", s.id, s.what);
                      refresh();
                      toast(m ? `Approved. Now with ${m[0]}.` : "Fully approved");
                    }}
                  >
                    <LuCheck />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Notice>
            Spend over ৳20,000 needs the CEO after Finance. Cloud costs that repeat monthly need the
            engineering lead first.
          </Notice>
        </div>
      )}
      {a === "unit" && (
        <Card
          flush
          icon={LuCalculator}
          title="Unit costs"
          description="What one unit of each thing costs us, this month vs last"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Measure</TableHead>
                <TableHead className="text-right">November</TableHead>
                <TableHead className="text-right">October</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unitCosts.map(([s, m, f]) => (
                <TableRow key={s}>
                  <TableCell className="font-medium">{s}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    ৳{m.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right tabular-nums">
                    ৳{f.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {m === f ? (
                      <span className="text-muted-foreground">No change</span>
                    ) : (
                      <Delta value={((m - f) / f) * 100} invert={!s.startsWith("Revenue")} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-muted-foreground border-t px-5 py-2.5 text-[12.5px]">
            The NID check price is the biggest lever: at 50k checks a month a lower tier would save
            about ৳40k.
          </div>
        </Card>
      )}
      {a === "tasks" && <TeamBoard team="finance" nav={nav} />}
      {a === "reports" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Monthly management pack", "Revenue, spend, cash, runway", LuFileText],
            ["VAT return (Mushak 9.1)", "Plan revenue with VAT split", LuReceipt],
            ["Ambassador payouts", "Per ambassador, verified only", LuTrophy],
            ["bKash settlement match", "Payments vs bank deposits", LuWallet],
            ["Vendor spend by month", "NID, SMS, cloud, ads", LuCalculator],
            ["Board pack", "One page for investors", LuBriefcase],
          ].map(([s, m, f]) => (
            <div
              className="bg-card flex items-center gap-3 rounded-2xl border p-4 shadow-card"
              key={s}
            >
              <IconTile icon={f} tone="success" />
              <span className="grid flex-1 leading-tight">
                <span className="text-[14px] font-semibold">{s}</span>
                <span className="text-muted-foreground text-[12.5px]">{m}</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  logAudit("Built report", s, "November");
                  toast(`${s} built. Copy saved for 90 days.`);
                }}
              >
                <LuDownload />
                Build
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
