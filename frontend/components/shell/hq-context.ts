"use client"

import { createContext, useContext } from "react"

/** Shared HQ state handed to every page: navigation helpers, search query and date range. */
export type HQNav = {
  user: (id: string) => void
  hostel: (id: string) => void
  go: (id: string) => void
  customize: () => void
}

export type HQState = {
  nav: HQNav
  q: string
  setQ: (q: string) => void
  range: string
  setRange: (range: string) => void
}

export const HQContext = createContext<HQState | null>(null)

export const useHQ = () => useContext(HQContext)
