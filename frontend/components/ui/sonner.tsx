"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // pointer-events: an open modal turns them off on <body>, which would leave Undo unclickable
          toast: "!pointer-events-auto !shadow-float !gap-2.5 !px-4 !py-3",
          title: "!text-[13.5px] !font-medium",
          description: "!text-muted-foreground !text-[12.5px]",
          icon: "[&_svg]:!size-[18px]",
          success: "[&_[data-icon]]:!text-success",
          error: "[&_[data-icon]]:!text-destructive",
          warning: "[&_[data-icon]]:!text-warning",
          info: "[&_[data-icon]]:!text-primary",
          actionButton:
            "!bg-foreground !text-background !rounded-lg !h-7 !px-2.5 !font-medium",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
