"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowDownRight, LuArrowUpRight } from "react-icons/lu";
import { cn } from "@/lib/utils";

function useWidth() {
  let t = useRef(null);
  let [a, e] = useState(600);
  useEffect(() => {
    if (!t.current) {
      return;
    }
    let r = new ResizeObserver((i) => e(Math.max(200, i[0].contentRect.width)));
    r.observe(t.current);
    return () => r.disconnect();
  }, []);
  return [t, a];
}

const chartMonths = [
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
];

const formatDay = (t) => `${Number(t.slice(8))} ${chartMonths[Number(t.slice(5, 7)) - 1]}`;

const niceStep = (t) => {
  let a = Math.pow(10, Math.floor(Math.log10(t || 1)));
  let e = t / a;
  return (e <= 1 ? 1 : e <= 2 ? 2 : e <= 5 ? 5 : 10) * a;
};

export const compact = (t) => {
  if (t >= 1000000 /* 1e6 */) {
    return (
      (t / 1000000) /* 1e6 */
        .toFixed(1) + "M"
    );
  }
  if (t >= 10000 /* 1e4 */) {
    return Math.round(t / 1000 /* 1e3 */) + "k";
  }
  if (t >= 1000 /* 1e3 */) {
    return (
      (t / 1000) /* 1e3 */
        .toFixed(1) + "k"
    );
  }
  return String(t);
};

export function Delta({ value, className, invert }) {
  let r = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold tabular-nums",
        (invert ? !r : r) ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {r ? <LuArrowUpRight className="size-3" /> : <LuArrowDownRight className="size-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function LineChart({
  data,
  series,
  height = 240,
  x: r = "date",
  fmt = (n) => n.toLocaleString("en-IN"),
  stacked = false,
}) {
  let [n, l] = useWidth();
  let [d, u] = useState(null);
  let s = 44;
  let m = 12;
  let f = 12;
  let h = 26;
  let B = l - s - m;
  let y = height - f - h;
  let W = (J) => series.reduce((lt, It) => lt + data[J][It.key], 0);
  let x = niceStep(
    Math.max(
      ...data.map((J, lt) => (stacked ? W(lt) : Math.max(...series.map((It) => J[It.key])))),
    ) * 1.05,
  );
  let k = (J) => s + (J / (data.length - 1)) * B;
  let N = (J) => f + y - (J / x) * y;
  let q = [0, 0.25 /* .25 */, 0.5 /* .5 */, 0.75 /* .75 */, 1].map((J) => J * x);
  let _ = Math.ceil(data.length / Math.max(2, Math.floor(B / 70)));
  let gt = data.map(() => 0);
  let P = series.map((J) => {
    let lt = gt.slice();
    let It = data.map((ue, ha) => (stacked ? (gt[ha] += ue[J.key]) : ue[J.key]));
    let me = It.map((ue, ha) => `${ha ? "L" : "M"}${k(ha).toFixed(1)} ${N(ue).toFixed(1)}`).join(
      "",
    );
    let se =
      me +
      (stacked
        ? lt
            .map(
              (ue, ha) =>
                `L${k(data.length - 1 - ha).toFixed(1)} ${N(lt[data.length - 1 - ha]).toFixed(1)}`,
            )
            .join("")
        : `L${k(data.length - 1)} ${N(0)}L${k(0)} ${N(0)}`) +
      "Z";
    return {
      s: J,
      line: me,
      area: se,
      vals: It,
    };
  });
  return (
    <div
      ref={n}
      className="relative w-full select-none"
      style={{
        height: height,
      }}
    >
      <svg
        width={l}
        height={height}
        onMouseMove={(J) => {
          let lt = J.currentTarget.getBoundingClientRect();
          let It = Math.round(((J.clientX - lt.left - s) / B) * (data.length - 1));
          u(It >= 0 && It < data.length ? It : null);
        }}
        onMouseLeave={() => u(null)}
        className="block"
      >
        <defs>
          {series.map((J) => (
            <linearGradient id={`g-${J.key}`} x1="0" y1="0" x2="0" y2="1" key={J.key}>
              <stop offset="0%" stopColor={J.color} stopOpacity=".28" />
              <stop offset="100%" stopColor={J.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {q.map((J) => (
          <g key={J}>
            <line
              x1={s}
              x2={l - m}
              y1={N(J)}
              y2={N(J)}
              stroke="var(--border)"
              strokeDasharray={J ? "3 4" : ""}
            />
            <text
              x={s - 8}
              y={N(J) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--muted-foreground)"
            >
              {compact(Math.round(J))}
            </text>
          </g>
        ))}
        {data.map(
          (J, lt) =>
            lt % _ === 0 && (
              <text
                x={k(lt)}
                y={height - 6}
                textAnchor="middle"
                fontSize="11"
                fill="var(--muted-foreground)"
                key={lt}
              >
                {formatDay(J[r])}
              </text>
            ),
        )}
        {P.slice()
          .reverse()
          .map((J) => (
            <g key={J.s.key}>
              <path
                d={J.area}
                fill={stacked ? J.s.color : `url(#g-${J.s.key})`}
                fillOpacity={stacked ? 0.22 /* .22 */ : 1}
              />
              <path
                d={J.line}
                fill="none"
                stroke={J.s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeDasharray={J.s.dash ? "4 4" : ""}
              />
            </g>
          ))}
        {d != null && (
          <g>
            <line
              x1={k(d)}
              x2={k(d)}
              y1={f}
              y2={f + y}
              stroke="var(--muted-foreground)"
              strokeOpacity=".5"
            />
            {P.map((J) => (
              <circle
                cx={k(d)}
                cy={N(J.vals[d])}
                r="4"
                fill="var(--card)"
                stroke={J.s.color}
                strokeWidth="2"
                key={J.s.key}
              />
            ))}
          </g>
        )}
      </svg>
      {d != null && (
        <div
          className="bg-popover pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-xl border px-3 py-2 text-[12px] shadow-float"
          style={{
            left: Math.min(Math.max(k(d) + 12, 0), l - 170),
          }}
        >
          <div className="mb-1 font-semibold">{formatDay(data[d][r])}</div>
          {series.map((J) => (
            <div className="flex items-center justify-between gap-4" key={J.key}>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{
                    background: J.color,
                  }}
                />
                {J.label}
              </span>
              <span className="font-semibold tabular-nums">{fmt(data[d][J.key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Legend({ series }) {
  return (
    <div className="flex flex-wrap gap-3 text-[12px]">
      {series.map((a) => (
        <span className="text-muted-foreground flex items-center gap-1.5" key={a.key}>
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
  );
}

export function Funnel({ steps }) {
  let a = steps[0][1];
  return (
    <div className="grid gap-2.5">
      {steps.map(([e, r], i) => {
        let o = (r / a) * 100;
        let n = i ? (r / steps[i - 1][1]) * 100 : 100;
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
            <div className="bg-muted h-7 overflow-hidden rounded-lg">
              <div
                className="from-primary to-primary/70 flex h-full items-center justify-end rounded-lg bg-gradient-to-r pr-2 text-[11px] font-semibold text-white"
                style={{
                  width: Math.max(o, 6) + "%",
                }}
              >
                {i > 0 && `${n.toFixed(0)}% from last`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CohortTable({ rows }) {
  let a = rows[0].ret.length;
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
              ),
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
              <td className="px-2 text-right tabular-nums">{e.size.toLocaleString("en-IN")}</td>
              {Array.from(
                {
                  length: a,
                },
                (r, i) => {
                  let o = e.ret[i];
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
                        <div className="bg-muted/40 h-8 rounded-md" />
                      )}
                    </td>
                  );
                },
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Donut({ items, size = 132, center }) {
  let r = items.reduce((l, d) => l + d[1], 0);
  let i = size / 2 - 10;
  let o = 2 * Math.PI * i;
  let n = 0;
  return (
    <div className="flex items-center gap-5">
      <div
        className="relative shrink-0"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg width={size} height={size} className="-rotate-90">
          {items.map(([l, d, u]) => {
            let s = (d / r) * o;
            let m = (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={i}
                fill="none"
                stroke={`var(--${u})`}
                strokeWidth="14"
                strokeDasharray={`${Math.max(s - 3, 1)} ${o}`}
                strokeDashoffset={-n}
                key={l}
              />
            );
            n += s;
            return m;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
          <span className="text-[18px] font-semibold tabular-nums">{center || compact(r)}</span>
          <span className="text-muted-foreground text-[11px]">total</span>
        </div>
      </div>
      <div className="grid flex-1 gap-2">
        {items.map(([l, d, u]) => (
          <div className="flex items-center gap-2 text-[13px]" key={l}>
            <span
              className="size-2.5 rounded-full"
              style={{
                background: `var(--${u})`,
              }}
            />
            <span className="flex-1">{l}</span>
            <span className="font-semibold tabular-nums">{d.toLocaleString("en-IN")}</span>
            <span className="text-muted-foreground w-10 text-right tabular-nums">
              {Math.round((d / r) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarList({ items, tone = "primary" }) {
  let e = Math.max(...items.map((r) => r[1]));
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
          <span className="relative font-semibold tabular-nums">{i.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

export function UptimeBars({ bars }) {
  return (
    <div className="flex h-7 items-stretch gap-[2px]">
      {bars.map((a, e) => (
        <span
          title={a === "ok" ? "No issues" : a === "slow" ? "Slow" : "Down"}
          className={cn(
            "flex-1 rounded-[2px]",
            a === "ok" ? "bg-success/70" : a === "slow" ? "bg-warning" : "bg-destructive",
          )}
          key={e}
        />
      ))}
    </div>
  );
}
