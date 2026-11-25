import * as React from "react"

import { Kbd as UIKbd } from "@/components/ui/kbd"

export const Kbd = ({ children }: { children?: React.ReactNode }) => (
  <UIKbd>{children}</UIKbd>
)
