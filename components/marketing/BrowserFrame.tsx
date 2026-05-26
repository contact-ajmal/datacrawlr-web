import Image from "next/image"
import { Camera } from "lucide-react"

import { cn } from "@/lib/utils"

interface BrowserFrameProps {
  /** Path under /public to the screenshot — eg "/screenshots/search-results.png". */
  src: string
  alt: string
  /** Displayed in the URL pill (e.g. "datacrawlr.com/search?q=medical+imaging"). */
  url: string
  /** Capture route this screenshot is sourced from, surfaced on the placeholder. */
  captureRoute?: string
  /** Whether to render the radial accent glow behind the frame. */
  glow?: boolean
  /** Subtle 3D perspective tilt for the hero. */
  tilt?: boolean
  /** Natural pixel dimensions of the screenshot — pass through to next/image. */
  width?: number
  height?: number
  className?: string
  /** When `false`, render the dashed placeholder even if `src` is set —
   *  handy for storybook-style previews while iterating on layouts, or
   *  for any new screenshot the capture script hasn't produced yet.
   *  Defaults to `true` because the canonical set ships in
   *  `public/screenshots/` after `pnpm capture:screenshots`. */
  available?: boolean
}

/**
 * Browser-chrome wrapper around a real product screenshot.
 *
 * Until `available` flips to true (default — i.e. the file exists at
 * `src`), we render a clearly-labeled dashed placeholder showing the
 * intended filename + capture route. The wrapper layout, padding, and
 * aspect ratio match the eventual screenshot so swapping the placeholder
 * for the real image doesn't reflow the page.
 *
 * To keep the marketing site honest while the screenshots are pending,
 * we ship with `available` defaulting to `false` for any caller that
 * doesn't explicitly opt in. The capture script flips a manifest once
 * files land — see `scripts/capture-screenshots.ts`.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  captureRoute,
  glow = false,
  tilt = false,
  width = 1440,
  height = 900,
  className,
  available = true,
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "relative",
        tilt && "[transform:perspective(1400px)_rotateX(2deg)_rotateY(-1deg)]",
        className
      )}
    >
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -m-12 rounded-[2rem] opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(94,234,212,0.18), transparent 60%)",
          }}
        />
      ) : null}

      <div className="border-strong bg-overlay relative overflow-hidden rounded-xl border shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        {/* Chrome: traffic lights + URL pill */}
        <div className="border-subtle bg-elevated/80 flex items-center gap-3 border-b px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
            <span className="size-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
          </div>
          <div className="bg-base border-subtle text-tertiary text-micro flex min-w-0 flex-1 items-center justify-center rounded-md border px-3 py-1 font-mono">
            <span className="truncate">{url}</span>
          </div>
          {/* Right side filler to keep the URL pill visually centered. */}
          <div className="w-12" aria-hidden="true" />
        </div>

        {/* Body — real image or labeled placeholder */}
        {available ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="block h-auto w-full"
            // The hero image is above the fold; let Next prioritise it.
            priority={glow}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        ) : (
          <ScreenshotPlaceholder
            filename={src.replace(/^\/screenshots\//, "")}
            captureRoute={captureRoute ?? url}
            aspect={width / height}
          />
        )}
      </div>
    </div>
  )
}

interface PlaceholderProps {
  filename: string
  captureRoute: string
  aspect: number
}

function ScreenshotPlaceholder({
  filename,
  captureRoute,
  aspect,
}: PlaceholderProps) {
  return (
    <div
      className="bg-base text-secondary relative flex flex-col items-center justify-center gap-3 p-10"
      style={{
        aspectRatio: aspect,
      }}
    >
      {/* Dashed inset border + faint grid so the placeholder reads as
          "deliberately empty" rather than broken. */}
      <div
        aria-hidden="true"
        className="border-subtle pointer-events-none absolute inset-4 rounded-md border border-dashed"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-md opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-tertiary) 1px, transparent 1px), linear-gradient(90deg, var(--text-tertiary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Camera
        className="text-accent relative size-6 shrink-0"
        aria-hidden="true"
      />
      <div className="relative text-center">
        <div className="text-tertiary text-micro font-mono uppercase tracking-widest">
          Screenshot needed
        </div>
        <div className="text-primary text-body mt-2 font-medium">
          {filename}
        </div>
        <div className="text-tertiary text-caption mt-1 font-mono">
          Capture from{" "}
          <span className="text-secondary">{captureRoute}</span>
        </div>
      </div>
    </div>
  )
}
