"use client"

import * as React from "react"
import { ChevronDownIcon, EyeIcon, HelpCircleIcon, XIcon } from "lucide-react"

import { useAccess } from "@/components/shell/access-context"
import { pageById } from "@/components/shell/nav"
import { Avatar } from "@/components/hq/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { admins } from "@/lib/data/access"
import {
  LEVEL_LABEL,
  RIGHTS,
  canViewAs,
  describeAdmin,
  explainPage,
} from "@/lib/access"
import { cn } from "@/lib/utils"

const LEVEL_TONE = {
  none: "bg-destructive/15 text-destructive",
  view: "bg-warning/15 text-warning",
  edit: "bg-primary/15 text-primary",
  manage: "bg-success/15 text-success",
}

/** The bar shown while previewing HQ as someone else (View as). */
export function ViewAsBanner({ route }: { route: string }) {
  const access = useAccess()
  if (!access?.viewing) return null
  const person = access.viewing
  const level = access.levelFor(route)
  const reasons = explainPage(person, route)
  const page = pageById[route]
  const first = person.name.split(" ")[0]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 bg-foreground px-4 py-2 text-[13px] text-background md:px-6">
      <EyeIcon className="size-4 shrink-0 opacity-80" />
      <span className="flex min-w-0 items-center gap-2">
        <Avatar name={person.name} photo={person.photo} size={22} />
        <span className="truncate">
          Viewing as <b className="font-semibold">{person.name}</b>
          <span className="opacity-70"> · {describeAdmin(person)}</span>
        </span>
      </span>
      <span className="hidden opacity-70 lg:inline">
        Preview only: nothing here changes anything.
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex h-7 items-center gap-1.5 rounded-lg px-2 font-medium hover:bg-background/15">
              <HelpCircleIcon className="size-4" />
              Why can {first} see this?
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[340px] p-0">
            <div className="border-b px-4 py-3">
              <div className="text-[12px] text-muted-foreground">
                {page?.title ?? "This page"}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[14px] font-semibold">
                  {first}&apos;s access
                </span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[12px] font-medium",
                    LEVEL_TONE[level]
                  )}
                >
                  {LEVEL_LABEL[level]}
                </span>
              </div>
            </div>
            <ul className="grid gap-1.5 px-4 py-3 text-[13px]">
              {reasons.length ? (
                reasons.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">
                  Nothing gives {first} this page.
                </li>
              )}
            </ul>
            <div className="border-t px-4 py-3">
              <div className="mb-1.5 text-[12px] text-muted-foreground">
                Rights
              </div>
              <div className="flex flex-wrap gap-1">
                {RIGHTS.filter((r) => access.can(r.id)).map((r) => (
                  <span
                    key={r.id}
                    className="rounded-md bg-muted px-1.5 py-0.5 text-[12px]"
                  >
                    {r.label}
                  </span>
                ))}
                {!RIGHTS.some((r) => access.can(r.id)) && (
                  <span className="text-[12.5px] text-muted-foreground">
                    None beyond page access
                  </span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 items-center gap-1 rounded-lg px-2 font-medium hover:bg-background/15">
              Switch person
              <ChevronDownIcon className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="max-h-[60vh] w-72 overflow-y-auto"
          >
            <DropdownMenuLabel className="text-[12px] font-medium text-muted-foreground">
              View HQ as
            </DropdownMenuLabel>
            {admins
              .filter((a) => canViewAs(access.me, a))
              .map((a) => (
                <DropdownMenuItem
                  key={a.id}
                  onSelect={() => access.startViewAs(a.id)}
                >
                  <Avatar name={a.name} photo={a.photo} size={24} />
                  <span className="grid min-w-0 leading-tight">
                    <span className="truncate">{a.name}</span>
                    <span className="truncate text-[11.5px] text-muted-foreground">
                      {describeAdmin(a)}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={access.exitViewAs}
          className="flex h-7 items-center gap-1 rounded-lg bg-background px-2.5 font-medium text-foreground hover:opacity-90"
        >
          <XIcon className="size-3.5" />
          Exit
        </button>
      </span>
    </div>
  )
}
