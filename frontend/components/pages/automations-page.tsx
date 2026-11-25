"use client"

import { useState } from "react"
import {
  ArrowDownIcon,
  CircleCheckIcon,
  FlaskConicalIcon,
  HistoryIcon,
  PlayIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  ZapIcon,
} from "lucide-react"
import { FilterChips } from "@/components/shared/filter-chips"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/hq/button"
import { Dialog } from "@/components/hq/dialog"
import { EmptyState } from "@/components/hq/empty-state"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input, Select } from "@/components/hq/input"
import { Sheet } from "@/components/hq/sheet"
import { Switch } from "@/components/hq/switch"
import { toast } from "@/components/hq/toast"
import {
  automationActions,
  automationTriggers,
  automations,
} from "@/lib/data/ops"
import { num } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AutomationsPage() {
  const [t, a] = useState(null)
  const [e, r] = useState(null)
  const [i, o] = useState("all")
  const n = automations.filter((l) => i === "all" || l.team === i)
  return (
    <>
      <PageHeader
        title="Automations"
        desc="When something happens, HQ does the routine work for you: assigns people, sends messages, opens tasks. Every run is logged."
      >
        <Button
          onClick={() =>
            a({
              id: "AU-0" + (automations.length + 1),
              name: "",
              trigger: automationTriggers[0],
              conds: [],
              actions: ["Post to Slack"],
              on: false,
              runs: 0,
              ok: 0,
              last: "\u2014",
              team: "Leadership",
              isNew: true,
            })
          }
        >
          <PlusIcon />
          New automation
        </Button>
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [
            ZapIcon,
            "primary",
            "Automations on",
            automations.filter((l) => l.on).length,
          ],
          [
            PlayIcon,
            "violet",
            "Runs this month",
            num(automations.reduce((l, d) => l + d.runs, 0)),
          ],
          [CircleCheckIcon, "success", "Worked first time", "99.8%"],
          [HistoryIcon, "orange", "Staff hours saved (est.)", "~140"],
        ].map(([l, d, u, s]) => (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={u}
          >
            <IconTile icon={l} tone={d} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">
                {s}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{u}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-3">
        <FilterChips
          value={i}
          onChange={o}
          items={[
            ["all", "All"],
            ...[...new Set(automations.map((l) => l.team))].map((l) => [l, l]),
          ]}
        />
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {n.map((l) => (
          <div
            className={cn(
              "flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-card",
              !l.on && "opacity-75"
            )}
            key={l.id}
          >
            <div className="flex items-start gap-3">
              <IconTile icon={ZapIcon} tone={l.on ? "primary" : "neutral"} />
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="text-[14.5px] font-semibold">{l.name}</span>
                <span className="text-[12px] text-muted-foreground">
                  {l.id}
                  {" \xB7 "}
                  {l.team}
                  {" \xB7 last run "}
                  {l.last}
                </span>
              </div>
              <Switch
                checked={l.on}
                onChange={(d) => {
                  l.on = d
                  logAudit(
                    d ? "Turned on automation" : "Turned off automation",
                    l.id,
                    l.name
                  )
                  refresh()
                }}
                label={l.name}
              />
            </div>
            <div className="grid gap-1.5 text-[12.5px]">
              <FlowStep kind="When" tone="primary">
                {l.trigger}
              </FlowStep>
              {l.conds.map((d) => (
                <FlowStep kind="If" tone="warning" key={d}>
                  {d}
                </FlowStep>
              ))}
              {l.actions.map((d, u) => (
                <FlowStep kind="Then" tone="success" key={u}>
                  {d}
                </FlowStep>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between border-t pt-3 text-[12.5px]">
              <span className="text-muted-foreground">
                {num(l.runs)}
                {" runs"}
                {l.runs > 0 && ` \xB7 ${l.ok}% ok`}
              </span>
              <div className="flex gap-1.5">
                <Button size="xs" variant="ghost" onClick={() => r(l)}>
                  <HistoryIcon />
                  Runs
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    toast(
                      `Test run of ${l.id}: all ${l.actions.length} steps passed. Nothing was sent.`,
                      FlaskConicalIcon
                    )
                  }}
                >
                  <FlaskConicalIcon />
                  Test
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() =>
                    a({
                      ...l,
                      conds: [...l.conds],
                      actions: [...l.actions],
                    })
                  }
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {t && (
        <Dialog
          open
          onClose={() => a(null)}
          title={t.isNew ? "New automation" : `Edit ${t.id}`}
          width="max-w-[620px]"
          footer={
            <>
              <Button variant="outline" onClick={() => a(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const l = {
                    ...t,
                    name: t.name || `${t.trigger} \u2192 ${t.actions[0]}`,
                  }
                  delete l.isNew
                  if (t.isNew) {
                    automations.push(l)
                  } else {
                    Object.assign(
                      automations.find((d) => d.id === t.id),
                      l
                    )
                  }
                  logAudit(
                    t.isNew ? "Created automation" : "Edited automation",
                    l.id,
                    l.name
                  )
                  a(null)
                  refresh()
                  toast(t.isNew ? "Saved. Turn it on when ready." : "Saved")
                }}
              >
                <SaveIcon />
                Save
              </Button>
            </>
          }
        >
          <Field label="Name">
            <Input
              value={t.name}
              onChange={(l) =>
                a({
                  ...t,
                  name: l.target.value,
                })
              }
              placeholder="e.g. New ticket → assign support"
            />
          </Field>
          <div className="grid gap-3 rounded-xl border p-3.5">
            <span className="text-[12px] font-semibold tracking-wide text-primary uppercase">
              When
            </span>
            <Select
              value={t.trigger}
              onChange={(l) =>
                a({
                  ...t,
                  trigger: l.target.value,
                })
              }
            >
              {automationTriggers.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </div>
          <div className="flex justify-center">
            <ArrowDownIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="grid gap-2 rounded-xl border p-3.5">
            <span className="text-[12px] font-semibold tracking-wide text-warning uppercase">
              Only if (optional)
            </span>
            {t.conds.map((l, d) => (
              <div className="flex gap-2" key={d}>
                <Input
                  value={l}
                  onChange={(u) => {
                    const s = [...t.conds]
                    s[d] = u.target.value
                    a({
                      ...t,
                      conds: s,
                    })
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remove"
                  onClick={() =>
                    a({
                      ...t,
                      conds: t.conds.filter((u, s) => s !== d),
                    })
                  }
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
            <button
              className="w-fit text-[12.5px] font-medium text-primary"
              onClick={() =>
                a({
                  ...t,
                  conds: [...t.conds, "Area is Uttara"],
                })
              }
            >
              + Add condition
            </button>
          </div>
          <div className="flex justify-center">
            <ArrowDownIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="grid gap-2 rounded-xl border p-3.5">
            <span className="text-[12px] font-semibold tracking-wide text-success uppercase">
              Then do
            </span>
            {t.actions.map((l, d) => (
              <div className="flex gap-2" key={d}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-[12px] font-semibold text-success">
                  {d + 1}
                </span>
                <Input
                  value={l}
                  onChange={(u) => {
                    const s = [...t.actions]
                    s[d] = u.target.value
                    a({
                      ...t,
                      actions: s,
                    })
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remove"
                  onClick={() =>
                    a({
                      ...t,
                      actions: t.actions.filter((u, s) => s !== d),
                    })
                  }
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5">
              {automationActions.map((l) => (
                <button
                  onClick={() =>
                    a({
                      ...t,
                      actions: [...t.actions, l],
                    })
                  }
                  className="rounded-full border px-2.5 py-1 text-[12px] hover:bg-accent"
                  key={l}
                >
                  {"+ "}
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Field label="Team that owns it">
            <Select
              value={t.team}
              onChange={(l) =>
                a({
                  ...t,
                  team: l.target.value,
                })
              }
            >
              {[
                "Leadership",
                "Trust & Safety",
                "Operations",
                "Growth",
                "Finance",
                "Engineering",
              ].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </Field>
        </Dialog>
      )}
      {e && (
        <Sheet open onClose={() => r(null)}>
          <div className="border-b p-5">
            <div className="text-[17px] font-semibold">{e.name}</div>
            <div className="text-[12.5px] text-muted-foreground">
              Last 6 runs
            </div>
          </div>
          <div className="grid flex-1 content-start gap-2 overflow-auto p-5">
            {e.runs ? (
              [
                "Today, 11:10",
                "Today, 08:02",
                "Yesterday, 22:40",
                "Yesterday, 13:15",
                "21 Nov, 19:30",
                "20 Nov, 10:05",
              ].map((l, d) => (
                <div
                  className="flex items-center gap-3 rounded-xl border p-3"
                  key={l}
                >
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      d === 3 && e.ok < 100 ? "bg-warning" : "bg-success"
                    )}
                  />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13px] font-medium">{l}</span>
                    <span className="text-[12px] text-muted-foreground">
                      {e.actions.length}
                      {" steps \xB7 "}
                      {d === 3 && e.ok < 100 ? "1 step retried" : "all ok"}
                      {" \xB7 "}
                      {120 + d * 37}
                      {" ms"}
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                icon={HistoryIcon}
                title="No runs yet"
                text="Turn it on to start."
              />
            )}
          </div>
        </Sheet>
      )}
    </>
  )
}

function FlowStep({
  kind,
  tone,
  children,
}: {
  kind?: any
  tone?: any
  children?: any
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={cn(
          "w-11 shrink-0 rounded-md px-1.5 py-0.5 text-center text-[10.5px] font-bold tracking-wide uppercase",
          tone === "primary"
            ? "bg-primary/10 text-primary"
            : tone === "warning"
              ? "bg-warning/10 text-warning"
              : "bg-success/10 text-success"
        )}
      >
        {kind}
      </span>
      <span className="pt-0.5">{children}</span>
    </div>
  )
}
