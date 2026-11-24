"use client";

import { badgeTones } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function IconTile({ icon: Icon, tone = "neutral", className, size = "md" }) {
  let i =
    size === "sm"
      ? "size-8 rounded-lg [&>svg]:size-4"
      : size === "lg"
        ? "size-11 rounded-xl [&>svg]:size-5"
        : "size-9 rounded-xl [&>svg]:size-[18px]";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        tone === "neutral" ? "bg-muted/60 text-foreground/75 border" : badgeTones[tone],
        i,
        className,
      )}
    >
      <Icon />
    </span>
  );
}
