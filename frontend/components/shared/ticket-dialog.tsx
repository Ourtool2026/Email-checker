"use client"

import { useEffect, useState } from "react"
import { EyeIcon, LockIcon } from "lucide-react"
import { Button } from "@/components/hq/button"
import { Dialog } from "@/components/hq/dialog"
import { Field, Input, Select } from "@/components/hq/input"
import { toast } from "@/components/hq/toast"
import { logAudit, refresh } from "@/lib/store"

export let openTicketDialog: (request: {
  label?: string
  target?: string
  done?: () => void
}) => void = () => {}

export function TicketDialog() {
  const [t, a] = useState(null)
  const [e, r] = useState("Support ticket")
  const [i, o] = useState("")
  useEffect(() => {
    openTicketDialog = (n) => {
      a(n)
      r("Support ticket")
      o("")
    }
  }, [])
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
              logAudit(
                `Viewed ${t.label.toLowerCase()}`,
                t.target,
                `${e}: ${i}`
              )
              t.done()
              a(null)
              refresh()
              toast("Shown for this session. Logged.", LockIcon)
            }}
          >
            <EyeIcon />
            Show
          </Button>
        </>
      }
    >
      <Field label="Reason">
        <Select value={e} onChange={(n) => r(n.target.value)}>
          {[
            "Support ticket",
            "Safety case",
            "Police request",
            "Verification check",
          ].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </Select>
      </Field>
      <Field label="Ticket, case or request number">
        <Input
          value={i}
          onChange={(n) => o(n.target.value)}
          placeholder="e.g. T-2291"
        />
      </Field>
    </Dialog>
  ) : null
}
