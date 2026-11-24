"use client";

import { useState } from "react";
import {
  LuCheck,
  LuCircleCheck,
  LuClipboardList,
  LuEye,
  LuFlame,
  LuImage,
  LuReceipt,
  LuTriangleAlert,
  LuUndo2,
  LuX,
} from "react-icons/lu";
import { FreshnessCard } from "@/components/pages/landlords-page";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getHostel, getUser, listingReviews } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ListingsPage({ nav }) {
  let [a, e] = useState({});
  let r = listingReviews.filter((n) => !n.done);
  let i = [
    ["photos", "Real photos, no stock images", LuImage],
    ["prices", "Prices within 15% of the area", LuReceipt],
    ["rules", "House rules are fair", LuClipboardList],
    ["fire", "Fire exit and extinguisher shown", LuFlame],
  ];
  let o = (n, l) => {
    n.done = l;
    if (n.lab && window.MS) {
      window.MS.emit("listing.decided", {
        id: n.id,
        d: l,
        why: a[n.id] || "",
      });
    }
    if (n.hid && l === "approved") {
      let d = getHostel(n.hid);
      if (d.status === "pending") {
        d.status = "live";
      }
    }
    logAudit(
      l === "approved"
        ? "Approved listing"
        : l === "back"
          ? "Sent listing back"
          : "Rejected listing",
      n.title,
      a[n.id] || "\u2014",
    );
    refresh();
    toast(l === "approved" ? `${n.title} is live in the app` : "Owner is told what to fix");
  };
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
          let l = n.hid && getHostel(n.hid);
          let d = n.uid && getUser(n.uid);
          let u = i.filter((s) => !n.checks[s[0]]);
          return (
            <article
              className="bg-card flex flex-col overflow-hidden rounded-2xl border shadow-card sm:flex-row"
              key={n.id}
            >
              <img src={n.photo} alt="" className="h-40 w-full object-cover sm:h-auto sm:w-44" />
              <div className="grid flex-1 gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid leading-tight">
                    <span className="text-[14.5px] font-semibold">{n.title}</span>
                    <span className="text-muted-foreground text-[12.5px]">
                      {l ? l.owner : d.name}
                      {" \xB7 "}
                      {n.when}
                    </span>
                  </div>
                  <Badge tone={n.kind.startsWith("New") ? "primary" : "warning"} dot={false}>
                    {n.kind}
                  </Badge>
                </div>
                <p className="text-[13px]">{n.change}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {i.map(([s, m, f]) => (
                    <button
                      onClick={() => {
                        n.checks[s] = !n.checks[s];
                        refresh();
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[12px]",
                        n.checks[s]
                          ? "text-foreground"
                          : "border-warning/40 bg-warning/[0.06] text-warning",
                      )}
                      key={s}
                    >
                      {n.checks[s] ? (
                        <LuCircleCheck className="text-success size-3.5 shrink-0" />
                      ) : (
                        <LuTriangleAlert className="size-3.5 shrink-0" />
                      )}
                      {m}
                    </button>
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
                    <Button size="sm" variant="ghost" onClick={() => nav.hostel(l.id)}>
                      <LuEye />
                      Hostel
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => o(n, "rejected")}>
                    <LuX />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => o(n, "back")}>
                    <LuUndo2 />
                    Send back
                  </Button>
                  <Button size="sm" disabled={u.length > 0} onClick={() => o(n, "approved")}>
                    <LuCheck />
                    Approve
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!r.length && (
        <Card>
          <EmptyState
            icon={LuCircleCheck}
            title="Nothing to review"
            text="New listings show here first."
          />
        </Card>
      )}
      <FreshnessCard />
    </>
  );
}
