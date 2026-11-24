"use client";

import { useEffect, useState } from "react";
import {
  LuBedDouble,
  LuCheck,
  LuChevronRight,
  LuCircleCheck,
  LuCreditCard,
  LuFileText,
  LuGift,
  LuLogIn,
  LuMapPin,
  LuMessageSquare,
  LuPause,
  LuPhone,
  LuPlay,
  LuShieldCheck,
  LuStar,
  LuTriangleAlert,
  LuUsers,
} from "react-icons/lu";
import { MaskedValue } from "@/components/shared/masked-value";
import { Notice } from "@/components/shared/notice";
import { ScoreRing } from "@/components/shared/score-ring";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { getHostel, plans, users } from "@/lib/data/core";
import { taka } from "@/lib/format";
import { logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

export const hostelStatus = {
  live: ["Live", "success"],
  pending: ["Waiting for approval", "warning"],
  paused: ["Paused", "danger"],
};

export const planTones = {
  Free: "neutral",
  Pro: "primary",
  Plus: "violet",
};

export function HostelDrawer({ id, onClose, nav }) {
  let r = id && getHostel(id);
  let [i, o] = useState("overview");
  let [n, l] = useState(null);
  let [d, u] = useState("");
  let [s, m] = useState("");
  useEffect(() => {
    o("overview");
    l(null);
    m(r?.plan);
  }, [id]);
  if (!r) {
    return null;
  }
  let f = users.filter((y) => y.hostel === r.id);
  let h = hostelStatus[r.status];
  let B = (y, W, x) => {
    if (x) {
      x();
    }
    if (r.id === "h0" && window.MS) {
      window.MS.emit("hostel.status", {
        hid: r.id,
        status: r.status,
        note: r.pauseNote || "",
      });
    }
    logAudit(y, r.name, d || "\u2014");
    l(null);
    u("");
    refresh();
    toast(W);
  };
  return (
    <Sheet open onClose={onClose} width="sm:max-w-[540px]">
      <div className="relative h-36 shrink-0">
        <img src={r.photo} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute right-5 bottom-3 left-5 flex items-end justify-between gap-3 text-white">
          <div className="grid leading-tight">
            <span className="text-[18px] font-semibold tracking-tight">{r.name}</span>
            <span className="text-[12.5px] text-white/80">
              {r.type}
              {" \xB7 "}
              {r.area}
              {" \xB7 code "}
              {r.code}
            </span>
          </div>
          <ScoreRing value={r.safety} size={48} />
        </div>
      </div>
      <div className="border-b px-5 py-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={h[1]}>{h[0]}</Badge>
          <Badge tone={planTones[r.plan]} dot={false}>
            {r.plan}
            {" plan"}
          </Badge>
          <Tag icon={LuStar}>{r.rating}</Tag>
          {r.discount && <Tag icon={LuGift}>Gives Stay Level discount</Tag>}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            ["Seats", r.seats],
            ["Filled", `${Math.round((r.filled / r.seats) * 100)}%`],
            ["Staff", r.staff],
            ["Reports filed", r.reports],
          ].map((y) => (
            <div className="bg-muted/60 rounded-xl border px-1 py-2" key={y[0]}>
              <div className="text-muted-foreground text-[11.5px]">{y[0]}</div>
              <div className="text-[13.5px] font-semibold">{y[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pt-3">
        <Tabs
          size="sm"
          value={i}
          onChange={o}
          className="w-full"
          items={[
            {
              value: "overview",
              label: "Overview",
            },
            {
              value: "residents",
              label: "Residents",
              count: f.length,
            },
            {
              value: "plan",
              label: "Plan",
            },
            {
              value: "safety",
              label: "Safety",
            },
          ]}
        />
      </div>
      <div className="flex-1 overflow-auto p-5 pt-4">
        {i === "overview" && (
          <div className="grid gap-4">
            {r.pauseNote && r.status === "paused" && (
              <Notice tone="danger" icon={LuPause}>
                {r.pauseNote}
              </Notice>
            )}
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <Avatar name={r.owner} size={40} />
              <div className="grid flex-1 leading-tight">
                <span className="text-[13.5px] font-semibold">{r.owner}</span>
                <span className="text-muted-foreground text-[12.5px]">
                  {"Owner \xB7 NID verified \xB7 joined "}
                  {r.joined}
                </span>
              </div>
              <LuShieldCheck className="text-success size-5" />
            </div>
            <div className="divide-y rounded-xl border text-[13.5px]">
              {[
                [LuMapPin, "Address", `${r.area}, Dhaka`],
                [
                  LuPhone,
                  "Phone",
                  <MaskedValue key="phone" value={r.phone} label="Phone number" target={r.name} />,
                ],
                [LuBedDouble, "Seats", `${r.filled} of ${r.seats} filled`],
                [LuFileText, "Papers", "Trade licence, fire safety, holding tax"],
              ].map(([Icon, W, x]) => (
                <div className="flex items-center gap-3 px-3.5 py-2.5" key={W}>
                  <Icon className="text-muted-foreground size-4 shrink-0" />
                  <span className="text-muted-foreground w-24 shrink-0">{W}</span>
                  <span className="min-w-0 font-medium">{x}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-1.5">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted-foreground">Seats filled</span>
                <span className="font-semibold tabular-nums">
                  {r.filled}/{r.seats}
                </span>
              </div>
              <Progress value={(r.filled / r.seats) * 100} />
            </div>
          </div>
        )}
        {i === "residents" &&
          (f.length ? (
            <div className="grid gap-1.5">
              {f.map((y) => (
                <button
                  onClick={() => nav.user(y.id)}
                  className="hover:bg-muted/60 flex items-center gap-3 rounded-xl border p-2.5 text-left"
                  key={y.id}
                >
                  <Avatar name={y.name} photo={y.photo} size={32} />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13.5px] font-medium">{y.name}</span>
                    <span className="text-muted-foreground text-[12px]">
                      {y.type === "student" ? "Student" : "Job holder"}
                      {" \xB7 Level "}
                      {y.level}
                    </span>
                  </span>
                  <LuChevronRight className="text-muted-foreground size-4" />
                </button>
              ))}
              <p className="text-muted-foreground mt-1 text-[12.5px]">
                {"Showing residents in this sample. The hostel has "}
                {r.filled}.
              </p>
            </div>
          ) : (
            <EmptyState
              icon={LuUsers}
              title="No residents in this sample"
              text={`The hostel has ${r.filled} residents.`}
            />
          ))}
        {i === "plan" && (
          <div className="grid gap-3">
            {plans.map((y) => (
              <button
                onClick={() => m(y.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left hover:border-ring/40",
                  s === y.id && "border-primary bg-primary/[0.05]",
                )}
                key={y.id}
              >
                <IconTile icon={LuCreditCard} tone={planTones[y.id]} size="sm" />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13.5px] font-semibold">
                    {y.id}{" "}
                    {r.plan === y.id && (
                      <span className="text-muted-foreground font-normal">· current</span>
                    )}
                  </span>
                  <span className="text-muted-foreground text-[12.5px]">{y.desc}</span>
                </span>
                <span className="text-[13.5px] font-semibold tabular-nums">
                  {y.price ? taka(y.price) + "/mo" : "Free"}
                </span>
              </button>
            ))}
            <Button
              disabled={s === r.plan}
              onClick={() => B("Changed plan", `${r.name} moved to ${s}`, () => (r.plan = s))}
            >
              <LuCheck />
              {"Change to "}
              {s}
            </Button>
            <Notice>
              This is what the hostel pays MyStay. Residents’ rent never passes through MyStay.
            </Notice>
          </div>
        )}
        {i === "safety" && (
          <div className="grid gap-3">
            <div className="flex items-center gap-4 rounded-xl border p-4">
              <ScoreRing value={r.safety} size={64} />
              <div className="grid gap-1 text-[13px]">
                <span className="text-[14px] font-semibold">
                  {"Safety score "}
                  {r.safety}
                </span>
                <span className="text-muted-foreground">
                  From ID scans at the gate, guest sign-ins, fair reports and resident feedback.
                </span>
              </div>
            </div>
            {[
              ["Residents scanned at move-in", "98%", true],
              ["Visitors signed in with a Living ID", "91%", true],
              ["Reports overturned on appeal", r.reports > 2 ? "2 of 3" : "0", r.reports <= 2],
              ["Guest list pulls this month", "1", true],
            ].map(([y, W, x]) => (
              <div
                className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[13px]"
                key={y}
              >
                {x ? (
                  <LuCircleCheck className="text-success size-4" />
                ) : (
                  <LuTriangleAlert className="text-warning size-4" />
                )}
                <span className="flex-1">{y}</span>
                <span className="font-semibold tabular-nums">{W}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
        {r.status === "pending" && (
          <Button
            size="sm"
            onClick={() =>
              B("Approved hostel", `${r.name} is live in the app`, () => (r.status = "live"))
            }
          >
            <LuCheck />
            Approve
          </Button>
        )}
        {r.status === "paused" ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => B("Resumed listing", "Listing is live again", () => (r.status = "live"))}
          >
            <LuPlay />
            Resume listing
          </Button>
        ) : (
          r.status === "live" && (
            <Button size="sm" variant="outline" onClick={() => l("pause")}>
              <LuPause />
              Pause listing
            </Button>
          )
        )}
        <Button size="sm" variant="outline" onClick={() => l("support")}>
          <LuLogIn />
          Open as support
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            logAudit("Sent message", r.name, "Message to owner");
            toast(`Message sent to ${r.owner}`);
          }}
        >
          <LuMessageSquare />
          Message owner
        </Button>
      </div>
      <Dialog
        open={n === "pause"}
        onClose={() => l(null)}
        title={`Pause ${r.name}?`}
        description="It disappears from search and stops taking seat requests. Residents and the dashboard keep working."
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!d.trim()}
              onClick={() =>
                B("Paused listing", "Listing paused. The owner is told why.", () => {
                  r.status = "paused";
                  r.pauseNote = "Paused by HQ: " + d;
                })
              }
            >
              <LuPause />
              Pause
            </Button>
          </>
        }
      >
        <Field label="Reason (the owner sees this)">
          <Input
            value={d}
            onChange={(y) => u(y.target.value)}
            placeholder="e.g. Fire exit photos missing"
          />
        </Field>
      </Dialog>
      <Dialog
        open={n === "support"}
        onClose={() => l(null)}
        title="Open their dashboard as support?"
        description={`${r.owner} sees a blue \u201CMyStay support is viewing\u201D banner while you are in. Every click is logged.`}
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button
              disabled={!d.trim()}
              onClick={() =>
                B("Opened hostel as support", "Support session started. The owner sees a banner.")
              }
            >
              <LuLogIn />
              Open
            </Button>
          </>
        }
      >
        <Field label="Why">
          <Input
            value={d}
            onChange={(y) => u(y.target.value)}
            placeholder="e.g. Owner asked for help in T-2296"
          />
        </Field>
      </Dialog>
    </Sheet>
  );
}
