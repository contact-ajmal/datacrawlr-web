import Link from "next/link"

import { Button } from "@/components/ui/button"

interface MarketingCTAProps {
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function MarketingCTA({
  title = "Stop bookmarking datasets and models.",
  subtitle = "Open the catalog and start finding what you actually need.",
  primaryLabel = "Open the app",
  primaryHref = "/explore",
  secondaryLabel = "Read about the index",
  secondaryHref = "/about",
}: MarketingCTAProps) {
  return (
    <section className="border-subtle border-t py-24 text-center">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="text-h2 font-semibold tracking-tight">{title}</h2>
        <p className="text-secondary text-lead mt-4">{subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href={primaryHref}>{primaryLabel} →</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
