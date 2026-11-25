"use client"

import * as React from "react"

const EMPTY = /^[—–-]?$/

/** Marks each cell of a table with its role and column title, so a phone can lay a row out as a card. */
function tag(table: HTMLTableElement) {
  if (table.hasAttribute("data-no-stack")) return
  table.setAttribute("data-stack", "")
  const labels = [...table.querySelectorAll<HTMLElement>("thead th")].map(
    (th) => (th.textContent ?? "").trim()
  )
  for (const row of table.querySelectorAll<HTMLTableRowElement>("tbody > tr")) {
    if (row.hasAttribute("data-st")) continue
    row.setAttribute("data-st", "")
    let primary = false
    ;[...row.children].forEach((cell, i) => {
      const td = cell as HTMLTableCellElement
      if (td.colSpan > 1) return void td.setAttribute("data-role", "full")
      const label = labels[i] ?? ""
      let role = "meta"
      if (
        !label &&
        td.querySelector('[role="checkbox"], input[type="checkbox"]')
      )
        role = "select"
      else if (!label) role = "actions"
      else if (!primary) {
        role = "primary"
        primary = true
      }
      td.setAttribute("data-role", role)
      if (role === "meta" && label) td.setAttribute("data-label", label)
      // A cell with only a dash says nothing: leave it out of the card.
      if (
        role === "meta" &&
        !td.querySelector("*") &&
        EMPTY.test((td.textContent ?? "").trim())
      )
        td.setAttribute("data-empty", "")
    })
  }
}

/**
 * On phones tables become stacked cards (the name on top, the other columns as labelled
 * lines under it, the row menu in the corner), styled in globals.css. This only adds the
 * attributes those styles use; it changes nothing on a desktop screen.
 */
export function ResponsiveTables() {
  React.useEffect(() => {
    let frame = 0
    const run = () => {
      frame = 0
      document
        .querySelectorAll<HTMLTableElement>('table[data-slot="table"]')
        .forEach(tag)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run)
    }
    run()
    const watch = new MutationObserver(schedule)
    watch.observe(document.body, { childList: true, subtree: true })
    return () => {
      watch.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return null
}
