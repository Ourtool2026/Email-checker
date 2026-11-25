"use client"

import { useState } from "react"
import {
  Building2Icon,
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  IdCardIcon,
  TriangleAlertIcon,
  UserCheckIcon,
  XIcon,
} from "lucide-react"
import { FilterChips } from "@/components/shared/filter-chips"
import { LivingIdCard } from "@/components/shared/living-id-card"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { ScoreRing } from "@/components/shared/score-ring"
import { Avatar } from "@/components/hq/avatar"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { EmptyState } from "@/components/hq/empty-state"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Select } from "@/components/hq/input"
import { toast } from "@/components/hq/toast"
import { getUser, verifications } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

const checkKinds: Record<string, any> = {
  nid: ["NID + selfie", IdCardIcon],
  student: ["Student ID", GraduationCapIcon],
  landlord: ["Landlord papers", Building2Icon],
  guardian: ["Guardian", UserCheckIcon],
}

export function VerifyPage({ nav }: { nav?: any }) {
  const [a, e] = useState("all")
  const r = verifications.filter(
    (h) => !h.done && (a === "all" || h.kind === a)
  )
  const [i, o] = useState(r[0]?.id)
  const [n, l] = useState(false)
  const [d, u] = useState("Photo is blurry")
  const s = verifications.find((h) => h.id === i && !h.done) || r[0]
  const m = s && getUser(s.uid)
  const f = (h?, B?) => {
    s.done = true
    if (s.lab && window.MS) {
      window.MS.emit("id.decided", {
        ok: h,
        what: B,
        reason: d,
      })
    }
    if (s.kind === "nid") {
      m.nid = h
      m.face = h
      if (h) m.status = "active"
    }
    if (s.kind === "student") {
      m.student = h
    }
    if (s.kind === "guardian") {
      m.guardian = h
    }
    logAudit(
      h
        ? `Approved ${checkKinds[s.kind][0]} check`
        : `${B} ${checkKinds[s.kind][0]} check`,
      m.name,
      h ? (s.score ? `Score ${s.score}` : "Papers checked") : d
    )
    l(false)
    o(verifications.find((y) => !y.done && y.id !== s.id)?.id)
    refresh()
    toast(
      h
        ? `${m.name.split(" ")[0]} is verified. They get a notice.`
        : `${m.name.split(" ")[0]} is asked to try again`,
      h ? CircleCheckIcon : CameraIcon
    )
  }
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
        <span className="text-[13px] text-muted-foreground">
          · median wait 18 min
        </span>
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
        <Card flush title="Queue" icon={ClockIcon}>
          <div className="divide-y">
            {r.map((h) => {
              const B = getUser(h.uid)
              const y = s && h.id === s.id
              return (
                <button
                  onClick={() => o(h.id)}
                  className={cn(
                    "relative flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50",
                    y && "bg-primary/[0.05]"
                  )}
                  key={h.id}
                >
                  {y && (
                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <Avatar name={B.name} photo={B.photo} size={36} />
                  <span className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate text-[13.5px] font-medium">
                      {B.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
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
              )
            })}
            {!r.length && (
              <EmptyState
                icon={CircleCheckIcon}
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
                <ChevronRightIcon />
              </Button>
            }
          >
            <div className="grid gap-5">
              {s.kind === "guardian" ? (
                <div className="flex items-center gap-4 rounded-xl border p-4">
                  <Avatar name={m.name} photo={m.photo} size={48} />
                  <ChevronRightIcon className="size-5 text-muted-foreground" />
                  <Avatar name="Abdul Hakim" size={48} />
                  <div className="grid leading-tight">
                    <span className="text-[14px] font-semibold">
                      Abdul Hakim · Father
                    </span>
                    <span className="text-[12.5px] text-muted-foreground">
                      +880 17•• ••• 918 · answered the OTP call
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <span className="text-[12.5px] font-medium text-muted-foreground">
                      Document
                    </span>
                    <LivingIdCard u={m} kind={s.kind} />
                  </div>
                  {s.kind !== "landlord" && (
                    <div className="grid gap-1.5">
                      <span className="text-[12.5px] font-medium text-muted-foreground">
                        Live selfie
                      </span>
                      <div className="relative aspect-[1.58] overflow-hidden rounded-xl border bg-muted">
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt=""
                            className={cn(
                              "size-full object-cover",
                              s.flags.includes("Photo is blurry") &&
                                "blur-[2px]"
                            )}
                          />
                        ) : (
                          <div
                            className={cn(
                              "flex size-full items-center justify-center",
                              s.flags.includes("Photo is blurry") &&
                                "blur-[2px]"
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
                      <span className="text-[13.5px] font-semibold">
                        Face match
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">
                        {s.score >= 85
                          ? "Strong"
                          : s.score >= 70
                            ? "Check by eye"
                            : "Weak"}
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
                    <div
                      className="flex items-center gap-2 text-[13px]"
                      key={h}
                    >
                      {B ? (
                        <CircleCheckIcon className="size-4 text-success" />
                      ) : (
                        <TriangleAlertIcon className="size-4 text-warning" />
                      )}
                      <span className={B ? "" : "font-medium text-warning"}>
                        {h}
                      </span>
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
                    <Button
                      variant="outline"
                      onClick={() => f(false, "Asked again on")}
                    >
                      <CameraIcon />
                      Ask to try again
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => f(false, "Rejected")}
                    >
                      <XIcon />
                      Reject
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                  <Button variant="outline" onClick={() => l(true)}>
                    <XIcon />
                    Reject or ask again
                  </Button>
                  <Button onClick={() => f(true)}>
                    <CheckIcon />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon={CircleCheckIcon}
              title="All checked"
              text="Nothing waits for a person right now."
            />
          </Card>
        )}
      </div>
    </>
  )
}
