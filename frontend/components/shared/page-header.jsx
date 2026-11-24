"use client";

export function PageHeader({ title, desc, children, badge }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="grid gap-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[24px] font-semibold tracking-tight">{title}</h1>
          {badge}
        </div>
        {desc && <p className="text-muted-foreground max-w-[72ch] text-[13.5px]">{desc}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
