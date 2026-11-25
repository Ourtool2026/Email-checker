"use client"

import { Switch as UISwitch } from "@/components/ui/switch"

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}) {
  return (
    <UISwitch checked={checked} onCheckedChange={onChange} aria-label={label} />
  )
}
