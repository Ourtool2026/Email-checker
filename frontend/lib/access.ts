import {
  admins,
  departments,
  groups,
  overrides,
  roles,
  SHARED_PAGES,
} from "@/lib/data/access"
import { TODAY } from "@/lib/data/teams"
import { pageIds } from "@/lib/routes"

/*
 * HQ access model (ClickUp-style): a person's role sets the highest level and the
 * named rights; their departments decide which pages they get; groups add pages;
 * overrides grant or block one page or right for one person, until a date.
 * The browser uses this to shape the screen; a backend must enforce the same rules.
 */

export type PageId = string
export type Level = "none" | "view" | "edit" | "manage"
export type Right =
  | "reveal_details"
  | "approve_id"
  | "suspend"
  | "approve_listing"
  | "change_plan"
  | "send_campaign"
  | "app_control"
  | "release_data"
  | "manage_admins"
  | "view_as"
export type BaseRole =
  "owner" | "admin" | "lead" | "member" | "viewer" | "guest"

export type Department = {
  id: string
  name: string
  tone: string
  leadIds: string[]
  private: boolean
  /** Pages this department owns; members get them at their role's level. */
  pages: PageId[]
}
export type Role = {
  id: string
  name: string
  base: BaseRole
  rights: Right[] | "all"
  custom: boolean
}
export type Group = {
  id: string
  name: string
  pages: Partial<Record<PageId, Level>>
  rights: Right[]
}
export type Override = {
  userId: string
  page?: PageId
  right?: Right
  effect: "grant" | "block"
  level?: Level
  reason: string
  until?: string
  by: string
}
export type Admin = {
  id: string
  name: string
  title: string
  email: string
  photo: string | null
  roleId: string
  departmentIds: string[]
  groupIds: string[]
  status: "active" | "invited" | "deactivated"
  tfa: boolean
  me?: boolean
}

export const LEVELS: Level[] = ["none", "view", "edit", "manage"]
export const LEVEL_LABEL: Record<Level, string> = {
  none: "No access",
  view: "View",
  edit: "Edit",
  manage: "Manage",
}
export const BASE_LABEL: Record<BaseRole, string> = {
  owner: "Owner",
  admin: "Admin",
  lead: "Department lead",
  member: "Member",
  viewer: "Viewer",
  guest: "Guest",
}
export const RIGHTS: { id: Right; label: string }[] = [
  { id: "reveal_details", label: "Show hidden details" },
  { id: "approve_id", label: "Approve ID checks" },
  { id: "suspend", label: "Suspend accounts" },
  { id: "approve_listing", label: "Approve hostels and listings" },
  { id: "change_plan", label: "Change plans" },
  { id: "send_campaign", label: "Send campaigns" },
  { id: "app_control", label: "App control and feature switches" },
  { id: "release_data", label: "Release data to police" },
  { id: "manage_admins", label: "Manage admins" },
  { id: "view_as", label: "View as" },
]
export const rightLabel = (right: Right) =>
  RIGHTS.find((r) => r.id === right)?.label ?? right

/** The highest level each base role can reach on a page it gets. */
const MAX_LEVEL: Record<BaseRole, Level> = {
  owner: "manage",
  admin: "manage",
  lead: "manage",
  member: "edit",
  viewer: "view",
  guest: "view",
}

const rank = (level: Level) => LEVELS.indexOf(level)
const higher = (a: Level, b: Level) => (rank(a) >= rank(b) ? a : b)
const lower = (a: Level, b: Level) => (rank(a) <= rank(b) ? a : b)

export const adminById = (id: string | null | undefined) =>
  admins.find((a) => a.id === id)
export const roleOf = (admin: Admin) =>
  roles.find((r) => r.id === admin.roleId) ?? roles.at(-1)!
export const departmentsOf = (admin: Admin) =>
  departments.filter((d) => admin.departmentIds.includes(d.id))
export const isFullAccess = (admin: Admin) =>
  ["owner", "admin"].includes(roleOf(admin).base)
const activeOverrides = (admin: Admin) =>
  overrides.filter(
    (o) => o.userId === admin.id && (!o.until || o.until >= TODAY)
  )

export type Access = {
  pages: Record<PageId, Level>
  rights: Set<Right>
}

/** Effective access: role → departments → groups → overrides. */
export function accessFor(admin: Admin): Access {
  const role = roleOf(admin)
  if (isFullAccess(admin) && admin.status !== "deactivated") {
    return {
      pages: Object.fromEntries(pageIds.map((p) => [p, "manage" as Level])),
      rights: new Set(RIGHTS.map((r) => r.id)),
    }
  }
  const max = MAX_LEVEL[role.base]
  const pages: Record<PageId, Level> = Object.fromEntries(
    pageIds.map((p) => [p, "none" as Level])
  )
  if (admin.status === "deactivated") return { pages, rights: new Set() }

  if (role.base !== "guest") {
    for (const p of SHARED_PAGES) pages[p] = higher(pages[p], "view")
    for (const d of departmentsOf(admin))
      for (const p of d.pages) pages[p] = higher(pages[p], max)
  }
  const rights = new Set<Right>(role.rights === "all" ? [] : role.rights)
  for (const g of groups.filter((g) => admin.groupIds.includes(g.id))) {
    for (const [p, level] of Object.entries(g.pages))
      pages[p] = higher(
        pages[p],
        lower(level, max === "view" ? "view" : "manage")
      )
    g.rights.forEach((r) => rights.add(r))
  }
  // People who manage admins or preview them reach the Admin team page.
  if (rights.has("manage_admins") || rights.has("view_as"))
    pages.team = higher(pages.team, "view")
  for (const o of activeOverrides(admin)) {
    if (o.page)
      pages[o.page] =
        o.effect === "block" ? "none" : higher(pages[o.page], o.level ?? "view")
    if (o.right) {
      if (o.effect === "block") rights.delete(o.right)
      else rights.add(o.right)
    }
  }
  return { pages, rights }
}

/** Plain-language reasons for a person's level on one page (the "Why" panel). */
export function explainPage(admin: Admin, page: PageId): string[] {
  const role = roleOf(admin)
  if (isFullAccess(admin)) return [`${role.name}: every page at Manage`]
  const reasons: string[] = []
  const max = LEVEL_LABEL[MAX_LEVEL[role.base]]
  for (const d of departmentsOf(admin))
    if (d.pages.includes(page))
      reasons.push(`${d.name} owns this page · ${role.name} gets ${max}`)
  if (role.base !== "guest" && SHARED_PAGES.includes(page))
    reasons.push("Shared with everyone at View")
  for (const g of groups.filter((g) => admin.groupIds.includes(g.id)))
    if (g.pages[page])
      reasons.push(`${g.name} group adds ${LEVEL_LABEL[g.pages[page]!]}`)
  for (const o of activeOverrides(admin))
    if (o.page === page)
      reasons.push(
        `${o.effect === "grant" ? `Granted ${LEVEL_LABEL[o.level ?? "view"]}` : "Blocked"} by ${o.by}` +
          `${o.until ? ` until ${o.until}` : ""}: ${o.reason}`
      )
  if (
    page === "team" &&
    !reasons.length &&
    accessFor(admin).pages.team !== "none"
  )
    reasons.push(`${role.name} can manage or preview admins`)
  return reasons
}

/** Who can open a page for someone who can't: its departments' leads, then admins. */
export function grantersFor(page: PageId): Admin[] {
  const leadIds = departments
    .filter((d) => d.pages.includes(page))
    .flatMap((d) => d.leadIds)
  const leads = admins.filter((a) => leadIds.includes(a.id))
  return leads.length ? leads : admins.filter(isFullAccess)
}

/** Owner and Admins preview anyone; leads with View as preview their own departments. */
export function canViewAs(viewer: Admin, target: Admin) {
  if (viewer.id === target.id) return false
  if (isFullAccess(viewer)) return true
  const role = roleOf(viewer)
  const rights = role.rights === "all" ? [] : role.rights
  if (!rights.includes("view_as") || isFullAccess(target)) return false
  return target.departmentIds.some((d) =>
    departments.find((x) => x.id === d)?.leadIds.includes(viewer.id)
  )
}

/** Short role line for a person: "Trust & Safety lead · Trust & Safety". */
export const describeAdmin = (admin: Admin) =>
  [roleOf(admin).name, ...departmentsOf(admin).map((d) => d.name)].join(" · ")
