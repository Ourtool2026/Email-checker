# MyStay ID HQ (frontend)

The internal admin dashboard for MyStay ID and MyStay for Business, built with
Next.js (App Router), React 19 and Tailwind CSS v4.

This is the **frontend only**. Every number, person and hostel comes from sample
data in `lib/data/`, held in memory in the browser. Nothing is saved to a server
yet; a page reload resets it.

## Run it

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm start` (serve the production build) and
`npm run lint`.

## Pages

Each HQ page has its own route, for example `/verify`, `/users` or `/cases`.
`/` opens the start page picked under **Customize → Start page** (Command center
by default). Old hash links such as `/#verify` redirect to `/verify`.

| Group | Routes |
| --- | --- |
| Overview | `/command`, `/analytics`, `/org`, `/calendar`, `/announcements` |
| Teams | `/work`, `/marketing`, `/finance`, `/technical` |
| People | `/users`, `/verify`, `/stays` |
| Places | `/hostels`, `/landlords`, `/listings`, `/map` |
| Trust & safety | `/cases`, `/reports`, `/alerts`, `/rules`, `/law`, `/approvals`, `/privacy`, `/audit` |
| Growth & business | `/levels`, `/campaigns`, `/templates`, `/partners`, `/plans` |
| Platform | `/appcontrol`, `/automations`, `/reportbuilder`, `/experiments`, `/integrations`, `/status`, `/content`, `/support`, `/team`, `/settings` |

## Layout

```
app/
  layout.jsx              Root HTML, Inter font, theme bootstrap
  globals.css             Tailwind v4 theme tokens, dark mode, sidebar themes, accents
  (hq)/layout.jsx         Wraps every page in the HQ shell
  (hq)/page.jsx           "/" → start page redirect
  (hq)/[page]/page.jsx    One static route per HQ page
components/
  ui/                     Primitives: Button, Badge, Card, Input, Select, Switch, Tabs,
                          Table, Dialog, Sheet, DropdownMenu, Tooltip, Toast, Avatar, …
  shared/                 HQ building blocks: PageHeader, Notice, KpiTile, ScoreRing,
                          MaskedValue, LivingIdCard, SearchInput, FilterChips, …
  charts.jsx              LineChart, Donut, BarList, Funnel, CohortTable, Sparkline helpers
  shell/                  Sidebar, Topbar, CommandPalette (⌘K), NotificationsPanel,
                          CustomizeSheet, page registry and navigation
  drawers/                User, hostel and case drawers
  teams/  org/            Team boards, task drawer, content calendar, org chart
  pages/                  One component per HQ page
lib/
  data/                   Sample data (core, ops, teams, org)
  store.js                refresh() re-renders after sample data changes; audit log helper
  lab.js                  Optional cross-tab "test lab" bus shared with the MyStay ID app prototype
  routes.js  prefs.js  format.js  metrics.js  photos.js  utils.js
public/photos/            Sample photos
```

## Keyboard shortcuts

`⌘K` or `/` search, `G` then `U`/`C`/`H`/`A`/`D` to jump, `N` notifications,
`[` collapse the sidebar, `?` list all shortcuts.

## Connecting a backend later

Pages read and change the arrays in `lib/data/` directly, then call `refresh()`
from `lib/store.js`. To move to a real API, swap those reads for fetches and the
in-place edits for API calls; the UI components can stay as they are.
