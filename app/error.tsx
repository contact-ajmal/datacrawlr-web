"use client"

import { ErrorState } from "@/components/shared/ErrorState"

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="The site is having a moment"
      description={
        error.message ||
        "We couldn't reach the index. Try again in a moment."
      }
      onRetry={reset}
    />
  )
}
