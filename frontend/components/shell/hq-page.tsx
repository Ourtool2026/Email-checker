"use client"

import { useHQ } from "@/components/shell/hq-context"
import { pageComponents } from "@/components/shell/page-registry"
import { useRerender } from "@/lib/store"

/** Renders one HQ page by id with the shared shell state. */
export function HQPage({ id }: { id: string }) {
  useRerender()
  const hq = useHQ()
  const Page = pageComponents[id]
  if (!hq || !Page) return null
  return (
    <Page
      nav={hq.nav}
      q={hq.q}
      setQ={hq.setQ}
      range={hq.range}
      setRange={hq.setRange}
    />
  )
}
