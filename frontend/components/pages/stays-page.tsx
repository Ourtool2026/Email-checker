"use client"

import { useState } from "react"
import { CheckIcon, PencilIcon } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Badge, Tag } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { Field, Input } from "@/components/hq/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import { getHostel, getUser, stays } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"

export function StaysPage({ nav }: { nav?: any }) {
  const [a, e] = useState(null)
  const [r, i] = useState("")
  return (
    <>
      <PageHeader
        title="Stay records"
        desc="Every move-in and move-out. These build each person’s stay history and Stay Level, so a wrong record matters. Fixes keep the old value."
      />
      <Card flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Person</TableHead>
              <TableHead>Hostel</TableHead>
              <TableHead>Moved in</TableHead>
              <TableHead>Moved out</TableHead>
              <TableHead>How</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {stays.map((o) => {
              const n = getUser(o.uid)
              const l = getHostel(o.hid)
              return (
                <TableRow key={o.id}>
                  <TableCell>
                    <button
                      className="flex items-center gap-2.5 text-left"
                      onClick={() => nav.user(n.id)}
                    >
                      <Avatar name={n.name} photo={n.photo} size={28} />
                      <span className="font-medium hover:underline">
                        {n.name}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex items-center gap-2 text-left hover:underline"
                      onClick={() => nav.hostel(l.id)}
                    >
                      <img
                        src={l.photo}
                        alt=""
                        className="size-6 rounded-md object-cover"
                      />
                      {l.name}
                    </button>
                  </TableCell>
                  <TableCell>{o.in}</TableCell>
                  <TableCell>
                    {o.out || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {o.via}
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        o.status === "Disputed"
                          ? "warning"
                          : o.status === "Living here"
                            ? "success"
                            : "neutral"
                      }
                    >
                      {o.status}
                    </Badge>
                    {o.fixed && (
                      <Tag className="ml-1.5" icon={PencilIcon}>
                        Fixed
                      </Tag>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        e(o)
                        i("")
                      }}
                    >
                      <PencilIcon />
                      Fix
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={!!a}
        onClose={() => e(null)}
        title="Fix this stay record"
        description="The old dates stay in the history. Both the person and the hostel are told."
        footer={
          <>
            <Button variant="outline" onClick={() => e(null)}>
              Cancel
            </Button>
            <Button
              disabled={!r.trim()}
              onClick={() => {
                a.fixed = true
                if (a.status === "Disputed") {
                  a.status = "Living here"
                }
                logAudit("Fixed stay record", getUser(a.uid).name, r)
                e(null)
                refresh()
                toast("Record fixed. Old value kept.")
              }}
            >
              <CheckIcon />
              Save fix
            </Button>
          </>
        }
      >
        {a && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Moved in">
                <Input defaultValue={a.in} />
              </Field>
              <Field label="Moved out">
                <Input defaultValue={a.out} placeholder="Still living there" />
              </Field>
            </div>
            <Field label="Reason">
              <Input
                value={r}
                onChange={(o) => i(o.target.value)}
                placeholder="e.g. Hostel scanned her in a week late"
              />
            </Field>
          </>
        )}
      </Dialog>
    </>
  )
}
