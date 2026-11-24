"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  LuBriefcase,
  LuCornerDownLeft,
  LuKeyboard,
  LuMegaphone,
  LuMoon,
  LuPlus,
  LuScale,
  LuSearch,
  LuSiren,
  LuSlidersHorizontal,
  LuSun,
} from "react-icons/lu";
import { pages } from "@/components/shell/nav";
import { Avatar } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/kbd";
import { cases, hostels, users } from "@/lib/data/core";
import { formatLivingId } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CommandPalette({ onClose, nav, set, ui }) {
  let [i, o] = useState("");
  let [n, l] = useState(0);
  let d = useRef();
  useEffect(() => {
    d.current?.focus();
  }, []);
  let u = i.trim().toLowerCase();
  let s = [
    {
      g: "Actions",
      icon: LuPlus,
      t: "Open a new case",
      run: () => nav.go("cases"),
    },
    {
      g: "Actions",
      icon: LuSiren,
      t: "Declare an incident",
      run: () => nav.go("status"),
    },
    {
      g: "Actions",
      icon: LuMegaphone,
      t: "New campaign",
      run: () => nav.go("campaigns"),
    },
    {
      g: "Actions",
      icon: LuScale,
      t: "Log a police request",
      run: () => nav.go("law"),
    },
    {
      g: "Actions",
      icon: ui.dark ? LuSun : LuMoon,
      t: ui.dark ? "Switch to light mode" : "Switch to dark mode",
      run: () =>
        set({
          dark: !ui.dark,
          mode: ui.dark ? "light" : "dark",
        }),
    },
    {
      g: "Actions",
      icon: LuKeyboard,
      t: "Keyboard shortcuts",
      run: () =>
        set({
          keys: true,
        }),
    },
    {
      g: "Actions",
      icon: LuSlidersHorizontal,
      t: "Customize HQ (colours, density, text size)",
      run: () =>
        set({
          custom: true,
        }),
    },
  ];
  let m = pages.map((k) => ({
    g: "Pages",
    icon: k.icon,
    t: k.title,
    sub: k.group,
    run: () => nav.go(k.id),
  }));
  let f = u
    ? users
        .filter((k) =>
          (k.name + k.lid).toLowerCase().replace(/\s/g, "").includes(u.replace(/\s/g, "")),
        )
        .slice(0, 5)
        .map((k) => ({
          g: "Users",
          av: k,
          t: k.name,
          sub: formatLivingId(k.lid),
          run: () => nav.user(k.id),
        }))
    : [];
  let h = u
    ? hostels
        .filter((k) => (k.name + k.area).toLowerCase().includes(u))
        .slice(0, 4)
        .map((k) => ({
          g: "Hostels",
          img: k.photo,
          t: k.name,
          sub: k.area,
          run: () => nav.hostel(k.id),
        }))
    : [];
  let B = u
    ? cases
        .filter((k) => (k.id + k.title).toLowerCase().includes(u))
        .slice(0, 3)
        .map((k) => ({
          g: "Cases",
          icon: LuBriefcase,
          t: k.title,
          sub: k.id,
          run: () => nav.go("cases"),
        }))
    : [];
  let y = [
    ...f,
    ...h,
    ...B,
    ...m.filter((k) => !u || (k.t + k.sub).toLowerCase().includes(u)),
    ...s.filter((k) => !u || k.t.toLowerCase().includes(u)),
  ].slice(0, 14);
  useEffect(() => l(0), [i]);
  let W = (k) => {
    onClose();
    k.run();
  };
  let x = "";
  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <div
        className="anim-dlg bg-popover w-full max-w-[620px] overflow-hidden rounded-2xl border shadow-float"
        style={{
          animationName: "fade-in",
        }}
        onMouseDown={(k) => k.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4">
          <LuSearch className="text-muted-foreground size-[18px]" />
          <input
            ref={d}
            value={i}
            onChange={(k) => o(k.target.value)}
            onKeyDown={(k) => {
              if (k.key === "ArrowDown") {
                k.preventDefault();
                l(Math.min(n + 1, y.length - 1));
              }
              if (k.key === "ArrowUp") {
                k.preventDefault();
                l(Math.max(n - 1, 0));
              }
              if (k.key === "Enter" && y[n]) {
                W(y[n]);
              }
              if (k.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search users, Living IDs, hostels, cases or pages…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[52vh] overflow-auto p-2">
          {y.length ? (
            y.map((k, N) => {
              let q = k.g !== x;
              x = k.g;
              return (
                <Fragment key={N}>
                  {q && (
                    <div className="text-muted-foreground px-2.5 pt-2 pb-1 text-[11.5px] font-medium">
                      {k.g}
                    </div>
                  )}
                  <button
                    onMouseEnter={() => l(N)}
                    onClick={() => W(k)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left",
                      N === n && "bg-accent",
                    )}
                  >
                    {k.av ? (
                      <Avatar name={k.av.name} photo={k.av.photo} size={26} />
                    ) : k.img ? (
                      <img src={k.img} alt="" className="size-[26px] rounded-md object-cover" />
                    ) : (
                      <span className="bg-muted flex size-[26px] items-center justify-center rounded-md">
                        <k.icon className="text-muted-foreground size-4" />
                      </span>
                    )}
                    <span className="flex-1 truncate text-[13.5px]">{k.t}</span>
                    {k.sub && (
                      <span className="text-muted-foreground font-mono text-[11.5px]">{k.sub}</span>
                    )}
                    {N === n && <LuCornerDownLeft className="text-muted-foreground size-3.5" />}
                  </button>
                </Fragment>
              );
            })
          ) : (
            <div className="text-muted-foreground py-10 text-center text-[13px]">
              No results for “{i}”
            </div>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-4 border-t px-4 py-2 text-[11.5px]">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            {" move"}
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            {" open"}
          </span>
          <span className="ml-auto">Searches the whole platform</span>
        </div>
      </div>
    </div>
  );
}
