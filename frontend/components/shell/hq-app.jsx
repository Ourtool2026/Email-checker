"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HostelDrawer } from "@/components/drawers/hostel-drawer";
import { UserDrawer } from "@/components/drawers/user-drawer";
import { TicketDialog } from "@/components/shared/ticket-dialog";
import { CommandPalette } from "@/components/shell/command-palette";
import { CustomizeSheet } from "@/components/shell/customize-sheet";
import { HQContext } from "@/components/shell/hq-context";
import { pages } from "@/components/shell/nav";
import { NotificationsPanel } from "@/components/shell/notifications-panel";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { Toaster } from "@/components/ui/toast";
import { connectLab } from "@/lib/lab";
import { readPref, writePref } from "@/lib/prefs";
import { isPageId, pagePath, routeFromPath } from "@/lib/routes";
import { refresh, useRerender } from "@/lib/store";

const shortcuts = [
  ["⌘ K", "Search and jump anywhere"],
  ["/", "Search"],
  ["G then U", "Users"],
  ["G then C", "Cases"],
  ["G then H", "Hostels"],
  ["G then A", "Analytics"],
  ["N", "Notifications"],
  ["[", "Collapse sidebar"],
  ["?", "This list"],
];

const initialUi = () => ({
  dark: readPref("hq-dark", false),
  side: readPref("hq-side", "light"),
  collapsed: readPref("hq-col", false),
  fav: readPref("hq-fav", ["cases", "verify", "analytics"]),
  shut: readPref("hq-shut", []),
  env: "Production",
  mobile: false,
  palette: false,
  notifs: false,
  keys: false,
  custom: false,
  ...readPref("hq-look", {
    mode: "light",
    accent: "blue",
    density: "comfortable",
    text: "md",
    motion: false,
    start: "command",
    badges: true,
    sounds: true,
    desk: false,
    lang: "en",
  }),
});

/**
 * The HQ application shell: sidebar, top bar, drawers, dialogs and global
 * keyboard shortcuts. The current page is rendered from `children`
 * (see app/(hq)/[page]/page.jsx) and reads shared state from HQContext.
 */
export default function HQApp({ children }) {
  useRerender();
  const router = useRouter();
  const pathname = usePathname();
  const route = routeFromPath(pathname) ?? "command";

  const [query, setQuery] = useState("");
  const [openUserId, setOpenUserId] = useState(null);
  const [openHostelId, setOpenHostelId] = useState(null);
  const [range, setRange] = useState("30d");
  const [ui, setUi] = useState(initialUi);
  const set = useCallback((patch) => setUi((prev) => ({ ...prev, ...patch })), []);

  const go = useCallback((id) => router.push(pagePath(id)), [router]);

  // Old hash links (e.g. /#verify) keep working.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (isPageId(id)) router.replace(pagePath(id));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [router]);

  // Live link to the MyStay ID app prototype (cross-tab "test lab" bus).
  useEffect(() => {
    connectLab(refresh);
  }, []);

  // Apply and remember look & feel settings.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", ui.dark);
    root.dataset.side = ui.side;
    root.dataset.accent = ui.accent;
    root.dataset.density = ui.density;
    root.dataset.text = ui.text;
    root.dataset.motion = ui.motion ? "reduce" : "full";
    writePref("hq-dark", ui.dark);
    writePref("hq-side", ui.side);
    writePref("hq-look", {
      mode: ui.mode,
      accent: ui.accent,
      density: ui.density,
      text: ui.text,
      motion: ui.motion,
      start: ui.start,
      badges: ui.badges,
      sounds: ui.sounds,
      desk: ui.desk,
      lang: ui.lang,
    });
    writePref("hq-start", ui.start);
    writePref("hq-col", ui.collapsed);
    writePref("hq-fav", ui.fav);
    writePref("hq-shut", ui.shut);
  }, [
    ui.dark,
    ui.collapsed,
    ui.fav,
    ui.shut,
    ui.side,
    ui.accent,
    ui.density,
    ui.text,
    ui.motion,
    ui.start,
    ui.badges,
    ui.sounds,
    ui.desk,
    ui.lang,
    ui.mode,
  ]);

  // Close drawers and scroll to top whenever the page changes.
  useEffect(() => {
    setOpenUserId(null);
    setOpenHostelId(null);
    set({ mobile: false });
    document.getElementById("main")?.scrollTo(0, 0);
  }, [route, set]);

  // Global keyboard shortcuts.
  useEffect(() => {
    let gPressedAt = 0;
    const onKey = (event) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        set({ palette: true });
        return;
      }
      if (typing) return;
      if (event.key === "/") {
        event.preventDefault();
        set({ palette: true });
      } else if (event.key === "?") {
        set({ keys: true });
      } else if (event.key === "[") {
        setUi((prev) => ({ ...prev, collapsed: !prev.collapsed }));
      } else if (event.key === "n") {
        set({ notifs: true });
      } else if (event.key === "g") {
        gPressedAt = Date.now();
      } else if (Date.now() - gPressedAt < 900) {
        const target = { u: "users", c: "cases", h: "hostels", a: "analytics", d: "command" }[
          event.key
        ];
        if (target) go(target);
        gPressedAt = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, set]);

  // Messages from the embedding test lab (theme switch, open a hostel).
  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data || {};
      if (data.labTheme) set({ dark: data.labTheme === "dark", mode: data.labTheme });
      if (data.labHostel) {
        go("hostels");
        setTimeout(() => {
          setOpenUserId(null);
          setOpenHostelId(data.labHostel);
        }, 120);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [go, set]);

  const openUser = useCallback((id) => {
    setOpenHostelId(null);
    setOpenUserId(id);
  }, []);
  const openHostel = useCallback((id) => {
    setOpenUserId(null);
    setOpenHostelId(id);
  }, []);
  const nav = useMemo(
    () => ({ user: openUser, hostel: openHostel, go, customize: () => set({ custom: true }) }),
    [openUser, openHostel, go, set],
  );
  const context = useMemo(
    () => ({ nav, q: query, setQ: setQuery, range, setRange }),
    [nav, query, range],
  );

  return (
    <HQContext.Provider value={context}>
      <div className="flex h-screen overflow-hidden">
        {ui.mobile && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => set({ mobile: false })}
          />
        )}
        <Sidebar route={route} ui={ui} set={set} openPalette={() => set({ palette: true })} />
        <div id="main" className="min-w-0 flex-1 overflow-auto">
          {ui.env === "Staging" && (
            <div className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-1.5 text-[12.5px] font-semibold text-amber-950">
              You are in Staging. Changes here never reach real users.
              <button className="underline" onClick={() => set({ env: "Production" })}>
                Back to Production
              </button>
            </div>
          )}
          <Topbar route={route} nav={nav} ui={ui} set={set} range={range} setRange={setRange} />
          <main className="mx-auto max-w-[1480px] p-4 md:p-6">{children}</main>
        </div>
        <UserDrawer id={openUserId} onClose={() => setOpenUserId(null)} nav={nav} />
        <HostelDrawer id={openHostelId} onClose={() => setOpenHostelId(null)} nav={nav} />
        {ui.custom && (
          <CustomizeSheet ui={ui} set={set} onClose={() => set({ custom: false })} pages={pages} />
        )}
        {ui.palette && (
          <CommandPalette onClose={() => set({ palette: false })} nav={nav} set={set} ui={ui} />
        )}
        {ui.notifs && <NotificationsPanel onClose={() => set({ notifs: false })} nav={nav} />}
        <Dialog
          open={ui.keys}
          onClose={() => set({ keys: false })}
          title="Keyboard shortcuts"
          footer={<Button onClick={() => set({ keys: false })}>Done</Button>}
        >
          <div className="grid gap-1">
            {shortcuts.map(([keys, label]) => (
              <div
                className="flex items-center justify-between rounded-lg px-1 py-1.5 text-[13.5px]"
                key={keys}
              >
                <span>{label}</span>
                <span className="flex gap-1">
                  {keys.split(" ").map((key, index) =>
                    key === "then" ? (
                      <span className="text-muted-foreground px-0.5 text-[12px]" key={index}>
                        then
                      </span>
                    ) : (
                      <Kbd key={index}>{key}</Kbd>
                    ),
                  )}
                </span>
              </div>
            ))}
          </div>
        </Dialog>
        <TicketDialog />
        <Toaster />
      </div>
    </HQContext.Provider>
  );
}
