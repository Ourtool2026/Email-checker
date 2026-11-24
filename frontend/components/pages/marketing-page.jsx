"use client";

import { useState } from "react";
import {
  LuCalendar,
  LuChartLine,
  LuFacebook,
  LuInstagram,
  LuLink2,
  LuLinkedin,
  LuListChecks,
  LuMegaphone,
  LuMusic2,
  LuPiggyBank,
  LuSend,
  LuSparkles,
  LuTarget,
  LuTrophy,
  LuUsers,
  LuYoutube,
} from "react-icons/lu";
import { BarList } from "@/components/charts";
import { KpiTile } from "@/components/shared/kpi-tile";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreRing } from "@/components/shared/score-ring";
import { ContentCalendar } from "@/components/teams/content-calendar";
import { SectionTabs } from "@/components/teams/shared";
import { TeamBoard } from "@/components/teams/team-board";
import { UtmBuilder } from "@/components/teams/utm-builder";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { users } from "@/lib/data/core";
import {
  ambassadors,
  channelSpend,
  contentCalendar,
  okrs,
  tasks,
  teamMembers,
} from "@/lib/data/teams";
import { num, taka } from "@/lib/format";
import { logAudit } from "@/lib/store";

export const socialIcons = {
  Facebook: [LuFacebook, "#1877F2"],
  Instagram: [LuInstagram, "#E1306C"],
  TikTok: [LuMusic2, "#111827"],
  YouTube: [LuYoutube, "#FF0000"],
  LinkedIn: [LuLinkedin, "#0A66C2"],
};

export const postStatusTones = {
  Published: "success",
  Scheduled: "primary",
  Draft: "warning",
  Idea: "neutral",
};

export function MarketingPage({ nav }) {
  let [a, e] = useState("overview");
  let r = channelSpend.reduce((o, n) => o + n[1], 0);
  let i = channelSpend.reduce((o, n) => o + n[4], 0);
  return (
    <>
      <PageHeader
        title="Marketing"
        desc="Growth team workspace: work, content, channels, campus ambassadors and goals."
        badge={
          <span className="flex -space-x-1.5">
            {teamMembers.marketing.map((o) => (
              <Avatar name={o[0]} photo={o[2]} size={26} ring key={o[0]} />
            ))}
          </span>
        }
      >
        <Button variant="outline" onClick={() => nav.go("campaigns")}>
          <LuMegaphone />
          {"Campaigns & push"}
        </Button>
      </PageHeader>
      <SectionTabs
        value={a}
        onChange={e}
        items={[
          {
            value: "overview",
            label: "Overview",
            icon: LuChartLine,
          },
          {
            value: "tasks",
            label: "Tasks",
            icon: LuListChecks,
            count: tasks.filter((o) => o.team === "marketing" && o.status !== "Done").length,
          },
          {
            value: "calendar",
            label: "Content calendar",
            icon: LuCalendar,
          },
          {
            value: "channels",
            label: "Channels",
            icon: LuTarget,
          },
          {
            value: "ambassadors",
            label: "Ambassadors",
            icon: LuTrophy,
          },
          {
            value: "goals",
            label: "Goals",
            icon: LuSparkles,
          },
          {
            value: "links",
            label: "Link builder",
            icon: LuLink2,
          },
        ]}
      />
      {a === "overview" && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KpiTile
              label="Verified sign-ups from marketing"
              value={num(i)}
              delta={18.2}
              icon={LuUsers}
              tone="primary"
            />
            <KpiTile
              label="Cost per verified sign-up"
              value={taka(r / i)}
              delta={-12.7}
              invert
              icon={LuPiggyBank}
              tone="success"
            />
            <KpiTile
              label="Posts published (Nov)"
              value={contentCalendar.filter((o) => o.st === "Published").length}
              delta={22}
              icon={LuMegaphone}
              tone="pink"
            />
            <KpiTile
              label="Ambassador sign-ups"
              value={num(ambassadors.reduce((o, n) => o + n[2], 0))}
              delta={31}
              icon={LuTrophy}
              tone="violet"
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Card icon={LuTarget} title="Verified sign-ups by channel" description="November">
              <BarList items={channelSpend.map((o) => [o[0], o[4]])} tone="pink" />
            </Card>
            <Card icon={LuCalendar} title="Coming up" flush>
              <div className="divide-y">
                {contentCalendar
                  .filter((o) => o.st !== "Published")
                  .map((o) => {
                    let [Icon, l] = socialIcons[o.ch];
                    return (
                      <div className="flex items-center gap-3 px-4 py-2.5" key={o.id}>
                        <span
                          className="flex size-8 items-center justify-center rounded-lg text-white"
                          style={{
                            background: l,
                          }}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="grid flex-1 leading-tight">
                          <span className="text-[13px] font-medium">{o.t}</span>
                          <span className="text-muted-foreground text-[11.5px]">
                            {o.d}
                            {" Nov \xB7 "}
                            {o.who}
                          </span>
                        </span>
                        <Badge tone={postStatusTones[o.st]}>{o.st}</Badge>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        </>
      )}
      {a === "tasks" && <TeamBoard team="marketing" nav={nav} />}
      {a === "calendar" && <ContentCalendar />}
      {a === "channels" && (
        <Card
          flush
          icon={LuTarget}
          title="Channels · November"
          description="Money in Taka. Cost per verified sign-up is what matters, not clicks."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Sign-ups</TableHead>
                <TableHead className="text-right">Verified</TableHead>
                <TableHead className="text-right">Cost / verified</TableHead>
                <TableHead>Verified rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelSpend
                .slice()
                .sort((o, n) => o[1] / o[4] - n[1] / n[4])
                .map(([o, n, l, d, u]) => (
                  <TableRow key={o}>
                    <TableCell className="font-medium">{o}</TableCell>
                    <TableCell className="text-right tabular-nums">{taka(n)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {l ? num(l) : "\u2014"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{num(d)}</TableCell>
                    <TableCell className="text-right tabular-nums">{num(u)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {taka(n / u)}
                    </TableCell>
                    <TableCell>
                      <div className="flex w-32 items-center gap-2">
                        <Progress
                          value={(u / d) * 100}
                          tone={u / d > 0.85 /* .85 */ ? "success" : "warning"}
                        />
                        <span className="text-[12px] tabular-nums">
                          {Math.round((u / d) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="text-muted-foreground border-t px-5 py-2.5 text-[12.5px]">
            Sorted cheapest first. Ambassadors and campus events bring the most real students for
            the money.
          </div>
        </Card>
      )}
      {a === "ambassadors" && (
        <Card
          flush
          icon={LuTrophy}
          title="Campus ambassadors"
          description="Paid per verified sign-up: ৳30 Bronze, ৳40 Silver, ৳50 Gold"
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                logAudit("Sent payout list", "Ambassadors", "November");
                toast("Payout list sent to Finance for approval");
              }}
            >
              <LuSend />
              Send payouts to Finance
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Ambassador</TableHead>
                <TableHead>University</TableHead>
                <TableHead className="text-right">Sign-ups</TableHead>
                <TableHead className="text-right">Verified</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Payout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ambassadors.map(([o, n, l, d, u], s) => (
                <TableRow key={o}>
                  <TableCell className="text-muted-foreground tabular-nums">{s + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={o} photo={users.find((m) => m.name === o)?.photo} size={26} />
                      {o}
                    </div>
                  </TableCell>
                  <TableCell>{n}</TableCell>
                  <TableCell className="text-right tabular-nums">{l}</TableCell>
                  <TableCell className="text-right tabular-nums">{d}</TableCell>
                  <TableCell>
                    <Badge
                      tone={u === "Gold" ? "warning" : u === "Silver" ? "primary" : "neutral"}
                      dot={false}
                    >
                      {u}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {taka(d * (u === "Gold" ? 50 : u === "Silver" ? 40 : 30))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {a === "goals" && (
        <div className="grid gap-4 xl:grid-cols-2">
          {okrs.map((o) => {
            let n = (o.krs.reduce((l, d) => l + Math.min(1, d[1] / d[2]), 0) / o.krs.length) * 100;
            return (
              <Card
                icon={LuSparkles}
                title={o.o}
                description="Q4 2026"
                actions={<ScoreRing value={Math.round(n)} size={40} stroke={4} />}
                key={o.o}
              >
                <div className="grid gap-3">
                  {o.krs.map(([l, d, u]) => (
                    <div className="grid gap-1.5" key={l}>
                      <div className="flex justify-between text-[13px]">
                        <span>{l}</span>
                        <span className="tabular-nums">
                          <b className="font-semibold">{num(d)}</b>{" "}
                          <span className="text-muted-foreground">
                            {"/ "}
                            {num(u)}
                          </span>
                        </span>
                      </div>
                      <Progress
                        value={(d / u) * 100}
                        tone={
                          d / u >= 0.7 /* .7 */
                            ? "success"
                            : d / u >= 0.5 /* .5 */
                              ? "primary"
                              : "warning"
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {a === "links" && <UtmBuilder />}
    </>
  );
}
