"use client"

export function PageHeader({
  title,
  desc,
  children,
  badge,
}: {
  title?: any
  desc?: any
  children?: any
  badge?: any
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="grid gap-1">
        <div className="flex items-center gap-2.5">
          <h1 className="font-brand text-[26px] leading-tight font-semibold tracking-[-0.015em]">
            {title}
          </h1>
          {badge}
        </div>
        {desc && (
          <p className="max-w-[72ch] text-[13.5px] text-muted-foreground">
            {desc}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  )
}
