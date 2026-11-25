"use client"

import { useState } from "react"
import { ActionButton } from "@/components/hq/gate"
import {
  AppleIcon,
  CheckIcon,
  GlobeIcon,
  MapPinIcon,
  SmartphoneIcon,
  ToggleRightIcon,
  WrenchIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/hq/badge"
import { Card } from "@/components/hq/card"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input, Select, Textarea } from "@/components/hq/input"
import { Switch } from "@/components/hq/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import { cities, featureFlags } from "@/lib/data/core"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AppControlPage() {
  const [t, a] = useState({
    android: "2.4.1",
    ios: "2.4.0",
    minA: "2.2.0",
    minI: "2.2.0",
    force: false,
    web: "1.9.3",
  })
  const [e, r] = useState({
    on: false,
    app: "Both apps",
    text: "Living ID scans may be slow on Sunday 30 Nov, 2\u20133 am, for an upgrade.",
  })
  const i = (o?, n?, l?, d?) => {
    o[n] = l
    if (window.MS) {
      window.MS.emit("app.flag", {
        key: o.key,
        field: n,
        value: l,
        name: o.name,
      })
    }
    logAudit("Changed feature switch", o.name, d)
    refresh()
  }
  return (
    <>
      <PageHeader
        title="App control"
        desc="Run both apps from one place: versions, feature switches, live areas and maintenance notices. Changes reach phones within a few minutes."
      />
      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Card
          icon={SmartphoneIcon}
          title="MyStay ID mobile app"
          description="Students, residents and landlords"
        >
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <IconTile icon={SmartphoneIcon} tone="success" size="sm" />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">
                    {"Android "}
                    {t.android}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    86% of users on latest
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <IconTile icon={AppleIcon} size="sm" />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13px] font-medium">
                    {"iOS "}
                    {t.ios}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    91% of users on latest
                  </span>
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Oldest Android allowed">
                <Input
                  value={t.minA}
                  onChange={(o) =>
                    a({
                      ...t,
                      minA: o.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Oldest iOS allowed">
                <Input
                  value={t.minI}
                  onChange={(o) =>
                    a({
                      ...t,
                      minI: o.target.value,
                    })
                  }
                />
              </Field>
            </div>
            <div className="flex items-center gap-3 rounded-xl border px-3.5 py-3">
              <span className="grid flex-1 leading-tight">
                <span className="text-[13.5px] font-medium">Force update</span>
                <span className="text-[12.5px] text-muted-foreground">
                  People below the oldest version can’t open the app until they
                  update
                </span>
              </span>
              <Switch
                checked={t.force}
                onChange={(o) => {
                  a({
                    ...t,
                    force: o,
                  })
                  logAudit(
                    o ? "Turned on force update" : "Turned off force update",
                    "Mobile app",
                    `min ${t.minA} / ${t.minI}`
                  )
                  toast(o ? "Force update is on" : "Force update is off")
                }}
                label="Force update"
              />
            </div>
          </div>
        </Card>
        <Card
          icon={GlobeIcon}
          title="MyStay for Business web app"
          description="Hostel owners and staff"
        >
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <IconTile icon={GlobeIcon} tone="primary" size="sm" />
              <span className="grid flex-1 leading-tight">
                <span className="text-[13px] font-medium">
                  {"Version "}
                  {t.web}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  Released 18 Nov · 148 hostels on it
                </span>
              </span>
              <Badge tone="success">Live</Badge>
            </div>
            <div className="flex items-center gap-3 rounded-xl border px-3.5 py-3">
              <span className="grid flex-1 leading-tight">
                <span className="text-[13.5px] font-medium">
                  Maintenance notice
                </span>
                <span className="text-[12.5px] text-muted-foreground">
                  {"A banner at the top of "}
                  {e.app.toLowerCase()}
                </span>
              </span>
              <Switch
                checked={e.on}
                onChange={(o) => {
                  r({
                    ...e,
                    on: o,
                  })
                  logAudit(
                    o
                      ? "Turned on maintenance notice"
                      : "Turned off maintenance notice",
                    e.app,
                    e.text
                  )
                  toast(o ? "Notice is showing" : "Notice removed")
                }}
                label="Maintenance notice"
              />
            </div>
            <Field label="Show on">
              <Select
                value={e.app}
                onChange={(o) =>
                  r({
                    ...e,
                    app: o.target.value,
                  })
                }
              >
                <option>Both apps</option>
                <option>Mobile app</option>
                <option>Business web app</option>
              </Select>
            </Field>
            <Field label="Text">
              <Textarea
                rows={2}
                value={e.text}
                onChange={(o) =>
                  r({
                    ...e,
                    text: o.target.value,
                  })
                }
              />
            </Field>
            {e.on && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-[12.5px] font-medium text-amber-950">
                <WrenchIcon className="size-4" />
                {e.text}
              </div>
            )}
          </div>
        </Card>
      </div>
      <Card
        icon={ToggleRightIcon}
        title="Feature switches"
        description="Turn features on or off per app, and roll out to a share of users first"
        flush
        className="mb-4"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Android</TableHead>
              <TableHead>iOS</TableHead>
              <TableHead>Mobile rollout</TableHead>
              <TableHead>Business web</TableHead>
              <TableHead>Where</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featureFlags.map((o) => (
              <TableRow key={o.key}>
                <TableCell>
                  <div className="grid leading-tight">
                    <span className="font-medium">{o.name}</span>
                    <span className="text-[12px] text-muted-foreground">
                      {o.desc}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {o.app != null ? (
                    <Switch
                      checked={o.android}
                      onChange={(n) =>
                        i(o, "android", n, `Android ${n ? "on" : "off"}`)
                      }
                      label={`${o.name} Android`}
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {o.app != null ? (
                    <Switch
                      checked={o.ios}
                      onChange={(n) =>
                        i(o, "ios", n, `iOS ${n ? "on" : "off"}`)
                      }
                      label={`${o.name} iOS`}
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {o.app != null ? (
                    <div className="flex w-40 items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={o.app}
                        onChange={(n) => {
                          o.app = +n.target.value
                          refresh()
                        }}
                        onMouseUp={() => {
                          logAudit("Changed rollout", o.name, o.app + "%")
                          if (window.MS) {
                            window.MS.emit("app.flag", {
                              key: o.key,
                              field: "app",
                              value: o.app,
                              name: o.name,
                            })
                          }
                        }}
                        onKeyUp={() =>
                          window.MS &&
                          window.MS.emit("app.flag", {
                            key: o.key,
                            field: "app",
                            value: o.app,
                            name: o.name,
                          })
                        }
                        className="flex-1 accent-primary"
                        aria-label={`${o.name} rollout`}
                      />
                      <span className="w-10 text-right text-[12.5px] font-medium tabular-nums">
                        {o.app}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {o.web != null ? (
                    <Switch
                      checked={o.web > 0}
                      onChange={(n) =>
                        i(o, "web", n ? 100 : 0, `Web ${n ? "on" : "off"}`)
                      }
                      label={`${o.name} web`}
                    />
                  ) : (
                    <span className="text-muted-foreground">Not on web</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {o.cities}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Card
        icon={MapPinIcon}
        title="Where MyStay is live"
        description="Turning an area on lets hostels and landlords there list, and shows it on the Living Map"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {cities.map((o) => (
            <div
              className="grid content-start gap-2.5 rounded-xl border p-3.5"
              key={o.name}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold">{o.name}</span>
                <Badge tone={o.status === "Live" ? "success" : "neutral"}>
                  {o.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {o.areas.map((n) => (
                  <ActionButton right="app_control"
                    onClick={() => {
                      n[1] = !n[1]
                      if (n[1]) {
                        o.status = "Live"
                      }
                      logAudit(
                        n[1] ? "Opened area" : "Closed area",
                        `${n[0]}, ${o.name}`,
                        "\u2014"
                      )
                      refresh()
                    }}
                    aria-pressed={n[1]}
                    className={cn(
                      "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[12.5px] font-medium",
                      n[1]
                        ? "border-success/40 bg-success/10 text-success"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    key={n[0]}
                  >
                    {n[1] && <CheckIcon className="size-3" />}
                    {n[0]}
                  </ActionButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
