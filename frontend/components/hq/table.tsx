import * as React from "react"

import {
  Table as UITable,
  TableBody as UITableBody,
  TableCell as UITableCell,
  TableHead as UITableHead,
  TableHeader as UITableHeader,
  TableRow as UITableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* shadcn/ui table with the studio spacing: 20px edge padding, 13.5px cells. */
export const Table = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => <UITable className={cn("text-[13.5px]", className)}>{children}</UITable>

export const TableHeader = ({ children }: { children?: React.ReactNode }) => (
  <UITableHeader>{children}</UITableHeader>
)

export const TableBody = ({ children }: { children?: React.ReactNode }) => (
  <UITableBody>{children}</UITableBody>
)

export const TableRow = ({
  className,
  ...props
}: React.ComponentProps<typeof UITableRow>) => (
  <UITableRow
    className={cn(props.onClick && "cursor-pointer", className)}
    {...props}
  />
)

export const TableHead = ({
  className,
  ...props
}: React.ComponentProps<typeof UITableHead>) => (
  <UITableHead
    className={cn(
      "px-3 text-[12.5px] text-muted-foreground first:pl-5 last:pr-5",
      className
    )}
    {...props}
  />
)

export const TableCell = ({
  className,
  ...props
}: React.ComponentProps<typeof UITableCell>) => (
  <UITableCell
    className={cn("px-3 py-2.5 first:pl-5 last:pr-5", className)}
    {...props}
  />
)
