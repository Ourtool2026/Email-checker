"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readPref } from "@/lib/prefs";
import { isPageId, pagePath } from "@/lib/routes";

/** "/" opens the page chosen in Customize → Start page (or an old #hash link). */
export function StartRedirect() {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const start = readPref("hq-start", "command");
    const target = isPageId(hash) ? hash : isPageId(start) ? start : "command";
    router.replace(pagePath(target));
  }, [router]);
  return null;
}
