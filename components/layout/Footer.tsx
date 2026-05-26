import Link from "next/link"

import { Wordmark } from "@/components/brand/Wordmark"

const PRODUCT_LINKS = [
  { label: "Search", href: "/search" },
  { label: "Explore", href: "/explore" },
  { label: "Models", href: "/models" },
  { label: "Compare", href: "/compare" },
]

const RESOURCE_LINKS = [
  { label: "About", href: "/about" },
  { label: "How indexing works", href: "/how-it-works" },
  { label: "Changelog", href: "/changelog" },
  { label: "API docs", href: "/docs/api" },
]

const COMPANY_LINKS = [
  { label: "Twitter", href: "https://twitter.com/datacrawlr" },
  { label: "GitHub", href: "https://github.com/datacrawlr" },
  { label: "Email", href: "mailto:hello@datacrawlr.dev" },
]

export function Footer() {
  return (
    <footer className="border-subtle border-t py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="flex flex-col gap-4">
          <Wordmark size="md" />
          <p className="text-secondary text-body">The dataset intelligence layer.</p>
          <p className="text-tertiary text-caption max-w-md">
            Datacrawlr indexes dataset metadata from HuggingFace, Kaggle, GitHub,
            and research papers. We help ML engineers decide which dataset to
            actually use.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>
      </div>

      <div className="border-subtle mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-3 border-t px-4 pt-6 sm:flex-row sm:items-center md:px-6">
        <div className="text-tertiary text-micro font-mono">© 2026 Datacrawlr</div>
        <div className="text-tertiary text-micro inline-flex items-center gap-2 font-mono">
          <span
            aria-hidden="true"
            className="bg-success animate-pulse-glow inline-block size-1.5 rounded-full"
          />
          All systems operational
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-tertiary text-micro font-mono uppercase tracking-wider">
        {title}
      </div>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-secondary hover:text-primary text-caption block py-1 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
