"use client";

export function Tooltip({ label, children }) {
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 opacity-0 transition-[opacity,transform] duration-150 group-hover/tip:translate-y-0 group-hover/tip:opacity-100"
      >
        <span className="block rounded-[7px] bg-foreground px-2 py-1 text-[11px] font-medium leading-none whitespace-nowrap text-background shadow-[0_6px_16px_-4px_rgb(0_0_0/0.3)]">
          {label}
        </span>
      </span>
    </span>
  );
}
