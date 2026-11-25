"use client"

import { useState } from "react"
import {
  Building2Icon,
  CheckIcon,
  EyeIcon,
  KeyRoundIcon,
  LayersIcon,
  LogOutIcon,
  SendIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"

import { useAccess } from "@/components/shell/access-context"
import { pageById } from "@/components/shell/nav"
import { PageHeader } from "@/components/shared/page-header"
import { SearchInput } from "@/components/shared/search-input"
import { Avatar } from "@/components/hq/avatar"
import { Badge, type Tone } from "@/components/hq/badge"
import { Button } from "@/components/hq/button"
import { Card } from "@/components/hq/card"
import { Dialog } from "@/components/hq/dialog"
import { Field, Input, Select } from "@/components/hq/input"
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
import { adminSessions } from "@/lib/data/core"
import { admins, departments, roles } from "@/lib/data/access"
import {
  BASE_LABEL,
  RIGHTS,
  accessFor,
  adminById,
  canViewAs,
  departmentsOf,
  roleOf,
  type Admin,
} from "@/lib/access"
import { logAudit, refresh } from "@/lib/store"

const BASE_TONE: Record<string, Tone> = {
  owner: "primary",
  admin: "primary",
  lead: "violet",
  member: "neutral",
  viewer: "neutral",
  guest: "warning",
}

function DeptChips({ admin }: { admin: Admin }) {
  const list = departmentsOf(admin)
  if (!list.length)
    return (
      <span className="text-[12.5px] text-muted-foreground">
        Shared pages only
      </span>
    )
  return (
    <div className="flex flex-wrap gap-1">
      {list.map((d) => (
        <Badge key={d.id} tone={d.tone as Tone}>
          {d.name}
        </Badge>
      ))}
    </div>
  )
}

function People() {
  const access = useAccess()
  const [query, setQuery] = useState("")
  const [dept, setDept] = useState("all")
  const shown = admins.filter(
    (a) =>
      (dept === "all" || a.departmentIds.includes(dept)) &&
      (a.name + a.title + a.email).toLowerCase().includes(query.toLowerCase())
  )
  return (
    <Card
      icon={UsersIcon}
      title="People"
      description={`${admins.length} people · ${admins.filter((a) => a.status === "invited").length} invited`}
      actions={
        <>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Name, title or email"
            className="w-56"
          />
          <Select
            className="h-8 w-[190px]"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </>
      }
      flush
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Person</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Pages</TableHead>
            <TableHead>Sign-in</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((a) => {
            const role = roleOf(a)
            const pages = Object.values(accessFor(a).pages).filter(
              (l) => l !== "none"
            ).length
            return (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={a.name} photo={a.photo} size={32} />
                    <span className="grid leading-tight">
                      <span className="font-medium">
                        {a.name}
                        {a.me && (
                          <span className="font-normal text-muted-foreground">
                            {" "}
                            (you)
                          </span>
                        )}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {a.title}
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DeptChips admin={a} />
                </TableCell>
                <TableCell>
                  <div className="grid gap-0.5">
                    <Badge tone={BASE_TONE[role.base]} dot={false}>
                      {role.name}
                    </Badge>
                    {role.custom && (
                      <span className="text-[11.5px] text-muted-foreground">
                        Based on {BASE_LABEL[role.base]}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{pages} of 39</TableCell>
                <TableCell>
                  {a.status === "invited" ? (
                    <Badge tone="warning">Invited</Badge>
                  ) : a.tfa ? (
                    <Badge tone="success">Two-step on</Badge>
                  ) : (
                    <Tooltip label="Two-step sign-in not set up yet">
                      <span>
                        <Badge tone="danger">Two-step off</Badge>
                      </span>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {access && canViewAs(access.me, a) && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => access.startViewAs(a.id)}
                    >
                      <EyeIcon />
                      View as
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

function Departments() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {departments.map((d) => {
        const members = admins.filter((a) => a.departmentIds.includes(d.id))
        const leads = d.leadIds
          .map((id) => adminById(id))
          .filter(Boolean) as Admin[]
        return (
          <Card
            key={d.id}
            icon={Building2Icon}
            title={d.name}
            description={`${members.length} people · ${d.pages.length} pages`}
          >
            <div className="grid gap-4">
              <div className="flex items-center gap-2.5">
                {leads.map((l) => (
                  <span key={l.id} className="flex items-center gap-2">
                    <Avatar name={l.name} photo={l.photo} size={28} />
                    <span className="grid leading-tight">
                      <span className="text-[13px] font-medium">{l.name}</span>
                      <span className="text-[11.5px] text-muted-foreground">
                        Lead
                      </span>
                    </span>
                  </span>
                ))}
                <span className="ml-auto flex -space-x-1.5">
                  {members
                    .filter((m) => !d.leadIds.includes(m.id))
                    .map((m) => (
                      <Tooltip
                        key={m.id}
                        label={`${m.name} · ${roleOf(m).name}`}
                      >
                        <span>
                          <Avatar
                            name={m.name}
                            photo={m.photo}
                            size={24}
                            ring
                          />
                        </span>
                      </Tooltip>
                    ))}
                </span>
              </div>
              <div>
                <div className="mb-1.5 text-[12px] font-medium text-muted-foreground">
                  Pages it owns
                </div>
                <div className="flex flex-wrap gap-1">
                  {d.pages.map((p) => (
                    <Badge key={p} tone="neutral" dot={false}>
                      {pageById[p]?.title ?? p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function Roles() {
  return (
    <Card
      icon={ShieldCheckIcon}
      title="Roles and rights"
      description="Each custom role is built on a base role and adds named rights"
      flush
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Base</TableHead>
            <TableHead>People</TableHead>
            {RIGHTS.map((r) => (
              <TableHead
                key={r.id}
                className="text-center text-[11.5px] whitespace-normal"
              >
                {r.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => {
            const count = admins.filter((a) => a.roleId === role.id).length
            return (
              <TableRow key={role.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {role.name}
                </TableCell>
                <TableCell>
                  <Badge tone={BASE_TONE[role.base]} dot={false}>
                    {BASE_LABEL[role.base]}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">{count}</TableCell>
                {RIGHTS.map((r) => (
                  <TableCell key={r.id} className="text-center">
                    {role.rights === "all" || role.rights.includes(r.id) ? (
                      <span className="inline-flex size-6 items-center justify-center rounded-md bg-success/10 text-success">
                        <CheckIcon className="size-3.5" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

function Sessions() {
  return (
    <Card
      icon={KeyRoundIcon}
      title="Active admin sessions"
      description="Sign-ins to HQ in the last 24 hours"
      flush
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Where</TableHead>
            <TableHead>When</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminSessions.map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    name={r.who}
                    photo={admins.find((o) => o.name === r.who)?.photo}
                    size={24}
                  />
                  {r.who}
                </div>
              </TableCell>
              <TableCell>{r.device}</TableCell>
              <TableCell className="font-mono text-[12.5px]">{r.ip}</TableCell>
              <TableCell>
                {r.where}
                {r.flag && (
                  <Badge tone="warning" className="ml-2">
                    {r.flag}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{r.when}</TableCell>
              <TableCell>
                {r.current ? (
                  <Badge tone="success">This session</Badge>
                ) : (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      adminSessions.splice(i, 1)
                      logAudit("Ended admin session", r.who, r.device)
                      refresh()
                      toast("Session ended")
                    }}
                  >
                    <LogOutIcon />
                    End
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export function TeamPage() {
  const [tab, setTab] = useState("people")
  const [inviting, setInviting] = useState(false)
  return (
    <>
      <PageHeader
        title="Admin team"
        desc="Who works in HQ, the departments they belong to, and what each role can do. Use View as to see HQ exactly as someone else does."
      >
        <Button onClick={() => setInviting(true)}>
          <UserPlusIcon />
          Invite admin
        </Button>
      </PageHeader>
      <div className="mb-4">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            {
              value: "people",
              label: "People",
              icon: UsersIcon,
              count: admins.length,
            },
            {
              value: "departments",
              label: "Departments",
              icon: Building2Icon,
              count: departments.length,
            },
            {
              value: "roles",
              label: "Roles & rights",
              icon: LayersIcon,
              count: roles.length,
            },
            { value: "sessions", label: "Sessions", icon: KeyRoundIcon },
          ]}
        />
      </div>
      {tab === "people" && <People />}
      {tab === "departments" && <Departments />}
      {tab === "roles" && <Roles />}
      {tab === "sessions" && <Sessions />}
      <Dialog
        open={inviting}
        onClose={() => setInviting(false)}
        title="Invite an admin"
        description="They sign in with their work email and must set up two-step sign-in first."
        footer={
          <>
            <Button variant="outline" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setInviting(false)
                logAudit(
                  "Invited admin",
                  "new admin",
                  "Role: Support · Operations & Support"
                )
                toast("Invite sent")
              }}
            >
              <SendIcon />
              Send invite
            </Button>
          </>
        }
      >
        <Field label="Work email">
          <Input placeholder="name@mystayid.com" />
        </Field>
        <Field label="Role">
          <Select defaultValue="support">
            {roles
              .filter((r) => r.base !== "owner")
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Department">
          <Select defaultValue="ops">
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </Field>
      </Dialog>
    </>
  )
}
