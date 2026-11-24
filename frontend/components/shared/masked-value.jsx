"use client";

import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { openTicketDialog } from "@/components/shared/ticket-dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function MaskedValue({ value, label, target, className }) {
  let [i, o] = useState(false);
  return i ? (
    <span className={cn("font-mono", className)}>{value}</span>
  ) : (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="text-muted-foreground font-mono tracking-widest">•••• ••• •••</span>
      <Tooltip label="Show, with a reason">
        <button
          className="text-primary hover:bg-primary/10 inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[12px] font-medium"
          onClick={() =>
            openTicketDialog({
              label: label,
              target: target,
              done: () => o(true),
            })
          }
        >
          <LuEye className="size-3.5" />
          Show
        </button>
      </Tooltip>
    </span>
  );
}
