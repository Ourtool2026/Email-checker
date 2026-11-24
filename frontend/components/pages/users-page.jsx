"use client";

import { useEffect, useState } from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuArrowUpDown,
  LuBan,
  LuBookmark,
  LuBriefcase,
  LuBuilding2,
  LuChevronLeft,
  LuChevronRight,
  LuColumns3,
  LuDownload,
  LuGraduationCap,
  LuRows2,
  LuRows3,
  LuSend,
  LuShieldCheck,
  LuStar,
  LuTag,
  LuUsers,
} from "react-icons/lu";
import { Delta } from "@/components/charts";
import { userStatus } from "@/components/drawers/user-drawer";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { TrustBadges } from "@/components/shared/trust-badges";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import {
  approvals,
  areas,
  currentAdmin,
  getHostel,
  getUser,
  notesStore,
  reports,
  totals,
  userFilters,
  users,
} from "@/lib/data/core";
import { formatLivingId, num, shortOrg, userTypes } from "@/lib/format";
import { copyText, logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

const userColumns = [
  ["type", "Type"],
  ["lives", "Lives at"],
  ["checks", "Checks"],
  ["level", "Level"],
  ["risk", "Risk"],
  ["status", "Status"],
  ["device", "Device"],
  ["joined", "Joined"],
  ["active", "Last active"],
];

export const riskScore = (t) =>
  Math.min(
    95,
    (t.status === "suspended" ? 70 : 8) +
      (t.nid ? 0 : 30) +
      reports.filter((a) => a.uid === t.id && !["Faded", "Removed"].includes(a.status)).length *
        28 +
      (t.face ? 0 : 12) +
      (t.lid.charCodeAt(4) % 9),
  );

export function RiskPill({ v: t }) {
  let a = t >= 60 ? "danger" : t >= 30 ? "warning" : "success";
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-11 items-center justify-center gap-1 rounded-md px-1.5 text-[12px] font-semibold tabular-nums",
        a === "danger"
          ? "bg-destructive/10 text-destructive"
          : a === "warning"
            ? "bg-warning/10 text-warning"
            : "bg-success/10 text-success",
      )}
    >
      {t}
    </span>
  );
}

export function UsersPage({ nav, q: a, setQ }) {
  let [r, i] = useState("all");
  let [o, n] = useState("all");
  let [l, d] = useState("all");
  let [u, s] = useState([]);
  let [m, f] = useState("all");
  let [h, B] = useState(["type", "lives", "checks", "level", "risk", "status", "active"]);
  let [y, W] = useState(["name", 1]);
  let [x, k] = useState(0);
  let [N, q] = useState(false);
  let [_, gt] = useState(false);
  let [P, O] = useState(null);
  let [J, lt] = useState("Beta tester");
  let It = a.trim().toLowerCase().replace(/\s/g, "");
  useEffect(() => k(0), [r, o, l, m, a]);
  let me = {
    all: () => true,
    unverified: (K) => !K.nid || !K.face,
    reported: (K) => reports.some((Mt) => Mt.uid === K.id),
    looking: (K) => K.type === "student" && !K.hostel && !K.flat,
    l3: (K) => K.level === 3,
  };
  let se = users.filter(
    (K) =>
      me[m](K) &&
      (r === "all" || K.type === r) &&
      (o === "all" || K.status === o) &&
      (l === "all" || K.area === l) &&
      (!It || K.name.toLowerCase().replace(/\s/g, "").includes(It) || K.lid.includes(It)),
  );
  let ue =
    {
      name: (K) => K.name,
      level: (K) => K.level,
      risk: (K) => riskScore(K),
      status: (K) => K.status,
      type: (K) => K.type,
    }[y[0]] || ((K) => K.name);
  se = se.slice().sort((K, Mt) => (ue(K) > ue(Mt) ? 1 : ue(K) < ue(Mt) ? -1 : 0) * y[1]);
  let ha = 12;
  let G = Math.max(1, Math.ceil(se.length / ha));
  let jt = se.slice(x * ha, x * ha + ha);
  let Ia = (K) => users.filter((Mt) => Mt.type === K).length;
  let Wt = (K) => h.includes(K);
  let X = ({ k: K, children, className }) => (
    <TableHead className={className}>
      <button
        onClick={() => W([K, y[0] === K ? -y[1] : 1])}
        className="hover:text-foreground inline-flex items-center gap-1"
      >
        {children}
        {y[0] === K ? (
          y[1] > 0 ? (
            <LuArrowUp className="size-3" />
          ) : (
            <LuArrowDown className="size-3" />
          )
        ) : (
          <LuArrowUpDown className="size-3 opacity-40" />
        )}
      </button>
    </TableHead>
  );
  let ea = N ? "py-1.5" : "";
  return (
    <>
      <PageHeader
        title="Users"
        desc={`Everyone with a MyStay ID account. ${num(totals.users)} in total; this prototype shows a sample of ${users.length}.`}
      >
        <Button
          variant="outline"
          onClick={() => {
            logAudit("Exported user list", `${se.length} users`, "Names and Living IDs only");
            copyText(
              se.map((K) => [K.name, K.lid, K.type, K.area, K.status].join(",")).join(`
`),
              "List copied (names and Living IDs only). Logged.",
            );
          }}
        >
          <LuDownload />
          Export
        </Button>
      </PageHeader>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Students", "11,940", LuGraduationCap, "primary", 4.8],
          ["Job holders", "6,068", LuBriefcase, "teal", 3.1],
          ["Landlords", num(totals.landlords), LuBuilding2, "orange", 9.6],
          [
            "Verified",
            `${Math.round((totals.verified / totals.users) * 100)}%`,
            LuShieldCheck,
            "success",
            1.2,
          ],
        ].map(([K, Mt, xt, ra, Xa]) => (
          <div
            className="bg-card flex items-center gap-3 rounded-2xl border p-3.5 shadow-card"
            key={K}
          >
            <IconTile icon={xt} tone={ra} />
            <div className="grid flex-1 leading-tight">
              <span className="text-[20px] font-semibold tabular-nums">{Mt}</span>
              <span className="text-muted-foreground text-[12.5px]">{K}</span>
            </div>
            <Delta value={Xa} />
          </div>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-muted-foreground mr-1 flex items-center gap-1 text-[12.5px] font-medium">
          <LuBookmark className="size-3.5" />
          Saved views
        </span>
        {userFilters.map(([K, Mt]) => (
          <button
            onClick={() => f(K)}
            className={cn(
              "h-7 rounded-lg border px-2.5 text-[12.5px] font-medium transition-colors",
              m === K
                ? "border-primary/40 bg-primary/10 text-primary"
                : "bg-card text-muted-foreground hover:text-foreground shadow-card",
            )}
            key={K}
          >
            {Mt}
            <span className="ml-1.5 tabular-nums opacity-60">{users.filter(me[K]).length}</span>
          </button>
        ))}
        <button
          onClick={() => toast("View saved for your team")}
          className="text-primary h-7 px-2 text-[12.5px] font-medium"
        >
          + Save current
        </button>
      </div>
      <Card flush>
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <SearchInput
            value={a}
            onChange={setQ}
            placeholder="Name or Living ID"
            className="w-full sm:w-60"
          />
          <Tabs
            size="sm"
            value={r}
            onChange={i}
            items={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "student",
                label: "Students",
                count: Ia("student"),
              },
              {
                value: "job",
                label: "Job holders",
                count: Ia("job"),
              },
              {
                value: "landlord",
                label: "Landlords",
                count: Ia("landlord"),
              },
            ]}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Select className="h-8 w-[130px]" value={l} onChange={(K) => d(K.target.value)}>
              <option value="all">All areas</option>
              {areas.map((K) => (
                <option key={K}>{K}</option>
              ))}
            </Select>
            <Select className="h-8 w-[140px]" value={o} onChange={(K) => n(K.target.value)}>
              <option value="all">Any status</option>
              <option value="active">Active</option>
              <option value="pending">Checking ID</option>
              <option value="suspended">Suspended</option>
            </Select>
            <div className="relative">
              <Button size="sm" variant="outline" onClick={() => gt(!_)}>
                <LuColumns3 />
                Columns
              </Button>
              {_ && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => gt(false)} />
                  <div className="anim-fade bg-popover absolute top-full right-0 z-30 mt-1.5 w-52 rounded-xl border p-1.5 shadow-float">
                    {userColumns.map(([K, Mt]) => (
                      <label
                        className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]"
                        key={K}
                      >
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={Wt(K)}
                          onChange={(xt) =>
                            B(xt.target.checked ? [...h, K] : h.filter((ra) => ra !== K))
                          }
                        />
                        {Mt}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Tooltip label={N ? "Comfortable rows" : "Compact rows"}>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Row density"
                onClick={() => q(!N)}
              >
                {N ? <LuRows2 /> : <LuRows3 />}
              </Button>
            </Tooltip>
          </div>
        </div>
        {u.length > 0 && (
          <div className="bg-primary/[0.05] flex flex-wrap items-center gap-2 border-b px-5 py-2 text-[13px]">
            <b className="font-semibold">
              {u.length}
              {" selected"}
            </b>
            <span className="bg-border mx-1 h-4 w-px" />
            <Button size="xs" variant="outline" onClick={() => O("msg")}>
              <LuSend />
              Message
            </Button>
            <Button size="xs" variant="outline" onClick={() => O("tag")}>
              <LuTag />
              Add tag
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                logAudit("Exported users", `${u.length} users`, "Bulk export");
                copyText(
                  u.map((K) => getUser(K).lid).join(`
`),
                  "Living IDs copied. Logged.",
                );
              }}
            >
              <LuDownload />
              Export
            </Button>
            <Button
              size="xs"
              variant="outline"
              className="text-destructive"
              onClick={() => O("suspend")}
            >
              <LuBan />
              Suspend…
            </Button>
            <Button size="xs" variant="ghost" onClick={() => s([])}>
              Clear
            </Button>
          </div>
        )}
        {jt.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <input
                    type="checkbox"
                    aria-label="Select page"
                    className="accent-primary"
                    checked={jt.every((K) => u.includes(K.id))}
                    onChange={(K) =>
                      s(
                        K.target.checked
                          ? [...new Set([...u, ...jt.map((Mt) => Mt.id)])]
                          : u.filter((Mt) => !jt.some((xt) => xt.id === Mt)),
                      )
                    }
                  />
                </TableHead>
                <X k="name">User</X>
                {Wt("type") && <X k="type">Type</X>}
                {Wt("lives") && <TableHead>Lives at</TableHead>}
                {Wt("checks") && <TableHead>Checks</TableHead>}
                {Wt("level") && <X k="level">Level</X>}
                {Wt("risk") && <X k="risk">Risk</X>}
                {Wt("status") && <X k="status">Status</X>}
                {Wt("device") && <TableHead>Device</TableHead>}
                {Wt("joined") && <TableHead>Joined</TableHead>}
                {Wt("active") && <TableHead>Active</TableHead>}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {jt.map((K) => {
                let Mt = K.hostel && getHostel(K.hostel);
                return (
                  <TableRow
                    onClick={() => nav.user(K.id)}
                    className={cn("group", u.includes(K.id) && "bg-primary/[0.04]")}
                    key={K.id}
                  >
                    <TableCell className={ea} onClick={(xt) => xt.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${K.name}`}
                        className="accent-primary"
                        checked={u.includes(K.id)}
                        onChange={(xt) =>
                          s(xt.target.checked ? [...u, K.id] : u.filter((ra) => ra !== K.id))
                        }
                      />
                    </TableCell>
                    <TableCell className={ea}>
                      <div className="flex items-center gap-3">
                        <Avatar name={K.name} photo={K.photo} size={N ? 28 : 36} />
                        <div className="grid leading-tight">
                          <span className="font-medium">{K.name}</span>
                          {!N && (
                            <span className="text-muted-foreground font-mono text-[12px]">
                              {formatLivingId(K.lid)}
                            </span>
                          )}
                        </div>
                        {notesStore[K.id]?.tags?.map((xt) => (
                          <Tag icon={LuTag} key={xt}>
                            {xt}
                          </Tag>
                        ))}
                      </div>
                    </TableCell>
                    {Wt("type") && (
                      <TableCell className={ea}>
                        <div className="grid leading-tight">
                          <Badge tone={userTypes[K.type][1]} dot={false}>
                            {userTypes[K.type][0]}
                          </Badge>
                          {!N && (
                            <span className="text-muted-foreground mt-1 text-[12px]">
                              {shortOrg(K.org)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {Wt("lives") && (
                      <TableCell className={ea}>
                        {Mt ? (
                          <span className="inline-flex items-center gap-2">
                            <img src={Mt.photo} alt="" className="size-6 rounded-md object-cover" />
                            <span className="max-w-[150px] truncate">{Mt.name}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {K.flat
                              ? "Flat \xB7 " + K.area
                              : K.type === "landlord"
                                ? K.area
                                : "Looking"}
                          </span>
                        )}
                      </TableCell>
                    )}
                    {Wt("checks") && (
                      <TableCell className={ea}>
                        <TrustBadges u={K} />
                      </TableCell>
                    )}
                    {Wt("level") && (
                      <TableCell className={ea}>
                        <span
                          className={cn(
                            "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[12px] font-semibold",
                            K.level === 3
                              ? "bg-violet/10 text-violet"
                              : K.level === 2
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          <LuStar className="size-3" />L{K.level}
                        </span>
                      </TableCell>
                    )}
                    {Wt("risk") && (
                      <TableCell className={ea}>
                        <RiskPill v={riskScore(K)} />
                      </TableCell>
                    )}
                    {Wt("status") && (
                      <TableCell className={ea}>
                        <Badge tone={userStatus[K.status][1]}>{userStatus[K.status][0]}</Badge>
                      </TableCell>
                    )}
                    {Wt("device") && (
                      <TableCell className={cn(ea, "text-muted-foreground")}>{K.device}</TableCell>
                    )}
                    {Wt("joined") && (
                      <TableCell className={cn(ea, "text-muted-foreground whitespace-nowrap")}>
                        {K.joined}
                      </TableCell>
                    )}
                    {Wt("active") && (
                      <TableCell className={cn(ea, "text-muted-foreground whitespace-nowrap")}>
                        {K.active}
                      </TableCell>
                    )}
                    <TableCell className={cn(ea, "w-8")}>
                      <LuChevronRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={LuUsers}
            title="No one matches"
            text="Try another name, Living ID or filter."
          />
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-2.5 text-[12.5px]">
          <span className="text-muted-foreground">
            {se.length
              ? `${x * ha + 1}\u2013${Math.min(se.length, x * ha + ha)} of ${se.length}`
              : "0"}
            {" \xB7 phone, NID and address stay hidden in lists"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Previous page"
              disabled={x === 0}
              onClick={() => k(x - 1)}
            >
              <LuChevronLeft />
            </Button>
            {Array.from(
              {
                length: G,
              },
              (K, Mt) => (
                <button
                  onClick={() => k(Mt)}
                  className={cn(
                    "size-8 rounded-lg text-[12.5px] font-medium tabular-nums",
                    Mt === x ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                  key={Mt}
                >
                  {Mt + 1}
                </button>
              ),
            )}
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Next page"
              disabled={x >= G - 1}
              onClick={() => k(x + 1)}
            >
              <LuChevronRight />
            </Button>
          </div>
        </div>
      </Card>
      <Dialog
        open={P === "msg"}
        onClose={() => O(null)}
        title={`Message ${u.length} people`}
        description="Arrives in the MyStay ID app from “MyStay team”."
        footer={
          <>
            <Button variant="outline" onClick={() => O(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                logAudit("Sent bulk message", `${u.length} users`, "\u2014");
                O(null);
                s([]);
                toast("Message sent", LuSend);
              }}
            >
              <LuSend />
              Send
            </Button>
          </>
        }
      >
        <Textarea rows={4} placeholder="Write a message" />
      </Dialog>
      <Dialog
        open={P === "tag"}
        onClose={() => O(null)}
        title={`Tag ${u.length} people`}
        description="Tags are only seen by HQ. Use them for saved views and campaigns."
        footer={
          <>
            <Button variant="outline" onClick={() => O(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                u.forEach((K) => {
                  let Mt =
                    notesStore[K] ||
                    (notesStore[K] = {
                      list: [],
                      tags: [],
                    });
                  Mt.tags = Mt.tags || [];
                  if (!Mt.tags.includes(J)) {
                    Mt.tags.push(J);
                  }
                });
                logAudit("Tagged users", `${u.length} users`, J);
                O(null);
                s([]);
                refresh();
                toast(`Tagged \u201C${J}\u201D`);
              }}
            >
              <LuTag />
              Add tag
            </Button>
          </>
        }
      >
        <Field label="Tag">
          <Input value={J} onChange={(K) => lt(K.target.value)} />
        </Field>
      </Dialog>
      <Dialog
        open={P === "suspend"}
        onClose={() => O(null)}
        title={`Suspend ${u.length} accounts?`}
        description="Bulk suspensions always need a second admin."
        footer={
          <>
            <Button variant="outline" onClick={() => O(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                approvals.unshift({
                  id: "ap" + Date.now(),
                  action: "Suspend accounts",
                  target: `${u.length} users`,
                  by: currentAdmin.name,
                  reason: "Bulk action from Users",
                  when: "Just now",
                  status: "waiting",
                  link: "users",
                });
                logAudit("Asked to suspend accounts", `${u.length} users`, "Bulk");
                O(null);
                s([]);
                refresh();
                toast("Sent for a second approval");
              }}
            >
              <LuBan />
              Ask for approval
            </Button>
          </>
        }
      >
        <Field label="Reason">
          <Input placeholder="e.g. Fake accounts from device ··7F21" />
        </Field>
      </Dialog>
    </>
  );
}
