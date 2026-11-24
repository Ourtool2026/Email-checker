"use client";

import { useEffect, useRef, useState } from "react";
import {
  LuBuilding2,
  LuCalendarOff,
  LuCrown,
  LuDownload,
  LuGraduationCap,
  LuLaptop,
  LuLayoutGrid,
  LuList,
  LuMapPin,
  LuMaximize,
  LuNetwork,
  LuPhoneCall,
  LuPlus,
  LuUserPlus,
  LuUsers,
  LuZoomIn,
  LuZoomOut,
} from "react-icons/lu";
import { AddPersonDialog } from "@/components/org/add-person-dialog";
import { OrgBranch } from "@/components/org/org-chart";
import { PersonDrawer } from "@/components/org/person-drawer";
import { FilterChips } from "@/components/shared/filter-chips";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { SearchInput } from "@/components/shared/search-input";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
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
} from "@/lib/data/org";
import { copyText } from "@/lib/store";
import { cn } from "@/lib/utils";

export function OrgPage({ nav }) {
  let [a, e] = useState("chart");
  let [r, i] = useState("all");
  let [o, n] = useState("");
  let [l, d] = useState(null);
  let [u, s] = useState([]);
  let [m, f] = useState(0.9 /* .9 */);
  let [h, B] = useState({
    x: 0,
    y: 0,
  });
  let y = useRef(null);
  let W = useRef(null);
  let x = useRef(null);
  let k = () => {
    let G = W.current;
    let jt = x.current;
    if (G && jt) {
      B({
        x: 0,
        y: 0,
      });
      f(Math.max(0.5 /* .5 */, Math.min(1, (G.clientWidth - 40) / jt.scrollWidth)));
    }
  };
  useEffect(() => {
    if (a === "chart") {
      setTimeout(k, 30);
    }
  }, [a, u.length]);
  let [N, q] = useState(false);
  let _ = o.trim().toLowerCase();
  let gt = (G) => !!_ && !G.open && (G.name + G.title).toLowerCase().includes(_);
  let P = (G) =>
    (r !== "all" && G.team !== r && G.team !== "exec") || (!!_ && !gt(G) && G.parent !== null);
  let O = activePeople();
  let J = O.filter((G) => childrenOf(G.id).length);
  let lt = (J.reduce((G, jt) => G + childrenOf(jt.id).length, 0) / J.length).toFixed(1);
  let It = orgPeople.find((G) => G.parent === null);
  let me = l && orgPeople.find((G) => G.id === l);
  let se = (G) => {
    if (!G.target.closest("button")) {
      y.current = {
        x: G.clientX - h.x,
        y: G.clientY - h.y,
      };
    }
  };
  let ue = (G) => {
    if (y.current) {
      B({
        x: G.clientX - y.current.x,
        y: G.clientY - y.current.y,
      });
    }
  };
  let ha = (G) => {
    if (G.ctrlKey || G.metaKey) {
      G.preventDefault();
      f((jt) => Math.min(1.6, Math.max(0.4 /* .4 */, jt - G.deltaY * 0.002 /* .002 */)));
    }
  };
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
                ].join(","),
              ).join(`
  `),
              "Org chart copied as CSV",
            )
          }
        >
          <LuDownload />
          Export
        </Button>
        <Button onClick={() => q(true)}>
          <LuPlus />
          Add person or role
        </Button>
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          [LuUsers, "primary", "People", O.length],
          [LuUserPlus, "violet", "Open roles", orgPeople.filter((G) => G.open).length],
          [LuBuilding2, "teal", "Teams", Object.keys(orgTeams).length - 1],
          [LuMapPin, "orange", "Places of work", Object.keys(offices).length],
          [LuNetwork, "success", "People per manager", lt],
          [LuCalendarOff, "danger", "On leave today", O.filter((G) => G.status === "leave").length],
        ].map(([G, jt, Ia, Wt]) => (
          <div
            className="bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-card"
            key={Ia}
          >
            <IconTile icon={G} tone={jt} />
            <div className="grid leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">{Wt}</span>
              <span className="text-muted-foreground text-[12.5px]">{Ia}</span>
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
              icon: LuNetwork,
            },
            {
              value: "teams",
              label: "Teams",
              icon: LuLayoutGrid,
            },
            {
              value: "where",
              label: "Where",
              icon: LuMapPin,
            },
            {
              value: "list",
              label: "Directory",
              icon: LuList,
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
          className="border-surface-border bg-surface relative overflow-hidden rounded-3xl border"
          style={{
            height: "calc(100vh - 330px)",
            minHeight: 520,
            backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
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
          <div className="bg-card absolute right-3 bottom-3 flex items-center gap-1 rounded-xl border p-1 shadow-card">
            <Tooltip label="Zoom out">
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Zoom out"
                onClick={() => f((G) => Math.max(0.4 /* .4 */, G - 0.1 /* .1 */))}
              >
                <LuZoomOut />
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
                <LuZoomIn />
              </Button>
            </Tooltip>
            <span className="bg-border mx-0.5 h-5 w-px" />
            <Tooltip label="Fit to screen">
              <Button size="icon-sm" variant="ghost" aria-label="Fit" onClick={k}>
                <LuMaximize />
              </Button>
            </Tooltip>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => s(u.length ? [] : J.filter((G) => G.parent).map((G) => G.id))}
            >
              {u.length ? "Expand all" : "Collapse teams"}
            </Button>
          </div>
          <div className="bg-card/90 text-muted-foreground absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-xl border px-3 py-2 text-[11.5px] backdrop-blur">
            {Object.entries(presence).map(([G, [jt, Ia]]) => (
              <span className="flex items-center gap-1.5" key={G}>
                <span className={cn("size-2 rounded-full", Ia)} />
                {jt}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <LuPhoneCall className="text-primary size-3" />
              On call
            </span>
            <span className="hidden sm:inline">Drag to move · Ctrl + scroll to zoom</span>
          </div>
        </div>
      )}
      {a === "teams" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(orgTeams)
            .filter(([G]) => G !== "exec" && (r === "all" || r === G))
            .map(([G, [jt, Ia, Wt]]) => {
              let X = orgPeople.filter((xt) => xt.team === G);
              let ea = X.find((xt) => xt.parent === "ceo");
              let K = X.filter((xt) => !xt.open);
              let Mt = Math.round(K.reduce((xt, ra) => xt + loadOf(ra.name), 0) / K.length);
              return (
                <section
                  className="border-surface-border bg-surface rounded-3xl border p-1.5 shadow-card"
                  key={G}
                >
                  <header className="flex items-center gap-3 px-3 pt-2 pb-2.5">
                    <IconTile icon={Wt} tone={Ia} size="sm" />
                    <div className="grid flex-1 leading-tight">
                      <span className="text-[15px] font-semibold">{jt}</span>
                      <span className="text-muted-foreground text-[12px]">
                        {K.length}
                        {" people"}
                        {X.length > K.length && ` \xB7 ${X.length - K.length} hiring`}
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
                  <div className="bg-card grid gap-1 rounded-2xl border p-2 shadow-card">
                    {X.sort((xt, ra) => (ra === ea) - (xt === ea)).map((xt) =>
                      xt.open ? (
                        <div
                          className="text-muted-foreground flex items-center gap-3 rounded-xl border border-dashed p-2 text-[13px]"
                          key={xt.id}
                        >
                          <span className="bg-muted flex size-8 items-center justify-center rounded-full">
                            <LuUserPlus className="size-4" />
                          </span>
                          {"Hiring: "}
                          {xt.title}
                        </div>
                      ) : (
                        <button
                          onClick={() => d(xt.id)}
                          className="hover:bg-muted/60 flex items-center gap-3 rounded-xl p-2 text-left"
                          key={xt.id}
                        >
                          <span className="relative">
                            <Avatar name={xt.name} photo={orgPhoto(xt.name)} size={34} />
                            <span
                              className={cn(
                                "ring-card absolute right-0 bottom-0 size-2.5 rounded-full ring-2",
                                presence[xt.status][1],
                              )}
                            />
                          </span>
                          <span className="grid min-w-0 flex-1 leading-tight">
                            <span className="truncate text-[13.5px] font-medium">
                              {xt.name}
                              {xt === ea && (
                                <Tag className="ml-1.5" icon={LuCrown}>
                                  Lead
                                </Tag>
                              )}
                            </span>
                            <span className="text-muted-foreground truncate text-[12px]">
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
                      ),
                    )}
                  </div>
                </section>
              );
            })}
        </div>
      )}
      {a === "where" && (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(offices).map(([G, [jt, Ia]]) => {
            let Wt = activePeople().filter((X) => X.loc === G && (r === "all" || X.team === r));
            return (
              <Card
                icon={G === "remote" ? LuLaptop : G === "diu" ? LuGraduationCap : LuBuilding2}
                title={jt}
                description={`${Ia} \xB7 ${Wt.length} ${Wt.length === 1 ? "person" : "people"}`}
                actions={
                  <span className="flex items-center gap-1.5 text-[12px]">
                    <span className="bg-success size-2 rounded-full" />
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
                        let K = Wt[ea];
                        return (
                          <Tooltip
                            label={K ? `${K.name} \xB7 desk ${ea + 1}` : `Desk ${ea + 1} free`}
                            key={ea}
                          >
                            <div
                              className={cn(
                                "flex aspect-square items-center justify-center rounded-lg border",
                                K ? "bg-primary/[0.06]" : "border-dashed",
                              )}
                            >
                              {K ? (
                                <Avatar name={K.name} photo={orgPhoto(K.name)} size={28} />
                              ) : (
                                <span className="text-muted-foreground text-[10.5px]">
                                  {ea + 1}
                                </span>
                              )}
                            </div>
                          </Tooltip>
                        );
                      },
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {Wt.map((X) => (
                    <button
                      onClick={() => d(X.id)}
                      className="hover:bg-muted/60 flex items-center gap-2 rounded-full border py-1 pr-3 pl-1"
                      key={X.id}
                    >
                      <span className="relative">
                        <Avatar name={X.name} photo={orgPhoto(X.name)} size={26} />
                        <span
                          className={cn(
                            "ring-card absolute right-0 bottom-0 size-2 rounded-full ring-2",
                            presence[X.status][1],
                          )}
                        />
                      </span>
                      <span className="text-[12.5px] font-medium">{X.name}</span>
                      <span className="text-muted-foreground text-[11.5px]">
                        {orgTeams[X.team][0]}
                      </span>
                    </button>
                  ))}
                  {!Wt.length && (
                    <span className="text-muted-foreground text-[12.5px]">
                      Nobody here for this filter
                    </span>
                  )}
                </div>
              </Card>
            );
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
                  let jt = orgPeople.find((Ia) => Ia.id === G.parent);
                  return (
                    <TableRow onClick={() => d(G.id)} key={G.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={G.name} photo={orgPhoto(G.name)} size={30} />
                          <div className="grid leading-tight">
                            <span className="font-medium">{G.name}</span>
                            <span className="text-muted-foreground text-[12px]">{G.title}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge tone={orgTeams[G.team][1]} dot={false}>
                          {orgTeams[G.team][0]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {jt ? jt.name : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>{offices[G.loc][0]}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <span className={cn("size-2 rounded-full", presence[G.status][1])} />
                          {presence[G.status][0]}
                        </span>
                      </TableCell>
                      <TableCell className="tabular-nums">{workloadOf(G.name).length}</TableCell>
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
                      <TableCell className="text-muted-foreground">{G.joined}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Card>
      )}
      {me && <PersonDrawer o={me} onClose={() => d(null)} onPick={(G) => d(G)} nav={nav} />}
      <AddPersonDialog open={N} onClose={() => q(false)} />
    </>
  );
}
