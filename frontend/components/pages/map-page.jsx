"use client";

import { useState } from "react";
import {
  LuBedDouble,
  LuBuilding2,
  LuChevronRight,
  LuLayers,
  LuMapPin,
  LuMegaphone,
  LuShieldAlert,
  LuUsers,
} from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { hostels } from "@/lib/data/core";
import { mapAreas } from "@/lib/data/ops";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MapPage({ nav }) {
  let [a, e] = useState(["hostels", "demand", "alerts"]);
  let [r, i] = useState("Uttara");
  let o = mapAreas.find((s) => s.k === r);
  let n = (s) => a.includes(s);
  let l = (s) => e(n(s) ? a.filter((m) => m !== s) : [...a, s]);
  let d = (s) =>
    `color-mix(in oklab, ${s > 35 ? "var(--destructive)" : s > 25 ? "var(--warning)" : "var(--success)"} ${s > 35 ? 20 : 16}%, var(--card))`;
  let u = hostels.filter((s) => s.area === r);
  return (
    <>
      <PageHeader
        title="Live map"
        desc="Where users, hostels, open seats and safety alerts are across Dhaka. Areas are drawn as a simple schematic, not to scale."
      />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground flex items-center gap-1.5 text-[12.5px] font-medium">
          <LuLayers className="size-4" />
          Layers
        </span>
        {[
          ["hostels", "Hostels", LuBuilding2],
          ["demand", "Demand vs seats", LuUsers],
          ["alerts", "Safety alerts", LuShieldAlert],
          ["staff", "Staff", LuMapPin],
        ].map(([s, m, Icon]) => (
          <button
            onClick={() => l(s)}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium",
              n(s)
                ? "border-primary/40 bg-primary/10 text-primary"
                : "bg-card text-muted-foreground shadow-card",
            )}
            key={s}
          >
            <Icon className="size-3.5" />
            {m}
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="border-surface-border bg-surface relative overflow-hidden rounded-3xl border p-3">
          <svg
            viewBox="0 0 600 540"
            className="mx-auto w-full max-w-[620px]"
            role="img"
            aria-label="Schematic map of Dhaka areas"
          >
            <path
              d="M20 520 C120 500 180 530 280 510 S440 525 590 495"
              fill="none"
              stroke="color-mix(in oklab, var(--info) 40%, transparent)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <text x="500" y="490" fontSize="11" fill="var(--muted-foreground)">
              Buriganga
            </text>
            {mapAreas.map((s) => {
              let m = s.k === r;
              return (
                <g onClick={() => i(s.k)} className="cursor-pointer" key={s.k}>
                  <rect
                    x={s.x}
                    y={s.y}
                    width={s.w}
                    height={s.h}
                    rx="18"
                    fill={n("demand") ? d(s.demand) : "var(--card)"}
                    stroke={m ? "var(--primary)" : "var(--border)"}
                    strokeWidth={m ? 3 : 1.5}
                  />
                  <text
                    x={s.x + 12}
                    y={s.y + 22}
                    fontSize="13"
                    fontWeight="600"
                    fill="var(--foreground)"
                  >
                    {s.k}
                  </text>
                  <text x={s.x + 12} y={s.y + 38} fontSize="11" fill="var(--muted-foreground)">
                    {num(s.users)}
                    {" users"}
                  </text>
                  {n("hostels") && (
                    <g>
                      <rect
                        x={s.x + 10}
                        y={s.y + s.h - 30}
                        width={s.hostels > 9 ? 84 : 76}
                        height="20"
                        rx="10"
                        fill="color-mix(in oklab, var(--primary) 14%, var(--card))"
                      />
                      <circle cx={s.x + 21} cy={s.y + s.h - 20} r="4" fill="var(--primary)" />
                      <text
                        x={s.x + 30}
                        y={s.y + s.h - 16}
                        fontSize="11"
                        fontWeight="600"
                        fill="var(--primary)"
                      >
                        {s.hostels}
                        {" hostels"}
                      </text>
                    </g>
                  )}
                  {n("alerts") && s.alerts > 0 && (
                    <g>
                      <circle
                        cx={s.x + s.w - 18}
                        cy={s.y + 18}
                        r="11"
                        fill="var(--destructive)"
                        opacity=".25"
                      >
                        <animate
                          attributeName="r"
                          values="9;15;9"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx={s.x + s.w - 18} cy={s.y + 18} r="8" fill="var(--destructive)" />
                      <text
                        x={s.x + s.w - 18}
                        y={s.y + 22}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="white"
                      >
                        {s.alerts}
                      </text>
                    </g>
                  )}
                  {n("staff") && ["Uttara", "Mirpur"].includes(s.k) && (
                    <g>
                      <rect
                        x={s.x + s.w - 72}
                        y={s.y + 30}
                        width="60"
                        height="18"
                        rx="9"
                        fill="var(--violet)"
                      />
                      <text
                        x={s.x + s.w - 42}
                        y={s.y + 43}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="white"
                      >
                        {s.k === "Mirpur" ? "10 staff" : "2 staff"}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          {n("demand") && (
            <div className="bg-card/90 mt-2 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-[11.5px] backdrop-blur sm:absolute sm:bottom-4 sm:left-4 sm:mt-0">
              <span>Students looking vs open seats</span>
              {[
                ["Balanced", "var(--success)"],
                ["Tight", "var(--warning)"],
                ["Short of seats", "var(--destructive)"],
              ].map(([s, m]) => (
                <span className="flex items-center gap-1" key={s}>
                  <span
                    className="size-2.5 rounded-sm"
                    style={{
                      background: m,
                    }}
                  />
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <Card icon={LuMapPin} title={r} description="Click an area on the map">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Users", num(o.users), LuUsers],
              ["Hostels", o.hostels, LuBuilding2],
              ["Seats open", o.open, LuBedDouble],
              ["Safety alerts", o.alerts, LuShieldAlert],
            ].map(([s, m, Icon]) => (
              <div
                className="bg-muted/60 flex items-center gap-2.5 rounded-xl border p-2.5"
                key={s}
              >
                <Icon className="text-muted-foreground size-4" />
                <div className="grid leading-tight">
                  <span className="text-[15px] font-semibold tabular-nums">{m}</span>
                  <span className="text-muted-foreground text-[11.5px]">{s}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span>Students looking for a seat</span>
              <span className="font-semibold">{o.demand}%</span>
            </div>
            <Progress
              value={o.demand * 2}
              tone={o.demand > 35 ? "danger" : o.demand > 25 ? "warning" : "success"}
            />
            {o.demand > 35 && (
              <span className="text-destructive text-[12px]">
                More demand than seats. Good area to sign up new hostels.
              </span>
            )}
          </div>
          <div className="mt-4 grid gap-1">
            <span className="text-muted-foreground mb-1 text-[12.5px] font-medium">
              {"Hostels in "}
              {r}
              {" (sample)"}
            </span>
            {u.length ? (
              u.map((s) => (
                <button
                  onClick={() => nav.hostel(s.id)}
                  className="hover:bg-muted/60 flex items-center gap-2.5 rounded-xl p-2 text-left"
                  key={s.id}
                >
                  <img src={s.photo} alt="" className="size-8 rounded-lg object-cover" />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13px] font-medium">{s.name}</span>
                    <span className="text-muted-foreground text-[11.5px]">
                      {s.filled}/{s.seats}
                      {" seats \xB7 "}
                      {s.type}
                    </span>
                  </span>
                  <LuChevronRight className="text-muted-foreground size-4" />
                </button>
              ))
            ) : (
              <span className="text-muted-foreground text-[12.5px]">
                No hostels in this sample.
              </span>
            )}
          </div>
          <Button variant="outline" className="mt-3 w-full" onClick={() => nav.go("campaigns")}>
            <LuMegaphone />
            {"Campaign to "}
            {r}
          </Button>
        </Card>
      </div>
    </>
  );
}
