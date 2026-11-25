"use client"

import { useState } from "react"
import { ChartLineIcon, CopyIcon, Link2Icon } from "lucide-react"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Field, Input, Select } from "@/components/hq/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { num } from "@/lib/format"
import { copyText } from "@/lib/store"

export function UtmBuilder() {
  const [t, a] = useState({
    url: "https://mystayid.com/get",
    src: "facebook",
    med: "paid",
    camp: "diu-orientation-nov26",
  })
  const e = `${t.url}?utm_source=${t.src}&utm_medium=${t.med}&utm_campaign=${t.camp}`
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card
        icon={Link2Icon}
        title="Tracked link builder"
        description="Every link in a post or ad should carry these tags so sign-ups are counted to the right channel"
      >
        <div className="grid gap-4">
          <Field label="Page">
            <Input
              value={t.url}
              onChange={(r) =>
                a({
                  ...t,
                  url: r.target.value,
                })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Source">
              <Select
                value={t.src}
                onChange={(r) =>
                  a({
                    ...t,
                    src: r.target.value,
                  })
                }
              >
                {[
                  "facebook",
                  "instagram",
                  "tiktok",
                  "youtube",
                  "ambassador",
                  "qr-standee",
                ].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Medium">
              <Select
                value={t.med}
                onChange={(r) =>
                  a({
                    ...t,
                    med: r.target.value,
                  })
                }
              >
                {["paid", "organic", "referral", "print"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Campaign">
              <Input
                value={t.camp}
                onChange={(r) =>
                  a({
                    ...t,
                    camp: r.target.value,
                  })
                }
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-muted/60 p-3">
            <code className="flex-1 font-mono text-[12px] break-all">{e}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyText(e, "Link copied")}
            >
              <CopyIcon />
              Copy
            </Button>
          </div>
        </div>
      </Card>
      <Card icon={ChartLineIcon} title="Recent links" flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["diu-orientation-nov26", "qr-standee", 2140, 512],
              ["uttara-girls-nov", "facebook", 9800, 640],
              ["living-id-reel", "instagram", 4100, 230],
              ["landlord-mirpur", "print", 610, 41],
            ].map((r) => (
              <TableRow key={r[0]}>
                <TableCell className="font-mono text-[12.5px]">
                  {r[0]}
                </TableCell>
                <TableCell>{r[1]}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {num(r[2])}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {num(r[3])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
