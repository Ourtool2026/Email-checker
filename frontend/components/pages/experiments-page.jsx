"use client";

import { LuCheck, LuFlaskConical, LuPause, LuPlus, LuTrophy } from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";
import { toast } from "@/components/ui/toast";
import { experiments } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ExperimentsPage() {
  let t = {
    Running: "primary",
    "Shipped B": "success",
    Stopped: "neutral",
  };
  return (
    <>
      <PageHeader
        title="Experiments"
        desc="Try two versions of a screen or message with real users and keep the one that works. We ship only at 95% confidence or more."
      >
        <Button onClick={() => toast("New experiment: pick a feature switch and a goal")}>
          <LuPlus />
          New experiment
        </Button>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        {experiments.map((a) => {
          let e = a.b[1] > a.a[1];
          let r = ((a.b[1] - a.a[1]) / a.a[1]) * 100;
          return (
            <div className="bg-card grid gap-4 rounded-2xl border p-5 shadow-card" key={a.id}>
              <div className="flex items-start gap-3">
                <IconTile icon={LuFlaskConical} tone="violet" />
                <div className="grid flex-1 leading-tight">
                  <span className="text-[14.5px] font-semibold">{a.name}</span>
                  <span className="text-muted-foreground text-[12.5px]">
                    {a.id}
                    {" \xB7 "}
                    {a.app}
                    {" \xB7 "}
                    {a.days}
                    {" days \xB7 split "}
                    {a.split}
                  </span>
                </div>
                <Badge tone={t[a.status]}>{a.status}</Badge>
              </div>
              <div className="text-muted-foreground text-[12.5px]">
                {"Goal: "}
                <span className="text-foreground font-medium">{a.metric}</span>
              </div>
              <div className="grid gap-2">
                {[
                  ["A", a.a, false],
                  ["B", a.b, true],
                ].map(([i, [o, n], l]) => {
                  let d = l === e;
                  return (
                    <div className="grid gap-1" key={i}>
                      <div className="flex justify-between text-[13px]">
                        <span>
                          <b className="font-semibold">{i}</b>
                          {" \xB7 "}
                          {o}
                          {d && a.conf >= 95 && (
                            <LuTrophy className="ml-1.5 inline size-3.5 text-amber-500" />
                          )}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {n}
                          {a.metric.includes("per") ? "" : "%"}
                        </span>
                      </div>
                      <div className="bg-track h-2 overflow-hidden rounded-full">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            d ? "bg-primary" : "bg-muted-foreground/40",
                          )}
                          style={{
                            width: Math.min(100, (n / Math.max(a.a[1], a.b[1])) * 100) + "%",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-[12.5px]">
                <span className="flex items-center gap-2">
                  <span
                    className={cn("font-semibold", r > 0 ? "text-success" : "text-destructive")}
                  >
                    {r > 0 ? "+" : ""}
                    {r.toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">
                    {"\xB7 confidence "}
                    {a.conf}%
                  </span>
                </span>
                {a.status === "Running" && (
                  <div className="flex gap-1.5">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        a.status = "Stopped";
                        logAudit("Stopped experiment", a.id, a.name);
                        refresh();
                      }}
                    >
                      <LuPause />
                      Stop
                    </Button>
                    <Button
                      size="xs"
                      disabled={a.conf < 95}
                      onClick={() => {
                        a.status = "Shipped B";
                        logAudit("Shipped experiment", a.id, "B");
                        refresh();
                        toast("B is now the default for everyone");
                      }}
                    >
                      <LuCheck />
                      Ship B
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
