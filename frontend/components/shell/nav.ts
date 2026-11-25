import {
  BookOpenIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  ChartLineIcon,
  ClipboardListIcon,
  CpuIcon,
  CreditCardIcon,
  FileChartColumnIcon,
  FileClockIcon,
  FileLockIcon,
  FileTextIcon,
  FlagIcon,
  FlaskConicalIcon,
  HandshakeIcon,
  HistoryIcon,
  HouseIcon,
  IdCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MailIcon,
  MapIcon,
  MegaphoneIcon,
  NetworkIcon,
  PlugIcon,
  RadioIcon,
  ScaleIcon,
  ServerIcon,
  SettingsIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SquareKanbanIcon,
  StarIcon,
  ToggleRightIcon,
  TriangleAlertIcon,
  UserCogIcon,
  UsersIcon,
  WalletIcon,
  WorkflowIcon,
} from "lucide-react"
import {
  approvals,
  cases,
  currentAdmin,
  hostels,
  incidents,
  lawRequests,
  listingReviews,
  reports,
  safetyAlerts,
  supportTickets,
  verifications,
} from "@/lib/data/core"
import { TODAY, rollouts, spendRequests, tasks } from "@/lib/data/teams"

const countWhere = (t?, a?) => t.filter(a).length

export const navGroups: any[] = [
  [
    "Overview",
    [
      ["command", LayoutDashboardIcon, "Command center"],
      ["analytics", ChartLineIcon, "Analytics"],
      ["org", NetworkIcon, "Organization"],
      ["calendar", CalendarIcon, "Company calendar"],
      ["announcements", RadioIcon, "Announcements"],
    ],
  ],
  [
    "Teams",
    [
      [
        "work",
        SquareKanbanIcon,
        "All team work",
        () => tasks.filter((t) => t.status !== "Done" && t.due < TODAY).length,
        "danger",
      ],
      ["marketing", MegaphoneIcon, "Marketing"],
      [
        "finance",
        WalletIcon,
        "Finance",
        () => spendRequests.filter((t) => !t.done).length,
      ],
      [
        "technical",
        CpuIcon,
        "Technical",
        () => rollouts.filter((t) => t.status === "Halted").length,
        "warning",
      ],
    ],
  ],
  [
    "People",
    [
      ["users", UsersIcon, "Users"],
      [
        "verify",
        IdCardIcon,
        "Verification queue",
        () => countWhere(verifications, (t) => !t.done),
      ],
      ["stays", HistoryIcon, "Stay records"],
    ],
  ],
  [
    "Places",
    [
      [
        "hostels",
        Building2Icon,
        "Hostels",
        () => countWhere(hostels, (t) => t.status === "pending"),
      ],
      ["landlords", HouseIcon, "Landlords & flats"],
      [
        "listings",
        ClipboardListIcon,
        "Listing review",
        () => countWhere(listingReviews, (t) => !t.done),
      ],
      ["map", MapIcon, "Live map"],
    ],
  ],
  [
    "Trust & safety",
    [
      [
        "cases",
        BriefcaseIcon,
        "Cases",
        () =>
          countWhere(cases, (t) => t.pri === "P1" && t.status !== "Resolved"),
        "danger",
      ],
      [
        "reports",
        FlagIcon,
        "Reports & disputes",
        () =>
          countWhere(reports, (t) =>
            ["Disputed", "HQ review"].includes(t.status)
          ),
      ],
      [
        "alerts",
        TriangleAlertIcon,
        "Safety alerts",
        () => countWhere(safetyAlerts, (t) => t.open),
        "danger",
      ],
      ["rules", ShieldAlertIcon, "Fraud & risk rules"],
      [
        "law",
        ScaleIcon,
        "Law enforcement",
        () => countWhere(lawRequests, (t) => t.step < 3),
      ],
      [
        "approvals",
        ShieldCheckIcon,
        "Approvals",
        () =>
          countWhere(
            approvals,
            (t) => t.status === "waiting" && t.by !== currentAdmin.name
          ),
      ],
      ["privacy", FileLockIcon, "Privacy requests"],
      ["audit", FileClockIcon, "Audit log"],
    ],
  ],
  [
    "Growth & business",
    [
      ["levels", StarIcon, "Stay Levels & rewards"],
      ["campaigns", MailIcon, "Campaigns & push"],
      ["templates", FileTextIcon, "Message templates"],
      ["partners", HandshakeIcon, "Partners"],
      ["plans", CreditCardIcon, "Plans & billing"],
    ],
  ],
  [
    "Platform",
    [
      ["appcontrol", ToggleRightIcon, "App control"],
      ["automations", WorkflowIcon, "Automations"],
      ["reportbuilder", FileChartColumnIcon, "Reports builder"],
      ["experiments", FlaskConicalIcon, "Experiments"],
      ["integrations", PlugIcon, "Integrations & API"],
      [
        "status",
        ServerIcon,
        "System status",
        () => countWhere(incidents, (t) => t.status !== "Resolved"),
        "warning",
      ],
      ["content", BookOpenIcon, "Content & policies"],
      [
        "support",
        InboxIcon,
        "Support inbox",
        () => countWhere(supportTickets, (t) => t.status === "Open"),
      ],
      ["team", UserCogIcon, "Admin team"],
      ["settings", SettingsIcon, "Settings"],
    ],
  ],
]

export const pages: any[] = navGroups.flatMap((t) =>
  t[1].map((a) => ({
    id: a[0],
    icon: a[1],
    title: a[2],
    group: t[0],
  }))
)

export const pageById = Object.fromEntries(pages.map((t) => [t.id, t]))
