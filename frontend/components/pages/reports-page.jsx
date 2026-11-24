"use client";

import { useState } from "react";
import {
  LuCheck,
  LuChevronRight,
  LuFlag,
  LuScale,
  LuShieldCheck,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import { FilterChips } from "@/components/shared/filter-chips";
import { Notice } from "@/components/shared/notice";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { approvals, currentAdmin, getHostel, getUser, reports } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";

const reportStatusTones = {
  Disputed: "warning",
  Active: "primary",
  "Waiting for reply": "neutral",
  "HQ review": "violet",
  Faded: "neutral",
  Removed: "danger",
  Kept: "primary",
};

export function ReportsPage({ nav }) {
  let [a, e] = useState("open");
  let [r, i] = useState(null);
  let [o, n] = useState("");
  let l = (h) => !["Faded", "Removed", "Kept"].includes(h.status) || h.status === "Active";
  let d = reports.filter(
    (h) =>
      a === "all" || (a === "open" ? !["Faded", "Removed"].includes(h.status) : h.status === a),
  );
  let u = r && reports.find((h) => h.id === r);
  let s = u && getUser(u.uid);
  let m = u && getHostel(u.by);
  let f = (h, B) => {
    u.status = h;
    if (u.lab && window.MS) {
      window.MS.emit("report.decided", {
        id: u.id,
        status: h,
      });
    }
    logAudit(`Report: ${h.toLowerCase()}`, s.name, o || u.type);
    n("");
    i(null);
    refresh();
    toast(B);
  };
  return (
    <>
      <PageHeader
        title={"Reports & disputes"}
        desc="Reports hostels and landlords file against residents. Each has proof, a 14-day reply window and a fixed type. HQ steps in on disputes and serious cases."
      />
      <FilterChips
        value={a}
        onChange={e}
        items={[
          ["open", "Open", reports.filter((h) => !["Faded", "Removed"].includes(h.status)).length],
          ["Disputed", "Disputed", reports.filter((h) => h.status === "Disputed").length],
          ["HQ review", "HQ review", reports.filter((h) => h.status === "HQ review").length],
          ["all", "All"],
        ]}
      />
      <Card flush className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>About</TableHead>
              <TableHead>Filed by</TableHead>
              <TableHead>Filed</TableHead>
              <TableHead>Reply window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {d.map((h) => {
              let B = getUser(h.uid);
              let y = getHostel(h.by);
              return (
                <TableRow
                  onClick={() => {
                    i(h.id);
                    n("");
                  }}
                  key={h.id}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <IconTile
                        icon={h.type.startsWith("Violence") ? LuTriangleAlert : LuFlag}
                        tone={h.type.startsWith("Violence") ? "danger" : "warning"}
                        size="sm"
                      />
                      <span className="font-medium">{h.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={B.name} photo={B.photo} size={26} />
                      {B.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={y.photo} alt="" className="size-6 rounded-md object-cover" />
                      <span className="max-w-[160px] truncate">{y.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{h.filed}</TableCell>
                  <TableCell>
                    {h.left > 0 ? (
                      <div className="grid w-24 gap-1">
                        <span className="text-[12px] tabular-nums">
                          {h.left}
                          {" days left"}
                        </span>
                        <Progress value={((14 - h.left) / 14) * 100} tone="warning" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Closed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge tone={reportStatusTones[h.status]}>{h.status}</Badge>
                  </TableCell>
                  <TableCell className="w-8">
                    <LuChevronRight className="text-muted-foreground size-4" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      {u && (
        <Sheet open onClose={() => i(null)} width="sm:max-w-[520px]">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <Badge tone={reportStatusTones[u.status]}>{u.status}</Badge>
              <span className="text-muted-foreground text-[12.5px]">
                {"Report "}
                {u.id.toUpperCase()}
                {" \xB7 filed "}
                {u.filed}
              </span>
            </div>
            <h2 className="mt-2 text-[18px] font-semibold tracking-tight">{u.type}</h2>
          </div>
          <div className="grid flex-1 content-start gap-4 overflow-auto p-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => nav.user(s.id)}
                className="hover:bg-muted/50 flex items-center gap-2.5 rounded-xl border p-2.5 text-left"
              >
                <Avatar name={s.name} photo={s.photo} size={34} />
                <span className="grid leading-tight">
                  <span className="text-muted-foreground text-[11.5px]">About</span>
                  <span className="text-[13px] font-medium">{s.name}</span>
                </span>
              </button>
              <button
                onClick={() => nav.hostel(m.id)}
                className="hover:bg-muted/50 flex items-center gap-2.5 rounded-xl border p-2.5 text-left"
              >
                <img src={m.photo} alt="" className="size-[34px] rounded-lg object-cover" />
                <span className="grid min-w-0 leading-tight">
                  <span className="text-muted-foreground text-[11.5px]">Filed by</span>
                  <span className="truncate text-[13px] font-medium">{m.name}</span>
                </span>
              </button>
            </div>
            <div className="grid gap-1.5">
              <span className="text-muted-foreground text-[12.5px] font-medium">
                Proof from the hostel
              </span>
              <div className="rounded-xl border p-3.5 text-[13.5px]">{u.proof}</div>
            </div>
            <div className="grid gap-1.5">
              <span className="text-muted-foreground text-[12.5px] font-medium">Their reply</span>
              {u.reply ? (
                <div className="border-primary/25 bg-primary/[0.04] rounded-xl border p-3.5 text-[13.5px]">
                  “{u.reply}”
                </div>
              ) : (
                <div className="text-muted-foreground rounded-xl border border-dashed p-3.5 text-[13px]">
                  {u.left ? `No reply yet \xB7 ${u.left} days left` : "No reply was sent"}
                </div>
              )}
            </div>
            <Notice icon={LuShieldCheck}>
              Other owners only see the type and year. A report fades after 2 years unless a police
              case backs it.
            </Notice>
            <Field label="Note for the record">
              <Textarea
                rows={2}
                value={o}
                onChange={(h) => n(h.target.value)}
                placeholder="Why you decided this"
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
            <Button size="sm" onClick={() => f("Kept", "Report kept. Both sides are told.")}>
              <LuCheck />
              Keep report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                f("Disputed", "Marked disputed. Owners see \u201Cdisputed\u201D next to it.")
              }
            >
              <LuScale />
              Mark disputed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                approvals.unshift({
                  id: "ap" + Date.now(),
                  action: "Remove report",
                  target: `Report ${u.id} \xB7 ${u.type}`,
                  by: currentAdmin.name,
                  reason: o || "\u2014",
                  when: "Just now",
                  status: "waiting",
                  link: "reports",
                  mine: true,
                });
                logAudit("Asked to remove report", s.name, o || "\u2014");
                i(null);
                refresh();
                toast("Sent for a second approval");
              }}
            >
              <LuX />
              Remove…
            </Button>
            <Button size="sm" variant="ghost" onClick={() => f("Faded", "Report faded early")}>
              Fade early
            </Button>
          </div>
        </Sheet>
      )}
    </>
  );
}
