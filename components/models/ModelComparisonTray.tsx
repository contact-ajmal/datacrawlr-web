"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Cpu, GitCompare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  MODEL_COMPARISON_MAX,
  useModelComparison,
} from "@/lib/stores/model-comparison"

/**
 * Floating bottom-right tray that appears when at least one model has
 * been queued for comparison. Mirrors the dataset comparison tray's
 * placement and behavior — separate localStorage key, separate widget.
 */
export function ModelComparisonTray() {
  const slugs = useModelComparison((s) => s.slugs)
  const remove = useModelComparison((s) => s.remove)
  const clear = useModelComparison((s) => s.clear)

  // Persist middleware rehydrates after mount; render nothing until then to
  // avoid SSR/CSR mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <AnimatePresence>
      {slugs.length > 0 ? (
        <motion.div
          key="model-tray"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-24 right-4 z-40"
          role="region"
          aria-label="Model comparison tray"
        >
          <div className="bg-overlay border-strong flex max-w-[calc(100vw-3rem)] items-center gap-3 rounded-xl border p-3 shadow-[0_0_60px_rgba(94,234,212,0.08)]">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Cpu
                className="text-tertiary size-4 shrink-0"
                aria-hidden="true"
              />
              {slugs.map((slug) => (
                <div
                  key={slug}
                  className="bg-elevated border-subtle flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1"
                >
                  <span className="text-primary text-caption max-w-[14ch] truncate">
                    {slug.replace(/^(or|hf)-/, "")}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(slug)}
                    aria-label={`Remove ${slug}`}
                    className="text-tertiary hover:text-primary -mr-0.5 transition-colors"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
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
              <Link href={`/models/compare?ids=${slugs.join(",")}`}>
                <GitCompare className="size-3.5" aria-hidden="true" />
                Compare ({slugs.length}/{MODEL_COMPARISON_MAX})
              </Link>
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
