"use client"

import {
  BellOffIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  ClockIcon,
  FileTextIcon,
  HouseIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { IconTile } from "@/components/hq/icon-tile"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import { totals, users } from "@/lib/data/core"
import { freshness, rentals } from "@/lib/data/ops"
import { num } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"

export function LandlordsPage({ nav }: { nav?: any }) {
  const a = users.filter((r) => r.type === "landlord")
  const e = [
    "Verified",
    "Waiting",
    "Verified",
    "Verified",
    "Missing",
    "Verified",
    "Waiting",
    "Verified",
  ]
  return (
    <>
      <PageHeader
        title={"Landlords & flats"}
        desc={`Landlords list flats in the MyStay ID app for verified tenants. ${num(totals.landlords)} landlords, ${num(totals.flats)} flats.`}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Flats listed", num(totals.flats), HouseIcon, "primary"],
          [
            "Ownership papers waiting",
            e.filter((r) => r === "Waiting").length,
            FileTextIcon,
            "warning",
          ],
          ["Flats rented to students this term", "214", UsersIcon, "success"],
        ].map(([r, i, o, n]) => (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={r}
          >
            <IconTile icon={o} tone={n} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">
                {i}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{r}</span>
            </div>
          </div>
        ))}
      </div>
      <Card flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Landlord</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Flats</TableHead>
              <TableHead>Ownership papers</TableHead>
              <TableHead>Tenants</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {a.map((r, i) => (
              <TableRow onClick={() => nav.user(r.id)} key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} photo={r.photo} size={34} />
                    <div className="grid leading-tight">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {r.nid ? "NID verified" : "NID being checked"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{r.area}</TableCell>
                <TableCell className="tabular-nums">{r.org}</TableCell>
                <TableCell>
                  <Badge
                    tone={
                      e[i] === "Verified"
                        ? "success"
                        : e[i] === "Waiting"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {e[i]}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">
                  {((i * 3) % 7) + 1}
                  {" verified"}
                </TableCell>
                <TableCell onClick={(o) => o.stopPropagation()}>
                  {e[i] === "Waiting" ? (
                    <Button
                      size="xs"
                      onClick={() => {
                        e[i] = "Verified"
                        logAudit(
                          "Verified ownership papers",
                          r.name,
                          "Holding tax receipt"
                        )
                        refresh()
                        toast(`${r.name}'s flats can go live`)
                      }}
                    >
                      <CheckIcon />
                      Verify papers
                    </Button>
                  ) : (
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}

const rentalStatus: Record<string, any> = {
  rented: ["Rented", "primary"],
  reserved: ["Reserved", "warning"],
  off: ["Paused \xB7 no reply", "neutral"],
  live: ["Back in search", "success"],
  notice: ["Tenant leaving", "neutral"],
}

export function FreshnessCard() {
  const t = freshness
  return (
    <Card
      icon={SparklesIcon}
      title="Search stays fresh"
      description="A home leaves search the moment it is no longer free, so tenants never chase a flat that is gone."
      className="mt-4"
    >
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Live in search", num(t.live), "primary", SearchIcon],
          [
            "Rented and removed (7 days)",
            t.rentedWeek,
            "success",
            CircleCheckIcon,
          ],
          ["Hidden while reserved", t.reserved, "warning", ClockIcon],
          ["Paused: no reply to 14-day check", t.stale, "neutral", BellOffIcon],
        ].map(([a, e, r, i]) => (
          <div
            className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3"
            key={a}
          >
            <IconTile icon={i} tone={r} />
            <div className="grid leading-tight">
              <span className="text-[18px] font-semibold tabular-nums">
                {e}
              </span>
              <span className="text-[12px] text-muted-foreground">{a}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Home</TableHead>
                <TableHead>Landlord</TableHead>
                <TableHead>Why it left search</TableHead>
                <TableHead>Now</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="grid leading-tight">
                      <span className="font-medium">{a.title}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {a.area}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{a.by}</TableCell>
                  <TableCell className="text-[13px]">{a.why}</TableCell>
                  <TableCell>
                    <Badge
                      tone={(rentalStatus[a.status] || rentalStatus.off)[1]}
                    >
                      {(rentalStatus[a.status] || rentalStatus.off)[0]}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {a.when}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid content-start gap-2 text-[13px]">
          {[
            [
              "Agreement signed by both",
              "Removed at once. Other requests close and visitors are told.",
            ],
            [
              "Landlord accepts a tenant",
              "Hidden while they sign. Back by itself after 72 hours if nobody signs.",
            ],
            [
              "Rented outside MyStay",
              "Landlord taps \u201CMark as rented\u201D. Removed at once.",
            ],
            [
              "Every 14 days",
              "We ask the landlord \u201CStill free?\u201D. No answer in 7 days pauses it.",
            ],
            [
              "Tenant gives notice",
              "Landlord can re-list with the free date. It shows as a new listing.",
            ],
          ].map(([a, e]) => (
            <div className="flex gap-2.5 rounded-xl border p-3" key={a}>
              <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="grid leading-snug">
                <b className="font-semibold">{a}</b>
                <span className="text-muted-foreground">{e}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
