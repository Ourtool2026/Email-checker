"use client"

import * as React from "react"

import { Tabs as UITabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type TabItem = {
  value: string
  label: React.ReactNode
  icon?: React.ElementType
  count?: number | null
}

function Count({ value, active }: { value: number; active?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-md px-1 text-[11px] tabular-nums",
        active ? "bg-muted text-muted-foreground" : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  )
}

/** Segmented tabs (filled track; the selected pill slides). */
export function Tabs({
  value,
  onChange,
  items,
  className,
  size,
}: {
  value: string
  onChange: (value: string) => void
  items: TabItem[]
  className?: string
  size?: "sm"
}) {
  return (
    <UITabs value={value} onValueChange={onChange} className="gap-0">
      <TabsList
        className={cn(
          size === "sm" && "group-data-[orientation=horizontal]/tabs:h-8",
          className
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn("px-2.5", size === "sm" && "px-2 text-[13px]")}
          >
            {item.icon && <item.icon />}
            {item.label}
            {item.count != null && (
              <Count value={item.count} active={item.value === value} />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </UITabs>
  )
}

/** Line tabs for sections inside a drawer or page. */
export function UnderlineTabs({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (value: string) => void
  items: TabItem[]
}) {
  return (
    <UITabs value={value} onValueChange={onChange} className="gap-0">
      <TabsList variant="line" className="w-full justify-start border-b">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex-none px-3"
          >
            {item.icon && <item.icon />}
            {item.label}
            {item.count ? <Count value={item.count} active /> : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </UITabs>
  )
}
