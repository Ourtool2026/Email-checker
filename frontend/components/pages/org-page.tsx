"use client"

import { useEffect, useRef, useState } from "react"
import {
  Building2Icon,
  CalendarOffIcon,
  CrownIcon,
  DownloadIcon,
  GraduationCapIcon,
  LaptopIcon,
  LayoutGridIcon,
  ListIcon,
  MapPinIcon,
  MaximizeIcon,
  NetworkIcon,
  PhoneCallIcon,
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"
import { AddPersonDialog } from "@/components/org/add-person-dialog"
import { OrgBranch } from "@/components/org/org-chart"
import { PersonDrawer } from "@/components/org/person-drawer"
import { FilterChips } from "@/components/shared/filter-chips"
import { PageHeader } from "@/components/shared/page-header"
import { ScoreRing } from "@/components/shared/score-ring"
import { SearchInput } from "@/components/shared/search-input"
import { Avatar } from "@/components/hq/avatar"
import { Badge, Tag } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { IconTile } from "@/components/hq/icon-tile"
import { Progress } from "@/components/hq/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/hq/table"
import { Tabs } from "@/components/hq/tabs"
import { Tooltip } from "@/components/hq/tooltip"
import {
  activePeople,
  childrenOf,
  loadOf,
  offices,
  orgPeople,
  orgPhoto,
  orgTeams,
  presence,
  workloadOf,
} from "@/lib/data/org"
import { copyText } from "@/lib/store"
import { cn } from "@/lib/utils"

export function OrgPage({ nav }: { nav?: any }) {
  const [a, e] = useState("chart")
  const [r, i] = useState("all")
  const [o, n] = useState("")
  const [l, d] = useState(null)
  const [u, s] = useState([])
  const [m, f] = useState(0.9 /* .9 */)
  const [h, B] = useState({
    x: 0,
    y: 0,
  })
  const y = useRef(null)
  const W = useRef(null)
  const x = useRef(null)
  const k = () => {
    const G = W.current
    const jt = x.current
    if (G && jt) {
      B({
        x: 0,
        y: 0,
      })
      f(
        Math.max(
          0.5 /* .5 */,
          Math.min(1, (G.clientWidth - 40) / jt.scrollWidth)
        )
      )
    }
  }
  useEffect(() => {
    if (a === "chart") {
      setTimeout(k, 30)
    }
  }, [a, u.length])
  const [N, q] = useState(false)
  const _ = o.trim().toLowerCase()
  const gt = (G?) =>
    !!_ && !G.open && (G.name + G.title).toLowerCase().includes(_)
  const P = (G?) =>
    (r !== "all" && G.team !== r && G.team !== "exec") ||
    (!!_ && !gt(G) && G.parent !== null)
  const O = activePeople()
  const J = O.filter((G) => childrenOf(G.id).length)
  const lt = (
    J.reduce((G, jt) => G + childrenOf(jt.id).length, 0) / J.length
  ).toFixed(1)
  const It = orgPeople.find((G) => G.parent === null)
  const me = l && orgPeople.find((G) => G.id === l)
  const se = (G?) => {
    if (!G.target.closest("button")) {
      y.current = {
        x: G.clientX - h.x,
        y: G.clientY - h.y,
      }
    }
  }
  const ue = (G?) => {
    if (y.current) {
      B({
        x: G.clientX - y.current.x,
        y: G.clientY - y.current.y,
      })
    }
  }
  const ha = (G?) => {
    if (G.ctrlKey || G.metaKey) {
      G.preventDefault()
      f((jt) =>
        Math.min(1.6, Math.max(0.4 /* .4 */, jt - G.deltaY * 0.002 /* .002 */))
      )
    }
  }
  return (
    <>
      <PageHeader
        title="Organization"
        desc="Who is on the team, who they report to, where they work and what they are working on right now. Click anyone to open their profile."
        badge={
          <Badge tone="primary" dot={false}>
            CEO view
          </Badge>
        }
      >
        <Button
          variant="outline"
          onClick={() =>
            copyText(
              O.map((G) =>
                [
                  G.name,
                  G.title,
                  orgTeams[G.team][0],
                  (orgPeople.find((jt) => jt.id === G.parent) || {}).name || "",
                  offices[G.loc][0],
                ].join(",")
              ).join(`
  `),
              "Org chart copied as CSV"
            )
          }
        >
          <DownloadIcon />
          Export
        </Button>
        <Button onClick={() => q(true)}>
          <PlusIcon />
          Add person or role
        </Button>
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {(
          [
            [UsersIcon, "primary", "People", O.length],
            [
              UserPlusIcon,
              "violet",
              "Open roles",
              orgPeople.filter((G) => G.open).length,
            ],
            [Building2Icon, "teal", "Teams", Object.keys(orgTeams).length - 1],
            [
              MapPinIcon,
              "orange",
              "Places of work",
              Object.keys(offices).length,
            ],
            [NetworkIcon, "success", "People per manager", lt],
            [
              CalendarOffIcon,
              "danger",
              "On leave today",
              O.filter((G) => G.status === "leave").length,
            ],
          ] as any[]
        ).map(([G, jt, Ia, Wt]) => (
          <div
            className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-card"
            key={Ia}
          >
            <IconTile icon={G} tone={jt} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">
                {Wt}
              </span>
              <span className="text-[12.5px] text-muted-foreground">{Ia}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Tabs
          value={a}
          onChange={e}
          items={[
            {
              value: "chart",
              label: "Chart",
              icon: NetworkIcon,
            },
            {
              value: "teams",
              label: "Teams",
              icon: LayoutGridIcon,
            },
            {
              value: "where",
              label: "Where",
              icon: MapPinIcon,
            },
            {
              value: "list",
              label: "Directory",
              icon: ListIcon,
            },
          ]}
        />
        <SearchInput
          value={o}
          onChange={n}
          placeholder="Find a person or role"
          className="w-full sm:w-60"
        />
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          <FilterChips
            value={r}
            onChange={i}
            items={[
              ["all", "All teams"],
              ...Object.entries(orgTeams)
                .filter(([G]) => G !== "exec")
                .map(([G, [jt]]) => [G, jt]),
            ]}
          />
        </div>
      </div>
      {a === "chart" && (
        <div
          ref={W}
          className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface"
          style={{
            height: "calc(100vh - 330px)",
            minHeight: 520,
            backgroundImage:
              "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          onMouseDown={se}
          onMouseMove={ue}
          onMouseUp={() => (y.current = null)}
          onMouseLeave={() => (y.current = null)}
          onWheel={ha}
        >
          <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
            <div
              ref={x}
              className="org absolute top-8 left-1/2 w-max origin-top transition-transform duration-75"
              style={{
                transform: `translate(calc(-50% + ${h.x}px), ${h.y}px) scale(${m})`,
              }}
            >
              <ul>
                <OrgBranch
                  o={It}
                  sel={l}
                  dimmed={P}
                  hits={gt}
                  onPick={(G) => d(G.id)}
                  folded={u}
                  setFolded={s}
                />
              </ul>
            </div>
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-xl border bg-card p-1 shadow-card">
            <Tooltip label="Zoom out">
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Zoom out"
                onClick={() =>
                  f((G) => Math.max(0.4 /* .4 */, G - 0.1 /* .1 */))
                }
              >
                <ZoomOutIcon />
              </Button>
            </Tooltip>
            <span className="w-11 text-center text-[12px] tabular-nums">
              {Math.round(m * 100)}%
            </span>
            <Tooltip label="Zoom in">
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Zoom in"
                onClick={() => f((G) => Math.min(1.6, G + 0.1 /* .1 */))}
              >
                <ZoomInIcon />
              </Button>
            </Tooltip>
            <span className="mx-0.5 h-5 w-px bg-border" />
            <Tooltip label="Fit to screen">
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Fit"
                onClick={k}
              >
                <MaximizeIcon />
              </Button>
            </Tooltip>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                s(u.length ? [] : J.filter((G) => G.parent).map((G) => G.id))
              }
            >
              {u.length ? "Expand all" : "Collapse teams"}
            </Button>
          </div>
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-xl border bg-card/90 px-3 py-2 text-[11.5px] text-muted-foreground backdrop-blur">
            {Object.entries(presence).map(([G, [jt, Ia]]) => (
              <span className="flex items-center gap-1.5" key={G}>
                <span className={cn("size-2 rounded-full", Ia)} />
                {jt}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <PhoneCallIcon className="size-3 text-primary" />
              On call
            </span>
            <span className="hidden sm:inline">
              Drag to move · Ctrl + scroll to zoom
            </span>
          </div>
        </div>
      )}
      {a === "teams" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(orgTeams)
            .filter(([G]) => G !== "exec" && (r === "all" || r === G))
            .map(([G, [jt, Ia, Wt]]) => {
              const X = orgPeople.filter((xt) => xt.team === G)
              const ea = X.find((xt) => xt.parent === "ceo")
              const K = X.filter((xt) => !xt.open)
              const Mt = Math.round(
                K.reduce((xt, ra) => xt + loadOf(ra.name), 0) / K.length
              )
              return (
                <section
                  className="rounded-3xl border border-surface-border bg-surface p-1.5 shadow-card"
                  key={G}
                >
                  <header className="flex items-center gap-3 px-3 pt-2 pb-2.5">
                    <IconTile icon={Wt} tone={Ia} size="sm" />
                    <div className="grid flex-1 leading-tight">
                      <span className="text-[15px] font-semibold">{jt}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {K.length}
                        {" people"}
                        {X.length > K.length &&
                          ` \xB7 ${X.length - K.length} hiring`}
                      </span>
                    </div>
                    <Tooltip label="Average workload">
                      <ScoreRing
                        value={Mt}
                        size={38}
                        stroke={4}
                        tone={
                          Mt > 75
                            ? "var(--destructive)"
                            : Mt > 55
                              ? "var(--warning)"
                              : "var(--success)"
                        }
                      />
                    </Tooltip>
                  </header>
                  <div className="grid gap-1 rounded-2xl border bg-card p-2 shadow-card">
                    {X.sort(
                      (xt, ra) => Number(ra === ea) - Number(xt === ea)
                    ).map((xt) =>
                      xt.open ? (
                        <div
                          className="flex items-center gap-3 rounded-xl border border-dashed p-2 text-[13px] text-muted-foreground"
                          key={xt.id}
                        >
                          <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                            <UserPlusIcon className="size-4" />
                          </span>
                          {"Hiring: "}
                          {xt.title}
                        </div>
                      ) : (
                        <button
                          onClick={() => d(xt.id)}
                          className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-muted/60"
                          key={xt.id}
                        >
                          <span className="relative">
                            <Avatar
                              name={xt.name}
                              photo={orgPhoto(xt.name)}
                              size={34}
                            />
                            <span
                              className={cn(
                                "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-card",
                                presence[xt.status][1]
                              )}
                            />
                          </span>
                          <span className="grid min-w-0 flex-1 leading-tight">
                            <span className="truncate text-[13.5px] font-medium">
                              {xt.name}
                              {xt === ea && (
                                <Tag className="ml-1.5" icon={CrownIcon}>
                                  Lead
                                </Tag>
                              )}
                            </span>
                            <span className="truncate text-[12px] text-muted-foreground">
                              {xt.title}
                            </span>
                          </span>
                          <div className="w-16">
                            <Progress
                              value={loadOf(xt.name)}
                              tone={
                                loadOf(xt.name) > 75
                                  ? "danger"
                                  : loadOf(xt.name) > 55
                                    ? "warning"
                                    : "success"
                              }
                            />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </section>
              )
            })}
        </div>
      )}
      {a === "where" && (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(offices).map(([G, [jt, Ia]]) => {
            const Wt = activePeople().filter(
              (X) => X.loc === G && (r === "all" || X.team === r)
            )
            return (
              <Card
                icon={
                  G === "remote"
                    ? LaptopIcon
                    : G === "diu"
                      ? GraduationCapIcon
                      : Building2Icon
                }
                title={jt}
                description={`${Ia} \xB7 ${Wt.length} ${Wt.length === 1 ? "person" : "people"}`}
                actions={
                  <span className="flex items-center gap-1.5 text-[12px]">
                    <span className="size-2 rounded-full bg-success" />
                    {Wt.filter((X) => X.status === "online").length}
                    {" online"}
                  </span>
                }
                key={G}
              >
                {G === "mirpur" && (
                  <div className="mb-3 grid grid-cols-6 gap-1.5">
                    {Array.from(
                      {
                        length: 12,
                      },
                      (X, ea) => {
                        const K = Wt[ea]
                        return (
                          <Tooltip
                            label={
                              K
                                ? `${K.name} \xB7 desk ${ea + 1}`
                                : `Desk ${ea + 1} free`
                            }
                            key={ea}
                          >
                            <div
                              className={cn(
                                "flex aspect-square items-center justify-center rounded-lg border",
                                K ? "bg-primary/[0.06]" : "border-dashed"
                              )}
                            >
                              {K ? (
                                <Avatar
                                  name={K.name}
                                  photo={orgPhoto(K.name)}
                                  size={28}
                                />
                              ) : (
                                <span className="text-[10.5px] text-muted-foreground">
                                  {ea + 1}
                                </span>
                              )}
                            </div>
                          </Tooltip>
                        )
                      }
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {Wt.map((X) => (
                    <button
                      onClick={() => d(X.id)}
                      className="flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 hover:bg-muted/60"
                      key={X.id}
                    >
                      <span className="relative">
                        <Avatar
                          name={X.name}
                          photo={orgPhoto(X.name)}
                          size={26}
                        />
                        <span
                          className={cn(
                            "absolute right-0 bottom-0 size-2 rounded-full ring-2 ring-card",
                            presence[X.status][1]
                          )}
                        />
                      </span>
                      <span className="text-[12.5px] font-medium">
                        {X.name}
                      </span>
                      <span className="text-[11.5px] text-muted-foreground">
                        {orgTeams[X.team][0]}
                      </span>
                    </button>
                  ))}
                  {!Wt.length && (
                    <span className="text-[12.5px] text-muted-foreground">
                      Nobody here for this filter
                    </span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
      {a === "list" && (
        <Card flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Reports to</TableHead>
                <TableHead>Where</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Open tasks</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgPeople
                .filter((G) => !G.open && !P(G))
                .map((G) => {
                  const jt = orgPeople.find((Ia) => Ia.id === G.parent)
                  return (
                    <TableRow onClick={() => d(G.id)} key={G.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={G.name}
                            photo={orgPhoto(G.name)}
                            size={30}
                          />
                          <div className="grid leading-tight">
                            <span className="font-medium">{G.name}</span>
                            <span className="text-[12px] text-muted-foreground">
                              {G.title}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge tone={orgTeams[G.team][1]} dot={false}>
                          {orgTeams[G.team][0]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {jt ? (
                          jt.name
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{offices[G.loc][0]}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              presence[G.status][1]
                            )}
                          />
                          {presence[G.status][0]}
                        </span>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {workloadOf(G.name).length}
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress
                            value={loadOf(G.name)}
                            tone={
                              loadOf(G.name) > 75
                                ? "danger"
                                : loadOf(G.name) > 55
                                  ? "warning"
                                  : "success"
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {G.joined}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </Card>
      )}
      {me && (
        <PersonDrawer
          o={me}
          onClose={() => d(null)}
          onPick={(G) => d(G)}
          nav={nav}
        />
      )}
      <AddPersonDialog open={N} onClose={() => q(false)} />
    </>
  )
}
