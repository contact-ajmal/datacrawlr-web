"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search } from "lucide-react"

import { Wordmark } from "@/components/brand/Wordmark"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LiveSearchInput } from "@/components/search/LiveSearchInput"
import { Kbd } from "@/components/shared/Kbd"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useScrollY } from "@/hooks/use-scroll-y"
import { useCommandPalette } from "@/lib/stores/command-palette"
import { cn } from "@/lib/utils"

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Explore", href: "/explore" },
  { label: "Models", href: "/models" },
  { label: "About", href: "/about" },
]

const PERSONAL_LINKS: { label: string; href: string }[] = [
  { label: "Saved", href: "/saved" },
  { label: "Recent", href: "/history" },
]

export function TopBar() {
  const scrollY = useScrollY()
  const elevated = scrollY > 80
  const openPalette = useCommandPalette((s) => s.open)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        "bg-base/80 border-subtle sticky top-0 z-50 h-[52px] border-b backdrop-blur-md transition-[backdrop-filter,box-shadow] duration-200 md:h-14",
        elevated &&
          "backdrop-blur-lg shadow-[0_1px_0_0_rgba(94,234,212,0.05)]"
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

        <div className="hidden max-w-md flex-1 justify-center md:flex">
          <LiveSearchInput size="md" placeholder="Search datasets…" />
        </div>

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
          <div className="mx-2 h-5 w-px bg-[var(--border-subtle)]" />
          <ThemeToggle />
          <SignInButton />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
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
                  Datacrawlr navigation
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 p-5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    openPalette()
                  }}
                  className="bg-elevated border-subtle text-tertiary hover:border-strong inline-flex h-10 w-full items-center gap-2 rounded-md border px-3 text-body transition-colors"
                >
                  <Search className="size-4" aria-hidden="true" />
                  <span>Search datasets…</span>
                  <Kbd className="ml-auto">⌘K</Kbd>
                </button>
                <div className="my-2 h-px w-full bg-[var(--border-subtle)]" />
                <nav className="flex flex-col">
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
                </nav>
                <div className="my-2 h-px w-full bg-[var(--border-subtle)]" />
                <div className="text-tertiary text-micro mb-1 px-2 font-mono uppercase tracking-wider">
                  Personal
                </div>
                <nav className="flex flex-col">
                  {PERSONAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-secondary hover:text-primary text-body rounded-md px-2 py-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="my-2 h-px w-full bg-[var(--border-subtle)]" />
                <SignInButton fullWidth />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function SignInButton({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className={fullWidth ? "block" : ""}>
          <Button
            variant="ghost"
            size="sm"
            disabled
            aria-disabled="true"
            className={fullWidth ? "w-full" : ""}
          >
            Sign in
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Coming soon</TooltipContent>
    </Tooltip>
  )
}
