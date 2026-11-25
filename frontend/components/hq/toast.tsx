"use client"

import * as React from "react"
import { CircleCheckIcon } from "lucide-react"
import { toast as sonner } from "sonner"

export { Toaster } from "@/components/ui/sonner"

/** Short confirmation toast (Sonner). `icon` replaces the default check. */
export const toast = (text: React.ReactNode, icon?: React.ElementType) => {
  const Icon = icon || CircleCheckIcon
  return sonner(text, {
    icon: <Icon className="size-[18px] text-success" />,
  })
}
