"use client";

import {
  LuBellOff,
  LuCheck,
  LuChevronRight,
  LuCircleCheck,
  LuClock,
  LuFileText,
  LuHouse,
  LuSearch,
  LuSparkles,
  LuUsers,
} from "react-icons/lu";
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
import { totals, users } from "@/lib/data/core";
import { freshness, rentals } from "@/lib/data/ops";
import { num } from "@/lib/format";
import { logAudit, refresh } from "@/lib/store";

export function LandlordsPage({ nav }) {
  let a = users.filter((r) => r.type === "landlord");
  let e = [
    "Verified",
    "Waiting",
    "Verified",
    "Verified",
    "Missing",
    "Verified",
    "Waiting",
    "Verified",
  ];
  return (
    <>
      <PageHeader
        title={"Landlords & flats"}
        desc={`Landlords list flats in the MyStay ID app for verified tenants. ${num(totals.landlords)} landlords, ${num(totals.flats)} flats.`}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Flats listed", num(totals.flats), LuHouse, "primary"],
          [
            "Ownership papers waiting",
            e.filter((r) => r === "Waiting").length,
            LuFileText,
            "warning",
          ],
          ["Flats rented to students this term", "214", LuUsers, "success"],
        ].map(([r, i, o, n]) => (
          <div
            className="bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-card"
            key={r}
          >
            <IconTile icon={o} tone={n} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">{i}</span>
              <span className="text-muted-foreground text-[12.5px]">{r}</span>
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
                      <span className="text-muted-foreground text-[12px]">
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
                      e[i] === "Verified" ? "success" : e[i] === "Waiting" ? "warning" : "danger"
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
                        e[i] = "Verified";
                        logAudit("Verified ownership papers", r.name, "Holding tax receipt");
                        refresh();
                        toast(`${r.name}'s flats can go live`);
                      }}
                    >
                      <LuCheck />
                      Verify papers
                    </Button>
                  ) : (
                    <LuChevronRight className="text-muted-foreground size-4" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

const rentalStatus = {
  rented: ["Rented", "primary"],
  reserved: ["Reserved", "warning"],
  off: ["Paused \xB7 no reply", "neutral"],
  live: ["Back in search", "success"],
  notice: ["Tenant leaving", "neutral"],
};

export function FreshnessCard() {
  let t = freshness;
  return (
    <Card
      icon={LuSparkles}
      title="Search stays fresh"
      description="A home leaves search the moment it is no longer free, so tenants never chase a flat that is gone."
      className="mt-4"
    >
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Live in search", num(t.live), "primary", LuSearch],
          ["Rented and removed (7 days)", t.rentedWeek, "success", LuCircleCheck],
          ["Hidden while reserved", t.reserved, "warning", LuClock],
          ["Paused: no reply to 14-day check", t.stale, "neutral", LuBellOff],
        ].map(([a, e, r, i]) => (
          <div className="bg-muted/50 flex items-center gap-3 rounded-xl border p-3" key={a}>
            <IconTile icon={i} tone={r} />
            <div className="grid leading-tight">
              <span className="text-[18px] font-semibold tabular-nums">{e}</span>
              <span className="text-muted-foreground text-[12px]">{a}</span>
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
                      <span className="text-muted-foreground text-[12px]">{a.area}</span>
                    </div>
                  </TableCell>
                  <TableCell>{a.by}</TableCell>
                  <TableCell className="text-[13px]">{a.why}</TableCell>
                  <TableCell>
                    <Badge tone={(rentalStatus[a.status] || rentalStatus.off)[1]}>
                      {(rentalStatus[a.status] || rentalStatus.off)[0]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
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
            ["Rented outside MyStay", "Landlord taps \u201CMark as rented\u201D. Removed at once."],
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
              <LuCircleCheck className="text-success mt-0.5 size-4 shrink-0" />
              <span className="grid leading-snug">
                <b className="font-semibold">{a}</b>
                <span className="text-muted-foreground">{e}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
