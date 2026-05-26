"use client"

import Link from "next/link"
import { AlertTriangle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this just now. The backend might be unreachable.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-24 text-center",
        className
      )}
    >
      <div className="bg-elevated border-subtle text-warn inline-flex size-14 items-center justify-center rounded-full border">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-h4 mt-5 font-semibold">{title}</h3>
      <p className="text-secondary text-body mt-2 max-w-md">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button onClick={onRetry} variant="secondary">
            <RotateCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
        ) : null}
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
