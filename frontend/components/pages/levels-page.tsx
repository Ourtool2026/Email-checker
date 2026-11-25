"use client"

import {
  CheckIcon,
  GiftIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar } from "@/components/hq/avatar"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Field, Input } from "@/components/hq/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { toast } from "@/components/hq/toast"
import { getUser, stayLevels, totals } from "@/lib/data/core"
import { num } from "@/lib/format"
import { logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export function LevelsPage() {
  const t = stayLevels
  const a = totals.levels.reduce((r, i) => r + i, 0)
  const e = ["bg-muted-foreground/40", "bg-primary", "bg-violet"]
  return (
    <>
      <PageHeader
        title={"Stay Levels & rewards"}
        desc="Levels grow with on-time stays on MyStay. Hostels choose to give the discount; MyStay never pays or collects it."
      >
        <Button
          onClick={() => {
            logAudit("Saved Stay Levels", "Levels 1\u20133", "Thresholds")
            toast("Levels saved. Apps update within an hour.")
          }}
        >
          <CheckIcon />
          Save
        </Button>
      </PageHeader>
      <Card
        icon={UsersIcon}
        title="People at each level"
        description={`${num(a)} users with a Living ID`}
        className="mb-4"
      >
        <div className="flex h-3 overflow-hidden rounded-full">
          {totals.levels.map((r, i) => (
            <span
              className={e[i]}
              style={{
                width: (r / a) * 100 + "%",
              }}
              key={i}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-5 text-[13px]">
          {totals.levels.map((r, i) => (
            <span className="flex items-center gap-2" key={i}>
              <span className={cn("size-2.5 rounded-full", e[i])} />
              {"Level "}
              {i + 1}
              {" \xB7 "}
              <b className="font-semibold tabular-nums">{num(r)}</b>{" "}
              <span className="text-muted-foreground">
                ({Math.round((r / a) * 100)}%)
              </span>
            </span>
          ))}
        </div>
      </Card>
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        {t.map((r, i) => (
          <section
            className="rounded-3xl border border-surface-border bg-surface p-1.5 shadow-card"
            key={r.n}
          >
            <header className="flex items-center gap-3 px-3 pt-2 pb-2.5">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl bg-gradient-to-b text-white",
                  i === 0
                    ? "from-slate-400 to-slate-600"
                    : i === 1
                      ? "from-[#2CB8FF] to-[#2B6BFF]"
                      : "from-violet-400 to-violet-700"
                )}
              >
                <StarIcon className="size-[18px]" />
              </span>
              <div className="grid leading-tight">
                <span className="text-[15px] font-semibold">
                  {"Level "}
                  {r.n}
                  {" \xB7 "}
                  {r.name}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {num(totals.levels[i])}
                  {" people"}
                </span>
              </div>
            </header>
            <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-card">
              <Field label="Stays needed">
                <Input
                  type="number"
                  value={r.min}
                  disabled={i === 0}
                  onChange={(o) => {
                    r.min = +o.target.value
                    refresh()
                  }}
                />
              </Field>
              <Field label="Suggested hostel discount (%)">
                <Input
                  type="number"
                  value={r.off}
                  onChange={(o) => {
                    r.off = +o.target.value
                    refresh()
                  }}
                />
              </Field>
              <Field label="What they see">
                <Input
                  value={r.perk}
                  onChange={(o) => {
                    r.perk = o.target.value
                    refresh()
                  }}
                />
              </Field>
            </div>
          </section>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card icon={GiftIcon} title="Hostels giving Stay Level discounts">
          <div className="flex items-center gap-4">
            <span className="text-[32px] leading-none font-semibold tabular-nums">
              71%
            </span>
            <span className="text-[13px] text-muted-foreground">
              105 of 148 hostels. Hostels that give it fill seats 9 days faster
              on average.
            </span>
          </div>
        </Card>
        <Card
          icon={UserPlusIcon}
          title="Referrals"
          description="Bring a friend codes"
          flush
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Moved in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["NUSRAT26", "u0", 14, 6],
                ["RAKIB10", "u23", 9, 2],
                ["FARHANA", "u1", 7, 4],
              ].map(([r, i, o, n]) => (
                <TableRow key={r}>
                  <TableCell className="font-mono text-[13px]">{r}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={getUser(i).name}
                        photo={getUser(i).photo}
                        size={22}
                      />
                      {getUser(i).name}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{o}</TableCell>
                  <TableCell className="tabular-nums">{n}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  )
}
