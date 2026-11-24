// Every HQ page id. Each one is served at /<id> (for example /verify).
export const pageIds = [
  "command",
  "analytics",
  "org",
  "calendar",
  "announcements",
  "work",
  "marketing",
  "finance",
  "technical",
  "users",
  "verify",
  "stays",
  "hostels",
  "landlords",
  "listings",
  "map",
  "cases",
  "reports",
  "alerts",
  "rules",
  "law",
  "approvals",
  "privacy",
  "audit",
  "levels",
  "campaigns",
  "templates",
  "partners",
  "plans",
  "appcontrol",
  "automations",
  "reportbuilder",
  "experiments",
  "integrations",
  "status",
  "content",
  "support",
  "team",
  "settings",
];

export const isPageId = (id) => pageIds.includes(id);

export const pagePath = (id) => `/${id}`;

export const routeFromPath = (pathname) => {
  const id = (pathname || "/").split("/")[1];
  return isPageId(id) ? id : null;
};
