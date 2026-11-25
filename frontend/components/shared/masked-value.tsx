"use client"

import { useState } from "react"
import { ActionButton } from "@/components/hq/gate"
import { EyeIcon } from "lucide-react"
import { openTicketDialog } from "@/components/shared/ticket-dialog"
import { Tooltip } from "@/components/hq/tooltip"
import { cn } from "@/lib/utils"

export function MaskedValue({
  value,
  label,
  target,
  className,
}: {
  value?: any
  label?: any
  target?: any
  className?: any
}) {
  const [i, o] = useState(false)
  return i ? (
    <span className={cn("font-mono", className)}>{value}</span>
  ) : (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-mono tracking-widest text-muted-foreground">
        •••• ••• •••
      </span>
      <Tooltip label="Show, with a reason">
        <ActionButton right="reveal_details"
          className="inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[12px] font-medium text-primary hover:bg-primary/10"
          onClick={() =>
            openTicketDialog({
              label: label,
              target: target,
              done: () => o(true),
            })
          }
        >
          <EyeIcon className="size-3.5" />
          Show
        </ActionButton>
      </Tooltip>
    </span>
  )
}
