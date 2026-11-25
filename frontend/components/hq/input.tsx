import * as React from "react"

import { Input as UIInput } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea as UITextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function Input({
  className,
  ...props
}: React.ComponentProps<typeof UIInput>) {
  return <UIInput className={cn("bg-card", className)} {...props} />
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof UITextarea>) {
  return <UITextarea className={cn("bg-card", className)} {...props} />
}

/** Native select that fills its slot (sized by `className` on the wrapper). */
export function Select({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"select">, "size">) {
  return (
    <div
      className={cn(
        "relative [&>[data-slot=native-select-wrapper]]:w-full",
        className
      )}
    >
      <NativeSelect className="bg-card" {...props}>
        {children}
      </NativeSelect>
    </div>
  )
}

/** A labelled form row: label, control, optional hint. */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-[12.5px] font-medium text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-[12px] text-muted-foreground">{hint}</span>
      )}
    </label>
  )
}
