"use client"

import { useState } from "react"
import {
  ArrowRightIcon,
  BookOpenIcon,
  BugIcon,
  CalculatorIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleIcon,
  ClockIcon,
  CloudIcon,
  DatabaseIcon,
  GaugeIcon,
  ListChecksIcon,
  PauseIcon,
  PhoneCallIcon,
  PlayIcon,
  PlusIcon,
  RocketIcon,
  ServerIcon,
  TrendingUpIcon,
  Undo2Icon,
  ZapIcon,
} from "lucide-react"
import { BarList, Legend, LineChart } from "@/components/charts"
import { KpiTile } from "@/components/shared/kpi-tile"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { ScoreRing } from "@/components/shared/score-ring"
import { SectionTabs, StatTile, personPhoto } from "@/components/teams/shared"
import { TeamBoard } from "@/components/teams/team-board"
import { Avatar } from "@/components/hq/avatar"
import { Badge, Tag } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { IconTile } from "@/components/hq/icon-tile"
import { Progress } from "@/components/hq/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import {
  cacheKeys,
  crashes,
  deploys,
  endpoints,
  infraCosts,
  latencySeries,
  onCall,
  rollouts,
  runbooks,
  scalingPlan,
  slowQueries,
  tasks,
  teamMembers,
} from "@/lib/data/teams"
import { num, taka } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function TechnicalPage({ nav }: { nav?: any }) {
  const [a, e] = useState("overview")
  const r = latencySeries.at(-1)
  return (
    <>
      <PageHeader
        title="Technical"
        desc="Engineering workspace: work, releases, speed, database and cache health, on-call, crashes and cloud cost."
        badge={
          <span className="flex -space-x-1.5">
            {teamMembers.tech.map((i) => (
              <Avatar name={i[0]} photo={i[2]} size={26} ring key={i[0]} />
            ))}
          </span>
        }
      >
        <Button variant="outline" onClick={() => nav.go("status")}>
          <ServerIcon />
          System status
        </Button>
      </PageHeader>
      <SectionTabs
        value={a}
        onChange={e}
        items={[
          {
            value: "overview",
            label: "Overview",
            icon: GaugeIcon,
          },
          {
            value: "tasks",
            label: "Tasks",
            icon: ListChecksIcon,
            count: tasks.filter((i) => i.team === "tech" && i.status !== "Done")
              .length,
          },
          {
            value: "releases",
            label: "Releases",
            icon: RocketIcon,
          },
          {
            value: "perf",
            label: "Endpoints",
            icon: ZapIcon,
          },
          {
            value: "db",
            label: "Database & cache",
            icon: DatabaseIcon,
          },
          {
            value: "scale",
            label: "Scale plan",
            icon: TrendingUpIcon,
          },
          {
            value: "oncall",
            label: "On-call",
            icon: PhoneCallIcon,
          },
          {
            value: "errors",
            label: "Crashes",
            icon: BugIcon,
          },
          {
            value: "cost",
            label: "Cloud cost",
            icon: CloudIcon,
          },
        ]}
      />
      {a === "overview" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KpiTile
              label="Slowest 5% of requests (p95)"
              value={`${r.p95} ms`}
              delta={-6.1}
              invert
              icon={GaugeIcon}
              tone="primary"
              data={latencySeries}
              k="p95"
            />
            <KpiTile
              label="Requests per second"
              value={num(r.rps)}
              delta={9.8}
              icon={ZapIcon}
              tone="violet"
              data={latencySeries}
              k="rps"
            />
            <KpiTile
              label="Cache hit rate"
              value={`${r.hit}%`}
              delta={1.4}
              icon={DatabaseIcon}
              tone="success"
              data={latencySeries}
              k="hit"
            />
            <KpiTile
              label="Errors"
              value="0.21%"
              delta={-14}
              invert
              icon={BugIcon}
              tone="danger"
            />
          </div>
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Card
              icon={GaugeIcon}
              title="Response time"
              description="Median (p50) and slowest 5% (p95), last 30 days"
              actions={
                <Legend
                  series={[
                    {
                      key: "p50",
                      label: "p50",
                      color: "var(--primary)",
                    },
                    {
                      key: "p95",
                      label: "p95",
                      color: "var(--warning)",
                    },
                  ]}
                />
              }
            >
              <LineChart
                data={latencySeries}
                series={[
                  {
                    key: "p50",
                    label: "p50 (ms)",
                    color: "var(--primary)",
                  },
                  {
                    key: "p95",
                    label: "p95 (ms)",
                    color: "var(--warning)",
                  },
                ]}
                height={250}
              />
            </Card>
            <Card icon={RocketIcon} title="Releases" flush>
              <div className="divide-y">
                {rollouts.map((i) => (
                  <div className="grid gap-1.5 px-4 py-3" key={i.app}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-medium">
                        {i.app} {i.v}
                      </span>
                      <Badge tone={i.status === "Live" ? "success" : "danger"}>
                        {i.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={i.stage}
                        tone={i.status === "Halted" ? "warning" : "success"}
                        className="flex-1"
                      />
                      <span className="w-10 text-right text-[12px] text-muted-foreground tabular-nums">
                        {i.stage}%
                      </span>
                    </div>
                    <span className="text-[12px] text-muted-foreground">
                      {i.note}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {a === "tasks" && <TeamBoard team="tech" nav={nav} />}
      {a === "releases" && (
        <>
          <div className="mb-4 grid gap-4 lg:grid-cols-3">
            {rollouts.map((i) => (
              <div
                className="grid gap-3 rounded-2xl border bg-card p-4 shadow-card"
                key={i.app}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold">
                    {i.app} {i.v}
                  </span>
                  <Badge tone={i.status === "Live" ? "success" : "danger"}>
                    {i.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreRing
                    value={i.stage}
                    size={52}
                    tone={
                      i.status === "Halted"
                        ? "var(--warning)"
                        : "var(--success)"
                    }
                  />
                  <div className="grid text-[12.5px] leading-snug">
                    <span>{i.stage}% of users have it</span>
                    <span className="text-muted-foreground">
                      {i.crash}% crash-free
                    </span>
                    <span className="text-muted-foreground">{i.note}</span>
                  </div>
                </div>
                {i.app !== "Business web" && (
                  <div className="flex gap-1.5">
                    {i.status === "Halted" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          i.status = "Live"
                          i.stage = 50
                          logAudit("Resumed rollout", `${i.app} ${i.v}`, "50%")
                          refresh()
                          toast("Rollout resumed at 50%")
                        }}
                      >
                        <PlayIcon />
                        Resume
                      </Button>
                    ) : (
                      i.stage < 100 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            i.stage = Math.min(100, i.stage * 2)
                            refresh()
                          }}
                        >
                          <ArrowRightIcon />
                          Expand
                        </Button>
                      )
                    )}
                    {i.status !== "Halted" && i.stage < 100 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          i.status = "Halted"
                          refresh()
                          toast("Rollout halted")
                        }}
                      >
                        <PauseIcon />
                        Halt
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Card flush icon={RocketIcon} title="Deploys">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {deploys.map((i, o) => (
                  <TableRow key={o}>
                    <TableCell className="font-mono text-[12.5px]">
                      {i[0]}
                    </TableCell>
                    <TableCell>{i[1]}</TableCell>
                    <TableCell>{i[2]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={i[3]}
                          photo={personPhoto(i[3])}
                          size={22}
                        />
                        {i[3]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge tone={i[4] === "Live" ? "success" : "warning"}>
                        {i[4]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {i[4] === "Live" && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            i[4] = "Rolled back"
                            logAudit("Rolled back deploy", i[0], i[1])
                            refresh()
                            toast(`${i[0]} rolled back`)
                          }}
                        >
                          <Undo2Icon />
                          Roll back
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
      {a === "perf" && (
        <Card
          flush
          icon={ZapIcon}
          title="Busiest endpoints"
          description="Last hour"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-right">Requests / min</TableHead>
                <TableHead className="text-right">p50</TableHead>
                <TableHead className="text-right">p95</TableHead>
                <TableHead className="text-right">Errors</TableHead>
                <TableHead>From cache</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endpoints.map(([i, o, n, l, d, u]) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-[12.5px]">{i}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {num(o)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {n}
                    {" ms"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums",
                      l > 500 && "font-semibold text-destructive"
                    )}
                  >
                    {l}
                    {" ms"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums",
                      d >= 0.5 /* .5 */ && "font-semibold text-warning"
                    )}
                  >
                    {d}%
                  </TableCell>
                  <TableCell>
                    {u ? (
                      <div className="flex w-28 items-center gap-2">
                        <Progress value={u} tone="success" />
                        <span className="text-[12px] tabular-nums">{u}%</span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">
                        writes, no cache
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t px-5 py-2.5 text-[12.5px] text-muted-foreground">
            Red p95: the seats endpoint misses an index. Fix is in review
            (ENG-410).
          </div>
        </Card>
      )}
      {a === "db" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              icon={DatabaseIcon}
              tone="success"
              label="Cache hit rate"
              value={`${r.hit}%`}
            />
            <StatTile
              icon={ServerIcon}
              tone="primary"
              label="Database reads / s"
              value="64"
              sub="of ~1,280 requests"
            />
            <StatTile
              icon={ClockIcon}
              tone="warning"
              label="Replica lag"
              value="0.4 s"
            />
            <StatTile
              icon={GaugeIcon}
              tone="violet"
              label="DB connections"
              value="38 / 200"
              sub="via PgBouncer"
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Card
              flush
              icon={ZapIcon}
              title="Hottest cache keys"
              description="Most read in the last minute"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead className="text-right">Reads / s</TableHead>
                    <TableHead>Kept for</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cacheKeys.map(([i, o, n]) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-[12px]">
                        {i}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {num(o)}
                      </TableCell>
                      <TableCell>{n}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t px-5 py-2.5 text-[12.5px] text-muted-foreground">
                The top key serves 1,240 students a second from one copy.
                Without the cache, each would be a database query.
              </div>
            </Card>
            <Card flush icon={DatabaseIcon} title="Slow queries">
              <div className="divide-y">
                {slowQueries.map(([i, o, n, l, d]) => (
                  <div className="grid gap-1.5 px-4 py-3" key={i}>
                    <code className="rounded-md bg-muted/60 px-2 py-1 font-mono text-[11.5px] break-all">
                      {i}
                    </code>
                    <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                      <Badge
                        tone={
                          o > 300 ? "danger" : o > 150 ? "warning" : "success"
                        }
                      >
                        {o}
                        {" ms avg"}
                      </Badge>
                      <span className="text-muted-foreground">
                        {n ? `${num(n)} calls/day` : "no longer runs"}
                      </span>
                      <span className="flex-1">{l}</span>
                      {d && <Tag>{d}</Tag>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {a === "scale" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card
            icon={TrendingUpIcon}
            title="Ready for scale"
            description="From the scale plan: built for the next 10×"
          >
            {scalingPlan.map(([i, o]) => (
              <div
                className="flex items-center gap-3 border-b py-2.5 text-[13.5px] last:border-0"
                key={i}
              >
                {o === "done" ? (
                  <CircleCheckIcon className="size-[18px] text-success" />
                ) : o === "doing" ? (
                  <ClockIcon className="size-[18px] text-primary" />
                ) : (
                  <CircleIcon className="size-[18px] text-muted-foreground" />
                )}
                <span className="flex-1">{i}</span>
                <Badge
                  tone={
                    o === "done"
                      ? "success"
                      : o === "doing"
                        ? "primary"
                        : "neutral"
                  }
                >
                  {o === "done"
                    ? "Done"
                    : o === "doing"
                      ? "In progress"
                      : o === "todo"
                        ? "Next"
                        : "At 2M users"}
                </Badge>
              </div>
            ))}
          </Card>
          <Card
            icon={GaugeIcon}
            title="Headroom"
            description="Today vs what the current setup can take"
          >
            <div className="grid gap-4">
              {[
                ["API requests / s", r.rps, 4000 /* 4e3 */],
                ["Database reads / s", 64, 1500],
                ["Database writes / s", 38, 600],
                ["Redis ops / s", 9200, 80000 /* 8e4 */],
                ["Search queries / s", 70, 800],
              ].map(([i, o, n]) => (
                <div className="grid gap-1.5" key={i}>
                  <div className="flex justify-between text-[13px]">
                    <span>{i}</span>
                    <span className="tabular-nums">
                      <b className="font-semibold">{num(o)}</b>{" "}
                      <span className="text-muted-foreground">
                        {"/ "}
                        {num(n)}
                      </span>
                    </span>
                  </div>
                  <Progress
                    value={(o / n) * 100}
                    tone={
                      o / n > 0.7 /* .7 */
                        ? "danger"
                        : o / n > 0.5 /* .5 */
                          ? "warning"
                          : "success"
                    }
                  />
                </div>
              ))}
              <Notice>
                Alerts fire at 60% of capacity, which leaves weeks to add the
                next layer.
              </Notice>
            </div>
          </Card>
        </div>
      )}
      {a === "oncall" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card
            icon={PhoneCallIcon}
            title="On-call rota"
            description="Primary answers within 5 min for SEV 1, 15 min for SEV 2"
          >
            <div className="grid gap-2">
              {onCall.map(([i, o, n], l) => (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3",
                    l === 0 && "border-primary/40 bg-primary/[0.04]"
                  )}
                  key={i}
                >
                  <span className="w-20 text-[13px] font-medium">{i}</span>
                  <div className="flex flex-1 items-center gap-2">
                    <Avatar name={o} photo={personPhoto(o)} size={26} />
                    <span className="grid leading-tight">
                      <span className="text-[13px] font-medium">{o}</span>
                      <span className="text-[11.5px] text-muted-foreground">
                        Primary
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <Avatar name={n} photo={personPhoto(n)} size={26} />
                    <span className="grid leading-tight">
                      <span className="text-[13px]">{n}</span>
                      <span className="text-[11.5px] text-muted-foreground">
                        Backup
                      </span>
                    </span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => toast("Swap request sent")}
              >
                Request a swap
              </Button>
            </div>
          </Card>
          <Card
            flush
            icon={BookOpenIcon}
            title="Runbooks"
            description="Step-by-step fixes for known problems"
          >
            <div className="divide-y">
              {runbooks.map(([i, o, n, l]) => (
                <button
                  onClick={() => toast(`Opening runbook: ${i}`)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
                  key={i}
                >
                  <IconTile icon={BookOpenIcon} tone="primary" size="sm" />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13.5px] font-medium">{i}</span>
                    <span className="text-[12px] text-muted-foreground">
                      {o}
                      {" \xB7 "}
                      {n}
                      {" \xB7 updated "}
                      {l}
                    </span>
                  </span>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
      {a === "errors" && (
        <Card
          flush
          icon={BugIcon}
          title="Top crashes"
          description="Grouped by cause, last 7 days"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crash</TableHead>
                <TableHead>App version</TableHead>
                <TableHead className="text-right">People affected</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Task</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crashes.map(([i, o, n, l, d]) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-[12.5px]">{i}</TableCell>
                  <TableCell>{o}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {num(n)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        l === "Rising"
                          ? "danger"
                          : l === "Flat"
                            ? "warning"
                            : "success"
                      }
                    >
                      {l}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {d ? (
                      <Tag>{d}</Tag>
                    ) : (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          tasks.unshift({
                            team: "tech",
                            id: "ENG-" + (413 + tasks.length),
                            title: `Fix: ${i}`,
                            status: "To do",
                            pri: "Medium",
                            who: "Sadia Noor",
                            due: "2026-11-30",
                            labels: ["Bug", "Crash"],
                            sub: [],
                            comments: 0,
                            link: null,
                            desc: "",
                            log: [],
                          })
                          refresh()
                          toast("Task created on the Technical board")
                        }}
                      >
                        <PlusIcon />
                        Create task
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {a === "cost" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card
            icon={CloudIcon}
            title="Cloud cost · November"
            description={taka(infraCosts.reduce((i, o) => i + o[1], 0))}
          >
            <BarList items={infraCosts} />
          </Card>
          <Card icon={CalculatorIcon} title="Per user">
            <div className="grid gap-3 text-[13.5px]">
              {[
                ["Cloud cost per active user", "\u09F33.10"],
                ["Cost per 1,000 API requests", "\u09F30.08"],
                ["Cost per Living ID scan", "\u09F30.004"],
              ].map(([i, o]) => (
                <div
                  className="flex justify-between border-b pb-2.5 last:border-0"
                  key={i}
                >
                  <span>{i}</span>
                  <span className="font-semibold tabular-nums">{o}</span>
                </div>
              ))}
              <Notice>
                Caching keeps the database the smallest line. Without it, the
                database alone would cost about 5× more at today&apos;s traffic.
              </Notice>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
