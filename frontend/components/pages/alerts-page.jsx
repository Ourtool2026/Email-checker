"use client";

import { useState } from "react";
import {
  LuFlag,
  LuLock,
  LuMessageSquare,
  LuScanFace,
  LuShieldCheck,
  LuSmartphone,
  LuTriangleAlert,
  LuUsers,
} from "react-icons/lu";
import { FilterChips } from "@/components/shared/filter-chips";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconTile } from "@/components/ui/icon-tile";
import { toast } from "@/components/ui/toast";
import { getUser, safetyAlerts } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

const alertSeverity = {
  high: ["High", "danger"],
  med: ["Medium", "warning"],
  low: ["Low", "neutral"],
};

const alertIcons = {
  "Face did not match at the gate": LuScanFace,
  "Reported by 3 hostels in 60 days": LuFlag,
  "9 failed Living ID scans in 10 minutes": LuSmartphone,
  "5 new accounts from one phone": LuUsers,
};

export function AlertsPage({ nav }) {
  let [a, e] = useState("open");
  let r = safetyAlerts.filter((o) => a === "all" || o.open);
  let i = (o, n, l) => {
    o.open = false;
    o.done = n;
    logAudit(n, o.kind, o.where);
    refresh();
    toast(l);
  };
  return (
    <>
      <PageHeader
        title="Safety alerts"
        desc="Things the system flags across all hostels and the app: face mismatches, repeat reports, failed scans and fake sign-ups."
      >
        <FilterChips
          value={a}
          onChange={e}
          items={[
            ["open", "Open", safetyAlerts.filter((o) => o.open).length],
            ["all", "All", safetyAlerts.length],
          ]}
        />
      </PageHeader>
      <div className="grid gap-3">
        {r.map((o) => {
          let n = getUser(o.who);
          return (
            <div
              className={cn(
                "bg-card flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-card",
                o.open && o.sev === "high" && "border-destructive/30",
              )}
              key={o.id}
            >
              <IconTile
                icon={alertIcons[o.kind] || LuTriangleAlert}
                tone={alertSeverity[o.sev][1]}
                size="lg"
              />
              <div className="grid min-w-0 flex-1 gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold">{o.kind}</span>
                  <Badge tone={alertSeverity[o.sev][1]}>{alertSeverity[o.sev][0]}</Badge>
                  {!o.open && <Badge>{o.done || "Reviewed"}</Badge>}
                </div>
                <span className="text-muted-foreground text-[12.5px]">
                  {n ? (
                    <button
                      className="text-primary font-medium hover:underline"
                      onClick={() => nav.user(n.id)}
                    >
                      {n.name}
                    </button>
                  ) : (
                    o.who
                  )}
                  {" \xB7 "}
                  {o.where}
                  {" \xB7 "}
                  {o.when}
                </span>
              </div>
              {o.open && (
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => i(o, "Dismissed alert", "Dismissed")}
                  >
                    Dismiss
                  </Button>
                  {o.sev !== "low" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => i(o, "Contacted hostel", "Hostel contacted")}
                    >
                      <LuMessageSquare />
                      Contact hostel
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      i(
                        o,
                        "Locked Living ID",
                        "Living ID on hold. The person is told and can appeal.",
                      )
                    }
                  >
                    <LuLock />
                    Hold Living ID
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {!r.length && (
          <Card>
            <EmptyState
              icon={LuShieldCheck}
              title="No open alerts"
              text="New alerts show here as they happen."
            />
          </Card>
        )}
      </div>
    </>
  );
}
