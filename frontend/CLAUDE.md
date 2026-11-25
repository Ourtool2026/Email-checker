# MyStay ID HQ frontend: build rules

Internal admin dashboard, frontend only (sample data in `lib/data/`). Built like Tirik Send
(`Ourtool2026/Tirik-send-test`, `client/`), with MyStay ID's palette. Overview: `README.md`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui new-york (Radix) animated with
Animate UI (`@animate-ui/react` on Motion) · lucide-react · recharts · sonner · next-themes · cmdk ·
fonts via `@fontsource-variable/*` (Inter, Rubik, Geist Mono).

## Layers

- `components/ui/`: shadcn/ui primitives, identical to Tirik Send's (lint-ignored). Never hand-edit
  one to restyle a screen. Add with `npx shadcn@latest add <name>` then
  `npx @animate-ui/cli@latest animate <name>`; motion on custom markup follows
  `.claude/skills/animate-ui` (tokens, recipes, reduced motion).
- `components/kit/`, `components/page/`: the Tirik kit and page blocks.
- `components/hq/`: the HQ component API every page imports (`Card` = kit `Panel`+`PanelBody`,
  `Badge` = kit `Chip`, `Dialog`, `Sheet`, `DropdownMenu`, `Tooltip`, `Tabs`, `Switch`, `Select`,
  `Progress`, `Table*`, `toast` = Sonner). Change the look here or in `ui/`, not per page.
- `components/shell/`: `hq-app.tsx` (SidebarProvider, header, drawers, dialogs, shortcuts, theme),
  `app-sidebar.tsx`, `site-header.tsx`, `command-menu.tsx`, `customize-sheet.tsx`, `nav.ts`
  (groups, badge counts), `page-registry.ts` (route id → page).
- Routing: `app/(hq)/[page]/page.tsx` serves every id in `lib/routes.ts`; pages get
  `{ nav, q, setQ, range, setRange }` (see `components/shell/hq-context.ts`). Navigate with
  `nav.go(id)`; open drawers with `nav.user(id)` / `nav.hostel(id)`. Navigation must stay
  client-side: a full reload resets the sample data.
- Data: `lib/data/*.ts` are mutable arrays; change them, then call `refresh()` (`lib/store.ts`).
  Log admin actions with `logAudit(action, target, reason)`.

## Rules

- **Tokens only.** No hex colours in components; semantic classes (`bg-card`, `bg-surface`,
  `text-muted-foreground`, `bg-success/10 text-success`, `shadow-card`, `shadow-float`) and
  `var(--chart-N)` for data. The palette is MyStay ID's (`app/globals.css`).
- **Two elevations**: surfaces `shadow-card`; menus, popovers, dialogs, toasts `shadow-float`.
- **Modals and side panels appear in place** (`NO_POP` in `ui/dialog.tsx`, `ui/sheet.tsx`); menus,
  popovers and tooltips keep their spring motion. Reduced motion is respected.
- **One primary action per screen**, top right. Secondary actions outline or in a `⋯` menu.
- **Every icon-only button has a Tooltip** and an `aria-label`. Lucide icons only, no emoji.
- **Numbers use `tabular-nums`.** Page titles Rubik 26px/600; body 14px; table cells 13.5px;
  meta 12.5px; nothing under 11px.
- **Desktop first, phones supported**: check every screen at 390px and in dark mode.
- Run `npm run typecheck`, `npm run lint` and `npm run build` before committing.
