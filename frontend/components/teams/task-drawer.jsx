"use client";

import { useState } from "react";
import {
  LuArrowRight,
  LuCircle,
  LuCircleCheck,
  LuClock,
  LuLink2,
  LuPlus,
  LuSend,
} from "react-icons/lu";
import { Notice } from "@/components/shared/notice";
import { formatDue, isOverdue, personPhoto, taskPriorityTones } from "@/components/teams/shared";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Input, Select } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { currentAdmin } from "@/lib/data/core";
import { allMembers, taskStages } from "@/lib/data/teams";
import { refresh } from "@/lib/store";

export function TaskDrawer({ t, onClose, nav }) {
  let [r, i] = useState("");
  let [o, n] = useState("");
  let l =
    t.thread ||
    (t.thread = t.comments
      ? [[t.who, "Yesterday", "First draft is up. Can someone review before Thursday?"]]
      : []);
  return (
    <Sheet open onClose={onClose} width="sm:max-w-[560px]">
      <div className="border-b p-5">
        <div className="text-muted-foreground font-mono text-[12.5px]">{t.id}</div>
        <h2 className="mt-1 pr-8 text-[18px] font-semibold tracking-tight">{t.title}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Status">
            <Select
              className="h-8"
              value={t.status}
              onChange={(d) => {
                t.status = d.target.value;
                t.log.unshift([currentAdmin.name, `moved to ${t.status}`, "Just now"]);
                refresh();
              }}
            >
              {taskStages.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Select
              className="h-8"
              value={t.who}
              onChange={(d) => {
                t.who = d.target.value;
                refresh();
              }}
            >
              {allMembers.map((d) => (
                <option key={d[0]}>{d[0]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select
              className="h-8"
              value={t.pri}
              onChange={(d) => {
                t.pri = d.target.value;
                refresh();
              }}
            >
              {Object.keys(taskPriorityTones).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Due">
            <Input
              className="h-8"
              type="date"
              value={t.due}
              onChange={(d) => {
                t.due = d.target.value;
                refresh();
              }}
            />
          </Field>
        </div>
      </div>
      <div className="grid flex-1 content-start gap-5 overflow-auto p-5">
        {isOverdue(t) && (
          <Notice tone="danger" icon={LuClock}>
            {"Overdue since "}
            {formatDue(t.due)}.
          </Notice>
        )}
        {t.desc && <p className="text-[13.5px] leading-relaxed">{t.desc}</p>}
        {t.link && (
          <button
            onClick={() => {
              t.link.k === "page";
              return nav.go(t.link.id);
            }}
            className="hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-2.5 text-left"
          >
            <IconTile icon={LuLink2} tone="primary" size="sm" />
            <span className="flex-1 text-[13px] font-medium">
              {"Linked: "}
              {t.link.label}
            </span>
            <LuArrowRight className="text-muted-foreground size-4" />
          </button>
        )}
        <div className="grid gap-1.5">
          <span className="text-muted-foreground text-[12.5px] font-medium">
            {"Checklist \xB7 "}
            {t.sub.filter((d) => d[1]).length}/{t.sub.length}
          </span>
          {t.sub.map((d, u) => (
            <button
              onClick={() => {
                d[1] = !d[1];
                refresh();
              }}
              className="hover:bg-muted/50 flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left text-[13.5px]"
              key={u}
            >
              {d[1] ? (
                <LuCircleCheck className="text-success size-[18px]" />
              ) : (
                <LuCircle className="text-muted-foreground size-[18px]" />
              )}
              <span className={d[1] ? "text-muted-foreground line-through" : ""}>{d[0]}</span>
            </button>
          ))}
          <form
            className="flex gap-2"
            onSubmit={(d) => {
              d.preventDefault();
              if (o.trim()) {
                t.sub.push([o.trim(), false]);
                n("");
                refresh();
              }
            }}
          >
            <Input
              className="h-8"
              value={o}
              onChange={(d) => n(d.target.value)}
              placeholder="Add a checklist item"
            />
            <Button size="sm" variant="outline" type="submit">
              <LuPlus />
              Add
            </Button>
          </form>
        </div>
        <div className="grid gap-2">
          <span className="text-muted-foreground text-[12.5px] font-medium">Comments</span>
          {l.map(([d, u, s], m) => (
            <div className="flex gap-2.5" key={m}>
              <Avatar name={d} photo={personPhoto(d)} size={28} />
              <div className="bg-muted/60 grid flex-1 gap-0.5 rounded-2xl rounded-tl-md px-3 py-2">
                <span className="text-[12px]">
                  <b className="font-semibold">{d}</b>{" "}
                  <span className="text-muted-foreground">
                    {"\xB7 "}
                    {u}
                  </span>
                </span>
                <span className="text-[13px]">{s}</span>
              </div>
            </div>
          ))}
          <form
            className="flex gap-2"
            onSubmit={(d) => {
              d.preventDefault();
              if (r.trim()) {
                l.push([currentAdmin.name, "Just now", r.trim()]);
                t.comments = l.length;
                i("");
                refresh();
              }
            }}
          >
            <Input
              value={r}
              onChange={(d) => i(d.target.value)}
              placeholder="Write a comment, @ to mention"
            />
            <Button type="submit">
              <LuSend />
            </Button>
          </form>
        </div>
        {t.log.length > 0 && (
          <div className="grid gap-1">
            <span className="text-muted-foreground text-[12.5px] font-medium">History</span>
            {t.log.map((d, u) => (
              <span className="text-muted-foreground text-[12.5px]" key={u}>
                <b className="text-foreground font-medium">{d[0]}</b> {d[1]}
                {" \xB7 "}
                {d[2]}
              </span>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
