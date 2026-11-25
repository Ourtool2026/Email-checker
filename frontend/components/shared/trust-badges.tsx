"use client"

import {
  GraduationCapIcon,
  ScanFaceIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react"
import { Tooltip } from "@/components/hq/tooltip"
import { cn } from "@/lib/utils"

export function TrustBadges({ u, size = "sm" }: { u?: any; size?: any }) {
  const e = [
    [u.nid, ShieldCheckIcon, "NID verified", "success"],
    [u.face, ScanFaceIcon, "Face matched", "success"],
    [
      u.type === "student" && u.student,
      GraduationCapIcon,
      "Student ID confirmed",
      "primary",
    ],
    [u.guardian, UserCheckIcon, "Guardian confirmed", "violet"],
  ]
  return (
    <div className="flex gap-1">
      {e
        .filter((r) => r[0] !== false || r[2] === "NID verified")
        .map(([r, Icon, o, n]) => (
          <Tooltip
            label={
              r
                ? o
                : o
                    .replace("verified", "not verified")
                    .replace("matched", "not checked")
            }
            key={o}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-lg",
                size === "sm" ? "size-7" : "size-8",
                r
                  ? n === "success"
                    ? "bg-success/10 text-success"
                    : n === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-violet/10 text-violet"
                  : "bg-muted text-muted-foreground/60"
              )}
            >
              <Icon className="size-4" />
            </span>
          </Tooltip>
        ))}
    </div>
  )
}
