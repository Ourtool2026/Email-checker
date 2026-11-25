"use client"

import { useEffect, useState } from "react"
import { ActionButton } from "@/components/hq/gate"
import {
  BanIcon,
  BriefcaseIcon,
  Building2Icon,
  CameraIcon,
  CircleCheckIcon,
  DownloadIcon,
  EllipsisIcon,
  FlagIcon,
  GraduationCapIcon,
  HistoryIcon,
  HouseIcon,
  IdCardIcon,
  KeyRoundIcon,
  Link2Icon,
  LogOutIcon,
  MapPinIcon,
  MessageSquareIcon,
  MonitorSmartphoneIcon,
  PhoneIcon,
  RotateCcwIcon,
  ScanFaceIcon,
  SendIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  StarIcon,
  StickyNoteIcon,
  TagIcon,
  Trash2Icon,
  UserCheckIcon,
} from "lucide-react"
import { RiskPill, riskScore } from "@/components/pages/users-page"
import { MaskedValue } from "@/components/shared/masked-value"
import { Notice } from "@/components/shared/notice"
import { Avatar } from "@/components/hq/avatar"
import { Badge, Tag } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Dialog } from "@/components/hq/dialog"
import { DropdownMenu } from "@/components/hq/dropdown-menu"
import { EmptyState } from "@/components/hq/empty-state"
import { IconTile } from "@/components/hq/icon-tile"
import { Field, Input, Select, Textarea } from "@/components/hq/input"
import { Sheet } from "@/components/hq/sheet"
import { Tabs } from "@/components/hq/tabs"
import { toast } from "@/components/hq/toast"
import {
  adminTeam,
  approvals,
  auditLog,
  currentAdmin,
  getHostel,
  getUser,
  hostels,
  notesStore,
  reports,
} from "@/lib/data/core"
import { formatLivingId, userTypes } from "@/lib/format"
import { copyText, logAudit, refresh } from "@/lib/store"
import { cn } from "@/lib/utils"

export const userStatus: Record<string, any> = {
  active: ["Active", "success"],
  suspended: ["Suspended", "danger"],
  pending: ["Checking ID", "warning"],
}

export function UserDrawer({
  id,
  onClose,
  nav,
}: {
  id?: any
  onClose?: any
  nav?: any
}) {
  const r = id && getUser(id)
  const [i, o] = useState("overview")
  const [n, l] = useState(null)
  const [d, u] = useState("")
  useEffect(() => {
    o("overview")
    l(null)
  }, [id])
  if (!r) {
    return null
  }
  const s = r.hostel && getHostel(r.hostel)
  const m = reports.filter((B) => B.uid === r.id)
  const f = userStatus[r.status]
  const h = (B?, y?, W?) => {
    if (W) {
      W()
    }
    logAudit(B, r.name, d || "\u2014")
    l(null)
    u("")
    refresh()
    toast(y)
  }
  return (
    <Sheet open onClose={onClose} width="sm:max-w-[560px]">
      <div className="relative border-b p-5 pb-4">
        <div className="flex items-start gap-4">
          <Avatar
            name={r.name}
            photo={r.photo}
            size={68}
            className="ring-4 ring-muted"
          />
          <div className="grid min-w-0 gap-1 pr-6">
            <div className="flex items-center gap-1.5 text-[18px] font-semibold tracking-tight">
              {r.name}
              {r.nid && (
                <ShieldCheckIcon className="size-[18px] text-success" />
              )}
            </div>
            <div className="font-mono text-[12.5px] text-muted-foreground">
              {"Living ID "}
              {formatLivingId(r.lid)}
              {" \xB7 "}
              {r.id.toUpperCase()}
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge tone={f[1]}>{f[0]}</Badge>
              <Badge tone={userTypes[r.type][1]} dot={false}>
                {userTypes[r.type][0]}
              </Badge>
              <Tag icon={StarIcon}>
                {"Level "}
                {r.level}
              </Tag>
              <Tag icon={SmartphoneIcon}>{r.device}</Tag>
            </div>
          </div>
        </div>
        <div className="absolute top-14 right-5 grid justify-items-center gap-0.5">
          <RiskPill v={riskScore(r)} />
          <span className="text-[10.5px] text-muted-foreground">risk</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            ["Stays", r.stays],
            ["Reports", m.length],
            ["Joined", r.joined],
            ["Active", r.active],
          ].map((B) => (
            <div className="rounded-xl border bg-muted/60 px-1 py-2" key={B[0]}>
              <div className="text-[11.5px] text-muted-foreground">{B[0]}</div>
              <div className="truncate text-[13px] font-semibold">{B[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="no-scrollbar overflow-x-auto px-5 pt-3">
        <Tabs
          size="sm"
          value={i}
          onChange={o}
          className="w-full min-w-max"
          items={[
            {
              value: "overview",
              label: "Overview",
            },
            {
              value: "verify",
              label: "Checks",
            },
            {
              value: "activity",
              label: "Activity",
            },
            {
              value: "stays",
              label: "Stays",
            },
            {
              value: "devices",
              label: "Devices",
            },
            {
              value: "notes",
              label: "Notes",
              count: notesStore[r.id]?.list?.length || null,
            },
            {
              value: "reports",
              label: "Reports",
              count: m.length || null,
            },
          ]}
        />
      </div>
      <div className="flex-1 overflow-auto p-5 pt-4">
        {i === "overview" && (
          <div className="grid gap-4">
            <div className="divide-y rounded-xl border text-[13.5px]">
              {[
                [
                  r.type === "student"
                    ? GraduationCapIcon
                    : r.type === "job"
                      ? BriefcaseIcon
                      : Building2Icon,
                  r.type === "student"
                    ? "University"
                    : r.type === "job"
                      ? "Work"
                      : "Owns",
                  r.org,
                ],
                [
                  HouseIcon,
                  "Lives at",
                  s ? (
                    <button
                      className="font-medium text-primary hover:underline"
                      onClick={() => nav.hostel(s.id)}
                    >
                      {s.name}
                    </button>
                  ) : r.flat ? (
                    "A flat in " + r.area
                  ) : r.type === "landlord" ? (
                    "\u2014"
                  ) : (
                    "Looking for a place"
                  ),
                ],
                [MapPinIcon, "Area", r.area],
                [
                  PhoneIcon,
                  "Phone",
                  <MaskedValue
                    key="phone"
                    value={r.phone}
                    label="Phone number"
                    target={r.name}
                  />,
                ],
                [
                  IdCardIcon,
                  "NID number",
                  <MaskedValue
                    key="nid"
                    value={r.nidNo}
                    label="NID number"
                    target={r.name}
                  />,
                ],
                [
                  MapPinIcon,
                  "Home address",
                  <MaskedValue
                    key="address"
                    value={r.address}
                    label="Home address"
                    target={r.name}
                  />,
                ],
              ].map(([B, y, W]) => (
                <div className="flex items-center gap-3 px-3.5 py-2.5" key={y}>
                  <B className="size-4 shrink-0 text-muted-foreground" />
                  <span className="w-28 shrink-0 text-muted-foreground">
                    {y}
                  </span>
                  <span className="min-w-0 font-medium">{W}</span>
                </div>
              ))}
            </div>
            <Notice icon={ShieldCheckIcon}>
              Hidden details need a reason. Each time one is shown, it is saved
              in the audit log with your name.
            </Notice>
          </div>
        )}
        {i === "verify" && (
          <div className="grid gap-2">
            {[
              [
                ShieldCheckIcon,
                "NID",
                r.nid ? "Verified \xB7 score 96" : "Waiting in the queue",
                r.nid,
              ],
              [
                ScanFaceIcon,
                "Face match",
                r.face ? "Matched at sign-up" : "Not checked",
                r.face,
              ],
              [
                GraduationCapIcon,
                "Student ID",
                r.type !== "student"
                  ? "Not a student"
                  : r.student
                    ? "Confirmed \xB7 valid to Dec 2027"
                    : "Not added",
                r.student,
              ],
              [
                UserCheckIcon,
                "Guardian",
                r.guardian ? "Confirmed by phone" : "Not added",
                r.guardian,
              ],
            ].map(([B, y, W, x]) => (
              <div
                className="flex items-center gap-3 rounded-xl border px-3.5 py-3"
                key={y}
              >
                <IconTile icon={B} tone={x ? "success" : "neutral"} size="sm" />
                <div className="grid flex-1 leading-tight">
                  <span className="text-[13.5px] font-medium">{y}</span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {W}
                  </span>
                </div>
                {x ? (
                  <CircleCheckIcon className="size-5 text-success" />
                ) : (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      toast(
                        `Asked ${r.name.split(" ")[0]} to add it in the app`,
                        SendIcon
                      )
                    }
                  >
                    Ask
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              className="mt-1"
              onClick={() => l("recheck")}
            >
              <CameraIcon />
              Ask for a new photo
            </Button>
          </div>
        )}
        {i === "stays" && (
          <div className="grid gap-2">
            {s && (
              <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/[0.05] p-3">
                <img
                  src={s.photo}
                  alt=""
                  className="size-10 rounded-lg object-cover"
                />
                <div className="grid flex-1 leading-tight">
                  <span className="text-[13.5px] font-medium">{s.name}</span>
                  <span className="text-[12.5px] text-muted-foreground">
                    {"Living here \xB7 since "}
                    {r.joined}
                  </span>
                </div>
                <Badge tone="success">Now</Badge>
              </div>
            )}
            {Array.from(
              {
                length: Math.min(r.stays, 4),
              },
              (B, y) => {
                const W =
                  hostels[(y * 5 + r.lid.charCodeAt(2)) % hostels.length]
                return (
                  <div
                    className="flex items-center gap-3 rounded-xl border p-3"
                    key={y}
                  >
                    <img
                      src={W.photo}
                      alt=""
                      className="size-10 rounded-lg object-cover opacity-80"
                    />
                    <div className="grid flex-1 leading-tight">
                      <span className="text-[13.5px] font-medium">
                        {W.name}
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">
                        {
                          [
                            "Jan\u2013Jun 2026",
                            "Jul\u2013Dec 2025",
                            "Jan\u2013Jun 2025",
                            "2024",
                          ][y]
                        }
                        {" \xB7 rent on time"}
                      </span>
                    </div>
                    <Badge>Ended</Badge>
                  </div>
                )
              }
            )}
            {!s && !r.stays && (
              <EmptyState
                icon={HistoryIcon}
                title="No stays yet"
                text="Stays appear when a hostel or landlord moves them in."
              />
            )}
          </div>
        )}
        {i === "activity" && (
          <div className="grid gap-0">
            {[
              ...auditLog
                .filter((B) => B.target === r.name)
                .map((B) => [`${B.act} \xB7 by ${B.by}`, B.when, "hq"]),
              ...userActivity(r).map(([B, y]) => [B, y, "app"]),
            ].map(([B, y, W], x, k) => (
              <div className="flex gap-3" key={x}>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-1.5 flex size-5 items-center justify-center rounded-full",
                      W === "hq"
                        ? "bg-violet/15 text-violet"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {W === "hq" ? (
                      <ShieldCheckIcon className="size-3" />
                    ) : (
                      <SmartphoneIcon className="size-3" />
                    )}
                  </span>
                  {x < k.length - 1 && (
                    <span className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="grid pb-3 leading-snug">
                  <span className="text-[13px]">{B}</span>
                  <span className="text-[11.5px] text-muted-foreground">
                    {y}
                    {W === "hq" ? " \xB7 HQ action" : " \xB7 in the app"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {i === "devices" && (
          <div className="grid gap-2">
            {[
              [
                r.device === "Android" ? "Samsung Galaxy A34" : "iPhone 13",
                "MyStay ID 2.4.1 \xB7 Dhaka",
                "Now",
                true,
              ],
              [
                "Uttara Scholars gate tablet",
                "Scanned at the gate",
                "Yesterday",
                false,
              ],
              [
                r.device === "Android" ? "Redmi Note 11" : "iPad (9th gen)",
                "MyStay ID 2.2.0 \xB7 Rajshahi",
                "3 Oct",
                false,
              ],
            ].map(([B, y, W, x], k) => (
              <div
                className="flex items-center gap-3 rounded-xl border p-3"
                key={k}
              >
                <IconTile
                  icon={k === 1 ? ScanFaceIcon : MonitorSmartphoneIcon}
                  tone={x ? "success" : "neutral"}
                  size="sm"
                />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13.5px] font-medium">
                    {B}
                    {x && (
                      <span className="ml-2 text-[11.5px] font-semibold text-success">
                        This session
                      </span>
                    )}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {y}
                    {" \xB7 "}
                    {W}
                  </span>
                </span>
                {k !== 1 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      logAudit("Signed out device", r.name, B)
                      toast(`${B} signed out`)
                    }}
                  >
                    <LogOutIcon />
                    Sign out
                  </Button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/[0.05] p-3 text-[12.5px]">
              <Link2Icon className="size-4 shrink-0 text-warning" />
              <span className="flex-1">
                No other accounts use these devices.
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logAudit("Signed out all devices", r.name, "\u2014")
                toast(
                  "Signed out everywhere. They sign in again with an SMS code."
                )
              }}
            >
              <LogOutIcon />
              Sign out everywhere
            </Button>
          </div>
        )}
        {i === "notes" && <UserNotes u={r} />}
        {i === "reports" &&
          (m.length ? (
            <div className="grid gap-2">
              {m.map((B) => (
                <button
                  onClick={() => nav.go("reports")}
                  className="flex items-center gap-3 rounded-xl border p-3 text-left hover:bg-muted/50"
                  key={B.id}
                >
                  <IconTile icon={FlagIcon} tone="warning" size="sm" />
                  <div className="grid flex-1 leading-tight">
                    <span className="text-[13.5px] font-medium">{B.type}</span>
                    <span className="text-[12.5px] text-muted-foreground">
                      {getHostel(B.by).name}
                      {" \xB7 "}
                      {B.filed}
                    </span>
                  </div>
                  <Badge tone="warning">{B.status}</Badge>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShieldCheckIcon}
              title="No reports"
              text="Nobody has reported this person."
            />
          ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t bg-muted/40 p-3">
        <Button variant="outline" size="sm" onClick={() => l("msg")}>
          <MessageSquareIcon />
          Message
        </Button>
        {r.status === "suspended" ? (
          <Button variant="outline" size="sm" onClick={() => l("restore")}>
            <RotateCcwIcon />
            Restore
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => l("suspend")}>
            <BanIcon />
            Suspend
          </Button>
        )}
        <DropdownMenu
          align="left"
          trigger={(B) => (
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="More actions"
              onClick={B}
            >
              <EllipsisIcon />
            </Button>
          )}
          items={[
            {
              icon: KeyRoundIcon,
              label: "Reset sign-in",
              onClick: () =>
                h("Reset sign-in", "Sign-in reset. A code was sent by SMS."),
            },
            {
              icon: DownloadIcon,
              label: "Copy their data (on request)",
              onClick: () => {
                logAudit("Copied user data", r.name, "Data request")
                copyText(
                  JSON.stringify(
                    {
                      name: r.name,
                      lid: r.lid,
                      type: r.type,
                      area: r.area,
                      stays: r.stays,
                    },
                    null,
                    1
                  ),
                  "Data copied. Logged."
                )
              },
            },
            "-",
            {
              icon: Trash2Icon,
              label: "Delete account",
              danger: true,
              onClick: () => l("delete"),
            },
          ]}
        />
      </div>
      <Dialog
        open={n === "msg"}
        onClose={() => l(null)}
        title={`Message ${r.name.split(" ")[0]}`}
        description="Arrives in the MyStay ID app from “MyStay team”."
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => h("Sent message", "Message sent in the app")}
            >
              <SendIcon />
              Send
            </Button>
          </>
        }
      >
        <Textarea
          rows={4}
          placeholder="Write a message"
          value={d}
          onChange={(B) => u(B.target.value)}
        />
      </Dialog>
      <Dialog
        open={n === "suspend"}
        onClose={() => l(null)}
        title={`Suspend ${r.name}?`}
        description="They can’t sign in or show their Living ID. Hostels see “Living ID on hold”. They are told why and can appeal."
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!d.trim()}
              onClick={() =>
                h(
                  "Suspended account",
                  `${r.name.split(" ")[0]} is suspended`,
                  () => (r.status = "suspended")
                )
              }
            >
              <BanIcon />
              Suspend
            </Button>
          </>
        }
      >
        <Field label="Reason (shown to them)">
          <Textarea
            rows={3}
            value={d}
            onChange={(B) => u(B.target.value)}
            placeholder="e.g. Three hostels reported threats. We are checking."
          />
        </Field>
      </Dialog>
      <Dialog
        open={n === "restore"}
        onClose={() => l(null)}
        title={`Restore ${r.name}?`}
        description="Their Living ID works again right away."
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                h(
                  "Restored account",
                  "Account restored",
                  () => (r.status = "active")
                )
              }
            >
              <RotateCcwIcon />
              Restore
            </Button>
          </>
        }
      >
        <Field label="Reason">
          <Input
            value={d}
            onChange={(B) => u(B.target.value)}
            placeholder="e.g. Appeal accepted"
          />
        </Field>
      </Dialog>
      <Dialog
        open={n === "recheck"}
        onClose={() => l(null)}
        title="Ask for a new photo?"
        description="They get a prompt to take a new selfie. Their Living ID keeps working until then."
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button onClick={() => h("Asked for new photo", "Request sent")}>
              <CameraIcon />
              Send request
            </Button>
          </>
        }
      >
        <Field label="Why">
          <Select>
            <option>Photo is old</option>
            <option>Face did not match at a gate</option>
            <option>Photo is blurry</option>
          </Select>
        </Field>
      </Dialog>
      <Dialog
        open={n === "delete"}
        onClose={() => l(null)}
        title={`Delete ${r.name}\u2019s account?`}
        description="This needs a second admin. Reports linked to a police case are kept by law."
        footer={
          <>
            <Button variant="outline" onClick={() => l(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!d.trim()}
              onClick={() => {
                approvals.unshift({
                  id: "ap" + Date.now(),
                  action: "Delete account",
                  target: r.name,
                  by: currentAdmin.name,
                  reason: d,
                  when: "Just now",
                  status: "waiting",
                  link: "users",
                  mine: true,
                })
                h("Asked to delete account", "Sent for a second approval")
              }}
            >
              <Trash2Icon />
              Ask for approval
            </Button>
          </>
        }
      >
        <Field label="Reason">
          <Input
            value={d}
            onChange={(B) => u(B.target.value)}
            placeholder="e.g. User asked in the app on 20 Nov"
          />
        </Field>
      </Dialog>
    </Sheet>
  )
}

function UserNotes({ u }: { u?: any }) {
  const [a, e] = useState("")
  const r =
    notesStore[u.id] ||
    (notesStore[u.id] = {
      list: [],
      tags: [],
    })
  r.list = r.list || []
  r.tags = r.tags || []
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[12.5px] text-muted-foreground">Tags:</span>
        {r.tags.map((i) => (
          <Tag icon={TagIcon} key={i}>
            {i}
          </Tag>
        ))}
        <ActionButton
          className="text-[12.5px] font-medium text-primary"
          onClick={() => {
            r.tags.push("Watch")
            refresh()
          }}
        >
          + Watch
        </ActionButton>
      </div>
      {r.list.length ? (
        r.list.map(([i, o, n], l) => (
          <div className="flex gap-2.5" key={l}>
            <Avatar
              name={i}
              photo={adminTeam.find((d) => d.name === i)?.photo}
              size={28}
            />
            <div className="grid flex-1 gap-0.5 rounded-2xl rounded-tl-md bg-muted/60 px-3 py-2">
              <span className="text-[12px]">
                <b className="font-semibold">{i}</b>{" "}
                <span className="text-muted-foreground">
                  {"\xB7 "}
                  {o}
                </span>
              </span>
              <span className="text-[13px]">{n}</span>
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          icon={StickyNoteIcon}
          title="No notes yet"
          text="Notes are internal. The person never sees them."
        />
      )}
      <form
        className="grid gap-2"
        onSubmit={(i) => {
          i.preventDefault()
          if (a.trim()) {
            r.list.push([currentAdmin.name, "Just now", a.trim()])
            logAudit("Added note", u.name, "\u2014")
            e("")
            refresh()
          }
        }}
      >
        <Textarea
          rows={2}
          value={a}
          onChange={(i) => e(i.target.value)}
          placeholder="Internal note, e.g. called guardian, all fine"
        />
        <div className="flex justify-end">
          <Button size="sm" type="submit">
            <StickyNoteIcon />
            Add note
          </Button>
        </div>
      </form>
    </div>
  )
}

function userActivity(t?) {
  const a = t.hostel && getHostel(t.hostel)
  const e = [["Opened the app", t.active]]
  if (a) {
    e.push(
      ["Turned off tomorrow\u2019s lunch", "2 hrs ago"],
      [`Scanned in at the ${a.name} gate`, "Yesterday, 9:42 pm"],
      ["Asked to come back late (approved)", "Yesterday, 6:10 pm"]
    )
  }
  if (t.type === "landlord") {
    e.push(
      ["Listed a 2-bed flat for students", "5 hrs ago"],
      ["Sent ownership papers", "2 days ago"],
      ["Accepted a verified tenant", "9 Nov"]
    )
  }
  if (!a && t.type !== "landlord") {
    e.push(
      ["Saved 3 hostels in " + t.area, "Today"],
      ["Sent a seat request", "Yesterday"]
    )
  }
  if (t.level >= 2) {
    e.push([`Stay Level ${t.level} reached`, "12 Nov"])
  }
  if (t.guardian) {
    e.push(["Added guardian", "3 Oct"])
  }
  if (a) {
    e.push([`Moved in to ${a.name}`, t.joined])
  }
  if (t.nid) {
    e.push([
      "Living ID verified \xB7 score " + (88 + (t.lid.charCodeAt(3) % 10)),
      t.joined,
    ])
  }
  e.push(["Signed up", t.joined])
  return e
}
