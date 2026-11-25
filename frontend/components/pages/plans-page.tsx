"use client"

import { useState } from "react"
import {
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  ReceiptIcon,
  SendIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { FilterChips } from "@/components/shared/filter-chips"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { Badge, Tag } from "@/components/hq/badge"
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
import { getHostel, hostels, invoices, plans } from "@/lib/data/core"
import { taka } from "@/lib/format"
import { refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function PlansPage({ nav }: { nav?: any }) {
  const [a, e] = useState("all")
  const r = invoices.filter((o) => a === "all" || o.status === a)
  const i = invoices.reduce((o, n) => o + n.amt, 0)
  return (
    <>
      <PageHeader
        title={"Plans & billing"}
        desc="What hostels pay MyStay for the business web app. This is the only money in HQ; residents’ rent never passes through MyStay."
      />
      <Notice tone="warning" icon={TriangleAlertIcon} className="mb-4">
        Prices here are placeholders until pricing is decided.
      </Notice>
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        {plans.map((o, n) => {
          const l = hostels.filter((d) => d.plan === o.id).length
          return (
            <section
              className={cn(
                "grid content-start gap-3 rounded-2xl border bg-card p-5 shadow-card",
                n === 1 && "border-primary/40 ring-4 ring-primary/15"
              )}
              key={o.id}
            >
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-semibold">{o.id}</span>
                <Tag icon={Building2Icon}>
                  {l}
                  {" in sample"}
                </Tag>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-muted-foreground">৳</span>
                <input
                  type="number"
                  value={o.price}
                  onChange={(d) => {
                    o.price = +d.target.value
                    refresh()
                  }}
                  className="w-24 border-b border-transparent bg-transparent text-[28px] font-semibold tabular-nums outline-none hover:border-input focus:border-ring"
                  aria-label={`${o.id} price`}
                />
                <span className="text-[13px] text-muted-foreground">
                  / month
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground">{o.desc}</p>
              <ul className="grid gap-1.5 text-[13px]">
                {o.feats.map((d) => (
                  <li className="flex items-center gap-2" key={d}>
                    <CheckIcon className="size-4 text-success" />
                    {d}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            [
              "Paid plans",
              invoices.length + " hostels",
              Building2Icon,
              "primary",
            ],
            ["This month", taka(i), TrendingUpIcon, "success"],
            [
              "Failed",
              invoices.filter((o) => o.status === "Failed").length,
              TriangleAlertIcon,
              "danger",
            ],
            [
              "Due",
              invoices.filter((o) => o.status === "Due").length,
              CalendarIcon,
              "warning",
            ],
          ] as any[]
        ).map(([o, n, l, d]) => (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={o}
          >
            <IconTile icon={l} tone={d} />
            <div className="grid leading-tight">
              <span className="text-[19px] font-semibold tabular-nums">
                {n}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{o}</span>
            </div>
          </div>
        ))}
      </div>
      <Card
        flush
        icon={ReceiptIcon}
        title="Invoices · November 2026"
        actions={
          <FilterChips
            value={a}
            onChange={e}
            items={[
              ["all", "All"],
              ["Paid", "Paid"],
              ["Due", "Due"],
              ["Failed", "Failed"],
            ]}
          />
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Hostel</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {r.map((o) => {
              const n = getHostel(o.hid)
              return (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-[13px]">
                    {o.id}
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex items-center gap-2 hover:underline"
                      onClick={() => nav.hostel(n.id)}
                    >
                      <img
                        src={n.photo}
                        alt=""
                        className="size-6 rounded-md object-cover"
                      />
                      {n.name}
                    </button>
                  </TableCell>
                  <TableCell>{o.plan}</TableCell>
                  <TableCell className="tabular-nums">{taka(o.amt)}</TableCell>
                  <TableCell>{o.via}</TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        o.status === "Paid"
                          ? "success"
                          : o.status === "Due"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {o.status !== "Paid" && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() =>
                          toast(`Reminder sent to ${n.owner}`, SendIcon)
                        }
                      >
                        <SendIcon />
                        Remind
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
