"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  Bookmark,
  Clock,
  Compass,
  Database,
  History,
  Layers,
  Moon,
  Search,
  Sun,
  Trophy,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Kbd } from "@/components/shared/Kbd"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { getTrendingDatasets } from "@/lib/data"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import { useCommandPalette } from "@/lib/stores/command-palette"
import {
  getRecentSearches,
  pushRecentSearch,
} from "@/lib/storage/recent-searches"
import type { Dataset } from "@/lib/types"

export function CommandPalette() {
  const isOpen = useCommandPalette((s) => s.isOpen)
  const close = useCommandPalette((s) => s.close)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [search, setSearch] = useState("")
  const [recent, setRecent] = useState<string[]>([])
  const [trending, setTrending] = useState<Dataset[]>([])

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setRecent(getRecentSearches())
    }
  }, [isOpen])

  useEffect(() => {
    let active = true
    getTrendingDatasets(4)
      .then((rows) => {
        if (active) setTrending(rows)
      })
      .catch(() => {
        if (active) setTrending([])
      })
    return () => {
      active = false
    }
  }, [])

  const isDark = resolvedTheme === "dark"

  const navigate = (path: string) => {
    close()
    router.push(path)
  }

  const runSearch = (query: string) => {
    const q = query.trim()
    if (!q) return
    pushRecentSearch(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
    close()
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) close()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="bg-overlay border-strong fixed left-1/2 top-[20vh] z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-xl border shadow-[0_0_60px_rgba(94,234,212,0.08)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="sr-only">
            Command palette
          </DialogPrimitive.Title>
          <Command
            shouldFilter={false}
            className="bg-transparent text-primary"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault()
                close()
              }
            }}
          >
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search datasets, jump to a page, or run a command…"
              className="text-lead h-14 placeholder:text-tertiary"
            />
            <CommandList className="max-h-[60vh]">
              <CommandEmpty className="text-tertiary text-caption px-4 py-6 text-center">
                No matching results.
              </CommandEmpty>

              {search.trim() && (
                <CommandGroup>
                  <CommandItem
                    value={`search-action-${search}`}
                    onSelect={() => runSearch(search)}
                    className="data-[selected=true]:bg-elevated data-[selected=true]:text-primary text-primary"
                  >
                    <Search className="text-accent size-4" />
                    <span className="text-body">
                      Search for{" "}
                      <span className="text-accent">&ldquo;{search}&rdquo;</span>
                    </span>
                  </CommandItem>
                </CommandGroup>
              )}

              <CommandGroup
                heading="Suggestions"
                className="text-tertiary [&_[cmdk-group-heading]]:text-tertiary [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-micro [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
              >
                {trending.map((ds) => {
                  const Icon = MODALITY_ICONS[ds.modality]
                  return (
                    <CommandItem
                      key={ds.id}
                      value={`dataset-${ds.slug}`}
                      onSelect={() => navigate(`/datasets/${ds.slug}`)}
                      className="data-[selected=true]:bg-elevated text-primary items-start gap-3"
                    >
                      <Icon className="text-accent mt-0.5 size-4 shrink-0" />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-body truncate">{ds.name}</span>
                        <span className="text-tertiary text-caption truncate">
                          {ds.description}
                        </span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              <CommandGroup
                heading="Quick actions"
                className="text-tertiary [&_[cmdk-group-heading]]:text-tertiary [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-micro [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
              >
                <CommandItem
                  value="open-explore"
                  onSelect={() => navigate("/explore")}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  <Compass className="text-accent size-4" />
                  <span>Open Explore</span>
                </CommandItem>
                <CommandItem
                  value="browse-models"
                  onSelect={() => navigate("/models")}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  <Layers className="text-accent size-4" />
                  <span>Browse Models</span>
                </CommandItem>
                <CommandItem
                  value="open-leaderboard"
                  onSelect={() => navigate("/models?sort=composite_score")}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  <Trophy className="text-accent size-4" />
                  <span>Open Leaderboard</span>
                </CommandItem>
                <CommandItem
                  value="toggle-theme"
                  onSelect={toggleTheme}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  {isDark ? (
                    <Sun className="text-accent size-4" />
                  ) : (
                    <Moon className="text-accent size-4" />
                  )}
                  <span>Switch to {isDark ? "light" : "dark"} mode</span>
                </CommandItem>
                <CommandItem
                  value="view-all-datasets"
                  onSelect={() => navigate("/search")}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  <Database className="text-accent size-4" />
                  <span>View all datasets</span>
                </CommandItem>
                <CommandItem
                  value="open-saved"
                  onSelect={() => navigate("/saved")}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  <Bookmark className="text-accent size-4" />
                  <span>Saved datasets</span>
                </CommandItem>
                <CommandItem
                  value="open-history"
                  onSelect={() => navigate("/history")}
                  className="data-[selected=true]:bg-elevated text-primary"
                >
                  <History className="text-accent size-4" />
                  <span>Recently viewed</span>
                </CommandItem>
              </CommandGroup>

              {recent.length > 0 && (
                <CommandGroup
                  heading="Recent"
                  className="text-tertiary [&_[cmdk-group-heading]]:text-tertiary [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-micro [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
                >
                  {recent.map((q) => (
                    <CommandItem
                      key={q}
                      value={`recent-${q}`}
                      onSelect={() =>
                        navigate(`/search?q=${encodeURIComponent(q)}`)
                      }
                      className="data-[selected=true]:bg-elevated text-primary"
                    >
                      <Clock className="text-tertiary size-4" />
                      <span>{q}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            {search.trim() && (
              <div className="border-subtle text-tertiary text-caption flex items-center justify-between gap-2 border-t px-4 py-2">
                <span className="truncate">
                  Press{" "}
                  <Kbd className="bg-elevated">↵</Kbd>{" "}
                  to search for: &ldquo;
                  <span className="text-secondary">{search}</span>
                  &rdquo;
                </span>
                <span className="hidden items-center gap-1 sm:inline-flex">
                  <Kbd className="bg-elevated">Esc</Kbd> to close
                </span>
              </div>
            )}
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
