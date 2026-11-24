"use client";

import Link from "next/link";
import {
  LuCheck,
  LuChevronDown,
  LuChevronsUpDown,
  LuMoon,
  LuPalette,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuSearch,
  LuSun,
} from "react-icons/lu";
import { BrandMark } from "@/components/shell/brand-mark";
import { navGroups, pageById } from "@/components/shell/nav";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { currentAdmin } from "@/lib/data/core";
import { pagePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

function CustomizeButton({ set }) {
  return (
    <Tooltip label="Customize HQ">
      <button
        aria-label="Customize HQ"
        onClick={() =>
          set({
            custom: true,
          })
        }
        className="sb-btn flex size-8 items-center justify-center rounded-lg"
      >
        <LuPalette className="size-4" />
      </button>
    </Tooltip>
  );
}

export function Sidebar({ route, ui, set, openPalette }) {
  let { collapsed, mobile, fav, shut, env } = ui;
  let NavItem = ({ it: s }) => {
    let m = navGroups.flatMap((W) => W[1]).find((W) => W[0] === s.id);
    let f = m[3] && ui.badges !== false ? m[3]() : 0;
    let h = m[4];
    let B = route === s.id;
    let y = (
      <Link
        href={pagePath(s.id)}
        onClick={() =>
          set({
            mobile: false,
          })
        }
        className={cn(
          "sb-item relative flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          B && "sb-active font-medium",
          collapsed && "justify-center px-0",
        )}
      >
        {B && <span className="sb-bar absolute inset-y-1.5 left-0 w-[3px] rounded-r-full" />}
        <s.icon className={cn("size-[18px] shrink-0", B ? "sb-icon-on" : "sb-icon")} />
        {!collapsed && <span className="truncate">{s.title}</span>}
        {f > 0 &&
          (collapsed ? (
            <span
              className={cn(
                "absolute top-1 right-1 size-2 rounded-full",
                h === "danger" ? "bg-red-500" : h === "warning" ? "bg-amber-400" : "bg-[#2F7BF6]",
              )}
            />
          ) : (
            <span
              className={cn(
                "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                h === "danger"
                  ? "bg-red-500 text-white"
                  : h === "warning"
                    ? "bg-amber-400 text-amber-950"
                    : "sb-badge",
              )}
            >
              {f}
            </span>
          ))}
      </Link>
    );
    return <li>{collapsed ? <Tooltip label={s.title}>{y}</Tooltip> : y}</li>;
  };
  return (
    <aside
      className={cn(
        "sb fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-[width,transform] duration-200 md:static md:translate-x-0",
        collapsed ? "w-[68px]" : "w-64",
        mobile ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="p-2.5 pb-1.5">
        <DropdownMenu
          align="left"
          trigger={(s) => (
            <button
              onClick={s}
              className={cn(
                "sb-item flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left",
                collapsed && "justify-center",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#2CB8FF] to-[#2B6BFF] shadow-sm">
                <BrandMark />
              </span>
              {!collapsed && (
                <>
                  <span className="grid min-w-0 flex-1 leading-tight">
                    <span className="sb-strong text-[14.5px] font-semibold tracking-tight">
                      MyStay ID HQ
                    </span>
                    <span className="sb-muted flex items-center gap-1.5 text-[11.5px]">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          env === "Production" ? "bg-emerald-500" : "bg-amber-400",
                        )}
                      />
                      {env}
                    </span>
                  </span>
                  <LuChevronsUpDown className="sb-group size-4" />
                </>
              )}
            </button>
          )}
          items={[
            {
              icon: env === "Production" ? LuCheck : null,
              label: "Production \xB7 Dhaka",
              onClick: () =>
                set({
                  env: "Production",
                }),
            },
            {
              icon: env === "Staging" ? LuCheck : null,
              label: "Staging (test data)",
              onClick: () => {
                set({
                  env: "Staging",
                });
                toast("Switched to Staging. Nothing here reaches real users.");
              },
            },
          ]}
        />
      </div>
      <div className="px-2.5 pb-1">
        {!collapsed && (
          <div className="sb-group flex h-7 items-center px-2.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase">
            Main menu
          </div>
        )}
        {collapsed ? (
          <Tooltip label="Search  ⌘K">
            <button
              onClick={openPalette}
              aria-label="Search"
              className="sb-btn flex h-9 w-full items-center justify-center rounded-lg"
            >
              <LuSearch className="size-4" />
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={openPalette}
            className="sb-item flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px]"
          >
            <LuSearch className="sb-icon size-[18px]" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="sb-kbd rounded-full border px-1.5 py-px font-mono text-[10.5px]">
              ⌘K
            </kbd>
          </button>
        )}
      </div>
      <nav className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-auto pb-2">
        {fav.length > 0 && (
          <div className="px-2.5 py-1">
            {!collapsed && (
              <div className="sb-group flex h-7 items-center px-2.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase">
                Favorites
              </div>
            )}
            <ul className="flex flex-col gap-0.5">
              {fav
                .filter((s) => pageById[s])
                .map((s) => (
                  <NavItem it={pageById[s]} key={s} />
                ))}
            </ul>
          </div>
        )}
        {navGroups.map(([s, m]) => {
          let f = shut.includes(s);
          return (
            <div className="px-2.5 py-1" key={s}>
              {collapsed ? (
                <div className="sb-divider mx-3 my-1.5 h-px" />
              ) : (
                <button
                  onClick={() =>
                    set({
                      shut: f ? shut.filter((h) => h !== s) : [...shut, s],
                    })
                  }
                  className="sb-group group mt-1 flex h-7 w-full items-center px-2.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase"
                >
                  {s}
                  <LuChevronDown
                    className={cn(
                      "ml-auto size-3.5 opacity-70 transition group-hover:opacity-100",
                      f && "-rotate-90",
                    )}
                  />
                </button>
              )}
              {(!f || collapsed) && (
                <ul className="flex flex-col gap-0.5">
                  {m.map((h) => (
                    <NavItem it={pageById[h[0]]} key={h[0]} />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
      <div
        className={cn("sb-foot flex items-center gap-1.5 border-t p-2.5", collapsed && "flex-col")}
      >
        <Avatar name={currentAdmin.name} photo={currentAdmin.photo} size={32} />
        {!collapsed && (
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="sb-strong truncate text-[13px] font-semibold">
              {currentAdmin.name}
            </span>
            <span className="sb-muted text-[11.5px]">{currentAdmin.role}</span>
          </span>
        )}
        <CustomizeButton ui={ui} set={set} />
        <Tooltip label={ui.dark ? "Light mode" : "Dark mode"}>
          <button
            aria-label="Switch theme"
            onClick={() =>
              set({
                dark: !ui.dark,
                mode: ui.dark ? "light" : "dark",
              })
            }
            className="sb-btn flex size-8 items-center justify-center rounded-lg"
          >
            {ui.dark ? <LuSun className="size-4" /> : <LuMoon className="size-4" />}
          </button>
        </Tooltip>
        <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <button
            aria-label="Toggle sidebar"
            onClick={() =>
              set({
                collapsed: !collapsed,
              })
            }
            className="sb-btn hidden size-8 items-center justify-center rounded-lg md:flex"
          >
            {collapsed ? (
              <LuPanelLeftOpen className="size-4" />
            ) : (
              <LuPanelLeftClose className="size-4" />
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
