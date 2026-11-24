"use client";

import { cn } from "@/lib/utils";

export const badgeTones = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  violet: "bg-violet/10 text-violet",
  teal: "bg-teal/10 text-teal",
  pink: "bg-pink/10 text-pink",
  orange: "bg-orange/10 text-orange",
  indigo: "bg-indigo/10 text-indigo",
};

export function Badge({ tone = "neutral", children, dot = true, className }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        badgeTones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Tag({ children, className, icon: Icon }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-md border bg-card px-1.5 py-0.5 text-[11.5px] font-medium text-foreground/80 whitespace-nowrap [&>svg]:size-3",
        className,
      )}
    >
      {Icon && <Icon />}
      {children}
    </span>
  );
}
