"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { GitCompare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import { getDatasetBySlug } from "@/lib/data"
import { useComparison } from "@/lib/stores/comparison"
import type { Dataset } from "@/lib/types"

export function ComparisonTray() {
  const ids = useComparison((s) => s.ids)
  const remove = useComparison((s) => s.remove)
  const clear = useComparison((s) => s.clear)

  // Avoid hydration mismatch — persist middleware hydrates after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [datasets, setDatasets] = useState<Dataset[]>([])
  useEffect(() => {
    let active = true
    Promise.all(ids.map((slug) => getDatasetBySlug(slug)))
      .then((rows) => {
        if (active) setDatasets(rows.filter((d): d is Dataset => d !== null))
      })
      .catch(() => {
        if (active) setDatasets([])
      })
    return () => {
      active = false
    }
  }, [ids])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {datasets.length > 0 ? (
        <motion.div
          key="tray"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-40"
          role="region"
          aria-label="Comparison tray"
        >
          <div className="bg-overlay border-strong flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border p-3 shadow-[0_0_60px_rgba(94,234,212,0.08)]">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <GitCompare
                className="text-tertiary size-4 shrink-0"
                aria-hidden="true"
              />
              {datasets.map((d) => {
                const Icon = MODALITY_ICONS[d.modality]
                return (
                  <div
                    key={d.slug}
                    className="bg-elevated border-subtle flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1"
                  >
                    <Icon
                      className="text-accent size-3 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-primary text-caption max-w-[14ch] truncate">
                      {d.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(d.slug)}
                      aria-label={`Remove ${d.name}`}
                      className="text-tertiary hover:text-primary -mr-0.5 transition-colors"
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={clear}
              aria-label="Clear comparison"
              className="text-tertiary hover:text-primary text-micro shrink-0 font-mono uppercase tracking-wider transition-colors"
            >
              Clear
            </button>
            <Button asChild size="sm" className="shrink-0">
              <Link href={`/compare?ids=${datasets.map((d) => d.slug).join(",")}`}>
                Compare ({datasets.length})
              </Link>
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
