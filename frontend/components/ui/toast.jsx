"use client";

import { useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";

let showToast;

export function Toaster() {
  let [t, a] = useState(null);
  useEffect(() => {
    showToast = a;
    return () => {
      showToast = undefined;
    };
  }, []);
  useEffect(() => {
    if (!t) {
      return;
    }
    let r = setTimeout(() => a(null), 2800);
    return () => clearTimeout(r);
  }, [t]);
  if (!t) {
    return null;
  }
  let Icon = t.icon || LuCheck;
  return (
    <div
      role="status"
      className="anim-toast fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-xl border bg-popover px-3.5 py-2.5 text-sm shadow-float"
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-success/10 text-success">
        <Icon className="size-3.5" />
      </span>
      {t.text}
    </div>
  );
}

export const toast = (t, a) =>
  showToast &&
  showToast({
    text: t,
    icon: a,
    k: Math.random(),
  });
