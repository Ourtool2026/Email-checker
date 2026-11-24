import {
  LuBookOpen,
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuChartLine,
  LuClipboardList,
  LuCpu,
  LuCreditCard,
  LuFileChartColumn,
  LuFileClock,
  LuFileLock,
  LuFileText,
  LuFlag,
  LuFlaskConical,
  LuHandshake,
  LuHistory,
  LuHouse,
  LuIdCard,
  LuInbox,
  LuLayoutDashboard,
  LuMail,
  LuMap,
  LuMegaphone,
  LuNetwork,
  LuPlug,
  LuRadio,
  LuScale,
  LuServer,
  LuSettings,
  LuShieldAlert,
  LuShieldCheck,
  LuSquareKanban,
  LuStar,
  LuToggleRight,
  LuTriangleAlert,
  LuUserCog,
  LuUsers,
  LuWallet,
  LuWorkflow,
} from "react-icons/lu";
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
} from "@/lib/data/core";
import { TODAY, rollouts, spendRequests, tasks } from "@/lib/data/teams";

const countWhere = (t, a) => t.filter(a).length;

export const navGroups = [
  [
    "Overview",
    [
      ["command", LuLayoutDashboard, "Command center"],
      ["analytics", LuChartLine, "Analytics"],
      ["org", LuNetwork, "Organization"],
      ["calendar", LuCalendar, "Company calendar"],
      ["announcements", LuRadio, "Announcements"],
    ],
  ],
  [
    "Teams",
    [
      [
        "work",
        LuSquareKanban,
        "All team work",
        () => tasks.filter((t) => t.status !== "Done" && t.due < TODAY).length,
        "danger",
      ],
      ["marketing", LuMegaphone, "Marketing"],
      ["finance", LuWallet, "Finance", () => spendRequests.filter((t) => !t.done).length],
      [
        "technical",
        LuCpu,
        "Technical",
        () => rollouts.filter((t) => t.status === "Halted").length,
        "warning",
      ],
    ],
  ],
  [
    "People",
    [
      ["users", LuUsers, "Users"],
      ["verify", LuIdCard, "Verification queue", () => countWhere(verifications, (t) => !t.done)],
      ["stays", LuHistory, "Stay records"],
    ],
  ],
  [
    "Places",
    [
      ["hostels", LuBuilding2, "Hostels", () => countWhere(hostels, (t) => t.status === "pending")],
      ["landlords", LuHouse, "Landlords & flats"],
      [
        "listings",
        LuClipboardList,
        "Listing review",
        () => countWhere(listingReviews, (t) => !t.done),
      ],
      ["map", LuMap, "Live map"],
    ],
  ],
  [
    "Trust & safety",
    [
      [
        "cases",
        LuBriefcase,
        "Cases",
        () => countWhere(cases, (t) => t.pri === "P1" && t.status !== "Resolved"),
        "danger",
      ],
      [
        "reports",
        LuFlag,
        "Reports & disputes",
        () => countWhere(reports, (t) => ["Disputed", "HQ review"].includes(t.status)),
      ],
      [
        "alerts",
        LuTriangleAlert,
        "Safety alerts",
        () => countWhere(safetyAlerts, (t) => t.open),
        "danger",
      ],
      ["rules", LuShieldAlert, "Fraud & risk rules"],
      ["law", LuScale, "Law enforcement", () => countWhere(lawRequests, (t) => t.step < 3)],
      [
        "approvals",
        LuShieldCheck,
        "Approvals",
        () => countWhere(approvals, (t) => t.status === "waiting" && t.by !== currentAdmin.name),
      ],
      ["privacy", LuFileLock, "Privacy requests"],
      ["audit", LuFileClock, "Audit log"],
    ],
  ],
  [
    "Growth & business",
    [
      ["levels", LuStar, "Stay Levels & rewards"],
      ["campaigns", LuMail, "Campaigns & push"],
      ["templates", LuFileText, "Message templates"],
      ["partners", LuHandshake, "Partners"],
      ["plans", LuCreditCard, "Plans & billing"],
    ],
  ],
  [
    "Platform",
    [
      ["appcontrol", LuToggleRight, "App control"],
      ["automations", LuWorkflow, "Automations"],
      ["reportbuilder", LuFileChartColumn, "Reports builder"],
      ["experiments", LuFlaskConical, "Experiments"],
      ["integrations", LuPlug, "Integrations & API"],
      [
        "status",
        LuServer,
        "System status",
        () => countWhere(incidents, (t) => t.status !== "Resolved"),
        "warning",
      ],
      ["content", LuBookOpen, "Content & policies"],
      [
        "support",
        LuInbox,
        "Support inbox",
        () => countWhere(supportTickets, (t) => t.status === "Open"),
      ],
      ["team", LuUserCog, "Admin team"],
      ["settings", LuSettings, "Settings"],
    ],
  ],
];

export const pages = navGroups.flatMap((t) =>
  t[1].map((a) => ({
    id: a[0],
    icon: a[1],
    title: a[2],
    group: t[0],
  })),
);

export const pageById = Object.fromEntries(pages.map((t) => [t.id, t]));
