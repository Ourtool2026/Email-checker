"use client"

import { Locked, useControlGate } from "@/components/hq/gate"
import { toast } from "@/components/hq/toast"
import { Switch as UISwitch } from "@/components/ui/switch"
import type { Right } from "@/lib/access"

export function Switch({
  checked,
  onChange,
  label,
  right,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  right?: Right
}) {
  const gate = useControlGate({ "aria-label": label ?? "switch" }, right)
  if (gate?.kind === "disabled")
    return (
      <Locked reason={gate.reason}>
        <UISwitch checked={checked} disabled aria-label={label} />
      </Locked>
    )
  return (
    <UISwitch
      checked={checked}
      onCheckedChange={gate ? () => toast(gate.reason) : onChange}
      aria-label={label}
    />
  )
}
