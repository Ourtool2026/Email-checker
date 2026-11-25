"use client"

import { useState } from "react"
import { ActionButton } from "@/components/hq/gate"
import {
  CheckIcon,
  CircleCheckIcon,
  ClipboardListIcon,
  EyeIcon,
  FlameIcon,
  ImageIcon,
  ReceiptIcon,
  TriangleAlertIcon,
  Undo2Icon,
  XIcon,
} from "lucide-react"
import { FreshnessCard } from "@/components/pages/landlords-page"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { EmptyState } from "@/components/hq/empty-state"
import { Input } from "@/components/hq/input"
import { toast } from "@/components/hq/toast"
import { getHostel, getUser, listingReviews } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ListingsPage({ nav }: { nav?: any }) {
  const [a, e] = useState({})
  const r = listingReviews.filter((n) => !n.done)
  const i: any[] = [
    ["photos", "Real photos, no stock images", ImageIcon],
    ["prices", "Prices within 15% of the area", ReceiptIcon],
    ["rules", "House rules are fair", ClipboardListIcon],
    ["fire", "Fire exit and extinguisher shown", FlameIcon],
  ]
  const o = (n?, l?) => {
    n.done = l
    if (n.lab && window.MS) {
      window.MS.emit("listing.decided", {
        id: n.id,
        d: l,
        why: a[n.id] || "",
      })
    }
    if (n.hid && l === "approved") {
      const d = getHostel(n.hid)
      if (d.status === "pending") {
        d.status = "live"
      }
    }
    logAudit(
      l === "approved"
        ? "Approved listing"
        : l === "back"
          ? "Sent listing back"
          : "Rejected listing",
      n.title,
      a[n.id] || "\u2014"
    )
    refresh()
    toast(
      l === "approved"
        ? `${n.title} is live in the app`
        : "Owner is told what to fix"
    )
  }
  return (
    <>
      <PageHeader
        title="Listing review"
        desc="New and changed listings from hostels and landlords wait here before they show in the MyStay ID app."
      >
        <Badge tone="primary">
          {r.length}
          {" waiting"}
        </Badge>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        {r.map((n) => {
          const l = n.hid && getHostel(n.hid)
          const d = n.uid && getUser(n.uid)
          const u = i.filter((s) => !n.checks[s[0]])
          return (
            <article
              className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card sm:flex-row"
              key={n.id}
            >
              <img
                src={n.photo}
                alt=""
                className="h-40 w-full object-cover sm:h-auto sm:w-44"
              />
              <div className="grid flex-1 gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid leading-tight">
                    <span className="text-[14.5px] font-semibold">
                      {n.title}
                    </span>
                    <span className="text-[12.5px] text-muted-foreground">
                      {l ? l.owner : d.name}
                      {" \xB7 "}
                      {n.when}
                    </span>
                  </div>
                  <Badge
                    tone={n.kind.startsWith("New") ? "primary" : "warning"}
                    dot={false}
                  >
                    {n.kind}
                  </Badge>
                </div>
                <p className="text-[13px]">{n.change}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {i.map(([s, m, f]) => (
                    <ActionButton right="approve_listing"
                      onClick={() => {
                        n.checks[s] = !n.checks[s]
                        refresh()
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[12px]",
                        n.checks[s]
                          ? "text-foreground"
                          : "border-warning/40 bg-warning/[0.06] text-warning"
                      )}
                      key={s}
                    >
                      {n.checks[s] ? (
                        <CircleCheckIcon className="size-3.5 shrink-0 text-success" />
                      ) : (
                        <TriangleAlertIcon className="size-3.5 shrink-0" />
                      )}
                      {m}
                    </ActionButton>
                  ))}
                </div>
                {u.length > 0 && (
                  <Input
                    className="h-8"
                    placeholder={`Note to owner: ${u[0][1].toLowerCase()}`}
                    value={a[n.id] || ""}
                    onChange={(s) =>
                      e({
                        ...a,
                        [n.id]: s.target.value,
                      })
                    }
                  />
                )}
                <div className="flex flex-wrap justify-end gap-1.5">
                  {l && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => nav.hostel(l.id)}
                    >
                      <EyeIcon />
                      Hostel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => o(n, "rejected")}
                  >
                    <XIcon />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => o(n, "back")}
                  >
                    <Undo2Icon />
                    Send back
                  </Button>
                  <Button
                    size="sm"
                    disabled={u.length > 0}
                    onClick={() => o(n, "approved")}
                  >
                    <CheckIcon />
                    Approve
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {!r.length && (
        <Card>
          <EmptyState
            icon={CircleCheckIcon}
            title="Nothing to review"
            text="New listings show here first."
          />
        </Card>
      )}
      <FreshnessCard />
    </>
  )
}
