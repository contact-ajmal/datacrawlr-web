"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export type DatasetTab =
  | "overview"
  | "schema"
  | "sources"
  | "lineage"
  | "citations"
  | "discussion"

interface TabDef {
  value: DatasetTab
  label: string
}

const TABS: TabDef[] = [
  { value: "overview", label: "Overview" },
  { value: "schema", label: "Schema" },
  { value: "sources", label: "Sources" },
  { value: "lineage", label: "Lineage" },
  { value: "citations", label: "Citations" },
  { value: "discussion", label: "Discussion" },
]

interface DatasetTabsProps {
  active: DatasetTab
  onChange: (tab: DatasetTab) => void
}

export function DatasetTabs({ active, onChange }: DatasetTabsProps) {
  return (
    <div
      className="bg-base/90 border-subtle sticky top-[52px] z-30 -mx-4 border-b backdrop-blur-md md:top-14 md:-mx-0"
      role="tablist"
      aria-label="Dataset sections"
    >
      <div className="mx-auto flex h-12 max-w-3xl items-end gap-1 overflow-x-auto px-4">
        {TABS.map((tab) => {
          const isActive = active === tab.value
          return (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative h-12 px-4 text-caption font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-secondary hover:text-primary"
              )}
            >
              {tab.label}
              {isActive ? (
                <motion.span
                  layoutId="active-tab-underline"
                  className="bg-accent absolute bottom-0 left-0 right-0 h-[2px]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
