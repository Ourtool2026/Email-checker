"use client";

import { useState } from "react";
import { LuBuilding2, LuChevronRight, LuStar } from "react-icons/lu";
import { hostelStatus, planTones } from "@/components/drawers/hostel-drawer";
import { FilterChips } from "@/components/shared/filter-chips";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { hostels, totals } from "@/lib/data/core";

export function HostelsPage({ nav }) {
  let [a, e] = useState("all");
  let [r, i] = useState("");
  let [o, n] = useState("cards");
  let l = hostels.filter(
    (d) =>
      (a === "all" || d.status === a) &&
      (!r || (d.name + d.area + d.owner).toLowerCase().includes(r.toLowerCase())),
  );
  return (
    <>
      <PageHeader
        title="Hostels"
        desc={`Every hostel on MyStay for Business. ${totals.hostels} in total; ${hostels.length} shown in this sample.`}
      >
        <Tabs
          size="sm"
          value={o}
          onChange={n}
          items={[
            {
              value: "cards",
              label: "Cards",
            },
            {
              value: "table",
              label: "Table",
            },
          ]}
        />
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput
          value={r}
          onChange={i}
          placeholder="Hostel, area or owner"
          className="w-full sm:w-72"
        />
        <FilterChips
          value={a}
          onChange={e}
          items={[
            ["all", "All", hostels.length],
            [
              "pending",
              "Waiting for approval",
              hostels.filter((d) => d.status === "pending").length,
            ],
            ["live", "Live", hostels.filter((d) => d.status === "live").length],
            ["paused", "Paused", hostels.filter((d) => d.status === "paused").length],
          ]}
        />
      </div>
      {o === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {l.map((d) => (
            <button
              onClick={() => nav.hostel(d.id)}
              className="group bg-card overflow-hidden rounded-2xl border text-left shadow-card transition-colors hover:border-ring/40"
              key={d.id}
            >
              <div className="relative h-32">
                <img src={d.photo} alt="" className="size-full object-cover" />
                <span className="absolute top-2.5 left-2.5">
                  <Badge tone={hostelStatus[d.status][1]} className="bg-card/95 backdrop-blur">
                    {hostelStatus[d.status][0]}
                  </Badge>
                </span>
                <span className="absolute top-2.5 right-2.5">
                  <Badge tone={planTones[d.plan]} dot={false} className="bg-card/95 backdrop-blur">
                    {d.plan}
                  </Badge>
                </span>
              </div>
              <div className="grid gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid min-w-0 leading-tight">
                    <span className="truncate text-[14.5px] font-semibold">{d.name}</span>
                    <span className="text-muted-foreground text-[12.5px]">
                      {d.type}
                      {" \xB7 "}
                      {d.area}
                      {" \xB7 "}
                      {d.owner}
                    </span>
                  </div>
                  <Tooltip label="Safety score">
                    <ScoreRing value={d.safety} size={38} stroke={4} />
                  </Tooltip>
                </div>
                <div className="grid gap-1.5">
                  <div className="flex justify-between text-[12.5px]">
                    <span className="text-muted-foreground">
                      {d.filled}/{d.seats}
                      {" seats filled"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <LuStar className="size-3.5 text-amber-500" />
                      {d.rating}
                    </span>
                  </div>
                  <Progress value={(d.filled / d.seats) * 100} />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <Card flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostel</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Safety</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {l.map((d) => (
                <TableRow onClick={() => nav.hostel(d.id)} key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={d.photo} alt="" className="size-9 rounded-lg object-cover" />
                      <div className="grid leading-tight">
                        <span className="font-medium">{d.name}</span>
                        <span className="text-muted-foreground text-[12px]">
                          {d.type}
                          {" \xB7 "}
                          {d.area}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{d.owner}</TableCell>
                  <TableCell>
                    <Badge tone={planTones[d.plan]} dot={false}>
                      {d.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="grid w-28 gap-1">
                      <span className="text-[12.5px] tabular-nums">
                        {d.filled}/{d.seats}
                      </span>
                      <Progress value={(d.filled / d.seats) * 100} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <ScoreRing value={d.safety} size={34} stroke={4} />
                  </TableCell>
                  <TableCell>
                    <Badge tone={hostelStatus[d.status][1]}>{hostelStatus[d.status][0]}</Badge>
                  </TableCell>
                  <TableCell className="w-8">
                    <LuChevronRight className="text-muted-foreground size-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {!l.length && (
        <Card>
          <EmptyState
            icon={LuBuilding2}
            title="No hostels match"
            text="Try another search or filter."
          />
        </Card>
      )}
    </>
  );
}
