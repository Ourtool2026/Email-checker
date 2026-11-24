"use client";

import { useState } from "react";
import { LuCheck, LuKeyRound, LuLock, LuLogOut, LuSend, LuUserPlus, LuUsers } from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { adminRoles, adminSessions, adminTeam, permissionMatrix } from "@/lib/data/core";
import { logAudit, refresh } from "@/lib/store";

export function TeamPage() {
  let [t, a] = useState(false);
  let e = {
    "Super admin": "primary",
    "Trust & safety": "warning",
    Operations: "teal",
    Support: "indigo",
    Growth: "pink",
    "Legal officer": "violet",
  };
  return (
    <>
      <PageHeader
        title="Admin team"
        desc="Who works in HQ and what each role can do. Every admin needs two-step sign-in."
      >
        <Button onClick={() => a(true)}>
          <LuUserPlus />
          Invite admin
        </Button>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card icon={LuUsers} title="Team" flush>
          <div className="divide-y">
            {adminTeam.map((r) => (
              <div className="flex items-center gap-3 px-4 py-3" key={r.name}>
                <Avatar name={r.name} photo={r.photo} size={38} />
                <span className="grid flex-1 leading-tight">
                  <span className="text-[13.5px] font-medium">
                    {r.name}
                    {r.me && <span className="text-muted-foreground font-normal">{" (you)"}</span>}
                  </span>
                  <span className="text-muted-foreground text-[12px]">
                    {"Active "}
                    {r.active.toLowerCase()}
                  </span>
                </span>
                {!r.tfa && (
                  <Tooltip label="Two-step sign-in not set up">
                    <span className="text-warning">
                      <LuKeyRound className="size-4" />
                    </span>
                  </Tooltip>
                )}
                <Badge tone={e[r.role]} dot={false}>
                  {r.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card icon={LuLock} title="What each role can do" flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                {adminRoles.map((r) => (
                  <TableHead className="text-center text-[11.5px] whitespace-normal" key={r}>
                    {r}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionMatrix.map(([r, i]) => (
                <TableRow key={r}>
                  <TableCell className="font-medium">{r}</TableCell>
                  {i.map((o, n) => (
                    <TableCell className="text-center" key={n}>
                      {o ? (
                        <span className="bg-success/10 text-success inline-flex size-6 items-center justify-center rounded-md">
                          <LuCheck className="size-3.5" />
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Card
        icon={LuKeyRound}
        title="Active admin sessions"
        description="Sign-ins to HQ in the last 24 hours"
        flush
        className="mt-4"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Where</TableHead>
              <TableHead>When</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminSessions.map((r, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={r.who}
                      photo={adminTeam.find((o) => o.name === r.who)?.photo}
                      size={24}
                    />
                    {r.who}
                  </div>
                </TableCell>
                <TableCell>{r.device}</TableCell>
                <TableCell className="font-mono text-[12.5px]">{r.ip}</TableCell>
                <TableCell>
                  {r.where}
                  {r.flag && (
                    <Badge tone="warning" className="ml-2">
                      {r.flag}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{r.when}</TableCell>
                <TableCell>
                  {r.current ? (
                    <Badge tone="success">This session</Badge>
                  ) : (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        adminSessions.splice(i, 1);
                        logAudit("Ended admin session", r.who, r.device);
                        refresh();
                        toast("Session ended");
                      }}
                    >
                      <LuLogOut />
                      End
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={t}
        onClose={() => a(false)}
        title="Invite an admin"
        description="They sign in with their work email and must set up two-step sign-in first."
        footer={
          <>
            <Button variant="outline" onClick={() => a(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                a(false);
                logAudit("Invited admin", "new admin", "Role: Support");
                toast("Invite sent");
              }}
            >
              <LuSend />
              Send invite
            </Button>
          </>
        }
      >
        <Field label="Work email">
          <Input placeholder="name@mystayid.com" />
        </Field>
        <Field label="Role">
          <Select>
            {adminRoles.slice(1).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
      </Dialog>
    </>
  );
}
