"use client";

import { cn } from "@/lib/utils";

export function SearchInput({ value, onChange, placeholder, className }) {
  return (
    <label
      className={cn(
        "bg-card text-muted-foreground focus-within:border-ring focus-within:ring-ring/30 flex h-9 items-center gap-2 rounded-xl border px-3 shadow-card focus-within:ring-[3px]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(i) => onChange(i.target.value)}
        placeholder={placeholder}
        className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
    </label>
  );
}
