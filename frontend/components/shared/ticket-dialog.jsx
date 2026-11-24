"use client";

import { useEffect, useState } from "react";
import { LuEye, LuLock } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { logAudit, refresh } from "@/lib/store";

export let openTicketDialog = () => {};

export function TicketDialog() {
  let [t, a] = useState(null);
  let [e, r] = useState("Support ticket");
  let [i, o] = useState("");
  useEffect(() => {
    openTicketDialog = (n) => {
      a(n);
      r("Support ticket");
      o("");
    };
  }, []);
  return t ? (
    <Dialog
      open
      onClose={() => a(null)}
      title={`Show ${t.label.toLowerCase()}?`}
      description={`${t.target}'s ${t.label.toLowerCase()} is hidden by default. Your reason is saved in the audit log.`}
      footer={
        <>
          <Button variant="outline" onClick={() => a(null)}>
            Cancel
          </Button>
          <Button
            disabled={!i.trim()}
            onClick={() => {
              logAudit(`Viewed ${t.label.toLowerCase()}`, t.target, `${e}: ${i}`);
              t.done();
              a(null);
              refresh();
              toast("Shown for this session. Logged.", LuLock);
            }}
          >
            <LuEye />
            Show
          </Button>
        </>
      }
    >
      <Field label="Reason">
        <Select value={e} onChange={(n) => r(n.target.value)}>
          {["Support ticket", "Safety case", "Police request", "Verification check"].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </Select>
      </Field>
      <Field label="Ticket, case or request number">
        <Input value={i} onChange={(n) => o(n.target.value)} placeholder="e.g. T-2291" />
      </Field>
    </Dialog>
  ) : null;
}
