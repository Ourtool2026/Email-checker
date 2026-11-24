"use client";

import { useState } from "react";
import {
  LuBookOpen,
  LuClipboardList,
  LuFileText,
  LuFlag,
  LuLanguages,
  LuPencil,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import { Notice } from "@/components/shared/notice";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
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
import { contentPolicies } from "@/lib/data/core";
import { refresh } from "@/lib/store";

export function ContentPage() {
  let [t, a] = useState("reports");
  let [e, r] = useState("en");
  let [i, o] = useState("");
  return (
    <>
      <PageHeader
        title={"Content & policies"}
        desc="Text and rules both apps share: report types, house-rule templates, help articles and terms."
      >
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
      </PageHeader>
      <Tabs
        value={t}
        onChange={a}
        className="mb-4"
        items={[
          {
            value: "reports",
            label: "Report types",
            icon: LuFlag,
          },
          {
            value: "rules",
            label: "House-rule templates",
            icon: LuClipboardList,
          },
          {
            value: "help",
            label: "Help articles",
            icon: LuBookOpen,
          },
          {
            value: "terms",
            label: "Terms & privacy",
            icon: LuFileText,
          },
        ]}
      />
      {e === "bn" && (
        <Notice tone="warning" className="mb-4" icon={LuLanguages}>
          Bangla text is being translated. 18 of 42 items are done.
        </Notice>
      )}
      {t === "reports" && (
        <Card flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Proof needed</TableHead>
                <TableHead>Kept for</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentPolicies.reports.map((n, l) => (
                <TableRow key={l}>
                  <TableCell className="font-medium">{n[0]}</TableCell>
                  <TableCell>{n[1]}</TableCell>
                  <TableCell className="text-muted-foreground">{n[2]}</TableCell>
                  <TableCell>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => toast("Editing opens a draft. Changes need a second admin.")}
                    >
                      <LuPencil />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-muted-foreground border-t px-5 py-2.5 text-[12.5px]">
            Hostels can only pick from these types. Free-text reports are not allowed.
          </div>
        </Card>
      )}
      {t === "rules" && (
        <Card title="Templates hostels can add with one tap" icon={LuClipboardList}>
          <div className="grid gap-2">
            {contentPolicies.rules.map((n, l) => (
              <div
                className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[13.5px]"
                key={l}
              >
                <span className="flex-1">{n}</span>
                <span className="text-muted-foreground text-[12px]">
                  {"used by "}
                  {120 - l * 14}
                  {" hostels"}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Remove"
                  onClick={() => {
                    contentPolicies.rules.splice(l, 1);
                    refresh();
                  }}
                >
                  <LuTrash2 />
                </Button>
              </div>
            ))}
            <form
              className="flex gap-2"
              onSubmit={(n) => {
                n.preventDefault();
                if (i.trim()) {
                  contentPolicies.rules.push(i.trim());
                  o("");
                  refresh();
                  toast("Template added");
                }
              }}
            >
              <Input
                value={i}
                onChange={(n) => o(n.target.value)}
                placeholder="Add a template rule"
              />
              <Button type="submit" variant="outline">
                <LuPlus />
                Add
              </Button>
            </form>
          </div>
        </Card>
      )}
      {t === "help" && (
        <Card flush>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Shown in</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentPolicies.help.map((n, l) => (
                <TableRow key={l}>
                  <TableCell className="font-medium">{n[0]}</TableCell>
                  <TableCell>{n[1]}</TableCell>
                  <TableCell>
                    <Badge tone={n[2] === "Published" ? "success" : "neutral"}>{n[2]}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{n[3]}</TableCell>
                  <TableCell>
                    <Button size="xs" variant="ghost" onClick={() => toast("Opening editor")}>
                      <LuPencil />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {t === "terms" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ["Terms of use", "v3 \xB7 1 Oct 2026", "Both apps"],
            ["Privacy policy", "v4 \xB7 1 Nov 2026", "Both apps"],
            ["Hostel partner terms", "v2 \xB7 15 Sep 2026", "Business web"],
            ["Law enforcement guidelines", "v1 \xB7 1 Nov 2026", "Public page"],
          ].map(([n, l, d]) => (
            <div
              className="bg-card flex items-center gap-3 rounded-2xl border p-4 shadow-card"
              key={n}
            >
              <IconTile icon={LuFileText} tone="primary" />
              <span className="grid flex-1 leading-tight">
                <span className="text-[14px] font-semibold">{n}</span>
                <span className="text-muted-foreground text-[12.5px]">
                  {l}
                  {" \xB7 "}
                  {d}
                </span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast("New version drafts need legal sign-off")}
              >
                <LuPencil />
                New version
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
