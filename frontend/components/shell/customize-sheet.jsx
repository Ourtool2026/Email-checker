"use client";

import {
  LuCheck,
  LuMonitor,
  LuMoon,
  LuPalette,
  LuRows2,
  LuRows3,
  LuSun,
  LuType,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const accents = [
  ["blue", "Blue", "#2F7BF6"],
  ["violet", "Violet", "#7C3AED"],
  ["emerald", "Emerald", "#059669"],
  ["rose", "Rose", "#E11D48"],
  ["orange", "Orange", "#EA580C"],
  ["slate", "Slate", "#334155"],
];

const sidebarThemes = [
  ["light", "Light", "#FFFFFF", "#2F7BF6"],
  ["graphite", "Graphite", "#18181B", "#3F3F46"],
  ["ocean", "Ocean blue", "#1D4ED8", "#1E3A8A"],
  ["teal", "Deep teal", "#0F4C4C", "#0B3B3B"],
  ["midnight", "Midnight", "#0B1220", "#18233A"],
];

function OptionButton({ on, onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-[13px] font-medium transition-colors hover:border-ring/40",
        on && "border-primary bg-primary/[0.06]",
        className,
      )}
    >
      {children}
      {on && <LuCheck className="text-primary ml-auto size-4" />}
    </button>
  );
}

export function CustomizeSheet({ ui, set, onClose, pages: r }) {
  return (
    <Sheet open onClose={onClose} width="sm:max-w-[460px]">
      <div className="border-b p-5">
        <div className="flex items-center gap-2 text-[17px] font-semibold">
          <LuPalette className="text-primary size-5" />
          Customize HQ
        </div>
        <p className="text-muted-foreground mt-1 text-[13px]">
          Only changes how HQ looks for you. Saved in this browser.
        </p>
      </div>
      <div className="grid flex-1 content-start gap-6 overflow-auto p-5">
        <section className="grid gap-2">
          <span className="text-[13px] font-semibold">Theme</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["light", "Light", LuSun],
              ["dark", "Dark", LuMoon],
              ["system", "System", LuMonitor],
            ].map(([i, o, Icon]) => (
              <OptionButton
                on={(ui.mode === "system" ? "system" : ui.dark ? "dark" : "light") === i}
                onClick={() =>
                  set({
                    mode: i,
                    dark:
                      i === "dark" ||
                      (i === "system" && matchMedia("(prefers-color-scheme: dark)").matches),
                  })
                }
                key={i}
              >
                <Icon className="size-4" />
                {o}
              </OptionButton>
            ))}
          </div>
        </section>
        <section className="grid gap-2">
          <span className="text-[13px] font-semibold">Accent colour</span>
          <div className="flex flex-wrap gap-2">
            {accents.map(([i, o, n]) => (
              <Tooltip label={o} key={i}>
                <button
                  aria-label={o}
                  onClick={() =>
                    set({
                      accent: i,
                    })
                  }
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition",
                    ui.accent === i && "ring-2",
                  )}
                  style={{
                    background: n,
                    "--tw-ring-color": n,
                  }}
                >
                  {ui.accent === i && <LuCheck className="size-5 text-white" />}
                </button>
              </Tooltip>
            ))}
          </div>
          <span className="text-muted-foreground text-[12px]">
            Used for buttons, links, charts and the selected page.
          </span>
        </section>
        <section className="grid gap-2">
          <span className="text-[13px] font-semibold">Sidebar colour</span>
          <div className="grid grid-cols-2 gap-2">
            {sidebarThemes.map(([i, o, n, l]) => (
              <OptionButton
                on={ui.side === i}
                onClick={() =>
                  set({
                    side: i,
                  })
                }
                key={i}
              >
                <span
                  className="size-6 rounded-md border"
                  style={{
                    background: `linear-gradient(135deg, ${n} 50%, ${l} 50%)`,
                  }}
                />
                {o}
              </OptionButton>
            ))}
          </div>
        </section>
        <section className="grid gap-2">
          <span className="text-[13px] font-semibold">Density</span>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton
              on={ui.density === "comfortable"}
              onClick={() =>
                set({
                  density: "comfortable",
                })
              }
            >
              <LuRows2 className="size-4" />
              Comfortable
            </OptionButton>
            <OptionButton
              on={ui.density === "compact"}
              onClick={() =>
                set({
                  density: "compact",
                })
              }
            >
              <LuRows3 className="size-4" />
              Compact
            </OptionButton>
          </div>
        </section>
        <section className="grid gap-2">
          <span className="text-[13px] font-semibold">Text size</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["sm", "Small", 13],
              ["md", "Default", 15],
              ["lg", "Large", 17],
            ].map(([i, o, n]) => (
              <OptionButton
                on={ui.text === i}
                onClick={() =>
                  set({
                    text: i,
                  })
                }
                key={i}
              >
                <LuType
                  style={{
                    width: n,
                    height: n,
                  }}
                />
                {o}
              </OptionButton>
            ))}
          </div>
        </section>
        <section className="grid gap-3">
          <span className="text-[13px] font-semibold">Behaviour</span>
          <Field label="Start page">
            <Select
              value={ui.start}
              onChange={(i) =>
                set({
                  start: i.target.value,
                })
              }
            >
              {r.map((i) => (
                <option value={i.id} key={i.id}>
                  {i.title}
                </option>
              ))}
            </Select>
          </Field>
          {[
            ["badges", "Show counts in the sidebar", "Red and blue number badges"],
            ["motion", "Reduce motion", "Turn off animations"],
            ["sounds", "Sound for P1 cases", "A short chime when a P1 case opens"],
            ["desk", "Desktop notifications", "For mentions and approvals"],
          ].map(([i, o, n]) => (
            <div className="flex items-start gap-3" key={i}>
              <span className="grid flex-1 leading-snug">
                <span className="text-[13.5px] font-medium">{o}</span>
                <span className="text-muted-foreground text-[12.5px]">{n}</span>
              </span>
              <Switch
                checked={!!ui[i]}
                onChange={(l) =>
                  set({
                    [i]: l,
                  })
                }
                label={o}
              />
            </div>
          ))}
          <Field label="Language">
            <Select
              value={ui.lang}
              onChange={(i) => {
                set({
                  lang: i.target.value,
                });
                if (i.target.value === "bn") {
                  toast(
                    "\u09AC\u09BE\u0982\u09B2\u09BE interface is coming soon. Labels stay English for now.",
                  );
                }
              }}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (coming soon)</option>
            </Select>
          </Field>
        </section>
      </div>
      <div className="flex justify-between gap-2 border-t bg-muted/40 p-3">
        <Button
          variant="ghost"
          onClick={() =>
            set({
              mode: "light",
              dark: false,
              accent: "blue",
              side: "light",
              density: "comfortable",
              text: "md",
              motion: false,
              badges: true,
            })
          }
        >
          Reset to default
        </Button>
        <Button onClick={onClose}>
          <LuCheck />
          Done
        </Button>
      </div>
    </Sheet>
  );
}
