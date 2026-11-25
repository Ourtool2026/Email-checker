"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { ViewTabs } from "@/components/kit/toolbar"
import { sectionFor } from "@/lib/nav"
import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

/**
 * Page title block on the canvas: optional breadcrumb, large title, one line of
 * context, actions on the right, then tabs. Pages that belong to a section
 * (see SECTIONS in lib/nav.ts) get their section tabs automatically.
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  meta,
  tabs,
  children,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: Crumb[]
  actions?: React.ReactNode
  /** Small inline facts next to the title (status chip, counts). */
  meta?: React.ReactNode
  /** Custom tabs row; defaults to the page's section tabs. Pass `false` to hide. */
  tabs?: React.ReactNode | false
  children?: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  const section = sectionFor(pathname)
  const tabRow =
    tabs === false
      ? null
      : (tabs ??
        (section ? (
          <ViewTabs
            tabs={section.map((t) => ({
              value: t.href,
              label: t.label,
              icon: t.icon,
              href: t.href,
            }))}
          />
        ) : null))

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--content-max)] px-6 pt-6",
        !tabRow && !children && "pb-1",
        className
      )}
    >
      {breadcrumb && breadcrumb.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-2 flex flex-wrap items-center gap-1 text-[13px] text-muted-foreground"
        >
          {breadcrumb.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="size-3.5 opacity-60" />}
              {c.href ? (
                <Link href={c.href} className="hover:text-foreground">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="grid min-w-0 flex-1 basis-[280px] gap-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="font-brand text-[26px] leading-tight font-semibold tracking-[-0.015em]">
              {title}
            </h1>
            {meta}
          </div>
          {description && (
            <p className="max-w-[680px] text-[13.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2 sm:ml-auto">
            {actions}
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
      {tabRow && <div className="mt-4 border-b">{tabRow}</div>}
    </div>
  )
}

/** Content column under a PageHeader. */
export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[var(--content-max)] flex-col gap-4 px-6 pt-5 pb-10",
        className
      )}
    >
      {children}
    </div>
  )
}
