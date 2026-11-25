# MyStay ID HQ (frontend)

The internal admin dashboard for MyStay ID and MyStay for Business. It is built
the same way as Tirik Send (same stack, components and motion rules) and keeps
MyStay ID's own palette.

This is the **frontend only**. Every person, hostel and number comes from sample
data in `lib/data/`, held in memory in the browser; a reload resets it.

## Run it

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

`npm run build` · `npm start` · `npm run lint` · `npm run typecheck` · `npm run format`

## Stack

| Area | What HQ uses |
| --- | --- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript 5 |
| Styling | Tailwind CSS v4 with CSS variables (design tokens) |
| Components | shadcn/ui (new-york) on Radix, animated with Animate UI (`@animate-ui/react` on Motion) |
| Icons | Lucide (`lucide-react`), 1.75 px stroke |
| Charts | Recharts (through the shadcn chart wrapper) |
| Toasts | Sonner |
| Dark mode | next-themes (light, dark, system) |
| Search | cmdk (⌘K) |
| Fonts | Inter (interface), Rubik (page titles and the wordmark), Geist Mono, self-hosted via `@fontsource-variable` |

## Colour

MyStay ID's palette, defined once in `app/globals.css` (light on `:root`, dark on
`.dark`). Components only use the semantic classes (`bg-card`, `bg-surface`,
`text-muted-foreground`, `bg-success/10 text-success`, `shadow-card`…), so the
Customize panel can change them live.

| Role | Light | Dark | Token |
| --- | --- | --- | --- |
| Primary action | `#2F7BF6` | `#60A5FA` | `--primary` |
| Page background | `#F4F5F7` | `#0B0D12` | `--background` |
| Card / panel | `#FFFFFF` | `#14171E` | `--card` |
| Panel shell | `#EEF0F3` | `#10131A` | `--surface` |
| Text / secondary text | `#111827` / `#6B7280` | `#F3F4F6` / `#9CA3AF` | `--foreground` / `--muted-foreground` |
| Border | `#E7E8EC` | `#262A34` | `--border` |
| Success · Warning · Danger | `#15803D` · `#B45309` · `#DC2626` | `#4ADE80` · `#FBBF24` · `#F87171` | `--success` `--warning` `--destructive` |
| Violet · Teal · Pink · Orange · Indigo | `#7C3AED` · `#0F766E` · `#DB2777` · `#EA580C` · `#4F46E5` | `#A78BFA` · `#2DD4BF` · `#F472B6` · `#FB923C` · `#818CF8` | `--violet` … `--indigo` |
| Charts 1–5 | `#3B82F6` `#22C55E` `#8B5CF6` `#F59E0B` `#BFDBFE` | `#60A5FA` `#4ADE80` `#A78BFA` `#FBBF24` `#1E3A8A` | `--chart-1` … `--chart-5` |

Brand (app icon tile only): `--brand-sky #2CB8FF` → `--brand-blue #2B6BFF`.
Customize also offers accent colours (violet, emerald, rose, orange, slate) and
five sidebar themes (light, graphite, ocean blue, teal, midnight).

## Pages

Each page has its own route, for example `/verify`, `/users`, `/cases`. `/` opens
the start page chosen under **Customize → Start page**; old links such as
`/#verify` redirect to `/verify`.

| Group | Routes |
| --- | --- |
| Overview | `/command`, `/analytics`, `/org`, `/calendar`, `/announcements` |
| Teams | `/work`, `/marketing`, `/finance`, `/technical` |
| People | `/users`, `/verify`, `/stays` |
| Places | `/hostels`, `/landlords`, `/listings`, `/map` |
| Trust & safety | `/cases`, `/reports`, `/alerts`, `/rules`, `/law`, `/approvals`, `/privacy`, `/audit` |
| Growth & business | `/levels`, `/campaigns`, `/templates`, `/partners`, `/plans` |
| Platform | `/appcontrol`, `/automations`, `/reportbuilder`, `/experiments`, `/integrations`, `/status`, `/content`, `/support`, `/team`, `/settings` |

## Where things live

```
app/layout.tsx              fonts, ThemeProvider, sidebar/accent paint script
app/globals.css             tokens (MyStay palette), sidebar themes, accents, phone rules
app/(hq)/                   HQ shell layout, "/" redirect, one static route per page
components/ui/              shadcn/ui primitives, animated with Animate UI (same source as Tirik Send)
components/kit/             Tirik kit: Panel, Tile, Chip, MetricCard, Toolbar, BulkBar, useConfirm…
components/page/            Tirik page blocks: PageHeader, PageBody, EmptyState, IconTile…
components/hq/              HQ's component API (Card, Badge, Dialog, Sheet, Tabs, Select, toast…)
                            as thin adapters over ui/ and kit/
components/shell/           AppSidebar, SiteHeader, CommandMenu (⌘K), CustomizeSheet, NotificationsPanel
components/pages/           one component per HQ page
components/drawers/ teams/ org/ shared/ charts.tsx
lib/data/                   sample data; lib/store.ts refresh() re-renders after a change
lib/lab.ts                  optional cross-tab "test lab" bus shared with the MyStay ID app prototype
```

## Keyboard

`⌘K` or `/` search · `⌘B` collapse the sidebar · `G` then `U`/`C`/`H`/`A`/`D` jump ·
`N` notifications · `?` all shortcuts.

## Adding UI

The shadcn and Animate UI registries can't be reached from every environment, so
`components/ui/` is copied from Tirik Send. To add a primitive:

```bash
npx shadcn@latest add <component>
npx @animate-ui/cli@latest animate <component>
```

Build screens from `components/hq`, `components/kit` and `components/page`, use
token colours only, keep one primary action per screen, and check the page in
dark mode and at phone width. Build rules: `frontend/CLAUDE.md`.

## Connecting a backend later

Pages read and change the arrays in `lib/data/` directly, then call `refresh()`.
To move to a real API, swap those reads for fetches and the in-place edits for
API calls, and give the records real TypeScript types (they're loosely typed
today: `tsconfig` has `strict: false`).
