import type * as React from "react"

export type SectionTab = {
  label: string
  href: string
  icon?: React.ElementType
}

/** Section tabs shown under a PageHeader. MyStay HQ pages manage their own tabs, so none are shared yet. */
export const sectionFor = (_pathname: string | null): SectionTab[] | null =>
  null
