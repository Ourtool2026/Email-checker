"use client";

import { cn } from "@/lib/utils";

export function Card({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
  bodyClass,
  flush,
}) {
  return (
    <section
      className={cn(
        "border-surface-border bg-surface flex min-w-0 flex-col rounded-3xl border p-1.5 shadow-card",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 px-3.5 pt-2 pb-2.5">
          <div className="flex min-w-0 flex-1 basis-[180px] items-center gap-2.5">
            {Icon && <Icon className="text-foreground/80 size-[18px] shrink-0" />}
            <div className="grid min-w-0">
              {title && (
                <h2 className="truncate text-[15px] font-semibold tracking-tight">{title}</h2>
              )}
              {description && (
                <p className="text-muted-foreground truncate text-[12.5px]">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex max-w-full min-w-0 flex-wrap items-center gap-1.5">{actions}</div>
          )}
        </header>
      )}
      <div
        data-slot="panel-body"
        className={cn(
          "bg-card border-border/60 min-w-0 overflow-hidden rounded-2xl border shadow-card",
          !flush && "p-5",
          bodyClass,
        )}
      >
        {children}
      </div>
    </section>
  );
}
