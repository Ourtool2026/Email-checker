import { dailyMetrics } from "@/lib/data/core"

export const sumBy = (t?, a?) => t.reduce((e, r) => e + r[a], 0)

export const pctChange = (t?, a?) => (a ? ((t - a) / a) * 100 : 0)

export function rangeSlices(t?) {
  const a = t === "7d" ? 7 : t === "30d" ? 30 : 90
  return [
    dailyMetrics.slice(-a),
    dailyMetrics.slice(-2 * a, -a).length
      ? dailyMetrics.slice(-2 * a, -a)
      : dailyMetrics.slice(0, a),
  ]
}
