"use client";

import {
  LuCircleCheck,
  LuClock,
  LuDownload,
  LuFileText,
  LuPause,
  LuPencil,
  LuSend,
  LuTrash2,
} from "react-icons/lu";
import { Notice } from "@/components/shared/notice";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { getUser, privacyRequests } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";

export function PrivacyPage({ nav }) {
  let a = {
    "Waiting for approval": "warning",
    "Ready to send": "primary",
    "On hold (police case)": "danger",
    Done: "success",
  };
  return (
    <>
      <PageHeader
        title="Privacy requests"
        desc="People can ask for a copy of their data, to fix it, or to delete their account. We answer within 30 days."
      />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [
            "Open",
            privacyRequests.filter((e) => e.status !== "Done").length,
            LuFileText,
            "primary",
          ],
          ["Due this week", 0, LuClock, "warning"],
          ["Answered on time (90 d)", "100%", LuCircleCheck, "success"],
          ["On hold for police", 1, LuPause, "danger"],
        ].map(([e, r, i, o]) => (
          <div
            className="bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-card"
            key={e}
          >
            <IconTile icon={i} tone={o} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">{r}</span>
              <span className="text-muted-foreground text-[12.5px]">{e}</span>
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
              let r = getUser(e.uid);
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-[13px]">{e.id}</TableCell>
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
                        <LuTrash2 className="text-destructive size-4" />
                      ) : e.type.startsWith("Copy") ? (
                        <LuDownload className="text-primary size-4" />
                      ) : (
                        <LuPencil className="text-muted-foreground size-4" />
                      )}
                      {e.type}
                    </span>
                    <div className="text-muted-foreground text-[12px]">{e.note}</div>
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
                          e.status = "Done";
                          logAudit("Sent data copy", r.name, e.id);
                          refresh();
                          toast("Secure download link sent. It expires in 7 days.");
                        }}
                      >
                        <LuSend />
                        Send
                      </Button>
                    )}
                    {e.status === "Waiting for approval" && (
                      <Button size="xs" variant="outline" onClick={() => nav.go("approvals")}>
                        Approvals
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      <Notice className="mt-4">
        Accounts linked to an open police case can’t be deleted until the case closes. The person is
        told this.
      </Notice>
    </>
  );
}
