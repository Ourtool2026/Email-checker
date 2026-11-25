"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  BookOpenIcon,
  KeyboardIcon,
  LogOutIcon,
  MoonIcon,
  PaintbrushIcon,
  SearchIcon,
  ShieldCheckIcon,
  SunIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { useAccess } from "@/components/shell/access-context"
import { BrandTile } from "@/components/shell/brand-mark"
import { navGroups, pageById } from "@/components/shell/nav"
import { Avatar } from "@/components/hq/avatar"
import { toast } from "@/components/hq/toast"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { currentAdmin } from "@/lib/data/core"
import { pagePath } from "@/lib/routes"
import { cn } from "@/lib/utils"

type NavEntry = [
  id: string,
  icon: React.ElementType,
  title: string,
  count?: () => number,
  tone?: "danger" | "warning",
]

/* Active item: a pill in the sidebar's active colour with a hairline (light theme), icon in the sidebar primary. */
const ITEM =
  "relative h-9 gap-2.5 rounded-lg px-2.5 text-[13.5px] text-sidebar-foreground/80 [&>svg]:size-[18px] [&>svg]:text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-active data-[active=true]:font-medium data-[active=true]:text-sidebar-active-foreground data-[active=true]:shadow-card data-[active=true]:inset-ring data-[active=true]:inset-ring-sidebar-active-ring data-[active=true]:[&>svg]:text-sidebar-primary group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-[9px]!"
const LABEL =
  "group-data-[collapsible=icon]:hidden h-7 px-2.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-sidebar-foreground/45"

const BADGE: Record<string, string> = {
  danger: "bg-destructive text-white",
  warning: "bg-warning text-white dark:text-background",
  default: "bg-sidebar-primary text-sidebar-primary-foreground",
}
const DOT: Record<string, string> = {
  danger: "bg-destructive",
  warning: "bg-warning",
  default: "bg-sidebar-primary",
}

const entryFor = (id: string): NavEntry | undefined =>
  navGroups
    .flatMap((group) => group[1] as NavEntry[])
    .find((entry) => entry[0] === id)

function NavMenu({
  ids,
  route,
  badges,
}: {
  ids: string[]
  route: string
  badges: boolean
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <SidebarMenu className="gap-0.5">
      {ids.map((id) => {
        const page = pageById[id]
        const entry = entryFor(id)
        if (!page || !entry) return null
        const count = badges && entry[3] ? entry[3]() : 0
        const tone = entry[4] ?? "default"
        return (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton
              isActive={route === id}
              tooltip={page.title}
              asChild
              className={ITEM}
            >
              <Link
                href={pagePath(id)}
                onClick={() => isMobile && setOpenMobile(false)}
              >
                <page.icon />
                {count > 0 && (
                  <span
                    className={cn(
                      "absolute top-1.5 right-1.5 hidden size-2 rounded-full ring-2 ring-sidebar group-data-[collapsible=icon]:block",
                      DOT[tone]
                    )}
                  />
                )}
                <span>{page.title}</span>
              </Link>
            </SidebarMenuButton>
            {count > 0 && (
              <SidebarMenuBadge
                className={cn(
                  "top-2 right-2 h-5 min-w-5 rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  BADGE[tone]
                )}
              >
                {count > 99 ? "99+" : count}
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export function AppSidebar({
  route,
  ui,
  set,
  onOpenCommand,
}: {
  route: string
  ui: any
  set: (patch: Record<string, any>) => void
  onOpenCommand: () => void
}) {
  const { state, isMobile } = useSidebar()
  const { resolvedTheme, setTheme } = useTheme()
  const collapsed = state === "collapsed" && !isMobile
  const dark = resolvedTheme === "dark"
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Keep the current page's item in view when the nav is taller than the window.
  React.useEffect(() => {
    contentRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" })
  }, [route, collapsed])

  // Only pages the person on screen can open (yours, or theirs during View as).
  const access = useAccess()
  const canOpen = (id: string) => !access || access.levelFor(id) !== "none"
  const visibleFav = (ui.fav as string[]).filter(canOpen)

  const groupOpen = (label: string) => collapsed || !ui.shut.includes(label)
  const toggleGroup = (label: string, open: boolean) =>
    set({
      shut: open
        ? ui.shut.filter((g: string) => g !== label)
        : [...ui.shut, label],
    })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2 group-data-[collapsible=icon]:px-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip="MyStay ID HQ"
                  className="h-11 rounded-xl px-1.5 group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0.5! hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
                >
                  <BrandTile size={32} />
                  <span className="grid flex-1 gap-0.5 text-left leading-tight">
                    <span className="truncate font-brand text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">
                      MyStay ID HQ
                    </span>
                    <span className="flex items-center gap-1.5 truncate text-[11.5px] text-sidebar-foreground/60">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          ui.env === "Production" ? "bg-success" : "bg-warning"
                        )}
                      />
                      {ui.env}
                    </span>
                  </span>
                  <ChevronsUpDownIcon className="ml-auto size-4 text-sidebar-foreground/50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-60"
              >
                <DropdownMenuLabel className="text-[12px] font-medium text-muted-foreground">
                  Environment
                </DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => set({ env: "Production" })}>
                  <span className="size-2 rounded-full bg-success" />
                  Production · Dhaka
                  {ui.env === "Production" && <CheckIcon className="ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    set({ env: "Staging" })
                    toast(
                      "Switched to Staging. Nothing here reaches real users."
                    )
                  }}
                >
                  <span className="size-2 rounded-full bg-warning" />
                  Staging (test data)
                  {ui.env === "Staging" && <CheckIcon className="ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent
        ref={contentRef}
        className="[scrollbar-width:none] gap-0 [mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)] px-1.5 pb-6 group-data-[collapsible=icon]:[mask-image:none] group-data-[collapsible=icon]:px-2.5 group-data-[collapsible=icon]:pb-1"
      >
        <SidebarGroup className="py-1 group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel className={LABEL}>Main menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onOpenCommand}
                  tooltip="Search  ⌘K"
                  className={ITEM}
                >
                  <SearchIcon />
                  <span>Search</span>
                  {!collapsed && (
                    <Kbd className="ml-auto bg-transparent">⌘K</Kbd>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleFav.length > 0 && (
          <SidebarGroup className="py-1 group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:border-t group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pt-1.5">
            <SidebarGroupLabel className={LABEL}>Favorites</SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMenu
                ids={visibleFav}
                route={route}
                badges={ui.badges !== false}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {navGroups
          .map(
            ([label, entries]) =>
              [
                label,
                (entries as NavEntry[]).map((e) => e[0]).filter(canOpen),
              ] as const
          )
          .filter(([, ids]) => ids.length > 0)
          .map(([label, ids]) => (
            <Collapsible
              key={label}
              open={groupOpen(label)}
              onOpenChange={(open) => toggleGroup(label, open)}
              className="group/collapsible"
            >
              <SidebarGroup className="py-1 group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:border-t group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pt-1.5">
                <SidebarGroupLabel
                  asChild
                  className={cn(
                    LABEL,
                    "cursor-pointer hover:text-sidebar-foreground"
                  )}
                >
                  <CollapsibleTrigger>
                    {label}
                    <ChevronDownIcon className="ml-auto size-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <NavMenu
                      ids={ids}
                      route={route}
                      badges={ui.badges !== false}
                    />
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
      </SidebarContent>

      <SidebarFooter className="gap-1 border-t border-sidebar-border px-3 pt-2 pb-3 group-data-[collapsible=icon]:px-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-12 rounded-xl bg-sidebar-active px-2 text-sidebar-active-foreground shadow-card inset-ring inset-ring-sidebar-active-ring group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0.5! group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:inset-ring-0"
                >
                  <Avatar
                    name={currentAdmin.name}
                    photo={currentAdmin.photo}
                    size={32}
                  />
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-[13.5px] font-medium">
                      {currentAdmin.name}
                    </span>
                    <span className="truncate text-[11.5px] text-sidebar-foreground/60">
                      {currentAdmin.role}
                    </span>
                  </span>
                  <ChevronsUpDownIcon className="ml-auto size-4 text-sidebar-foreground/50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                sideOffset={10}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-60"
              >
                <DropdownMenuLabel className="flex items-center gap-2.5 font-normal">
                  <Avatar
                    name={currentAdmin.name}
                    photo={currentAdmin.photo}
                    size={32}
                  />
                  <span className="grid min-w-0 leading-tight">
                    <span className="truncate text-[13.5px] font-medium">
                      {currentAdmin.name}
                    </span>
                    <span className="truncate text-[12px] text-muted-foreground">
                      {currentAdmin.role}
                    </span>
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <ShieldCheckIcon /> Two-step sign-in: on
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setTheme(dark ? "light" : "dark")}
                >
                  {dark ? <SunIcon /> : <MoonIcon />}
                  {dark ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => set({ custom: true })}>
                  <PaintbrushIcon /> Customize HQ
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => set({ keys: true })}>
                  <KeyboardIcon /> Keyboard shortcuts
                  <DropdownMenuShortcut>?</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => toast("Opens the HQ handbook")}
                >
                  <BookOpenIcon /> HQ handbook
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => toast("Signed out (prototype)")}
                >
                  <LogOutIcon /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
