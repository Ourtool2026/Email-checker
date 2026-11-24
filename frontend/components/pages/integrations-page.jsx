"use client";

import { useState } from "react";
import {
  LuActivity,
  LuBell,
  LuBug,
  LuCog,
  LuCopy,
  LuCreditCard,
  LuHash,
  LuIdCard,
  LuKeyRound,
  LuMap,
  LuMessageSquare,
  LuPlug,
  LuPlus,
  LuRefreshCw,
  LuSend,
  LuTrash2,
  LuWebhook,
} from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Badge, Tag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { IconTile } from "@/components/ui/icon-tile";
import { Field, Input, Select } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { apiKeys, currentAdmin, integrations, webhooks } from "@/lib/data/core";
import { copyText, logAudit, refresh } from "@/lib/store";

const integrationIcons = {
  id: LuIdCard,
  bell: LuBell,
  sms: LuMessageSquare,
  pay: LuCreditCard,
  map: LuMap,
  chat: LuHash,
  bug: LuBug,
};

export function IntegrationsPage() {
  let [t, a] = useState("apps");
  let [e, r] = useState(false);
  let [i, o] = useState(null);
  let [n, l] = useState("Partner: NSU student check");
  return (
    <>
      <PageHeader
        title={"Integrations & API"}
        desc="Outside services MyStay relies on, API keys for our apps and partners, and webhooks."
      >
        <Tabs
          value={t}
          onChange={a}
          items={[
            {
              value: "apps",
              label: "Services",
              icon: LuPlug,
            },
            {
              value: "keys",
              label: "API keys",
              icon: LuKeyRound,
            },
            {
              value: "hooks",
              label: "Webhooks",
              icon: LuWebhook,
            },
          ]}
        />
      </PageHeader>
      {t === "apps" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((d) => {
            let u = integrationIcons[d.icon];
            let s =
              d.status === "Connected"
                ? "success"
                : d.status === "Degraded"
                  ? "warning"
                  : "neutral";
            return (
              <div className="bg-card grid gap-3 rounded-2xl border p-4 shadow-card" key={d.name}>
                <div className="flex items-start gap-3">
                  <IconTile
                    icon={u}
                    tone={d.status === "Not connected" ? "neutral" : "primary"}
                    size="lg"
                  />
                  <div className="grid min-w-0 flex-1 leading-tight">
                    <span className="text-[14px] font-semibold">{d.name}</span>
                    <span className="text-muted-foreground text-[12.5px]">{d.what}</span>
                  </div>
                  <Badge tone={s}>{d.status}</Badge>
                </div>
                <div className="text-muted-foreground flex justify-between border-t pt-3 text-[12.5px]">
                  <span>{d.calls}</span>
                  <span>
                    {"Last call "}
                    {d.last}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {d.status === "Not connected" ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        d.status = "Connected";
                        d.last = "Just now";
                        logAudit("Connected service", d.name, "\u2014");
                        refresh();
                        toast(`${d.name} connected`);
                      }}
                    >
                      <LuPlug />
                      Connect
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast(`Test call to ${d.name}: OK in 212 ms`)}
                      >
                        <LuActivity />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast("Settings are kept in the secrets vault")}
                      >
                        <LuCog />
                        Settings
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {t === "keys" && (
        <Card
          flush
          icon={LuKeyRound}
          title="API keys"
          description="Keys are shown once. Each key has a scope and is logged when used."
          actions={
            <Button size="sm" onClick={() => r(true)}>
              <LuPlus />
              New key
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((d, u) => (
                <TableRow key={d.name}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="font-mono text-[12.5px]">{d.key}</TableCell>
                  <TableCell>
                    <Tag>{d.scope}</Tag>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.created}
                    {" \xB7 "}
                    {d.by}
                  </TableCell>
                  <TableCell>{d.last}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Tooltip label="Rotate">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Rotate key"
                          onClick={() => {
                            logAudit("Rotated API key", d.name, "\u2014");
                            toast("New key made. Old key works for 24 more hours.");
                          }}
                        >
                          <LuRefreshCw />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Revoke">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Revoke key"
                          onClick={() => {
                            apiKeys.splice(u, 1);
                            logAudit("Revoked API key", d.name, "\u2014");
                            refresh();
                            toast("Key revoked");
                          }}
                        >
                          <LuTrash2 />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {t === "hooks" && (
        <Card
          flush
          icon={LuWebhook}
          title="Webhooks"
          actions={
            <Button size="sm" variant="outline" onClick={() => toast("Add a URL and pick events")}>
              <LuPlus />
              Add webhook
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead>Last</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((d) => (
                <TableRow key={d.url}>
                  <TableCell className="max-w-[320px] truncate font-mono text-[12.5px]">
                    {d.url}
                  </TableCell>
                  <TableCell className="text-[12.5px]">{d.events}</TableCell>
                  <TableCell className="text-right tabular-nums">{d.ok}%</TableCell>
                  <TableCell>{d.last}</TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => toast("Test event sent \xB7 200 OK")}
                    >
                      <LuSend />
                      Send test
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      <Dialog
        open={e}
        onClose={() => {
          r(false);
          o(null);
        }}
        title={i ? "Copy your key now" : "New API key"}
        description={
          i
            ? "You won\u2019t see it again. Store it in the partner\u2019s secret manager."
            : "Give partners the smallest scope that works."
        }
        footer={
          i ? (
            <Button
              onClick={() => {
                r(false);
                o(null);
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => r(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  let d =
                    "msk_live_" +
                    Math.random().toString(36).slice(2, 10) +
                    Math.random().toString(36).slice(2, 10);
                  o(d);
                  apiKeys.push({
                    name: n,
                    key:
                      d.slice(0, 9) +
                      "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" +
                      d.slice(-4),
                    scope: "Partner: student check only",
                    created: "23 Nov 2026",
                    last: "Never",
                    by: currentAdmin.name,
                  });
                  logAudit("Created API key", n, "Partner scope");
                  refresh();
                }}
              >
                <LuKeyRound />
                Create key
              </Button>
            </>
          )
        }
      >
        {i ? (
          <div className="bg-muted/60 flex items-center gap-2 rounded-xl border p-3">
            <code className="flex-1 font-mono text-[13px] break-all">{i}</code>
            <Button size="sm" variant="outline" onClick={() => copyText(i, "Key copied")}>
              <LuCopy />
              Copy
            </Button>
          </div>
        ) : (
          <>
            <Field label="Name">
              <Input value={n} onChange={(d) => l(d.target.value)} />
            </Field>
            <Field label="Scope">
              <Select>
                <option>Partner: student check only</option>
                <option>Business API (one hostel)</option>
                <option>Read-only analytics</option>
              </Select>
            </Field>
            <Field label="Expires">
              <Select>
                <option>In 90 days</option>
                <option>In 1 year</option>
                <option>Never (not recommended)</option>
              </Select>
            </Field>
          </>
        )}
      </Dialog>
    </>
  );
}
