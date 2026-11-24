import {
  LuBriefcase,
  LuCrown,
  LuGraduationCap,
  LuHouse,
  LuLaptop,
  LuShieldCheck,
} from "react-icons/lu";
import { adminTeam, cases, supportTickets } from "@/lib/data/core";
import { memberPhoto, tasks } from "@/lib/data/teams";

export const orgTeams = {
  exec: ["Leadership", "primary", LuCrown],
  trust: ["Trust & Safety", "danger", LuShieldCheck],
  ops: ["Operations & Support", "teal", LuHouse],
  growth: ["Marketing", "pink", LuGraduationCap],
  finance: ["Finance", "success", LuBriefcase],
  eng: ["Engineering", "violet", LuLaptop],
};

export const offices = {
  mirpur: ["Mirpur 10 office", "Head office \xB7 12 desks"],
  uttara: ["Uttara field office", "Near the beta hostels"],
  diu: ["DIU campus desk", "Ashulia, 3 days a week"],
  remote: ["Remote", "Works from home"],
};

export const presence = {
  online: ["Online", "bg-success"],
  meeting: ["In a meeting", "bg-warning"],
  away: ["Away", "bg-muted-foreground/50"],
  leave: ["On leave", "bg-destructive"],
};

const person = (t, a, e, r, i, o, n, l, d = {}) => ({
  id: t,
  name: a,
  title: e,
  team: r,
  parent: i,
  loc: o,
  status: n,
  joined: l,
  ...d,
});

export const orgPeople = [
  person("ceo", "Sabbir Ahmed", "CEO & Founder", "exec", null, "mirpur", "online", "Jan 2026", {
    email: "sabbir@mystayid.com",
    note: "Super admin in HQ",
  }),
  person(
    "coo",
    "Mitu Akter",
    "Head of Trust & Safety",
    "trust",
    "ceo",
    "mirpur",
    "online",
    "Mar 2026",
  ),
  person("legal", "Nadia Rahman", "Legal officer", "trust", "coo", "mirpur", "meeting", "Apr 2026"),
  person(
    "rev1",
    "Open role",
    "Safety reviewer (night shift)",
    "trust",
    "coo",
    "mirpur",
    null,
    null,
    {
      open: true,
    },
  ),
  person(
    "ops",
    "Imran Chowdhury",
    "Head of Operations",
    "ops",
    "ceo",
    "uttara",
    "online",
    "Mar 2026",
  ),
  person("sup", "Rony Das", "Support lead", "ops", "ops", "mirpur", "online", "May 2026"),
  person(
    "field",
    "Jakir Hossain",
    "Hostel onboarding (field)",
    "ops",
    "ops",
    "uttara",
    "away",
    "Aug 2026",
  ),
  person("sup2", "Puja Saha", "Support agent", "ops", "sup", "remote", "online", "Oct 2026"),
  person("mkt", "Farah Kabir", "Growth lead", "growth", "ceo", "remote", "online", "Feb 2026", {
    city: "Chattogram",
  }),
  person("cont", "Tanzila Rahman", "Content", "growth", "mkt", "mirpur", "online", "Jun 2026"),
  person("des", "Shuvo Ahmed", "Design", "growth", "mkt", "mirpur", "meeting", "Jun 2026"),
  person(
    "camp",
    "Mehjabin Ara",
    "Campus partnerships",
    "growth",
    "mkt",
    "diu",
    "online",
    "Jul 2026",
  ),
  person("fin", "Ayesha Siddika", "Finance lead", "finance", "ceo", "mirpur", "away", "Feb 2026"),
  person("acc", "Mahmud Hasan", "Accountant", "finance", "fin", "mirpur", "leave", "May 2026", {
    leaveTill: "26 Nov",
  }),
  person("cto", "Arif Hossain", "Engineering lead", "eng", "ceo", "mirpur", "online", "Jan 2026"),
  person("be", "Nabil Rahman", "Backend engineer", "eng", "cto", "remote", "online", "Mar 2026"),
  person("mob", "Sadia Noor", "Mobile engineer", "eng", "cto", "mirpur", "online", "Apr 2026"),
  person("sre", "Tareq Aziz", "Infra & SRE", "eng", "cto", "remote", "online", "Apr 2026", {
    oncall: true,
  }),
  person("be2", "Open role", "Backend engineer", "eng", "cto", "mirpur", null, null, {
    open: true,
  }),
  person("qa", "Open role", "QA engineer", "eng", "cto", "mirpur", null, null, {
    open: true,
  }),
];

export const orgPhoto = (t) => adminTeam.find((a) => a.name === t)?.photo || memberPhoto(t) || null;

export const childrenOf = (t) => orgPeople.filter((a) => a.parent === t);

export const activePeople = () => orgPeople.filter((t) => !t.open);

export const workloadOf = (t) => [
  ...tasks.filter((a) => a.who === t && a.status !== "Done"),
  ...cases
    .filter((a) => a.who === t && a.status !== "Resolved")
    .map((a) => ({
      id: a.id,
      title: a.title,
      status: a.status,
      pri: a.pri === "P1" ? "Urgent" : "High",
      due: "2026-11-24",
      team: "cases",
    })),
  ...supportTickets
    .filter((a) => a.who === t && a.status !== "Solved")
    .map((a) => ({
      id: a.id,
      title: a.subj,
      status: a.status,
      pri: a.pri === "High" ? "High" : "Medium",
      due: "2026-11-24",
      team: "support",
    })),
];

export const loadOf = (t) =>
  Math.min(100, workloadOf(t).length * 22 + (t === "Sabbir Ahmed" ? 40 : 10));

export const chainOf = (t) => {
  let a = [];
  let e = t;
  for (; e && e.parent;) {
    e = orgPeople.find((r) => r.id === e.parent);
    a.unshift(e);
  }
  return a;
};

export const descendantsOf = (t) => childrenOf(t).flatMap((a) => [a, ...descendantsOf(a.id)]);
