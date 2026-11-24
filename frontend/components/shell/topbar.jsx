"use client";

import {
  LuBell,
  LuBriefcase,
  LuCalendar,
  LuChevronRight,
  LuCircleHelp,
  LuCircleUser,
  LuKeyboard,
  LuLock,
  LuLogOut,
  LuMegaphone,
  LuPanelLeft,
  LuPlus,
  LuScale,
  LuSearch,
  LuSiren,
  LuStar,
  LuToggleRight,
} from "react-icons/lu";
import { pageById } from "@/components/shell/nav";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { currentAdmin, notifications } from "@/lib/data/core";
import { cn } from "@/lib/utils";

export function Topbar({ route, nav, ui, set, range, setRange }) {
  let n = pageById[route];
  let l = notifications.filter((u) => u.unread).length;
  let d = ui.fav.includes(route);
  return (
    <header className="bg-background/85 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        aria-label="Open menu"
        onClick={() =>
          set({
            mobile: true,
          })
        }
      >
        <LuPanelLeft />
      </Button>
      <nav className="text-muted-foreground flex min-w-0 flex-1 items-center gap-1.5 text-sm">
        <span className="hidden sm:inline">{n.group}</span>
        <LuChevronRight className="hidden size-3.5 sm:block" />
        <span className="text-foreground truncate font-medium">{n.title}</span>
        <Tooltip label={d ? "Remove from favorites" : "Add to favorites"}>
          <button
            aria-label="Favorite"
            onClick={() =>
              set({
                fav: d ? ui.fav.filter((u) => u !== route) : [...ui.fav, route],
              })
            }
            className="hover:bg-accent ml-1 rounded-md p-1"
          >
            <LuStar className={cn("size-4", d ? "fill-amber-400 text-amber-400" : "")} />
          </button>
        </Tooltip>
      </nav>
      {route === "command" && (
        <div className="hidden items-center gap-2 sm:flex">
          <LuCalendar className="text-muted-foreground size-4" />
          <Tabs
            size="sm"
            value={range}
            onChange={setRange}
            items={[
              {
                value: "7d",
                label: "7d",
              },
              {
                value: "30d",
                label: "30d",
              },
              {
                value: "90d",
                label: "90d",
              },
            ]}
          />
        </div>
      )}
      <button
        onClick={() =>
          set({
            palette: true,
          })
        }
        className="bg-card text-muted-foreground hover:text-foreground hidden h-9 w-64 items-center gap-2 rounded-xl border px-3 text-sm shadow-card lg:flex"
      >
        <LuSearch className="size-4" />
        <span className="flex-1 text-left">Search…</span>
        <Kbd>⌘K</Kbd>
      </button>
      <DropdownMenu
        trigger={(u) => (
          <Button size="icon" variant="outline" aria-label="Create" onClick={u}>
            <LuPlus />
          </Button>
        )}
        items={[
          {
            icon: LuBriefcase,
            label: "New case",
            onClick: () => nav.go("cases"),
          },
          {
            icon: LuMegaphone,
            label: "New campaign",
            onClick: () => nav.go("campaigns"),
          },
          {
            icon: LuScale,
            label: "Log police request",
            onClick: () => nav.go("law"),
          },
          {
            icon: LuToggleRight,
            label: "Feature switch",
            onClick: () => nav.go("appcontrol"),
          },
          "-",
          {
            icon: LuSiren,
            label: "Declare incident",
            danger: true,
            onClick: () => nav.go("status"),
          },
        ]}
      />
      <Tooltip label="Notifications">
        <button
          onClick={() =>
            set({
              notifs: true,
            })
          }
          aria-label="Notifications"
          className="bg-card hover:bg-accent relative flex size-9 items-center justify-center rounded-xl border shadow-card"
        >
          <LuBell className="size-4" />
          {l > 0 && (
            <span className="bg-destructive ring-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ring-2">
              {l}
            </span>
          )}
        </button>
      </Tooltip>
      <DropdownMenu
        trigger={(u) => (
          <button onClick={u} aria-label="Account" className="rounded-full">
            <Avatar name={currentAdmin.name} photo={currentAdmin.photo} size={34} ring />
          </button>
        )}
        items={[
          {
            icon: LuCircleUser,
            label: `${currentAdmin.name} \xB7 ${currentAdmin.role}`,
          },
          {
            icon: LuLock,
            label: "Two-step sign-in: on",
          },
          {
            icon: LuKeyboard,
            label: "Keyboard shortcuts",
            onClick: () =>
              set({
                keys: true,
              }),
          },
          {
            icon: LuCircleHelp,
            label: "HQ handbook",
            onClick: () => toast("Opens the HQ handbook"),
          },
          "-",
          {
            icon: LuLogOut,
            label: "Sign out",
            onClick: () => toast("Signed out (prototype)"),
          },
        ]}
      />
    </header>
  );
}
