"use client";

import { useState } from "react";
import { LuCopy, LuLock } from "react-icons/lu";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminTeam, auditLog } from "@/lib/data/core";
import { copyText } from "@/lib/store";

export function AuditPage() {
  let [t, a] = useState("");
  let [e, r] = useState("all");
  let i = auditLog.filter(
    (o) =>
      (e === "all" || o.by === e) &&
      (!t || (o.act + o.target + o.why).toLowerCase().includes(t.toLowerCase())),
  );
  return (
    <>
      <PageHeader
        title="Audit log"
        desc="Every action taken in HQ, with who, when and why. Nobody can edit or delete it, including super admins."
      >
        <Button
          variant="outline"
          onClick={() =>
            copyText(
              i.map((o) => [o.when, o.by, o.act, o.target, o.why].join(",")).join(`
  `),
              "Audit log copied as CSV. This copy is logged too.",
            )
          }
        >
          <LuCopy />
          Copy as CSV
        </Button>
      </PageHeader>
      <Card flush>
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <SearchInput
            value={t}
            onChange={a}
            placeholder="Action, person, hostel or reason"
            className="w-full sm:w-80"
          />
          <Select className="h-8 w-[170px]" value={e} onChange={(o) => r(o.target.value)}>
            <option value="all">All admins</option>
            {adminTeam.map((o) => (
              <option key={o.name}>{o.name}</option>
            ))}
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>On</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {i.map((o) => {
              let n = adminTeam.find((l) => l.name === o.by);
              return (
                <TableRow key={o.id}>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {o.when}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Avatar name={o.by} photo={n?.photo} size={24} />
                      {o.by}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{o.act}</TableCell>
                  <TableCell>{o.target}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[280px]">{o.why}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="text-muted-foreground flex items-center gap-2 border-t px-5 py-2.5 text-[12.5px]">
          <LuLock className="size-3.5" />
          {"Kept for 7 years \xB7 "}
          {i.length}
          {" entries shown"}
        </div>
      </Card>
    </>
  );
}
