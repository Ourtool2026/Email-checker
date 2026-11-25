"use client"

import { useState } from "react"
import {
  CheckIcon,
  CircleCheckIcon,
  FlaskConicalIcon,
  PauseIcon,
  PencilIcon,
  PlusIcon,
  ShieldAlertIcon,
  ZapIcon,
} from "lucide-react"
import { Notice } from "@/components/shared/notice"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input, Select } from "@/components/hq/input"
import { Switch } from "@/components/hq/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { Tabs } from "@/components/hq/tabs"
import { toast } from "@/components/hq/toast"
import { Tooltip } from "@/components/hq/tooltip"
import { riskRules } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"

const severityTones: Record<string, any> = {
  high: "danger",
  med: "warning",
  low: "neutral",
}

export function RulesPage() {
  const [t, a] = useState(null)
  const [e, r] = useState(null)
  return (
    <>
      <PageHeader
        title={"Fraud & risk rules"}
        desc="Automatic checks that run on every sign-up, scan, report and listing edit. When a rule matches, it takes the action and logs it."
      >
        <Button
          onClick={() =>
            a({
              id: "R-0" + (riskRules.length + 1),
              name: "",
              when: "",
              then: "",
              on: false,
              hits: 0,
              last: "\u2014",
              sev: "med",
              isNew: true,
            })
          }
        >
          <PlusIcon />
          New rule
        </Button>
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [
            "Rules on",
            riskRules.filter((i) => i.on).length,
            ZapIcon,
            "primary",
          ],
          [
            "Matches (7 days)",
            riskRules.reduce((i, o) => i + o.hits, 0),
            ShieldAlertIcon,
            "warning",
          ],
          ["Accounts held", 19, PauseIcon, "danger"],
          ["Wrong matches undone", "4%", CircleCheckIcon, "success"],
        ].map(([i, o, n, l]) => (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={i}
          >
            <IconTile icon={n} tone={l} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">
                {o}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{i}</span>
            </div>
          </div>
        ))}
      </div>
      <Card flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Then</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Matches (7 d)</TableHead>
              <TableHead>On</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {riskRules.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <div className="grid leading-tight">
                    <span className="font-medium">{i.name}</span>
                    <span className="font-mono text-[11.5px] text-muted-foreground">
                      {i.id}
                      {" \xB7 last "}
                      {i.last}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[240px] text-[13px]">
                  {i.when}
                </TableCell>
                <TableCell className="max-w-[200px] text-[13px] text-muted-foreground">
                  {i.then}
                </TableCell>
                <TableCell>
                  <Badge tone={severityTones[i.sev]}>
                    {i.sev === "med"
                      ? "Medium"
                      : i.sev[0].toUpperCase() + i.sev.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {i.hits}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={i.on}
                    onChange={(o) => {
                      i.on = o
                      logAudit(
                        o ? "Turned on rule" : "Turned off rule",
                        i.id,
                        i.name
                      )
                      refresh()
                      toast(o ? "Rule is on" : "Rule is off")
                    }}
                    label={i.name}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Tooltip label="Test on last 7 days">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Test rule"
                        onClick={() => r(i)}
                      >
                        <FlaskConicalIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Edit">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Edit rule"
                        onClick={() =>
                          a({
                            ...i,
                          })
                        }
                      >
                        <PencilIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={!!t}
        onClose={() => a(null)}
        title={t?.isNew ? "New rule" : `Edit ${t?.id}`}
        width="max-w-[620px]"
        footer={
          <>
            <Button variant="outline" onClick={() => a(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (t.isNew) {
                  riskRules.push({
                    ...t,
                    name: t.name || "New rule",
                    when:
                      t.when || "Same device signs in to 5+ accounts in a day",
                    then: t.then || "Open a case",
                    isNew: undefined,
                  })
                } else {
                  Object.assign(
                    riskRules.find((i) => i.id === t.id),
                    t
                  )
                }
                logAudit(t.isNew ? "Created rule" : "Edited rule", t.id, t.name)
                a(null)
                refresh()
                toast("Rule saved. Starts off until you turn it on.")
              }}
            >
              <CheckIcon />
              Save rule
            </Button>
          </>
        }
      >
        {t && (
          <>
            <Field label="Name">
              <Input
                value={t.name}
                onChange={(i) =>
                  a({
                    ...t,
                    name: i.target.value,
                  })
                }
                placeholder="e.g. Many sign-ins from one device"
              />
            </Field>
            <div className="grid gap-2 rounded-xl border p-3.5">
              <span className="text-[13px] font-semibold">When</span>
              <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_0.6fr_0.8fr]">
                <Select>
                  <option>Same device</option>
                  <option>Gate face score</option>
                  <option>Active reports</option>
                  <option>Failed scans</option>
                  <option>Listing price change</option>
                </Select>
                <Select>
                  <option>signs up accounts</option>
                  <option>is below</option>
                  <option>is at least</option>
                  <option>rises by</option>
                </Select>
                <Input defaultValue="3" />
                <Select>
                  <option>in 24 hours</option>
                  <option>in 10 minutes</option>
                  <option>in 90 days</option>
                  <option>in one edit</option>
                </Select>
              </div>
              <button className="w-fit text-[12.5px] font-medium text-primary">
                + Add condition
              </button>
            </div>
            <div className="grid gap-2 rounded-xl border p-3.5">
              <span className="text-[13px] font-semibold">Then</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Hold the account",
                  "Open a case",
                  "Safety alert",
                  "Notify the hostel",
                  "Send to review",
                  "Slack #trust-safety",
                ].map((i, o) => (
                  <label
                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12.5px] has-[:checked]:border-primary/40 has-[:checked]:bg-primary/[0.06]"
                    key={i}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={o < 2}
                      className="accent-primary"
                    />
                    {i}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Severity">
              <Tabs
                size="sm"
                value={t.sev}
                onChange={(i) =>
                  a({
                    ...t,
                    sev: i,
                  })
                }
                items={[
                  {
                    value: "low",
                    label: "Low",
                  },
                  {
                    value: "med",
                    label: "Medium",
                  },
                  {
                    value: "high",
                    label: "High",
                  },
                ]}
              />
            </Field>
          </>
        )}
      </Dialog>
      <Dialog
        open={!!e}
        onClose={() => r(null)}
        title={`Test \u201C${e?.name}\u201D`}
        description="Ran against the last 7 days. Nothing was changed."
        footer={<Button onClick={() => r(null)}>Done</Button>}
      >
        {e && (
          <>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Would match", e.hits + 2],
                ["Already caught", e.hits],
                ["New", 2],
              ].map(([i, o]) => (
                <div className="rounded-xl border bg-muted/60 p-3" key={i}>
                  <div className="text-[20px] font-semibold tabular-nums">
                    {o}
                  </div>
                  <div className="text-[12px] text-muted-foreground">{i}</div>
                </div>
              ))}
            </div>
            <Notice>
              2 new matches: accounts made from device ··7F21 on 21 and 22 Nov.
            </Notice>
          </>
        )}
      </Dialog>
    </>
  )
}
