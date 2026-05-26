import Link from "next/link"

import { BrowserFrame } from "@/components/marketing/BrowserFrame"
import { cn } from "@/lib/utils"

interface FeatureShowcaseProps {
  eyebrow: string
  title: string
  body: string
  /** Bullet points rendered below the body. */
  bullets?: string[]
  screenshot: {
    src: string
    alt: string
    url: string
    captureRoute?: string
    available?: boolean
  }
  /** "left" puts the copy on the left, screenshot on the right; "right" flips. */
  imageSide?: "left" | "right"
  cta?: { label: string; href: string }
  className?: string
}

export function FeatureShowcase({
  eyebrow,
  title,
  body,
  bullets,
  screenshot,
  imageSide = "right",
  cta,
  className,
}: FeatureShowcaseProps) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className={cn(imageSide === "left" && "lg:order-2")}>
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            {eyebrow}
          </p>
          <h2 className="text-h2 mt-3 font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-secondary text-lead mt-5 leading-relaxed">
            {body}
          </p>
          {bullets && bullets.length > 0 ? (
            <ul className="border-subtle mt-6 flex flex-col gap-2 border-l pl-5">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="text-secondary text-body relative leading-relaxed before:absolute before:-left-[1.4rem] before:top-[0.6rem] before:size-1 before:rounded-full before:bg-[var(--accent)]"
                >
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
          {cta ? (
            <div className="mt-8">
              <Link
                href={cta.href}
                className="text-accent text-caption hover:text-accent-hover inline-flex items-center font-medium underline-offset-4 hover:underline"
              >
                {cta.label} →
              </Link>
            </div>
          ) : null}
        </div>

        <div className={cn(imageSide === "left" && "lg:order-1")}>
          <BrowserFrame
            src={screenshot.src}
            alt={screenshot.alt}
            url={screenshot.url}
            captureRoute={screenshot.captureRoute}
            available={screenshot.available}
          />
        </div>
      </div>
    </section>
  )
}
