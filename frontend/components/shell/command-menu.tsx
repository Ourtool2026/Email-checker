"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Dialog as DialogPrimitive } from "@animate-ui/react/primitives/radix-ui"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  CornerDownLeftIcon,
  KeyboardIcon,
  MegaphoneIcon,
  MoonIcon,
  PaintbrushIcon,
  PlusIcon,
  ScaleIcon,
  SearchIcon,
  SirenIcon,
  SunIcon,
  EyeOffIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { useAccess } from "@/components/shell/access-context"
import { pages } from "@/components/shell/nav"
import { admins } from "@/lib/data/access"
import { canViewAs, describeAdmin } from "@/lib/access"
import { Avatar } from "@/components/hq/avatar"
import { Kbd } from "@/components/ui/kbd"
import { cases, hostels, users } from "@/lib/data/core"
import { formatLivingId } from "@/lib/format"

/*
 * ⌘K palette (cmdk in a dialog, Tirik Send layout): actions, every page, and the
 * people, hostels and cases that match what you type.
 */
type Entry = {
  id: string
  label: string
  hint?: string
  group: string
  icon?: React.ElementType
  avatar?: { name: string; photo?: string }
  image?: string
  keywords?: string[]
  run: () => void
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-success/15 px-px text-foreground">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  )
}

const GROUPS = ["Actions", "Pages", "View as", "Users", "Hostels", "Cases"]

export function CommandMenu({
  open,
  onOpenChange,
  nav,
  set,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  nav: {
    go: (id: string) => void
    user: (id: string) => void
    hostel: (id: string) => void
  }
  set: (patch: Record<string, any>) => void
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dark = resolvedTheme === "dark"
  const q = query.trim().toLowerCase()

  const access = useAccess()
  const canOpen = (id: string) => !access || access.levelFor(id) !== "none"

  const entries: Entry[] = React.useMemo(() => {
    const actions: Entry[] = [
      {
        id: "new-case",
        label: "Open a new case",
        group: "Actions",
        icon: PlusIcon,
        run: () => nav.go("cases"),
      },
      {
        id: "incident",
        label: "Declare an incident",
        group: "Actions",
        icon: SirenIcon,
        run: () => nav.go("status"),
      },
      {
        id: "campaign",
        label: "New campaign",
        group: "Actions",
        icon: MegaphoneIcon,
        run: () => nav.go("campaigns"),
      },
      {
        id: "police",
        label: "Log a police request",
        group: "Actions",
        icon: ScaleIcon,
        run: () => nav.go("law"),
      },
      {
        id: "theme",
        label: dark ? "Switch to light mode" : "Switch to dark mode",
        group: "Actions",
        icon: dark ? SunIcon : MoonIcon,
        keywords: ["theme", "dark", "light"],
        run: () => setTheme(dark ? "light" : "dark"),
      },
      {
        id: "keys",
        label: "Keyboard shortcuts",
        group: "Actions",
        icon: KeyboardIcon,
        run: () => set({ keys: true }),
      },
      {
        id: "customize",
        label: "Customize HQ",
        hint: "Colours, sidebar, density, text size",
        group: "Actions",
        icon: PaintbrushIcon,
        run: () => set({ custom: true }),
      },
    ]
    const pageEntries: Entry[] = pages
      .filter((p) => canOpen(p.id))
      .map((p) => ({
        id: `page-${p.id}`,
        label: p.title,
        hint: p.group,
        group: "Pages",
        icon: p.icon,
        run: () => nav.go(p.id),
      }))
    // Preview another admin's access (Owner and Admins; leads for their own departments).
    const viewAs: Entry[] = access
      ? access.viewing
        ? [
            {
              id: "exit-view-as",
              label: `Exit View as ${access.viewing.name}`,
              group: "View as",
              icon: EyeOffIcon,
              run: access.exitViewAs,
            },
          ]
        : admins
            .filter((a) => canViewAs(access.me, a))
            .map((a) => ({
              id: `view-as-${a.id}`,
              label: `View as ${a.name}`,
              hint: describeAdmin(a),
              group: "View as",
              avatar: a,
              keywords: ["view as", "preview", "access", "permissions"],
              run: () => access.startViewAs(a.id),
            }))
      : []
    return [...actions, ...pageEntries, ...viewAs]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark, nav, set, setTheme, access?.subject.id, access?.viewing])

  // Records are many, so they're matched here instead of all being listed.
  const records: Entry[] = React.useMemo(() => {
    if (q.length < 2) return []
    const compact = q.replace(/\s/g, "")
    return [
      ...users
        .filter(() => canOpen("users"))
        .filter((u) =>
          (u.name + u.lid).toLowerCase().replace(/\s/g, "").includes(compact)
        )
        .slice(0, 5)
        .map((u) => ({
          id: `u-${u.id}`,
          label: u.name,
          hint: `Living ID ${formatLivingId(u.lid)}`,
          group: "Users",
          avatar: u,
          run: () => nav.user(u.id),
        })),
      ...hostels
        .filter(() => canOpen("hostels"))
        .filter((h) => (h.name + h.area).toLowerCase().includes(q))
        .slice(0, 4)
        .map((h) => ({
          id: `h-${h.id}`,
          label: h.name,
          hint: h.area,
          group: "Hostels",
          image: h.photo,
          run: () => nav.hostel(h.id),
        })),
      ...cases
        .filter(() => canOpen("cases"))
        .filter((c) => (c.id + c.title).toLowerCase().includes(q))
        .slice(0, 3)
        .map((c) => ({
          id: `c-${c.id}`,
          label: c.title,
          hint: c.id,
          group: "Cases",
          icon: BriefcaseIcon,
          run: () => nav.go("cases"),
        })),
    ]
  }, [q, nav])

  const all = [...entries, ...records]

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery("")
        onOpenChange(next)
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          transition={{ duration: 0 }}
          exitTransition={{ duration: 0 }}
          className="fixed top-[12dvh] left-1/2 z-50 w-[calc(100vw-24px)] max-w-[620px] -translate-x-1/2 overflow-hidden rounded-2xl border bg-popover shadow-float outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            Search MyStay ID HQ
          </DialogPrimitive.Title>
          <CommandPrimitive loop className="flex w-full flex-col">
            <div className="flex items-center gap-3 border-b px-4">
              <SearchIcon className="size-[18px] shrink-0 text-muted-foreground" />
              <CommandPrimitive.Input
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                placeholder="Search pages, people, hostels, cases…"
                className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQuery("")
                    inputRef.current?.focus()
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            <CommandPrimitive.List className="max-h-[min(420px,60dvh)] overflow-y-auto overscroll-contain p-2">
              <CommandPrimitive.Empty className="px-3 py-10 text-center text-[13.5px] text-muted-foreground">
                Nothing matches “{query}”.
              </CommandPrimitive.Empty>
              {GROUPS.map((group) => {
                const items = all.filter((e) => e.group === group)
                if (!items.length) return null
                return (
                  <CommandPrimitive.Group
                    key={group}
                    heading={group}
                    className="py-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    {items.map((e) => (
                      <CommandPrimitive.Item
                        key={e.id}
                        value={`${e.label} ${e.hint ?? ""} ${e.id}`}
                        keywords={e.keywords}
                        onSelect={() => {
                          setQuery("")
                          onOpenChange(false)
                          e.run()
                        }}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 outline-none select-none data-[selected=true]:bg-muted"
                      >
                        {e.avatar ? (
                          <Avatar
                            name={e.avatar.name}
                            photo={e.avatar.photo}
                            size={32}
                          />
                        ) : e.image ? (
                          <img
                            src={e.image}
                            alt=""
                            className="size-8 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-card text-muted-foreground shadow-card">
                            {e.icon && <e.icon className="size-4" />}
                          </span>
                        )}
                        <span className="grid min-w-0 flex-1">
                          <span className="truncate text-[14px]">
                            <Highlight text={e.label} query={query} />
                          </span>
                          {e.hint && (
                            <span className="truncate text-[12px] text-muted-foreground">
                              {e.hint}
                            </span>
                          )}
                        </span>
                      </CommandPrimitive.Item>
                    ))}
                  </CommandPrimitive.Group>
                )
              })}
            </CommandPrimitive.List>
            <div className="flex items-center gap-4 border-t bg-muted/50 px-4 py-2.5 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Kbd>
                  <ArrowUpIcon className="size-3" />
                </Kbd>
                <Kbd>
                  <ArrowDownIcon className="size-3" />
                </Kbd>
                Move
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>
                  <CornerDownLeftIcon className="size-3" />
                </Kbd>
                Select
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>esc</Kbd>
                Close
              </span>
            </div>
          </CommandPrimitive>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
