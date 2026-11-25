import { ClientShell } from "@/components/shell/client-shell"

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>
}
