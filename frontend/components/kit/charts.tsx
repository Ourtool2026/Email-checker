"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

/*
 * Charts in the studio style: pale bars with the peak (or a chosen bar) filled
 * with the brand gradient, and a soft double-ring donut.
 */

export function HighlightBarChart({
  data,
  label = "Value",
  highlight,
  height = 220,
  format,
  className,
}: {
  data: { name: string; value: number }[]
  label?: string
  /** Index to highlight; defaults to the largest value. */
  highlight?: number
  height?: number
  format?: (v: number) => string
  className?: string
}) {
  const id = React.useId().replace(/:/g, "")
  const max = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0)
  const hi = highlight ?? (data.some((d) => d.value > 0) ? max : -1)
  const config = {
    value: { label, color: "var(--primary)" },
  } satisfies ChartConfig
  return (
    <ChartContainer
      config={config}
      className={cn("w-full", className)}
      style={{ height }}
    >
      <BarChart
        data={data}
        margin={{ left: 0, right: 4, top: 8, bottom: 0 }}
        barCategoryGap="18%"
      >
        <defs>
          <linearGradient id={`hb-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.65} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 4" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-[11px]"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={format}
          className="text-[11px] tabular-nums"
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        />
        <Bar dataKey="value" radius={[10, 10, 10, 10]} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === hi ? `url(#hb-${id})` : "var(--chart-5)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/** Double-ring donut with a centered total, plus a legend grid. */
export function RingDonut({
  segments,
  total,
  totalLabel = "Total",
  size = 168,
  className,
}: {
  segments: { label: string; value: number; color: string }[]
  total?: React.ReactNode
  totalLabel?: React.ReactNode
  size?: number
  className?: string
}) {
  const sum = segments.reduce((n, s) => n + s.value, 0)
  const stroke = 14
  const r = (size - stroke) / 2 - 2
  const inner = r - stroke - 6
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--track)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={inner}
            fill="none"
            stroke="var(--track)"
            strokeOpacity={0.55}
            strokeWidth={4}
          />
          {sum > 0 &&
            segments.map((s) => {
              const len = (s.value / sum) * c
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${Math.max(len - 3, 0.01)} ${c}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += len
              return el
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[12px] text-muted-foreground">
            {totalLabel}
          </span>
          <span className="text-[22px] font-semibold tracking-tight tabular-nums">
            {total ?? sum.toLocaleString()}
          </span>
        </div>
      </div>
      <dl className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-x-5 gap-y-3">
        {segments.map((s) => (
          <div key={s.label} className="grid min-w-0 gap-0.5">
            <dt className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="truncate">{s.label}</span>
            </dt>
            <dd className="text-[17px] font-semibold tabular-nums">
              {s.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
