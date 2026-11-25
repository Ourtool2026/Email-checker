"use client"

import * as React from "react"
import {
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon,
  MegaphoneIcon,
  PaintbrushIcon,
  PlusIcon,
  ScaleIcon,
  SearchIcon,
  SirenIcon,
  StarIcon,
  ToggleRightIcon,
} from "lucide-react"

import { useAccess } from "@/components/shell/access-context"
import { pageById } from "@/components/shell/nav"
import { Tabs } from "@/components/hq/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { notifications } from "@/lib/data/core"
import { cn } from "@/lib/utils"

function IconButton({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn(
            "relative size-9 rounded-xl text-muted-foreground",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

const CREATE = [
  { page: "cases", label: "New case", icon: BriefcaseIcon },
  { page: "campaigns", label: "New campaign", icon: MegaphoneIcon },
  { page: "law", label: "Log police request", icon: ScaleIcon },
  { page: "appcontrol", label: "Feature switch", icon: ToggleRightIcon },
  { page: "status", label: "Declare incident", icon: SirenIcon, danger: true },
]

/** Top bar: sidebar toggle, breadcrumb with favourite star, ⌘K search, create menu, customize, notifications. */
export function SiteHeader({
  route,
  nav,
  ui,
  set,
  range,
  setRange,
  onOpenCommand,
}: {
  route: string
  nav: { go: (id: string) => void }
  ui: any
  set: (patch: Record<string, any>) => void
  range: string
  setRange: (range: string) => void
  onOpenCommand: () => void
}) {
  const access = useAccess()
  // The Create menu offers only what the person on screen can edit.
  const canEdit = (id: string) =>
    !access || ["edit", "manage"].includes(access.levelFor(id))
  const page = pageById[route]
  const unread = notifications.filter((n) => n.unread).length
  const favorite = ui.fav.includes(route)

  // Name each tab after its screen ("Users · MyStay ID HQ").
  React.useEffect(() => {
    document.title = page ? `${page.title} · MyStay ID HQ` : "MyStay ID HQ"
  }, [page])

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1 rounded-lg text-muted-foreground" />
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-1 items-center gap-1.5 text-[13.5px]"
      >
        {page && (
          <>
            <span className="hidden text-muted-foreground sm:inline">
              {page.group}
            </span>
            <ChevronRightIcon className="hidden size-3.5 shrink-0 text-muted-foreground/60 sm:block" />
            <span className="flex min-w-0 items-center gap-2 font-medium">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-card shadow-card">
                <page.icon className="size-3.5" />
              </span>
              <span className="truncate">{page.title}</span>
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={
                    favorite ? "Remove from favorites" : "Add to favorites"
                  }
                  onClick={() =>
                    set({
                      fav: favorite
                        ? ui.fav.filter((id: string) => id !== route)
                        : [...ui.fav, route],
                    })
                  }
                  className="ml-0.5 rounded-md p-1 hover:bg-accent"
                >
                  <StarIcon
                    className={cn(
                      "size-4",
                      favorite
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {favorite ? "Remove from favorites" : "Add to favorites"}
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </nav>

      {route === "command" && (
        <div className="hidden items-center gap-2 sm:flex">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <Tabs
            size="sm"
            value={range}
            onChange={setRange}
            items={[
              { value: "7d", label: "7d" },
              { value: "30d", label: "30d" },
              { value: "90d", label: "90d" },
            ]}
          />
        </div>
      )}

      <button
        onClick={onOpenCommand}
        className="hidden h-9 w-64 items-center gap-2 rounded-xl border bg-card px-3 text-[13px] text-muted-foreground shadow-card transition-colors hover:text-foreground lg:flex"
      >
        <SearchIcon className="size-4" />
        Search everything
        <Kbd className="ml-auto">⌘K</Kbd>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton
          label="Search"
          onClick={onOpenCommand}
          className="lg:hidden"
        >
          <SearchIcon />
        </IconButton>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" aria-label="Create">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Create</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56">
            {CREATE.filter((item) => canEdit(item.page)).map((item) => (
              <DropdownMenuItem
                key={item.page}
                variant={item.danger ? "destructive" : "default"}
                onSelect={() => nav.go(item.page)}
              >
                <item.icon /> {item.label}
              </DropdownMenuItem>
            ))}
            {!CREATE.some((item) => canEdit(item.page)) && (
              <DropdownMenuItem disabled>
                Nothing to create with this access
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <IconButton label="Customize HQ" onClick={() => set({ custom: true })}>
          <PaintbrushIcon />
        </IconButton>
        <IconButton label="Notifications" onClick={() => set({ notifs: true })}>
          <BellIcon />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white tabular-nums ring-2 ring-background">
              {unread}
            </span>
          )}
        </IconButton>
      </div>
    </header>
  )
}
