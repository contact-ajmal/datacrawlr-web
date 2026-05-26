"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Wordmark } from "@/components/brand/Wordmark"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useScrollY } from "@/hooks/use-scroll-y"
import { cn } from "@/lib/utils"

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Datasets", href: "/product/datasets" },
  { label: "Models", href: "/product/models" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
]

/**
 * Top chrome on the marketing site. Replaces the product TopBar on
 * marketing routes via `SiteNav` in `app/layout.tsx`. Sticky, blurred
 * when scrolled, with the same Wordmark + colors as the product so
 * the surfaces don't feel like two different sites.
 */
export function MarketingNav() {
  const scrollY = useScrollY()
  const elevated = scrollY > 20
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        "border-subtle sticky top-0 z-50 h-14 border-b backdrop-blur-md transition-[background-color,backdrop-filter,box-shadow] duration-200",
        elevated
          ? "bg-base/85 shadow-[0_1px_0_0_rgba(94,234,212,0.05)]"
          : "bg-base/60"
      )}
    >
      <a
        href="#main"
        className="bg-accent text-base sr-only z-50 rounded-md px-3 py-2 text-caption font-medium focus:not-sr-only focus:absolute focus:left-4 focus:top-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          aria-label="Datacrawlr home"
          className="flex shrink-0 items-center"
        >
          <Wordmark size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-secondary hover:text-primary text-caption rounded-md px-3 py-1.5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">Why Datacrawlr</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/explore">Open app →</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-base border-subtle w-72 border-l p-0"
            >
              <SheetHeader className="border-subtle border-b p-5">
                <SheetTitle asChild>
                  <Wordmark size="md" />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Marketing navigation
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-secondary hover:text-primary text-body rounded-md px-2 py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 h-px w-full bg-[var(--border-subtle)]" />
                <Button asChild className="w-full">
                  <Link href="/explore" onClick={() => setMobileOpen(false)}>
                    Open app →
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
