import { useEffect, useState } from "react"
import { toast } from "@/components/hq/toast"
import { auditLog, currentAdmin } from "@/lib/data/core"

// The sample data lives in plain mutable arrays. After changing it, call
// refresh() so every subscribed component re-renders.

// The sample data lives in plain mutable arrays. After changing it, call
// refresh() so every subscribed component re-renders.
const listeners = new Set<() => void>()

export const useRerender = () => {
  const [, setTick] = useState(0)
  useEffect(() => {
    const listener = () => setTick((tick) => tick + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])
}

export const refresh = () => listeners.forEach((listener) => listener())

export const copyText = (t?, a?) => {
  try {
    navigator.clipboard.writeText(t).then(
      () => toast(a),
      () => toast(a)
    )
  } catch {
    toast(a)
  }
}

export const logAudit = (t?, a?, e?) => {
  auditLog.unshift({
    id: "a" + Date.now() + Math.random(),
    when: "Just now",
    by: currentAdmin.name,
    act: t,
    target: a,
    why: e,
  })
}
