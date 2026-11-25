"use client"

import * as React from "react"
import {
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/*
 * Confirmations and result screens, available anywhere through hooks:
 *
 *   const confirm = useConfirm()
 *   if (await confirm({ title: "Delete 3 campaigns?", tone: "danger", confirmLabel: "Delete" })) …
 *
 *   // irreversible: make them type a phrase (pattern from 21st.dev @cnippet-dev/v-form-12)
 *   await confirm({ title: "Delete list?", tone: "danger", typeToConfirm: "Newsletter subscribers" })
 *
 *   // async work with a spinner in the button; the dialog closes when it resolves
 *   await confirm({ title: "Send now?", onConfirm: () => api.send() })
 *
 *   const result = useResult()
 *   result({ tone: "success", title: "Campaign scheduled", description: "…", action: { label: "View", onClick } })
 *
 * Rule of thumb: reversible actions get an Undo toast instead of a confirm; confirm what
 * spends money, sends mail, or deletes data; type-to-confirm only for the irreversible.
 */

type Tone = "default" | "danger" | "warning" | "success"

export type ConfirmOptions = {
  title: React.ReactNode
  description?: React.ReactNode
  /** Extra content under the description: a summary list, a checkbox. */
  details?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: Tone
  icon?: LucideIcon
  /** The user must type this exact text to enable the confirm button. */
  typeToConfirm?: string
  /** Async work to run on confirm; shows a spinner and keeps the dialog open until it settles. */
  onConfirm?: () => Promise<unknown> | unknown
}

export type ResultOptions = {
  title: React.ReactNode
  description?: React.ReactNode
  tone?: "success" | "danger" | "default"
  icon?: LucideIcon
  action?: { label: string; onClick: () => void }
  closeLabel?: string
}

type Ctx = {
  confirm: (o: ConfirmOptions) => Promise<boolean>
  result: (o: ResultOptions) => void
}

const ConfirmContext = React.createContext<Ctx | null>(null)

export function useConfirm() {
  const ctx = React.useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirm needs <ConfirmProvider>")
  return ctx.confirm
}

export function useResult() {
  const ctx = React.useContext(ConfirmContext)
  if (!ctx) throw new Error("useResult needs <ConfirmProvider>")
  return ctx.result
}

const TONE: Record<
  Tone,
  { media: string; icon: LucideIcon; button: "default" | "destructive" }
> = {
  default: {
    media: "bg-primary/10 text-primary",
    icon: Info,
    button: "default",
  },
  danger: {
    media: "bg-destructive/10 text-destructive",
    icon: Trash2,
    button: "destructive",
  },
  warning: {
    media: "bg-warning/12 text-warning",
    icon: TriangleAlert,
    button: "default",
  },
  success: {
    media: "bg-success/10 text-success",
    icon: CircleCheck,
    button: "default",
  },
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<
    | { kind: "confirm"; o: ConfirmOptions; resolve: (v: boolean) => void }
    | { kind: "result"; o: ResultOptions }
    | null
  >(null)
  const [open, setOpen] = React.useState(false)
  const [typed, setTyped] = React.useState("")
  const [busy, setBusy] = React.useState(false)

  const ctx = React.useMemo<Ctx>(
    () => ({
      confirm: (o) =>
        new Promise<boolean>((resolve) => {
          setTyped("")
          setBusy(false)
          setState({ kind: "confirm", o, resolve })
          setOpen(true)
        }),
      result: (o) => {
        setState({ kind: "result", o })
        setOpen(true)
      },
    }),
    []
  )

  const close = (ok: boolean) => {
    if (state?.kind === "confirm") state.resolve(ok)
    setOpen(false)
  }

  const run = async () => {
    if (state?.kind !== "confirm") return
    if (state.o.onConfirm) {
      setBusy(true)
      try {
        await state.o.onConfirm()
      } finally {
        setBusy(false)
      }
    }
    close(true)
  }

  const c = state?.kind === "confirm" ? state.o : null
  const r = state?.kind === "result" ? state.o : null
  const tone: Tone = c
    ? (c.tone ?? "default")
    : r?.tone === "danger"
      ? "danger"
      : r?.tone === "success"
        ? "success"
        : "default"
  const Icon = (c?.icon ??
    r?.icon ??
    (r?.tone === "danger" ? CircleAlert : TONE[tone].icon)) as LucideIcon
  const locked = !!c?.typeToConfirm && typed.trim() !== c.typeToConfirm

  return (
    <ConfirmContext.Provider value={ctx}>
      {children}
      <AlertDialog
        open={open}
        onOpenChange={(o) => !o && !busy && close(false)}
      >
        <AlertDialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[420px]">
          <div
            className={cn(
              "flex flex-col gap-4 px-6 pt-6 pb-5",
              r && "items-center text-center"
            )}
          >
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full",
                TONE[tone].media,
                r && "size-14"
              )}
            >
              <Icon className={r ? "size-7" : "size-5"} />
            </span>
            <div className="grid gap-1.5">
              <AlertDialogTitle className="text-[17px] leading-snug font-semibold tracking-tight">
                {c?.title ?? r?.title}
              </AlertDialogTitle>
              {(c?.description ?? r?.description) && (
                <AlertDialogDescription className="text-[13.5px] leading-relaxed text-muted-foreground">
                  {c?.description ?? r?.description}
                </AlertDialogDescription>
              )}
            </div>
            {c?.details}
            {c?.typeToConfirm && (
              <label className="grid gap-1.5 text-[13px]">
                <span className="text-muted-foreground">
                  Type{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
                    {c.typeToConfirm}
                  </code>{" "}
                  to confirm
                </span>
                <Input
                  autoFocus
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !locked && run()}
                  placeholder={c.typeToConfirm}
                  aria-label={`Type ${c.typeToConfirm} to confirm`}
                />
              </label>
            )}
          </div>
          <div
            className={cn(
              "flex flex-col-reverse gap-2 border-t bg-muted/50 px-6 py-3.5 sm:flex-row sm:justify-end",
              r && "sm:justify-center"
            )}
          >
            {c && (
              <>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => close(false)}
                >
                  {c.cancelLabel ?? "Cancel"}
                </Button>
                <Button
                  variant={TONE[tone].button}
                  disabled={locked || busy}
                  onClick={run}
                  autoFocus={!c.typeToConfirm}
                >
                  {busy && <Loader2 className="animate-spin" />}
                  {c.confirmLabel ?? "Confirm"}
                </Button>
              </>
            )}
            {r && (
              <>
                <Button
                  variant={r.action ? "outline" : "default"}
                  onClick={() => close(false)}
                >
                  {r.closeLabel ?? (r.action ? "Close" : "Done")}
                </Button>
                {r.action && (
                  <Button
                    onClick={() => {
                      close(false)
                      r.action!.onClick()
                    }}
                  >
                    {r.action.label}
                  </Button>
                )}
              </>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}
