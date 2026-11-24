"use client";

import { useState } from "react";
import { LuBell, LuMail, LuMessageSquare, LuPencil, LuSend, LuSmartphone } from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Textarea } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { approvals, currentAdmin, messageTemplates } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

const channelIcons = {
  SMS: LuMessageSquare,
  Push: LuBell,
  Email: LuMail,
};

export function TemplatesPage() {
  let [t, a] = useState(messageTemplates[0].id);
  let [e, r] = useState("en");
  let i = messageTemplates.find((u) => u.id === t);
  let o = {
    code: "482915",
    first_name: "Nusrat",
    hostel: "Uttara Scholars Hostel",
    seat: "B-12",
    date: "1 Dec",
    type: "Repeated rule breaking",
    days: "14",
    agency: "Mirpur Model Police Station",
    fields: "name, Living ID",
    amount: "\u09F31,500",
  };
  let n = (u) => u.replace(/\{(\w+)\}/g, (s, m) => o[m] || m);
  let d =
    e === "bn"
      ? {
          otp: "\u0986\u09AA\u09A8\u09BE\u09B0 MyStay ID \u0995\u09CB\u09A1 {code}\u0964 \u0995\u09BE\u0989\u0995\u09C7 \u09AC\u09B2\u09AC\u09C7\u09A8 \u09A8\u09BE\u0964",
          verified:
            "{first_name}, \u0986\u09AA\u09A8\u09BE\u09B0 Living ID \u09AF\u09BE\u099A\u09BE\u0987 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964",
          seat: "{hostel} \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09BF\u099F {seat} \u09B0\u09C7\u0996\u09C7\u099B\u09C7\u0964 {date} \u09A4\u09BE\u09B0\u09BF\u0996\u09C7 \u0989\u09A0\u09AC\u09C7\u09A8\u0964",
          report:
            "\u098F\u0995\u099F\u09BF \u09B9\u09CB\u09B8\u09CD\u099F\u09C7\u09B2 \u201C{type}\u201D \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F \u0995\u09B0\u09C7\u099B\u09C7\u0964 {days} \u09A6\u09BF\u09A8\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09BF\u09A8\u0964",
        }[i.id] || ""
      : i.body;
  return (
    <>
      <PageHeader
        title="Message templates"
        desc="Every SMS, push and email the apps send, with variables and both languages. Edits go live after a second admin approves."
      />
      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card flush>
          <div className="divide-y">
            {messageTemplates.map((u) => {
              let s = u.id === t;
              let m = channelIcons[u.ch.split(" ")[0]];
              return (
                <button
                  onClick={() => a(u.id)}
                  className={cn(
                    "relative flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50",
                    s && "bg-primary/[0.05]",
                  )}
                  key={u.id}
                >
                  {s && (
                    <span className="bg-primary absolute inset-y-2 left-0 w-[3px] rounded-r-full" />
                  )}
                  <IconTile icon={m} tone="primary" size="sm" />
                  <span className="grid flex-1 leading-tight">
                    <span className="text-[13.5px] font-medium">{u.name}</span>
                    <span className="text-muted-foreground text-[12px]">
                      {u.ch}
                      {" \xB7 "}
                      {u.sent}
                    </span>
                  </span>
                  {u.status !== "Live" && (
                    <Badge tone="warning" dot={false}>
                      {u.status}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
        <Card
          icon={LuPencil}
          title={i.name}
          description={`${i.ch} \xB7 ${i.lang}`}
          actions={
            <Tabs
              size="sm"
              value={e}
              onChange={r}
              items={[
                {
                  value: "en",
                  label: "English",
                },
                {
                  value: "bn",
                  label: "\u09AC\u09BE\u0982\u09B2\u09BE",
                },
              ]}
            />
          }
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="grid content-start gap-3">
              <Field label="Text" hint={i.ch === "SMS" ? `${d.length}/160 characters` : undefined}>
                <Textarea
                  rows={4}
                  value={d}
                  onChange={(u) => {
                    if (e === "en") {
                      i.body = u.target.value;
                      refresh();
                    }
                  }}
                  placeholder={e === "bn" ? "Bangla text not written yet" : ""}
                />
              </Field>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground text-[12.5px]">Variables:</span>
                {i.vars.map((u) => (
                  <button
                    onClick={() => {
                      i.body += ` {${u}}`;
                      refresh();
                    }}
                    className="bg-primary/[0.08] text-primary rounded-md px-1.5 py-0.5 font-mono text-[12px] hover:bg-primary/15"
                    key={u}
                  >{`{${u}}`}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    approvals.unshift({
                      id: "ap" + Date.now(),
                      action: "Publish template",
                      target: i.name,
                      by: currentAdmin.name,
                      reason: "Text change",
                      when: "Just now",
                      status: "waiting",
                      link: "templates",
                    });
                    logAudit("Asked to publish template", i.name, e);
                    refresh();
                    toast("Sent for a second approval");
                  }}
                >
                  <LuSend />
                  Publish…
                </Button>
                <Button variant="outline" onClick={() => toast("Test sent to your phone")}>
                  <LuSmartphone />
                  Send me a test
                </Button>
              </div>
            </div>
            <div className="grid content-start gap-2">
              <span className="text-muted-foreground text-[12.5px] font-medium">
                Preview with sample data
              </span>
              <div className="rounded-[26px] bg-gradient-to-b from-slate-700 to-slate-900 p-3 pt-9">
                <div className="rounded-2xl bg-white/92 p-3 text-gray-900">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="size-4 rounded bg-gradient-to-b from-[#2CB8FF] to-[#2B6BFF]" />
                    {i.ch.startsWith("SMS") ? "MyStayID" : "MyStay ID"}
                    {" \xB7 now"}
                  </div>
                  <div className="mt-1 text-[12.5px] leading-snug">
                    {d ? n(d) : <span className="text-gray-400 italic">No text</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
