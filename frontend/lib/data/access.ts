import type {
  Admin,
  Department,
  Group,
  Override,
  PageId,
  Role,
} from "@/lib/access"
import { orgPhoto } from "@/lib/data/org"

/*
 * Who works in HQ and what they can reach (sample data, see docs plan "HQ admin
 * access plan"). Departments own pages; roles set the level and named rights;
 * groups and overrides adjust single people.
 */

/** Pages every member of staff can read, whatever their department. */
export const SHARED_PAGES: PageId[] = [
  "command",
  "calendar",
  "announcements",
  "org",
  "work",
]

export const departments: Department[] = [
  {
    id: "exec",
    name: "Leadership",
    tone: "primary",
    leadIds: ["ceo"],
    private: false,
    pages: [
      "command",
      "analytics",
      "org",
      "calendar",
      "announcements",
      "approvals",
      "audit",
      "team",
      "settings",
    ],
  },
  {
    id: "trust",
    name: "Trust & Safety",
    tone: "danger",
    leadIds: ["coo"],
    private: false,
    pages: [
      "verify",
      "cases",
      "reports",
      "alerts",
      "rules",
      "law",
      "privacy",
      "users",
      "stays",
    ],
  },
  {
    id: "ops",
    name: "Operations & Support",
    tone: "teal",
    leadIds: ["ops"],
    private: false,
    pages: [
      "hostels",
      "landlords",
      "listings",
      "map",
      "support",
      "content",
      "users",
      "stays",
    ],
  },
  {
    id: "growth",
    name: "Marketing",
    tone: "pink",
    leadIds: ["mkt"],
    private: false,
    pages: [
      "marketing",
      "campaigns",
      "templates",
      "partners",
      "levels",
      "experiments",
    ],
  },
  {
    id: "finance",
    name: "Finance",
    tone: "success",
    leadIds: ["fin"],
    private: false,
    pages: ["finance", "plans"],
  },
  {
    id: "eng",
    name: "Engineering",
    tone: "violet",
    leadIds: ["cto"],
    private: false,
    pages: [
      "technical",
      "appcontrol",
      "automations",
      "integrations",
      "status",
      "reportbuilder",
      "experiments",
    ],
  },
]

export const roles: Role[] = [
  { id: "owner", name: "Owner", base: "owner", rights: "all", custom: false },
  { id: "admin", name: "Admin", base: "admin", rights: "all", custom: false },
  {
    id: "ts-lead",
    name: "Trust & Safety lead",
    base: "lead",
    rights: [
      "reveal_details",
      "approve_id",
      "suspend",
      "view_as",
      "manage_admins",
    ],
    custom: true,
  },
  {
    id: "ops-lead",
    name: "Operations lead",
    base: "lead",
    rights: ["reveal_details", "approve_listing", "view_as", "manage_admins"],
    custom: true,
  },
  {
    id: "mkt-lead",
    name: "Marketing lead",
    base: "lead",
    rights: ["send_campaign", "view_as", "manage_admins"],
    custom: true,
  },
  {
    id: "fin-lead",
    name: "Finance lead",
    base: "lead",
    rights: ["change_plan", "view_as", "manage_admins"],
    custom: true,
  },
  {
    id: "eng-lead",
    name: "Engineering lead",
    base: "lead",
    rights: ["app_control", "view_as", "manage_admins"],
    custom: true,
  },
  {
    id: "ts",
    name: "Trust & safety",
    base: "member",
    rights: ["reveal_details", "approve_id"],
    custom: true,
  },
  {
    id: "operations",
    name: "Operations",
    base: "member",
    rights: ["approve_listing"],
    custom: true,
  },
  {
    id: "support",
    name: "Support",
    base: "member",
    rights: ["reveal_details"],
    custom: true,
  },
  {
    id: "growth",
    name: "Growth",
    base: "member",
    rights: ["send_campaign"],
    custom: true,
  },
  {
    id: "legal",
    name: "Legal officer",
    base: "member",
    rights: ["reveal_details", "release_data"],
    custom: true,
  },
  { id: "member", name: "Member", base: "member", rights: [], custom: false },
  { id: "viewer", name: "Viewer", base: "viewer", rights: [], custom: false },
  { id: "guest", name: "Guest", base: "guest", rights: [], custom: false },
]

const admin = (
  id: string,
  name: string,
  title: string,
  roleId: string,
  departmentIds: string[],
  extra: Partial<Admin> = {}
): Admin => ({
  id,
  name,
  title,
  email: `${name.split(" ")[0].toLowerCase()}@mystayid.com`,
  photo: orgPhoto(name),
  roleId,
  departmentIds,
  groupIds: [],
  status: "active",
  tfa: true,
  ...extra,
})

export const admins: Admin[] = [
  admin("ceo", "Sabbir Ahmed", "CEO & Founder", "owner", ["exec"], {
    me: true,
  }),
  admin("coo", "Mitu Akter", "Head of Trust & Safety", "ts-lead", ["trust"]),
  admin("legal", "Nadia Rahman", "Legal officer", "legal", ["trust"]),
  admin("ops", "Imran Chowdhury", "Head of Operations", "ops-lead", ["ops"]),
  admin("sup", "Rony Das", "Support lead", "support", ["ops"]),
  admin(
    "field",
    "Jakir Hossain",
    "Hostel onboarding (field)",
    "operations",
    ["ops"],
    {
      tfa: false,
    }
  ),
  admin("sup2", "Puja Saha", "Support agent", "support", ["ops"]),
  admin("mkt", "Farah Kabir", "Growth lead", "mkt-lead", ["growth"]),
  admin("cont", "Tanzila Rahman", "Content", "growth", ["growth"]),
  admin("des", "Shuvo Ahmed", "Design", "viewer", ["growth"]),
  admin("camp", "Mehjabin Ara", "Campus partnerships", "growth", ["growth"]),
  admin("fin", "Ayesha Siddika", "Finance lead", "fin-lead", ["finance"]),
  admin("acc", "Mahmud Hasan", "Accountant", "member", ["finance"]),
  admin("cto", "Arif Hossain", "Engineering lead", "eng-lead", ["eng"]),
  admin("be", "Nabil Rahman", "Backend engineer", "member", ["eng"], {
    groupIds: ["oncall"],
  }),
  admin("mob", "Sadia Noor", "Mobile engineer", "member", ["eng"]),
  admin("sre", "Tareq Aziz", "Infra & SRE", "member", ["eng"], {
    groupIds: ["oncall"],
  }),
  admin("audit1", "Shahana Parvin", "External auditor", "guest", [], {
    status: "invited",
    tfa: false,
    email: "shahana@ledgerpoint.example",
  }),
]

export const groups: Group[] = [
  {
    id: "oncall",
    name: "On-call",
    pages: { status: "edit", integrations: "view" },
    rights: [],
  },
]

export const overrides: Override[] = [
  {
    userId: "sup",
    page: "reports",
    effect: "grant",
    level: "view",
    reason: "Helping with the dispute backlog",
    until: "2026-11-30",
    by: "Mitu Akter",
  },
  {
    userId: "audit1",
    page: "finance",
    effect: "grant",
    level: "view",
    reason: "Year-end audit",
    until: "2026-12-31",
    by: "Sabbir Ahmed",
  },
  {
    userId: "audit1",
    page: "plans",
    effect: "grant",
    level: "view",
    reason: "Year-end audit",
    until: "2026-12-31",
    by: "Sabbir Ahmed",
  },
]
