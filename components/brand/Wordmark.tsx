import { cn } from "@/lib/utils"

type WordmarkSize = "sm" | "md" | "lg"

interface WordmarkProps {
  size?: WordmarkSize
  className?: string
}

const sizeClass: Record<WordmarkSize, string> = {
  sm: "text-body",
  md: "text-h4",
  lg: "text-h2",
}

const markPx: Record<WordmarkSize, number> = {
  sm: 0,
  md: 22,
  lg: 36,
}

export function Wordmark({ size = "md", className }: WordmarkProps) {
  const showMark = size !== "sm"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans font-semibold tracking-tight lowercase",
        sizeClass[size],
        className
      )}
    >
      {showMark ? <ConstellationMark px={markPx[size]} /> : null}
      <span>
        <span className="text-primary">data</span>
        <span className="text-accent">crawlr</span>
      </span>
    </span>
  )
}

function ConstellationMark({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <line
        x1="10"
        y1="4"
        x2="4"
        y2="16"
        stroke="var(--accent)"
        strokeWidth="0.75"
        strokeOpacity="0.6"
      />
      <line
        x1="10"
        y1="4"
        x2="16"
        y2="16"
        stroke="var(--accent)"
        strokeWidth="0.75"
        strokeOpacity="0.6"
      />
      <line
        x1="4"
        y1="16"
        x2="16"
        y2="16"
        stroke="var(--accent)"
        strokeWidth="0.75"
        strokeOpacity="0.6"
      />
      <circle cx="10" cy="4" r="2" fill="var(--accent)" />
      <circle cx="4" cy="16" r="2" fill="var(--accent)" />
      <circle cx="16" cy="16" r="2" fill="var(--accent)" />
    </svg>
  )
}
