"use client"

import { useState } from "react"
import {
  ActivityIcon,
  Building2Icon,
  ChartPieIcon,
  ClipboardListIcon,
  DownloadIcon,
  FilterIcon,
  IdCardIcon,
  MapPinIcon,
  MegaphoneIcon,
  RepeatIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "lucide-react"
import {
  BarList,
  CohortTable,
  Delta,
  Donut,
  Funnel,
  Legend,
  LineChart,
} from "@/components/charts"
import { KpiTile } from "@/components/shared/kpi-tile"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { Tabs } from "@/components/hq/tabs"
import {
  areaUsers,
  cohorts,
  funnelSteps,
  signupSources,
  userMix,
} from "@/lib/data/core"
import { num } from "@/lib/format"
import { pctChange, rangeSlices, sumBy } from "@/lib/metrics"
import { copyText } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AnalyticsPage({
  range,
  setRange,
}: {
  range?: any
  setRange?: any
}) {
  const [e, r] = rangeSlices(range)
  const [i, o] = useState("growth")
  const n = {
    growth: [
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
    ],
    usage: [
      {
        key: "dau",
        label: "Daily active users",
        color: "var(--violet)",
      },
    ],
    hostels: [
      {
        key: "requests",
        label: "Seat requests",
        color: "var(--orange)",
      },
      {
        key: "moveins",
        label: "Move-ins",
        color: "var(--teal)",
      },
    ],
  }
  const l = areaUsers.map(([d, u, s], m) => [
    d,
    u,
    s * 12,
    [42, 38, 31, 35, 29, 22, 26, 19][m],
    [8.2, 6.1, 12.4, 3.9, 5.5, 2.1, 9.8, 4.4][m],
  ])
  return (
    <>
      <PageHeader
        title="Analytics"
        desc="How MyStay ID is growing, who stays, and where the drop-offs are. Numbers update every hour."
      >
        <Tabs
          size="sm"
          value={range}
          onChange={setRange}
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
        <Button
          variant="outline"
          onClick={() =>
            copyText(
              e.map((d) =>
                [
                  d.date,
                  d.signups,
                  d.verified,
                  d.dau,
                  d.requests,
                  d.moveins,
                ].join(",")
              ).join(`
  `),
              "Daily numbers copied as CSV"
            )
          }
        >
          <DownloadIcon />
          Copy CSV
        </Button>
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-5">
        <KpiTile
          label="Sign-ups"
          value={num(sumBy(e, "signups"))}
          delta={pctChange(sumBy(e, "signups"), sumBy(r, "signups"))}
          icon={UserPlusIcon}
          tone="primary"
        />
        <KpiTile
          label="Verified"
          value={`${Math.round((sumBy(e, "verified") / sumBy(e, "signups")) * 100)}%`}
          delta={pctChange(
            sumBy(e, "verified") / sumBy(e, "signups"),
            sumBy(r, "verified") / sumBy(r, "signups")
          )}
          icon={ShieldCheckIcon}
          tone="success"
        />
        <KpiTile
          label="DAU / MAU"
          value="58%"
          delta={3.2}
          icon={RepeatIcon}
          tone="violet"
        />
        <KpiTile
          label="Seat requests"
          value={num(sumBy(e, "requests"))}
          delta={pctChange(sumBy(e, "requests"), sumBy(r, "requests"))}
          icon={ClipboardListIcon}
          tone="orange"
        />
        <KpiTile
          label="Time to verify"
          value="4.2 min"
          delta={-18.5}
          invert
          icon={IdCardIcon}
          tone="teal"
        />
      </div>
      <Card
        icon={ActivityIcon}
        title="Trends"
        className="mb-4"
        actions={
          <Tabs
            size="sm"
            value={i}
            onChange={o}
            items={[
              {
                value: "growth",
                label: "Growth",
              },
              {
                value: "usage",
                label: "Usage",
              },
              {
                value: "hostels",
                label: "Hostels",
              },
            ]}
          />
        }
      >
        <div className="mb-2">
          <Legend series={n[i]} />
        </div>
        <LineChart data={e} series={n[i]} height={300} />
      </Card>
      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Card
          icon={FilterIcon}
          title="Funnel"
          description="From sign-up to moving in · all time"
        >
          <Funnel steps={funnelSteps} />
        </Card>
        <Card
          icon={RepeatIcon}
          title="Who keeps using the app"
          description="Share of each month’s sign-ups still active in later months"
        >
          <CohortTable rows={cohorts} />
        </Card>
      </div>
      <div className="mb-4 grid gap-4 xl:grid-cols-3">
        <Card icon={ChartPieIcon} title="Users by type">
          <Donut items={userMix} />
        </Card>
        <Card icon={MegaphoneIcon} title="Where sign-ups come from">
          <BarList items={signupSources} />
        </Card>
        <Card icon={Building2Icon} title="Hostels by plan">
          <Donut
            items={[
              ["Free", 61, "muted-foreground"],
              ["Pro", 66, "primary"],
              ["Plus", 21, "violet"],
            ]}
            center="148"
          />
        </Card>
      </div>
      <Card icon={MapPinIcon} title="By area" flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Hostels</TableHead>
              <TableHead className="text-right">Verified seat demand</TableHead>
              <TableHead className="text-right">Growth (30 days)</TableHead>
              <TableHead>Demand vs seats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {l.map(([d, u, s, m, f]) => (
              <TableRow key={d}>
                <TableCell className="font-medium">{d}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {num(u)}
                </TableCell>
                <TableCell className="text-right tabular-nums">{s}</TableCell>
                <TableCell className="text-right tabular-nums">{m}%</TableCell>
                <TableCell className="text-right">
                  <Delta value={f} />
                </TableCell>
                <TableCell>
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-track">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        m > 35 ? "bg-warning" : "bg-primary"
                      )}
                      style={{
                        width: m * 2 + "%",
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="border-t px-5 py-2.5 text-[12.5px] text-muted-foreground">
          Amber = more students looking than open seats. Good areas to sign up
          new hostels.
        </div>
      </Card>
    </>
  )
}
