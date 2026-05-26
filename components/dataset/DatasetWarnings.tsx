import { AlertOctagon, AlertTriangle, Info, type LucideIcon } from "lucide-react"

import type { Warning, WarningLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DatasetWarningsProps {
  warnings: Warning[]
}

const LEVEL_ICON: Record<WarningLevel, LucideIcon> = {
  info: Info,
  warn: AlertTriangle,
  danger: AlertOctagon,
}

const LEVEL_CLASS: Record<WarningLevel, string> = {
  info: "bg-accent/10 border-accent/20 [&_[data-icon]]:text-accent",
  warn: "bg-warn/10 border-warn/20 [&_[data-icon]]:text-warn",
  danger: "bg-danger/10 border-danger/20 [&_[data-icon]]:text-danger",
}

export function DatasetWarnings({ warnings }: DatasetWarningsProps) {
  if (warnings.length === 0) return null

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <div className="space-y-3">
        {warnings.map((w) => {
          const Icon = LEVEL_ICON[w.level]
          return (
            <div
              key={w.title}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4",
                LEVEL_CLASS[w.level]
              )}
            >
              <Icon
                data-icon
                className="mt-0.5 size-5 shrink-0"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="text-primary text-body font-semibold">
                  {w.title}
                </div>
                <div className="text-secondary text-caption mt-1">
                  {w.body}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
