"use client"

import {
  CircleCheckIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  PauseIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react"
import { Notice } from "@/components/shared/notice"
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
import { getUser, privacyRequests } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"

export function PrivacyPage({ nav }: { nav?: any }) {
  const a = {
    "Waiting for approval": "warning",
    "Ready to send": "primary",
    "On hold (police case)": "danger",
    Done: "success",
  }
  return (
    <>
      <PageHeader
        title="Privacy requests"
        desc="People can ask for a copy of their data, to fix it, or to delete their account. We answer within 30 days."
      />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(
          [
            [
              "Open",
              privacyRequests.filter((e) => e.status !== "Done").length,
              FileTextIcon,
              "primary",
            ],
            ["Due this week", 0, ClockIcon, "warning"],
            ["Answered on time (90 d)", "100%", CircleCheckIcon, "success"],
            ["On hold for police", 1, PauseIcon, "danger"],
          ] as any[]
        ).map(([e, r, i, o]) => (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={e}
          >
            <IconTile icon={i} tone={o} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">
                {r}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{e}</span>
            </div>
          </div>
        ))}
      </div>
      <Card flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead>Person</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {privacyRequests.map((e) => {
              const r = getUser(e.uid)
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-[13px]">
                    {e.id}
                  </TableCell>
                  <TableCell>
                    <button
                      className="flex items-center gap-2 hover:underline"
                      onClick={() => nav.user(r.id)}
                    >
                      <Avatar name={r.name} photo={r.photo} size={24} />
                      {r.name}
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      {e.type.startsWith("Delete") ? (
                        <Trash2Icon className="size-4 text-destructive" />
                      ) : e.type.startsWith("Copy") ? (
                        <DownloadIcon className="size-4 text-primary" />
                      ) : (
                        <PencilIcon className="size-4 text-muted-foreground" />
                      )}
                      {e.type}
                    </span>
                    <div className="text-[12px] text-muted-foreground">
                      {e.note}
                    </div>
                  </TableCell>
                  <TableCell>{e.got}</TableCell>
                  <TableCell>{e.due}</TableCell>
                  <TableCell>
                    <Badge tone={a[e.status]}>{e.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {e.status === "Ready to send" && (
                      <Button
                        size="xs"
                        onClick={() => {
                          e.status = "Done"
                          logAudit("Sent data copy", r.name, e.id)
                          refresh()
                          toast(
                            "Secure download link sent. It expires in 7 days."
                          )
                        }}
                      >
                        <SendIcon />
                        Send
                      </Button>
                    )}
                    {e.status === "Waiting for approval" && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => nav.go("approvals")}
                      >
                        Approvals
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      <Notice className="mt-4">
        Accounts linked to an open police case can’t be deleted until the case
        closes. The person is told this.
      </Notice>
    </>
  )
}
