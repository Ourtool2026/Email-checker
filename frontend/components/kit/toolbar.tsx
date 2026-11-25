"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ListFilter, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Count } from "./chip"

/* Toolbars: search with a key hint, a filter button with a count, view tabs, segmented pills, bulk bar. */

export function Toolbar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  )
}

/**
 * Search field with a key hint. `hotkey="/"` focuses it from anywhere on the page
 * (ignored while typing in another field).
 */
export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  hotkey,
  className,
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hotkey?: string
  className?: string
  autoFocus?: boolean
}) {
  const ref = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (
        t.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)
      )
        return
      if (e.key === hotkey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hotkey])
  return (
    <label
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-xl border bg-card px-3 text-muted-foreground shadow-card transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 sm:w-64",
        className
      )}
    >
      <Search className="size-4 shrink-0" />
      <input
        ref={ref}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onChange("")}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        hotkey && <Kbd>{hotkey}</Kbd>
      )}
    </label>
  )
}

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md border bg-card px-1 font-sans text-[11px] font-medium text-muted-foreground shadow-[0_1px_0_var(--border)]",
        className
      )}
    >
      {children}
    </kbd>
  )
}

/** "Filter (2)": outline when idle, tinted when filters are applied. */
export const FilterButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { count?: number; label?: string }
>(function FilterButton(
  { count = 0, label = "Filter", className, ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "h-9 rounded-xl shadow-card",
        count > 0 &&
          "border-primary/30 bg-primary/[0.06] text-primary hover:bg-primary/10 hover:text-primary",
        className
      )}
      {...props}
    >
      <ListFilter />
      {label}
      {count > 0 && (
        <Count className="bg-primary text-primary-foreground">{count}</Count>
      )}
    </Button>
  )
})

export type ViewTab = {
  value: string
  label: string
  icon?: React.ElementType
  count?: number
  href?: string
}

/**
 * Underlined view tabs ("List view · Kanban · Calendar"). Controlled with
 * value/onChange, or route-based when every tab has an href.
 */
export function ViewTabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: ViewTab[]
  value?: string
  onChange?: (v: string) => void
  className?: string
}) {
  const pathname = usePathname()
  const active =
    value ??
    tabs
      .filter(
        (t) =>
          t.href && (pathname === t.href || pathname.startsWith(t.href + "/"))
      )
      .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0]?.value
  return (
    <nav
      className={cn(
        "-mb-px flex items-center gap-5 overflow-x-auto",
        className
      )}
      role="tablist"
    >
      {tabs.map((t) => {
        const on = t.value === active
        const inner = (
          <>
            {t.icon && <t.icon className="size-4" />}
            {t.label}
            {t.count !== undefined && <Count>{t.count}</Count>}
          </>
        )
        const cls = cn(
          "flex h-10 shrink-0 items-center gap-1.5 border-b-2 text-[13.5px] font-medium whitespace-nowrap transition-colors outline-none focus-visible:text-foreground",
          on
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground"
        )
        return t.href ? (
          <Link
            key={t.value}
            href={t.href}
            role="tab"
            aria-selected={on}
            className={cls}
          >
            {inner}
          </Link>
        ) : (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={on}
            className={cls}
            onClick={() => onChange?.(t.value)}
          >
            {inner}
          </button>
        )
      })}
    </nav>
  )
}

/** Small rounded pills on a muted track: "Week · Month · Year". */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  size = "sm",
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: React.ReactNode; icon?: React.ElementType }[]
  className?: string
  size?: "sm" | "md"
}) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-muted p-[3px]",
        className
      )}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              size === "sm"
                ? "h-7 px-3 text-[12.5px]"
                : "h-8 px-3.5 text-[13px]",
              on
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {o.icon && <o.icon className="size-3.5" />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Floating bar that appears when rows are selected: count, actions, clear.
 * Place it once at the bottom of a list; it pins to the bottom of the scroll area.
 */
export function BulkBar({
  count,
  noun = "selected",
  onClear,
  children,
}: {
  count: number
  noun?: string
  onClear: () => void
  children: React.ReactNode
}) {
  if (count === 0) return null
  return (
    <div className="pointer-events-none sticky bottom-4 z-20 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-2xl bg-foreground py-1.5 pr-1.5 pl-4 text-background shadow-float">
        <span className="mr-2 text-[13px] font-medium tabular-nums">
          {count} {noun}
        </span>
        <div className="flex items-center gap-1 [&_button]:h-8 [&_button]:rounded-lg [&_button]:text-[13px]">
          {children}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear selection"
          onClick={onClear}
          className="size-8 rounded-lg text-background hover:bg-background/15 hover:text-background"
        >
          <X />
        </Button>
      </div>
    </div>
  )
}

/** A bulk-bar action button styled for the dark bar. */
export function BulkAction({
  children,
  onClick,
  danger,
  icon: Icon,
}: {
  children: React.ReactNode
  onClick: () => void
  danger?: boolean
  /** Show only this icon (with the label as its tooltip), for bars in narrow columns. */
  icon?: React.ElementType
}) {
  if (Icon)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={typeof children === "string" ? children : undefined}
            onClick={onClick}
            className={cn(
              "size-8 hover:bg-background/15",
              danger
                ? "bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground"
                : "text-background hover:text-background"
            )}
          >
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    )
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "px-2.5 hover:bg-background/15",
        danger
          ? "bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground"
          : "text-background hover:text-background"
      )}
    >
      {children}
    </Button>
  )
}
