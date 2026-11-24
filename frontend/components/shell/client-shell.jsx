"use client";

import dynamic from "next/dynamic";

// The HQ shell reads browser-only state (localStorage, window), so it renders on the client only.
const HQApp = dynamic(() => import("@/components/shell/hq-app"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-screen items-center justify-center text-sm">
      Loading HQ…
    </div>
  ),
});

export function ClientShell({ children }) {
  return <HQApp>{children}</HQApp>;
}
