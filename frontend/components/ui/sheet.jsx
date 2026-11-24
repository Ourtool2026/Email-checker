"use client";

import { useEffect } from "react";
import { LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";

export function useEscape(t, a) {
  useEffect(() => {
    if (!t) {
      return;
    }
    let e = (r) => r.key === "Escape" && a();
    window.addEventListener("keydown", e);
    return () => window.removeEventListener("keydown", e);
  }, [t, a]);
}

export function Sheet({ open: t, onClose, children, width = "sm:max-w-[460px]" }) {
  useEscape(t, onClose);
  return t ? (
    <>
      <div
        className="anim-fade fixed inset-0 z-40 bg-black/30 dark:bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "anim-sheet fixed inset-y-2 right-2 z-50 flex w-[calc(100%-1rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-float",
          width,
        )}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 rounded-lg bg-card/85 p-1.5 text-foreground/70 shadow-sm backdrop-blur hover:bg-accent hover:text-foreground"
        >
          <LuX className="size-4" />
        </button>
        {children}
      </div>
    </>
  ) : null;
}
