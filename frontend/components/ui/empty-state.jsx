"use client";

import { IconTile } from "@/components/ui/icon-tile";

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <IconTile icon={icon} size="lg" />
      <div className="text-[14px] font-medium">{title}</div>
      <div className="max-w-sm text-[12.5px] text-muted-foreground">{text}</div>
      {action}
    </div>
  );
}
