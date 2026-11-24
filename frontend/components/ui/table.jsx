"use client";

import { cn } from "@/lib/utils";

export const Table = ({ children, className }) => (
  <div className="relative w-full overflow-x-auto">
    <table className={cn("w-full caption-bottom text-sm", className)}>{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className={"[&_tr]:border-b"}>{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className={"[&_tr:last-child]:border-0"}>{children}</tbody>
);

export const TableRow = ({ children, className, ...props }) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-muted/50",
      props.onClick && "cursor-pointer",
      className,
    )}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className }) => (
  <th
    className={cn(
      "h-10 px-3 text-left align-middle text-[12.5px] font-medium whitespace-nowrap text-muted-foreground first:pl-5 last:pr-5",
      className,
    )}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className, ...props }) => (
  <td className={cn("px-3 py-2.5 align-middle first:pl-5 last:pr-5", className)} {...props}>
    {children}
  </td>
);
