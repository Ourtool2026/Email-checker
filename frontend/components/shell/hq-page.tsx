"use client"

import { PageLevel, useAccess } from "@/components/shell/access-context"
import { useHQ } from "@/components/shell/hq-context"
import { NoAccess } from "@/components/shell/no-access"
import { pageComponents } from "@/components/shell/page-registry"
import { useRerender } from "@/lib/store"

/** Renders one HQ page by id with the shared shell state, within the access of the person on screen. */
export function HQPage({ id }: { id: string }) {
  useRerender()
  const hq = useHQ()
  const access = useAccess()
  const Page = pageComponents[id]
  if (!hq || !Page) return null
  if (access && access.levelFor(id) === "none") return <NoAccess page={id} />
  return (
    <PageLevel page={id}>
      <Page
        key={access?.subject.id}
        nav={hq.nav}
        q={hq.q}
        setQ={hq.setQ}
        range={hq.range}
        setRange={hq.setRange}
      />
    </PageLevel>
  )
}
