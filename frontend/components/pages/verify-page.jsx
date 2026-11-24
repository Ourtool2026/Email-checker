"use client";

import { useState } from "react";
import {
  LuBuilding2,
  LuCamera,
  LuCheck,
  LuChevronRight,
  LuCircleCheck,
  LuClock,
  LuGraduationCap,
  LuIdCard,
  LuTriangleAlert,
  LuUserCheck,
  LuX,
} from "react-icons/lu";
import { FilterChips } from "@/components/shared/filter-chips";
import { LivingIdCard } from "@/components/shared/living-id-card";
import { Notice } from "@/components/shared/notice";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Select } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getUser, verifications } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

const checkKinds = {
  nid: ["NID + selfie", LuIdCard],
  student: ["Student ID", LuGraduationCap],
  landlord: ["Landlord papers", LuBuilding2],
  guardian: ["Guardian", LuUserCheck],
};

export function VerifyPage({ nav }) {
  let [a, e] = useState("all");
  let r = verifications.filter((h) => !h.done && (a === "all" || h.kind === a));
  let [i, o] = useState(r[0]?.id);
  let [n, l] = useState(false);
  let [d, u] = useState("Photo is blurry");
  let s = verifications.find((h) => h.id === i && !h.done) || r[0];
  let m = s && getUser(s.uid);
  let f = (h, B) => {
    s.done = true;
    if (s.lab && window.MS) {
      window.MS.emit("id.decided", {
        ok: h,
        what: B,
        reason: d,
      });
    }
    if (s.kind === "nid") {
      m.nid = h;
      m.face = h;
      h && (m.status = "active");
    }
    if (s.kind === "student") {
      m.student = h;
    }
    if (s.kind === "guardian") {
      m.guardian = h;
    }
    logAudit(
      h ? `Approved ${checkKinds[s.kind][0]} check` : `${B} ${checkKinds[s.kind][0]} check`,
      m.name,
      h ? (s.score ? `Score ${s.score}` : "Papers checked") : d,
    );
    l(false);
    o(verifications.find((y) => !y.done && y.id !== s.id)?.id);
    refresh();
    toast(
      h
        ? `${m.name.split(" ")[0]} is verified. They get a notice.`
        : `${m.name.split(" ")[0]} is asked to try again`,
      h ? LuCircleCheck : LuCamera,
    );
  };
  return (
    <>
      <PageHeader
        title="Verification queue"
        desc="Check each ID before it becomes a Living ID. Most NID checks pass automatically; these need a person."
      >
        <Badge tone="primary">
          {verifications.filter((h) => !h.done).length}
          {" waiting"}
        </Badge>
        <span className="text-muted-foreground text-[13px]">· median wait 18 min</span>
      </PageHeader>
      <FilterChips
        value={a}
        onChange={e}
        items={[
          ["all", "All", verifications.filter((h) => !h.done).length],
          ...Object.entries(checkKinds).map(([h, [B]]) => [
            h,
            B,
            verifications.filter((y) => !y.done && y.kind === h).length,
          ]),
        ]}
      />
      <div className="mt-4 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card flush title="Queue" icon={LuClock}>
          <div className="divide-y">
            {r.map((h) => {
              let B = getUser(h.uid);
              let y = s && h.id === s.id;
              return (
                <button
                  onClick={() => o(h.id)}
                  className={cn(
                    "relative flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50",
                    y && "bg-primary/[0.05]",
                  )}
                  key={h.id}
                >
                  {y && (
                    <span className="bg-primary absolute inset-y-2 left-0 w-[3px] rounded-r-full" />
                  )}
                  <Avatar name={B.name} photo={B.photo} size={36} />
                  <span className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate text-[13.5px] font-medium">{B.name}</span>
                    <span className="text-muted-foreground text-[12px]">
                      {checkKinds[h.kind][0]}
                      {" \xB7 "}
                      {h.when}
                    </span>
                  </span>
                  {h.score ? (
                    <ScoreRing value={h.score} size={34} stroke={4} />
                  ) : (
                    <IconTile icon={checkKinds[h.kind][1]} size="sm" />
                  )}
                </button>
              );
            })}
            {!r.length && (
              <EmptyState
                icon={LuCircleCheck}
                title="Queue is clear"
                text="New checks show here as people sign up."
              />
            )}
          </div>
        </Card>
        {s ? (
          <Card
            icon={checkKinds[s.kind][1]}
            title={`${checkKinds[s.kind][0]} \xB7 ${m.name}`}
            description={`Sent ${s.when} from ${m.device}`}
            actions={
              <Button size="sm" variant="ghost" onClick={() => nav.user(m.id)}>
                Open profile
                <LuChevronRight />
              </Button>
            }
          >
            <div className="grid gap-5">
              {s.kind === "guardian" ? (
                <div className="flex items-center gap-4 rounded-xl border p-4">
                  <Avatar name={m.name} photo={m.photo} size={48} />
                  <LuChevronRight className="text-muted-foreground size-5" />
                  <Avatar name="Abdul Hakim" size={48} />
                  <div className="grid leading-tight">
                    <span className="text-[14px] font-semibold">Abdul Hakim · Father</span>
                    <span className="text-muted-foreground text-[12.5px]">
                      +880 17•• ••• 918 · answered the OTP call
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <span className="text-muted-foreground text-[12.5px] font-medium">
                      Document
                    </span>
                    <LivingIdCard u={m} kind={s.kind} />
                  </div>
                  {s.kind !== "landlord" && (
                    <div className="grid gap-1.5">
                      <span className="text-muted-foreground text-[12.5px] font-medium">
                        Live selfie
                      </span>
                      <div className="relative aspect-[1.58] overflow-hidden rounded-xl border bg-muted">
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt=""
                            className={cn(
                              "size-full object-cover",
                              s.flags.includes("Photo is blurry") && "blur-[2px]",
                            )}
                          />
                        ) : (
                          <div
                            className={cn(
                              "flex size-full items-center justify-center",
                              s.flags.includes("Photo is blurry") && "blur-[2px]",
                            )}
                          >
                            <Avatar name={m.name} size={110} />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                          Liveness passed
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                {s.score > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border p-3 pr-5">
                    <ScoreRing value={s.score} size={56} />
                    <div className="grid leading-tight">
                      <span className="text-[13.5px] font-semibold">Face match</span>
                      <span className="text-muted-foreground text-[12.5px]">
                        {s.score >= 85 ? "Strong" : s.score >= 70 ? "Check by eye" : "Weak"}
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid gap-1.5">
                  {[
                    ["Name matches the account", true],
                    [
                      s.kind === "student"
                        ? "University is on the partner list"
                        : s.kind === "landlord"
                          ? "Address matches the flat"
                          : "Date of birth: 18 or older",
                      true,
                    ],
                    ["Not used by another account", true],
                    ...s.flags.map((h) => [h, false]),
                  ].map(([h, B]) => (
                    <div className="flex items-center gap-2 text-[13px]" key={h}>
                      {B ? (
                        <LuCircleCheck className="text-success size-4" />
                      ) : (
                        <LuTriangleAlert className="text-warning size-4" />
                      )}
                      <span className={B ? "" : "text-warning font-medium"}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              {s.note && <Notice>{s.note}</Notice>}
              {n ? (
                <div className="grid gap-3 rounded-xl border p-3.5">
                  <Field label="Reason (shown to them)">
                    <Select value={d} onChange={(h) => u(h.target.value)}>
                      {[
                        "Photo is blurry",
                        "Face does not match the ID",
                        "ID is expired",
                        "Photo of a screen, not a real card",
                        "Papers do not show the owner\u2019s name",
                      ].map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </Select>
                  </Field>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => l(false)}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={() => f(false, "Asked again on")}>
                      <LuCamera />
                      Ask to try again
                    </Button>
                    <Button variant="destructive" onClick={() => f(false, "Rejected")}>
                      <LuX />
                      Reject
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                  <Button variant="outline" onClick={() => l(true)}>
                    <LuX />
                    Reject or ask again
                  </Button>
                  <Button onClick={() => f(true)}>
                    <LuCheck />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon={LuCircleCheck}
              title="All checked"
              text="Nothing waits for a person right now."
            />
          </Card>
        )}
      </div>
    </>
  );
}
