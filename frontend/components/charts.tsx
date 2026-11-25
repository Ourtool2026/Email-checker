"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const chartMonths: any[] = [
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
]

const formatDay = (t?) =>
  `${Number(t.slice(8))} ${chartMonths[Number(t.slice(5, 7)) - 1]}`

export const compact = (t?) => {
  if (t >= 1000000 /* 1e6 */) {
    return (
      (t / 1000000) /* 1e6 */
        .toFixed(1) + "M"
    )
  }
  if (t >= 10000 /* 1e4 */) {
    return Math.round(t / 1000 /* 1e3 */) + "k"
  }
  if (t >= 1000 /* 1e3 */) {
    return (
      (t / 1000) /* 1e3 */
        .toFixed(1) + "k"
    )
  }
  return String(t)
}

export function Delta({
  value,
  className,
  invert,
}: {
  value?: any
  className?: any
  invert?: any
}) {
  const r = value >= 0
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold tabular-nums",
        (invert ? !r : r)
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive",
        className
      )}
    >
      {r ? (
        <ArrowUpRightIcon className="size-3" />
      ) : (
        <ArrowDownRightIcon className="size-3" />
      )}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

/* Semantic colours passed by pages map onto the chart palette (data uses --chart-N). */
const CHART_COLOR: Record<string, string> = {
  "var(--primary)": "var(--chart-1)",
  "var(--success)": "var(--chart-2)",
  "var(--violet)": "var(--chart-3)",
  "var(--warning)": "var(--chart-4)",
}
const chartColor = (color: string | undefined, index: number) =>
  (color && CHART_COLOR[color]) || color || `var(--chart-${(index % 5) + 1})`

const axisLabel = (value: unknown) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? formatDay(value)
    : String(value)

type Series = { key: string; label: string; color?: string }

/** Area chart over time (Recharts): soft fills, dashed grid, hover tooltip. */
export function LineChart({
  data,
  series,
  height = 240,
  x = "date",
  fmt = (n: number) => n.toLocaleString("en-IN"),
  stacked = false,
}: {
  data: Record<string, any>[]
  series: Series[]
  height?: number
  x?: string
  fmt?: (n: number) => string
  stacked?: boolean
}) {
  const id = React.useId().replace(/:/g, "")
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      { label: s.label, color: chartColor(s.color, i) },
    ])
  )
  return (
    <ChartContainer
      config={config}
      className="aspect-auto w-full"
      style={{ height }}
    >
      <AreaChart
        data={data}
        margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`${id}-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.28}
              />
              <stop
                offset="100%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.02}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 4" />
        <XAxis
          dataKey={x}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={axisLabel}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => compact(v)}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                axisLabel(payload?.[0]?.payload?.[x])
              }
              formatter={(value, name, item) => (
                <div className="flex w-full items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-[2px]"
                    style={{ background: item.color }}
                  />
                  <span className="flex-1 text-muted-foreground">
                    {config[String(name)]?.label}
                  </span>
                  <span className="font-medium text-foreground tabular-nums">
                    {fmt(Number(value))}
                  </span>
                </div>
              )}
            />
          }
        />
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            type="monotone"
            stackId={stacked ? "total" : undefined}
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            fill={`url(#${id}-${s.key})`}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

export function Legend({ series }: { series?: any }) {
  return (
    <div className="flex flex-wrap gap-3 text-[12px]">
      {series.map((a) => (
        <span
          className="flex items-center gap-1.5 text-muted-foreground"
          key={a.key}
        >
          <span
            className="h-2 w-3 rounded-sm"
            style={{
              background: a.color,
            }}
          />
          {a.label}
        </span>
      ))}
    </div>
  )
}

export function Funnel({ steps }: { steps?: any }) {
  const a = steps[0][1]
  return (
    <div className="grid gap-2.5">
      {steps.map(([e, r], i) => {
        const o = (r / a) * 100
        const n = i ? (r / steps[i - 1][1]) * 100 : 100
        return (
          <div className="grid gap-1" key={e}>
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="font-medium">{e}</span>
              <span className="tabular-nums">
                <b className="font-semibold">{r.toLocaleString("en-IN")}</b>{" "}
                <span className="text-muted-foreground">
                  {"\xB7 "}
                  {o.toFixed(0)}%
                </span>
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-lg bg-muted">
              <div
                className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-primary to-primary/70 pr-2 text-[11px] font-semibold text-white"
                style={{
                  width: Math.max(o, 6) + "%",
                }}
              >
                {i > 0 && `${n.toFixed(0)}% from last`}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function CohortTable({ rows }: { rows?: any }) {
  const a = rows[0].ret.length
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="text-muted-foreground">
            <th className="py-2 pr-3 text-left font-medium">Joined</th>
            <th className="px-2 text-right font-medium">Users</th>
            {Array.from(
              {
                length: a,
              },
              (e, r) => (
                <th className="px-1 text-center font-medium" key={r}>
                  M{r}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.m}>
              <td className="py-1 pr-3 font-medium">
                {e.m}
                {" 2026"}
              </td>
              <td className="px-2 text-right tabular-nums">
                {e.size.toLocaleString("en-IN")}
              </td>
              {Array.from(
                {
                  length: a,
                },
                (r, i) => {
                  const o = e.ret[i]
                  return (
                    <td className="p-0.5" key={i}>
                      {o != null ? (
                        <div
                          className="flex h-8 items-center justify-center rounded-md text-[11.5px] font-semibold tabular-nums"
                          style={{
                            background: `color-mix(in oklab, var(--primary) ${Math.round(o * 0.85 /* .85 */)}%, transparent)`,
                            color: o > 55 ? "white" : "var(--foreground)",
                          }}
                        >
                          {o}%
                        </div>
                      ) : (
                        <div className="h-8 rounded-md bg-muted/40" />
                      )}
                    </td>
                  )
                }
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Share of a total (Recharts pie with a hole), legend with values and percentages. */
export function Donut({
  items,
  size = 132,
  center,
}: {
  items: [label: string, value: number, tone: string][]
  size?: number
  center?: React.ReactNode
}) {
  const total = items.reduce((sum, item) => sum + item[1], 0)
  const config: ChartConfig = Object.fromEntries(
    items.map(([label, , tone]) => [label, { label, color: `var(--${tone})` }])
  )
  const data = items.map(([label, value, tone]) => ({
    label,
    value,
    fill: `var(--${tone})`,
  }))
  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ChartContainer config={config} className="aspect-square size-full">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel nameKey="label" />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={size / 2 - 17}
              outerRadius={size / 2 - 3}
              paddingAngle={2}
              strokeWidth={0}
              cornerRadius={3}
            />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-tight">
          <span className="text-[18px] font-semibold tabular-nums">
            {center || compact(total)}
          </span>
          <span className="text-[11px] text-muted-foreground">total</span>
        </div>
      </div>
      <div className="grid flex-1 gap-2">
        {items.map(([label, value, tone]) => (
          <div key={label} className="flex items-center gap-2 text-[13px]">
            <span
              className="size-2.5 rounded-full"
              style={{ background: `var(--${tone})` }}
            />
            <span className="flex-1">{label}</span>
            <span className="font-semibold tabular-nums">
              {value.toLocaleString("en-IN")}
            </span>
            <span className="w-10 text-right text-muted-foreground tabular-nums">
              {Math.round((value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarList({
  items,
  tone = "primary",
}: {
  items?: any
  tone?: any
}) {
  const e = Math.max(...items.map((r) => r[1]))
  return (
    <div className="grid gap-1.5">
      {items.map(([r, i]) => (
        <div
          className="relative flex h-8 items-center justify-between rounded-lg px-2.5 text-[13px]"
          key={r}
        >
          <span
            className="absolute inset-y-0 left-0 rounded-lg"
            style={{
              width: (i / e) * 100 + "%",
              background: `color-mix(in oklab, var(--${tone}) 14%, transparent)`,
            }}
          />
          <span className="relative">{r}</span>
          <span className="relative font-semibold tabular-nums">
            {i.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  )
}

export function UptimeBars({ bars }: { bars?: any }) {
  return (
    <div className="flex h-7 items-stretch gap-[2px]">
      {bars.map((a, e) => (
        <span
          title={a === "ok" ? "No issues" : a === "slow" ? "Slow" : "Down"}
          className={cn(
            "flex-1 rounded-[2px]",
            a === "ok"
              ? "bg-success/70"
              : a === "slow"
                ? "bg-warning"
                : "bg-destructive"
          )}
          key={e}
        />
      ))}
    </div>
  )
}
