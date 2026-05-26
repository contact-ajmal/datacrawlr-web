"use client"

import { usePathname } from "next/navigation"

import { TopBar } from "@/components/layout/TopBar"
import { MarketingNav } from "@/components/marketing/MarketingNav"

/**
 * Switches between the product `TopBar` and the marketing `MarketingNav`
 * based on the current route. Keeps the chrome decision in a single
 * client component so the root layout stays a server component and can
 * cache cleanly. The list of marketing roots is intentionally explicit;
 * unknown routes default to the product TopBar so we never accidentally
 * ship the marketing chrome over a product surface.
 */
const MARKETING_ROOTS = ["/features", "/product/", "/about"] as const

export function SiteNav() {
  const pathname = usePathname() ?? "/"
  const isMarketing =
    pathname === "/" ||
    MARKETING_ROOTS.some((p) => pathname.startsWith(p))
  return isMarketing ? <MarketingNav /> : <TopBar />
}
