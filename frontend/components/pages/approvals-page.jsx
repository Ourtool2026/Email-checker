"use client";

import { LuBan, LuCheck, LuEye, LuFlag, LuScale } from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { toast } from "@/components/ui/toast";
import { approvals, currentAdmin, lawRequests, reports, users } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";

export function ApprovalsPage({ nav }) {
  let a = approvals;
  let e = (r, i) => {
    r.status = i ? "approved" : "declined";
    if (i && r.action === "Release data to police") {
      let o = lawRequests.find((n) => r.target.startsWith(n.id));
      if (o) {
        o.second = currentAdmin.name;
      }
    }
    if (i && r.action === "Delete account") {
      let o = users.find((n) => n.name === r.target);
      if (o) {
        o.status = "suspended";
      }
    }
    if (i && r.action === "Remove report") {
      let o = reports.find((n) => r.target.includes(n.id));
      if (o) {
        o.status = "Removed";
      }
    }
    logAudit(i ? `Second approval: ${r.action}` : `Declined: ${r.action}`, r.target, r.reason);
    refresh();
    toast(i ? "Approved. It goes ahead now." : "Declined. The first admin is told.");
  };
  return (
    <>
      <PageHeader
        title="Approvals"
        desc="The riskiest actions need two different admins. You can’t approve your own request."
      />
      <div className="grid gap-3">
        {a.map((r) => (
          <div
            className="bg-card flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-card"
            key={r.id}
          >
            <IconTile
              icon={
                r.action.startsWith("Release")
                  ? LuScale
                  : r.action.startsWith("Delete")
                    ? LuBan
                    : LuFlag
              }
              tone={
                r.status === "waiting" ? "warning" : r.status === "approved" ? "success" : "neutral"
              }
              size="lg"
            />
            <div className="grid min-w-0 flex-1 gap-0.5">
              <span className="text-[14px] font-semibold">
                {r.action}
                {" \xB7 "}
                <span className="font-normal">{r.target}</span>
              </span>
              <span className="text-muted-foreground text-[12.5px]">
                {"Asked by "}
                {r.by}
                {" \xB7 "}
                {r.when}
                {" \xB7 \u201C"}
                {r.reason}”
              </span>
            </div>
            {r.status !== "waiting" ? (
              <Badge tone={r.status === "approved" ? "success" : "neutral"}>
                {r.status === "approved" ? "Approved" : "Declined"}
              </Badge>
            ) : r.by === currentAdmin.name ? (
              <Badge tone="warning">Waiting for another admin</Badge>
            ) : (
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => nav.go(r.link)}>
                  <LuEye />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => e(r, false)}>
                  Decline
                </Button>
                <Button size="sm" onClick={() => e(r, true)}>
                  <LuCheck />
                  Approve
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
