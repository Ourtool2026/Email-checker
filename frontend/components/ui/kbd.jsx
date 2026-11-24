"use client";

export const Kbd = ({ children }) => (
  <kbd className="rounded-md border bg-muted/60 px-1.5 font-mono text-[11px] text-muted-foreground">
    {children}
  </kbd>
);
