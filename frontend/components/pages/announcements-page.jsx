"use client";

import { useState } from "react";
import {
  LuBell,
  LuCheck,
  LuCircleCheck,
  LuEye,
  LuMegaphone,
  LuMessageSquare,
  LuPartyPopper,
  LuPin,
  LuSend,
  LuThumbsUp,
} from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { adminTeam, currentAdmin } from "@/lib/data/core";
import { announcements } from "@/lib/data/ops";
import { allMembers, memberPhoto } from "@/lib/data/teams";
import { logAudit, refresh } from "@/lib/store";

export const photoOf = (t) => adminTeam.find((a) => a.name === t)?.photo || memberPhoto(t) || null;

export function AnnouncementsPage() {
  let [t, a] = useState("");
  let [e, r] = useState("");
  let [i, o] = useState("Everyone");
  let [n, l] = useState(false);
  let [d, u] = useState(true);
  let [s, m] = useState({});
  let [f, h] = useState(null);
  let B = adminTeam.length + allMembers.length;
  return (
    <>
      <PageHeader
        title="Announcements"
        desc="Company news for the team. Ask people to confirm they have read important ones."
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid content-start gap-4">
          {announcements
            .slice()
            .sort((y, W) => W.pin - y.pin)
            .map((y) => (
              <article className="bg-card grid gap-3 rounded-2xl border p-5 shadow-card" key={y.id}>
                <div className="flex items-center gap-3">
                  <Avatar name={y.by} photo={photoOf(y.by)} size={38} />
                  <div className="grid flex-1 leading-tight">
                    <span className="text-[13.5px] font-semibold">{y.by}</span>
                    <span className="text-muted-foreground text-[12px]">
                      {y.when}
                      {" \xB7 to "}
                      {y.aud}
                    </span>
                  </div>
                  {y.pin && <Tag icon={LuPin}>Pinned</Tag>}
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight">{y.title}</h3>
                <p className="text-[13.5px] leading-relaxed">{y.body}</p>
                {y.ack && (
                  <div className="bg-muted/60 flex items-center gap-3 rounded-xl border px-3 py-2">
                    <LuEye className="text-muted-foreground size-4" />
                    <button className="flex -space-x-1.5" onClick={() => h(y)}>
                      {y.reads.slice(0, 8).map((W) => (
                        <Avatar name={W} photo={photoOf(W)} size={22} ring key={W} />
                      ))}
                    </button>
                    <span className="flex-1 text-[12.5px]">
                      <b className="font-semibold">{y.reads.length}</b>
                      {" of "}
                      {B}
                      {" confirmed"}
                    </span>
                    <Progress value={(y.reads.length / B) * 100} className="w-24" />
                    {!y.reads.includes(currentAdmin.name) && y.by !== currentAdmin.name && (
                      <Button
                        size="xs"
                        onClick={() => {
                          y.reads.push(currentAdmin.name);
                          refresh();
                        }}
                      >
                        <LuCheck />
                        I&apos;ve read it
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      y.likes++;
                      refresh();
                    }}
                  >
                    <LuThumbsUp />
                    {y.likes}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      y.cheers++;
                      refresh();
                    }}
                  >
                    <LuPartyPopper />
                    {y.cheers}
                  </Button>
                  <span className="text-muted-foreground ml-1 flex items-center gap-1 text-[12.5px]">
                    <LuMessageSquare className="size-3.5" />
                    {y.comments.length}
                  </span>
                  {y.by === currentAdmin.name && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto"
                      onClick={() => {
                        y.pin = !y.pin;
                        refresh();
                      }}
                    >
                      <LuPin />
                      {y.pin ? "Unpin" : "Pin"}
                    </Button>
                  )}
                </div>
                {y.comments.map(([W, x], k) => (
                  <div className="flex gap-2.5" key={k}>
                    <Avatar name={W} photo={photoOf(W)} size={26} />
                    <div className="bg-muted/60 rounded-2xl rounded-tl-md px-3 py-2 text-[13px]">
                      <b className="font-semibold">{W}</b> {x}
                    </div>
                  </div>
                ))}
                <form
                  className="flex gap-2"
                  onSubmit={(W) => {
                    W.preventDefault();
                    if (s[y.id]?.trim()) {
                      y.comments.push([currentAdmin.name, s[y.id].trim()]);
                      m({
                        ...s,
                        [y.id]: "",
                      });
                      refresh();
                    }
                  }}
                >
                  <Input
                    className="h-8"
                    value={s[y.id] || ""}
                    onChange={(W) =>
                      m({
                        ...s,
                        [y.id]: W.target.value,
                      })
                    }
                    placeholder="Write a comment"
                  />
                  <Button size="sm" type="submit" variant="outline">
                    <LuSend />
                  </Button>
                </form>
              </article>
            ))}
        </div>
        <Card
          icon={LuMegaphone}
          title="New announcement"
          className="xl:sticky xl:top-20 xl:self-start"
        >
          <form
            className="grid gap-3"
            onSubmit={(y) => {
              y.preventDefault();
              if (t.trim()) {
                announcements.unshift({
                  id: "an" + Date.now(),
                  by: currentAdmin.name,
                  title: t,
                  body: e,
                  aud: i,
                  pin: n,
                  ack: d,
                  reads: [currentAdmin.name],
                  likes: 0,
                  cheers: 0,
                  comments: [],
                  when: "Just now",
                });
                a("");
                r("");
                logAudit("Posted announcement", t, i);
                refresh();
                toast("Posted. The team gets a notification.", LuMegaphone);
              }
            }}
          >
            <Field label="Title">
              <Input value={t} onChange={(y) => a(y.target.value)} placeholder="What's happening" />
            </Field>
            <Field label="Message">
              <Textarea rows={5} value={e} onChange={(y) => r(y.target.value)} />
            </Field>
            <Field label="Who sees it">
              <Select value={i} onChange={(y) => o(y.target.value)}>
                {[
                  "Everyone",
                  "Leadership",
                  "Trust & Safety",
                  "Operations",
                  "Marketing",
                  "Finance",
                  "Engineering",
                ].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </Select>
            </Field>
            <label className="flex items-center justify-between text-[13.5px]">
              Ask people to confirm they&apos;ve read it
              <Switch checked={d} onChange={u} label="Ask to confirm" />
            </label>
            <label className="flex items-center justify-between text-[13.5px]">
              Pin to top
              <Switch checked={n} onChange={l} label="Pin" />
            </label>
            <Button type="submit">
              <LuSend />
              Post
            </Button>
          </form>
        </Card>
      </div>
      {f && (
        <Dialog
          open
          onClose={() => h(null)}
          title="Who has confirmed"
          footer={
            <Button
              onClick={() => {
                toast(`Reminder sent to ${B - f.reads.length} people`);
                h(null);
              }}
            >
              <LuBell />
              Remind the rest
            </Button>
          }
        >
          <div className="grid gap-1.5">
            {f.reads.map((y) => (
              <div className="flex items-center gap-2.5 text-[13.5px]" key={y}>
                <Avatar name={y} photo={photoOf(y)} size={26} />
                {y}
                <LuCircleCheck className="text-success ml-auto size-4" />
              </div>
            ))}
          </div>
        </Dialog>
      )}
    </>
  );
}
