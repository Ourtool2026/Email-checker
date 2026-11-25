"use client"

import { LockIcon } from "lucide-react"

import { useAccess } from "@/components/shell/access-context"
import { useHQ } from "@/components/shell/hq-context"
import { pageById, pages } from "@/components/shell/nav"
import { EmptyState } from "@/components/page/empty-state"
import { Button } from "@/components/ui/button"
import { departments } from "@/lib/data/access"
import { grantersFor } from "@/lib/access"

/** Shown instead of a page the person on screen can't open. */
export function NoAccess({ page }: { page: string }) {
  const access = useAccess()
  const hq = useHQ()
  if (!access || !hq) return null
  const first = access.subject.name.split(" ")[0]
  const owners = departments
    .filter((d) => d.pages.includes(page))
    .map((d) => d.name)
  const granters = grantersFor(page).map((a) => a.name)
  const home = pages.find((p) => access.levelFor(p.id) !== "none")
  return (
    <div className="rounded-3xl border border-surface-border bg-surface p-1.5 shadow-card">
      <div className="rounded-2xl border border-border/60 bg-card shadow-card">
        <EmptyState
          icon={LockIcon}
          title={`${first} can't open ${pageById[page]?.title ?? "this page"}`}
          description={
            <>
              {owners.length ? `It belongs to ${owners.join(" and ")}. ` : ""}
              {granters.join(" or ")} can give {first} access.
            </>
          }
        >
          {home && (
            <Button variant="outline" onClick={() => hq.nav.go(home.id)}>
              Go to {home.title}
            </Button>
          )}
        </EmptyState>
      </div>
    </div>
  )
}
