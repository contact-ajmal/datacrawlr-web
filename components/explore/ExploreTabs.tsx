"use client"

import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

export type ExploreTab =
  | "overview"
  | "modalities"
  | "ml-tasks"
  | "sources"
  | "licenses"
  | "freshness"
  | "models"

interface TabDef {
  value: ExploreTab
  label: string
}

const TABS: TabDef[] = [
  { value: "overview", label: "Overview" },
  { value: "modalities", label: "Modalities" },
  { value: "ml-tasks", label: "ML Tasks" },
  { value: "sources", label: "Sources" },
  { value: "licenses", label: "Licenses" },
  { value: "freshness", label: "Freshness" },
  { value: "models", label: "Models" },
]

export interface ExploreTabsProps {
  overview: ReactNode
  modalities?: ReactNode
  mlTasks?: ReactNode
  sources?: ReactNode
  licenses?: ReactNode
  freshness?: ReactNode
  models?: ReactNode
}

export function ExploreTabs({
  overview,
  modalities,
  mlTasks,
  sources,
  licenses,
  freshness,
  models,
}: ExploreTabsProps) {
  const [active, setActive] = useState<ExploreTab>("overview")

  const slots: Record<ExploreTab, ReactNode> = {
    overview,
    modalities: modalities ?? <ComingSoon name="Modalities" />,
    "ml-tasks": mlTasks ?? <ComingSoon name="ML Tasks" />,
    sources: sources ?? <ComingSoon name="Sources" />,
    licenses: licenses ?? <ComingSoon name="Licenses" />,
    freshness: freshness ?? <ComingSoon name="Freshness" />,
    models: models ?? <ComingSoon name="Models" />,
  }

  return (
    <>
      <div
        className="bg-base/90 border-subtle sticky top-14 z-30 -mx-6 border-b backdrop-blur-md"
        role="tablist"
        aria-label="Explore sections"
      >
        <div className="mx-auto flex h-12 max-w-7xl items-end gap-1 overflow-x-auto px-6">
          {TABS.map((tab) => {
            const isActive = active === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.value)}
                className={cn(
                  "relative h-12 shrink-0 px-4 text-caption font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                )}
              >
                {tab.label}
                {isActive ? (
                  <motion.span
                    layoutId="active-explore-tab-underline"
                    className="bg-accent absolute bottom-0 left-0 right-0 h-[2px]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pt-12"
        >
          {slots[active]}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="border-subtle bg-elevated/40 mx-auto max-w-2xl rounded-xl border p-12 text-center">
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        Up next
      </p>
      <h3 className="text-h4 mt-3 font-semibold">{name} lens</h3>
      <p className="text-secondary text-body mt-2">
        We&apos;re building this view. Check back shortly.
      </p>
    </div>
  )
}
