"use client";

import { useState } from "react";
import { LuCheck, LuDatabase, LuLock, LuPalette } from "react-icons/lu";
import { Notice } from "@/components/shared/notice";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { logAudit } from "@/lib/store";

export function SettingsPage({ nav }) {
  let [a, e] = useState({
    tfa: true,
    timeout: "30",
    ip: false,
    visitors: "30",
    reports: "2",
    audit: "7",
    stays: "Until account is deleted",
  });
  return (
    <>
      <PageHeader title="Settings" desc="Security for HQ and how long each kind of data is kept.">
        <Button variant="outline" onClick={() => nav?.customize?.()}>
          <LuPalette />
          Customize look
        </Button>
        <Button
          onClick={() => {
            logAudit("Changed settings", "HQ", "Security and data rules");
            toast("Settings saved");
          }}
        >
          <LuCheck />
          Save
        </Button>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card icon={LuLock} title="HQ security">
          <div className="grid gap-3.5">
            {[
              [
                "tfa",
                "Two-step sign-in for every admin",
                "Required. Admins without it can\u2019t open HQ.",
              ],
              ["ip", "Only from the office network", "Block HQ outside the office and VPN"],
            ].map(([r, i, o]) => (
              <div className="flex items-start gap-3" key={r}>
                <span className="grid flex-1 leading-snug">
                  <span className="text-[13.5px] font-medium">{i}</span>
                  <span className="text-muted-foreground text-[12.5px]">{o}</span>
                </span>
                <Switch
                  checked={a[r]}
                  onChange={(n) =>
                    e({
                      ...a,
                      [r]: n,
                    })
                  }
                  label={i}
                />
              </div>
            ))}
            <Field label="Sign out after (minutes idle)">
              <Select
                value={a.timeout}
                onChange={(r) =>
                  e({
                    ...a,
                    timeout: r.target.value,
                  })
                }
              >
                {["15", "30", "60"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>
        <Card icon={LuDatabase} title="How long data is kept">
          <div className="grid gap-3">
            {[
              ["visitors", "Hostel visitor logs", "days", ["30", "60", "90"]],
              ["reports", "Reports without a police case", "years", ["1", "2", "3"]],
              ["audit", "HQ audit log", "years", ["5", "7", "10"]],
            ].map(([r, i, o, n]) => (
              <div className="flex items-center gap-3" key={r}>
                <span className="flex-1 text-[13.5px]">{i}</span>
                <Select
                  className="w-[130px]"
                  value={a[r]}
                  onChange={(l) =>
                    e({
                      ...a,
                      [r]: l.target.value,
                    })
                  }
                >
                  {n.map((l) => (
                    <option value={l} key={l}>
                      {l} {o}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
            <Notice>
              NID images are deleted 30 days after a check passes. Only the result is kept.
            </Notice>
          </div>
        </Card>
      </div>
    </>
  );
}
