import { notFound } from "next/navigation"
import { HQPage } from "@/components/shell/hq-page"
import { isPageId, pageIds } from "@/lib/routes"

export const dynamicParams = false

export function generateStaticParams() {
  return pageIds.map((page) => ({ page }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  if (!isPageId(page)) notFound()
  return <HQPage id={page} />
}
