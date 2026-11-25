"use client"

import * as React from "react"

import {
  type Access,
  type Admin,
  type Level,
  type PageId,
  type Right,
  rightLabel,
} from "@/lib/access"

export type AccessState = {
  /** The signed-in admin. */
  me: Admin
  /** The person being previewed with View as, or null. */
  viewing: Admin | null
  /** Whose access the screen shows: `viewing` during View as, else `me`. */
  subject: Admin
  access: Access
  levelFor: (page: PageId) => Level
  can: (right: Right) => boolean
  startViewAs: (id: string) => void
  exitViewAs: () => void
}

export const AccessContext = React.createContext<AccessState | null>(null)
export const useAccess = () => React.useContext(AccessContext)

/** The page (or drawer) a control sits in, and the subject's level there. */
export const PageLevelContext = React.createContext<{
  page: PageId
  level: Level
} | null>(null)

export function PageLevel({
  page,
  children,
}: {
  page: PageId
  children: React.ReactNode
}) {
  const access = useAccess()
  const level = access?.levelFor(page) ?? "manage"
  const value = React.useMemo(() => ({ page, level }), [page, level])
  return (
    <PageLevelContext.Provider value={value}>
      {children}
    </PageLevelContext.Provider>
  )
}

/* Controls whose label matches these only read or move around, so they stay usable. */
const SAFE =
  /^(export|copy|csv|open|view|calendar|analytics|all\b|columns|details|filter|back|next|prev|close|cancel|done|search|more|see |show all|history|profile|edit layout|why|row density|compact|comfortable|zoom|refresh|download|clear|reset filters|week|month|day|list|board|chart|map|grid|cards|table|today|expand|collapse)/i

/** The named right an action on a page needs, read from its label. */
function rightForAction(page: PageId, label: string): Right | null {
  if (/suspend/i.test(label)) return "suspend"
  if (/show, with a reason|reveal/i.test(label)) return "reveal_details"
  if (page === "verify" && /approve|reject|ask again/i.test(label))
    return "approve_id"
  if (
    (page === "listings" || page === "hostels") &&
    /approve|publish|reject|pause|send back/i.test(label)
  )
    return "approve_listing"
  if (page === "campaigns" && /send|schedule|launch/i.test(label))
    return "send_campaign"
  if (page === "law" && /release|send data|approve/i.test(label))
    return "release_data"
  if (
    page === "plans" &&
    /plan|refund|retry|charge|upgrade|downgrade/i.test(label)
  )
    return "change_plan"
  if (page === "appcontrol") return "app_control"
  if (page === "team" && /invite|role|remove|deactivate|end/i.test(label))
    return "manage_admins"
  return null
}

/** Plain text of a React node, for reading a control's label. */
export function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(" ").trim()
  if (React.isValidElement(node))
    return textOf((node.props as { children?: React.ReactNode }).children)
  return ""
}

export type Gate =
  | { kind: "disabled"; reason: string }
  | { kind: "preview"; reason: string }
  | null

/**
 * Whether an action control is allowed for the person on screen.
 * `disabled`: their level or rights don't allow it. `preview`: they could do it,
 * but View as never changes anything. `null`: go ahead.
 */
export function useActionGate(label: string, right?: Right): Gate {
  const access = useAccess()
  const page = React.useContext(PageLevelContext)
  if (!access || !page) return null
  const name = access.subject.name.split(" ")[0]
  const needs = right ?? rightForAction(page.page, label)
  if (!needs && SAFE.test(label.trim())) return null
  if (page.level === "view" || page.level === "none")
    return {
      kind: "disabled",
      reason: `${name} can view this page but can't change it`,
    }
  if (needs && !access.can(needs))
    return {
      kind: "disabled",
      reason: `${name} needs the “${rightLabel(needs)}” right`,
    }
  if (access.viewing)
    return {
      kind: "preview",
      reason: `${name} can do this. View as is a preview, so nothing changed.`,
    }
  return null
}
