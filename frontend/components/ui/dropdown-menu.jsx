"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({ trigger, items, align = "right" }) {
  let [r, i] = useState(false);
  let o = useRef();
  useEffect(() => {
    if (!r) {
      return;
    }
    let n = (l) => {
      if (!o.current?.contains(l.target)) {
        i(false);
      }
    };
    document.addEventListener("mousedown", n);
    return () => document.removeEventListener("mousedown", n);
  }, [r]);
  return (
    <div ref={o} className="relative">
      {trigger(() => i((n) => !n))}
      {r && (
        <div
          className={cn(
            "anim-fade absolute top-full z-30 mt-1.5 min-w-[13rem] rounded-xl border bg-popover p-1.5 shadow-float",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((n, l) =>
            n === "-" ? (
              <div className="-mx-1.5 my-1.5 h-px bg-border" key={l} />
            ) : (
              <button
                onClick={() => {
                  i(false);
                  n.onClick?.();
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent [&>svg]:size-4 [&>svg]:text-muted-foreground",
                  n.danger && "text-destructive [&>svg]:text-destructive",
                )}
                key={l}
              >
                {n.icon && <n.icon />}
                {n.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
