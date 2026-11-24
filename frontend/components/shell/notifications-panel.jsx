"use client";

import { useState } from "react";
import { LuAtSign, LuServer } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { adminTeam, notifications } from "@/lib/data/core";
import { refresh } from "@/lib/store";

export function NotificationsPanel({ onClose, nav }) {
  let [e, r] = useState("all");
  let i = notifications.filter(
    (o) => e === "all" || (e === "mention" ? o.kind === "mention" : o.kind !== "mention"),
  );
  return (
    <Sheet open onClose={onClose} width="sm:max-w-[420px]">
      <div className="flex items-center justify-between border-b p-5 pr-14">
        <div className="grid leading-tight">
          <span className="text-[17px] font-semibold">Notifications</span>
          <span className="text-muted-foreground text-[12.5px]">
            {notifications.filter((o) => o.unread).length}
            {" unread"}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            notifications.forEach((o) => (o.unread = false));
            refresh();
          }}
        >
          Mark all read
        </Button>
      </div>
      <div className="px-5 pt-3">
        <Tabs
          size="sm"
          value={e}
          onChange={r}
          className="w-full"
          items={[
            {
              value: "all",
              label: "All",
            },
            {
              value: "mention",
              label: "Mentions",
            },
            {
              value: "system",
              label: "System & approvals",
            },
          ]}
        />
      </div>
      <div className="flex-1 overflow-auto p-3">
        {i.map((o) => {
          let n = adminTeam.find((l) => l.name === o.who);
          return (
            <button
              onClick={() => {
                o.unread = false;
                refresh();
                onClose();
                nav.go(
                  o.kind === "approval" ? "approvals" : o.kind === "mention" ? "cases" : "status",
                );
              }}
              className="hover:bg-muted/60 relative flex w-full gap-3 rounded-xl p-3 text-left"
              key={o.id}
            >
              {o.unread && (
                <span className="bg-primary absolute top-4 right-3 size-2 rounded-full" />
              )}
              {n ? (
                <Avatar name={o.who} photo={n.photo} size={34} />
              ) : (
                <span className="bg-warning/10 text-warning flex size-[34px] shrink-0 items-center justify-center rounded-full">
                  {o.kind === "system" ? (
                    <LuServer className="size-4" />
                  ) : (
                    <LuAtSign className="size-4" />
                  )}
                </span>
              )}
              <span className="grid gap-0.5 pr-4 leading-snug">
                <span className="text-[13px]">
                  <b className="font-semibold">{o.who}</b> {o.text}
                </span>
                <span className="text-muted-foreground text-[11.5px]">{o.when}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
