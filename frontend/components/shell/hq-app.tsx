"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { HostelDrawer } from "@/components/drawers/hostel-drawer"
import { UserDrawer } from "@/components/drawers/user-drawer"
import { ConfirmProvider } from "@/components/kit/confirm"
import { ResponsiveTables } from "@/components/responsive-tables"
import { TicketDialog } from "@/components/shared/ticket-dialog"
import {
  AccessContext,
  PageLevel,
  type AccessState,
} from "@/components/shell/access-context"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { CommandMenu } from "@/components/shell/command-menu"
import { CustomizeSheet } from "@/components/shell/customize-sheet"
import { HQContext } from "@/components/shell/hq-context"
import { pages } from "@/components/shell/nav"
import { NotificationsPanel } from "@/components/shell/notifications-panel"
import { SiteHeader } from "@/components/shell/site-header"
import { ViewAsBanner } from "@/components/shell/view-as-banner"
import { Button } from "@/components/hq/button"
import { Dialog } from "@/components/hq/dialog"
import { Kbd } from "@/components/hq/kbd"
import { toast } from "@/components/hq/toast"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { accessFor, adminById, canViewAs } from "@/lib/access"
import { connectLab } from "@/lib/lab"
import { readPref, writePref } from "@/lib/prefs"
import { isPageId, pagePath, routeFromPath } from "@/lib/routes"
import { logAudit, refresh, useRerender } from "@/lib/store"

const SHORTCUTS: [string, string][] = [
  ["⌘ K", "Search and jump anywhere"],
  ["/", "Search"],
  ["G then U", "Users"],
  ["G then C", "Cases"],
  ["G then H", "Hostels"],
  ["G then A", "Analytics"],
  ["N", "Notifications"],
  ["⌘ B", "Collapse sidebar"],
  ["?", "This list"],
]

type Look = {
  accent: string
  side: string
  density: string
  text: string
  motion: boolean
  start: string
  badges: boolean
  sounds: boolean
  desk: boolean
  lang: string
}

/** The signed-in admin (sample data until there is a real sign-in). */
const SIGNED_IN = "ceo"

const DEFAULT_LOOK: Look = {
  accent: "blue",
  side: "light",
  density: "comfortable",
  text: "md",
  motion: false,
  start: "command",
  badges: true,
  sounds: true,
  desk: false,
  lang: "en",
}

const initialUi = () => ({
  collapsed: readPref("hq-col", false) as boolean,
  fav: readPref("hq-fav", ["cases", "verify", "analytics"]) as string[],
  shut: readPref("hq-shut", []) as string[],
  env: "Production",
  palette: false,
  notifs: false,
  keys: false,
  custom: false,
  ...DEFAULT_LOOK,
  ...(readPref("hq-look", {}) as Partial<Look>),
})

/**
 * The HQ shell: sidebar, header, drawers, dialogs and keyboard shortcuts.
 * The page itself comes in as `children` (app/(hq)/[page]/page.tsx) and reads
 * the shared state from HQContext.
 */
export default function HQApp({ children }: { children: React.ReactNode }) {
  useRerender()
  const router = useRouter()
  const pathname = usePathname()
  const route = routeFromPath(pathname) ?? "command"
  const { theme, resolvedTheme, setTheme } = useTheme()

  const [query, setQuery] = React.useState("")
  const [openUserId, setOpenUserId] = React.useState<string | null>(null)
  const [openHostelId, setOpenHostelId] = React.useState<string | null>(null)
  const [range, setRange] = React.useState("30d")
  const [state, setState] = React.useState(initialUi)

  // Light/dark lives in next-themes; the rest of the look in `state`.
  const ui = React.useMemo(
    () => ({
      ...state,
      dark: resolvedTheme === "dark",
      mode: theme ?? "system",
    }),
    [state, resolvedTheme, theme]
  )
  const set = React.useCallback(
    (patch: Record<string, any>) => {
      const { dark, mode, ...rest } = patch
      if (mode) setTheme(mode)
      else if (dark !== undefined) setTheme(dark ? "dark" : "light")
      if (Object.keys(rest).length) setState((prev) => ({ ...prev, ...rest }))
    },
    [setTheme]
  )

  const go = React.useCallback(
    (id: string) => router.push(pagePath(id)),
    [router]
  )

  // Old hash links (/#verify) open the matching page.
  React.useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1)
      if (isPageId(id)) router.replace(pagePath(id))
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [router])

  // Live link to the MyStay ID app prototype (cross-tab test lab).
  React.useEffect(() => {
    connectLab(refresh)
  }, [])

  // Apply and remember the look.
  React.useEffect(() => {
    const root = document.documentElement
    root.dataset.side = state.side
    root.dataset.accent = state.accent
    root.dataset.density = state.density
    root.dataset.text = state.text
    root.dataset.motion = state.motion ? "reduce" : "full"
    writePref("hq-look", {
      accent: state.accent,
      side: state.side,
      density: state.density,
      text: state.text,
      motion: state.motion,
      start: state.start,
      badges: state.badges,
      sounds: state.sounds,
      desk: state.desk,
      lang: state.lang,
    })
    writePref("hq-start", state.start)
    writePref("hq-col", state.collapsed)
    writePref("hq-fav", state.fav)
    writePref("hq-shut", state.shut)
  }, [state])

  // A new page closes the drawers and starts at the top.
  React.useEffect(() => {
    setOpenUserId(null)
    setOpenHostelId(null)
    document.getElementById("main")?.scrollTo(0, 0)
  }, [route])

  // Keyboard shortcuts (⌘B is handled by the sidebar itself).
  React.useEffect(() => {
    let gPressedAt = 0
    const onKey = (event: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(
        (document.activeElement as HTMLElement | null)?.tagName ?? ""
      )
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        set({ palette: true })
        return
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === "/") {
        event.preventDefault()
        set({ palette: true })
      } else if (event.key === "?") set({ keys: true })
      else if (event.key === "n") set({ notifs: true })
      else if (event.key === "g") gPressedAt = Date.now()
      else if (Date.now() - gPressedAt < 900) {
        const target = (
          {
            u: "users",
            c: "cases",
            h: "hostels",
            a: "analytics",
            d: "command",
          } as Record<string, string>
        )[event.key]
        if (target) go(target)
        gPressedAt = 0
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, set])

  // Messages from an embedding test lab (theme, open a hostel).
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data || {}
      if (data.labTheme) setTheme(data.labTheme)
      if (data.labHostel) {
        go("hostels")
        setTimeout(() => {
          setOpenUserId(null)
          setOpenHostelId(data.labHostel)
        }, 120)
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [go, setTheme])

  // Access: the signed-in admin, or the person previewed with View as.
  const me = adminById(SIGNED_IN)!
  const [viewingId, setViewingId] = React.useState<string | null>(null)
  const viewing = viewingId ? (adminById(viewingId) ?? null) : null
  const subject = viewing ?? me
  const subjectAccess = accessFor(subject)
  const startViewAs = (id: string) => {
    const target = adminById(id)
    if (!target || !canViewAs(adminById(SIGNED_IN)!, target)) return
    logAudit("Started View as", target.name, "Preview of their access")
    setOpenUserId(null)
    setOpenHostelId(null)
    setViewingId(id)
    setState((prev) => ({ ...prev, palette: false, notifs: false }))
    refresh()
  }
  const exitViewAs = () => {
    setViewingId((current) => {
      const person = adminById(current)
      if (person) logAudit("Ended View as", person.name, "Back to own access")
      return null
    })
    setOpenUserId(null)
    setOpenHostelId(null)
    refresh()
  }
  const accessState: AccessState = {
    me,
    viewing,
    subject,
    access: subjectAccess,
    levelFor: (page) => subjectAccess.pages[page] ?? "none",
    can: (right) => subjectAccess.rights.has(right),
    startViewAs,
    exitViewAs,
  }
  const accessRef = React.useRef(accessState)
  React.useEffect(() => {
    accessRef.current = accessState
  })

  // Drawers open only when the person on screen can open their page.
  const openUser = React.useCallback((id: string) => {
    const a = accessRef.current
    if (a.levelFor("users") === "none") {
      toast(`${a.subject.name.split(" ")[0]} can't open user profiles`)
      return
    }
    setOpenHostelId(null)
    setOpenUserId(id)
  }, [])
  const openHostel = React.useCallback((id: string) => {
    const a = accessRef.current
    if (a.levelFor("hostels") === "none") {
      toast(`${a.subject.name.split(" ")[0]} can't open hostels`)
      return
    }
    setOpenUserId(null)
    setOpenHostelId(id)
  }, [])
  const nav = React.useMemo(
    () => ({
      user: openUser,
      hostel: openHostel,
      go,
      customize: () => set({ custom: true }),
    }),
    [openUser, openHostel, go, set]
  )
  const context = React.useMemo(
    () => ({ nav, q: query, setQ: setQuery, range, setRange }),
    [nav, query, range]
  )

  return (
    <HQContext.Provider value={context}>
      <AccessContext.Provider value={accessState}>
        <TooltipProvider delayDuration={300}>
          <ConfirmProvider>
            <SidebarProvider
              className="h-svh"
              open={!state.collapsed}
              onOpenChange={(open) => set({ collapsed: !open })}
              style={
                {
                  "--sidebar-width-icon": "calc(3.5rem + 1px)",
                } as React.CSSProperties
              }
            >
              <AppSidebar
                route={route}
                ui={ui}
                set={set}
                onOpenCommand={() => set({ palette: true })}
              />
              <SidebarInset className="min-w-0 overflow-hidden">
                <ViewAsBanner route={route} />
                {state.env === "Staging" && (
                  <div className="flex items-center justify-center gap-2 bg-warning px-4 py-1.5 text-[12.5px] font-semibold text-background">
                    You are in Staging. Changes here never reach real users.
                    <button
                      className="underline"
                      onClick={() => set({ env: "Production" })}
                    >
                      Back to Production
                    </button>
                  </div>
                )}
                <SiteHeader
                  route={route}
                  nav={nav}
                  ui={ui}
                  set={set}
                  range={range}
                  setRange={setRange}
                  onOpenCommand={() => set({ palette: true })}
                />
                <div
                  id="main"
                  className="flex min-h-0 flex-1 flex-col overflow-y-auto"
                >
                  <div className="mx-auto w-full max-w-[var(--content-max)] p-4 md:p-6">
                    {children}
                  </div>
                </div>
              </SidebarInset>

              <PageLevel page="users">
                <UserDrawer
                  id={openUserId}
                  onClose={() => setOpenUserId(null)}
                  nav={nav}
                />
              </PageLevel>
              <PageLevel page="hostels">
                <HostelDrawer
                  id={openHostelId}
                  onClose={() => setOpenHostelId(null)}
                  nav={nav}
                />
              </PageLevel>
              {state.custom && (
                <CustomizeSheet
                  ui={ui}
                  set={set}
                  onClose={() => set({ custom: false })}
                  pages={pages}
                />
              )}
              <CommandMenu
                open={state.palette}
                onOpenChange={(open) => set({ palette: open })}
                nav={nav}
                set={set}
              />
              {state.notifs && (
                <NotificationsPanel
                  onClose={() => set({ notifs: false })}
                  nav={nav}
                />
              )}
              <Dialog
                open={state.keys}
                onClose={() => set({ keys: false })}
                title="Keyboard shortcuts"
                footer={
                  <Button onClick={() => set({ keys: false })}>Done</Button>
                }
              >
                <div className="grid gap-1">
                  {SHORTCUTS.map(([keys, label]) => (
                    <div
                      key={keys}
                      className="flex items-center justify-between rounded-lg px-1 py-1.5 text-[13.5px]"
                    >
                      <span>{label}</span>
                      <span className="flex gap-1">
                        {keys.split(" ").map((key, index) =>
                          key === "then" ? (
                            <span
                              key={index}
                              className="px-0.5 text-[12px] text-muted-foreground"
                            >
                              then
                            </span>
                          ) : (
                            <Kbd key={index}>{key}</Kbd>
                          )
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </Dialog>
              <TicketDialog />
              <ResponsiveTables />
              <Toaster position="bottom-right" />
            </SidebarProvider>
          </ConfirmProvider>
        </TooltipProvider>
      </AccessContext.Provider>
    </HQContext.Provider>
  )
}
