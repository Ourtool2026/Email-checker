"use client";

import { useState } from "react";
import { LuCalendar, LuPlus } from "react-icons/lu";
import { postStatusTones, socialIcons } from "@/components/pages/marketing-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { contentCalendar } from "@/lib/data/teams";
import { refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ContentCalendar() {
  let [t, a] = useState(null);
  let e = new Date(Date.UTC(2026, 10, 1)).getUTCDay();
  let r = Array.from(
    {
      length: 35,
    },
    (i, o) => o - e + 1,
  );
  return (
    <>
      <Card
        icon={LuCalendar}
        title="November 2026"
        description="Drag-free view: click a post to open it"
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden flex-wrap gap-2 text-[12px] md:flex">
              {Object.entries(postStatusTones).map(([i, o]) => (
                <Badge tone={o} key={i}>
                  {i}
                </Badge>
              ))}
            </div>
            <Button size="sm" onClick={() => toast("New post drafted for 29 Nov")}>
              <LuPlus />
              New post
            </Button>
          </div>
        }
        flush
      >
        <div className="grid grid-cols-7 border-b text-center text-[12px] font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((i) => (
            <div className="py-2" key={i}>
              {i}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {r.map((i, o) => {
            let n = i >= 1 && i <= 30;
            let l = contentCalendar.filter((d) => d.d === i);
            return (
              <div
                className={cn(
                  "min-h-[104px] border-r border-b p-1.5 [&:nth-child(7n)]:border-r-0",
                  !n && "bg-muted/30",
                  i === 23 && "bg-primary/[0.04]",
                )}
                key={o}
              >
                {n && (
                  <>
                    <div
                      className={cn(
                        "mb-1 flex size-6 items-center justify-center rounded-full text-[12px] font-medium",
                        i === 23 ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      {i}
                    </div>
                    <div className="grid gap-1">
                      {l.map((d) => {
                        let [Icon, s] = socialIcons[d.ch];
                        return (
                          <button
                            onClick={() => a(d)}
                            className={cn(
                              "flex items-center gap-1.5 truncate rounded-md border px-1.5 py-1 text-left text-[11.5px] hover:border-ring/40",
                              d.st === "Published" && "opacity-70",
                            )}
                            style={{
                              borderLeft: `3px solid ${s}`,
                            }}
                            key={d.id}
                          >
                            <Icon
                              className="size-3 shrink-0"
                              style={{
                                color: s,
                              }}
                            />
                            <span className="truncate">{d.t}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      <Dialog
        open={!!t}
        onClose={() => a(null)}
        title={t?.t}
        description={t && `${t.ch} \xB7 ${t.d} Nov \xB7 ${t.who}`}
        footer={
          <>
            <Button variant="outline" onClick={() => a(null)}>
              Close
            </Button>
            {t?.st !== "Published" && (
              <Button
                onClick={() => {
                  t.st = "Scheduled";
                  a(null);
                  refresh();
                  toast("Scheduled");
                }}
              >
                <LuCalendar />
                Schedule
              </Button>
            )}
          </>
        }
      >
        {t && (
          <>
            <Badge tone={postStatusTones[t.st]}>{t.st}</Badge>
            <Field label="Caption">
              <Textarea
                rows={3}
                defaultValue={`${t.t}. Get your Living ID in the MyStay ID app.`}
              />
            </Field>
          </>
        )}
      </Dialog>
    </>
  );
}
