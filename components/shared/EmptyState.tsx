import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-24 text-center",
        className
      )}
    >
      <div className="bg-elevated border-subtle text-tertiary inline-flex size-14 items-center justify-center rounded-full border">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-h4 mt-5 font-semibold">{title}</h3>
      {description ? (
        <p className="text-secondary text-body mt-2 max-w-md">{description}</p>
      ) : null}
      {actions ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
