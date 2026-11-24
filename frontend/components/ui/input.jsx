"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(function Input({ className, ...props }, r) {
  return (
    <input
      ref={r}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-card transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
});

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-20 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-card outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="h-9 w-full appearance-none rounded-lg border border-input bg-card pr-8 pl-3 text-sm shadow-card outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      </svg>
    </div>
  );
}

export function Field({ label, hint, children, className }) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-muted-foreground text-[12.5px] font-medium">{label}</span>
      {children}
      {hint && <span className="text-muted-foreground text-[12px]">{hint}</span>}
    </label>
  );
}
