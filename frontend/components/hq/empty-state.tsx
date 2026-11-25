import * as React from "react"

import { EmptyState as PageEmptyState } from "@/components/page/empty-state"

/** One sentence and one action. */
export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon?: React.ElementType
  title: React.ReactNode
  text?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <PageEmptyState
      icon={icon}
      title={title}
      description={text}
      className="py-10"
    >
      {action}
    </PageEmptyState>
  )
}
