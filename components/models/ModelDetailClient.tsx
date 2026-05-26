"use client"

import { type ReactNode, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

export type ModelTab =
  | "overview"
  | "benchmarks"
  | "pricing"
  | "training-data"
  | "provenance"
  | "discussion"

interface ModelDetailClientProps {
  rail: ReactNode
  slots: {
    overview: ReactNode
    benchmarks: ReactNode
    pricing?: ReactNode
    trainingData: ReactNode
    provenance: ReactNode
    discussion: ReactNode
  }
}

interface TabDef {
  value: ModelTab
  label: string
}

export function ModelDetailClient({ rail, slots }: ModelDetailClientProps) {
  const [active, setActive] = useState<ModelTab>("overview")

  const tabs: TabDef[] = [
    { value: "overview", label: "Overview" },
    { value: "benchmarks", label: "Benchmarks" },
    ...(slots.pricing
      ? [{ value: "pricing" as const, label: "Pricing" }]
      : []),
    { value: "training-data", label: "Training data" },
    { value: "provenance", label: "Provenance" },
    { value: "discussion", label: "Discussion" },
  ]

  return (
    <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-12">
      <main id="main" className="lg:col-span-8">
        <div
          className="bg-base/90 border-subtle sticky top-14 z-30 -mx-4 border-b backdrop-blur-md md:-mx-0"
          role="tablist"
          aria-label="Model sections"
        >
          <div className="mx-auto flex h-12 items-end gap-1 overflow-x-auto px-4">
            {tabs.map((tab) => {
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
                      layoutId="active-model-tab-underline"
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
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pt-8"
          >
            {pick(active, slots)}
          </motion.div>
        </AnimatePresence>
      </main>

      <aside className="lg:col-span-4">{rail}</aside>
    </div>
  )
}

function pick(
  tab: ModelTab,
  slots: ModelDetailClientProps["slots"]
): ReactNode {
  switch (tab) {
    case "overview":
      return slots.overview
    case "benchmarks":
      return slots.benchmarks
    case "pricing":
      return slots.pricing ?? null
    case "training-data":
      return slots.trainingData
    case "provenance":
      return slots.provenance
    case "discussion":
      return slots.discussion
  }
}
