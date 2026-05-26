import Link from "next/link"

import { Wordmark } from "@/components/brand/Wordmark"

const COLUMNS: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}[] = [
  {
    title: "Product",
    links: [
      { label: "Datasets", href: "/product/datasets" },
      { label: "Models", href: "/product/models" },
      { label: "Features", href: "/features" },
      { label: "Open the app", href: "/explore" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Search", href: "/search" },
      { label: "Models directory", href: "/models" },
      { label: "Leaderboards", href: "/models/leaderboard/mmlu-pro" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/datacrawlr/datacrawlr",
        external: true,
      },
      { label: "Email", href: "mailto:hello@datacrawlr.com", external: true },
      {
        label: "Status",
        href: "https://status.datacrawlr.com",
        external: true,
      },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-subtle border-t py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-6">
        <div className="flex flex-col gap-4">
          <Wordmark size="md" />
          <p className="text-secondary text-body">
            The dataset and model intelligence layer.
          </p>
          <p className="text-tertiary text-caption max-w-md">
            Datacrawlr indexes metadata about datasets and models from across
            the open ML ecosystem. We point you to the right data and the
            right weights — and never mirror either.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <FooterColumn key={col.title} title={col.title} links={col.links} />
        ))}
      </div>

      <div className="border-subtle mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-3 border-t px-4 pt-6 sm:flex-row sm:items-center md:px-6">
        <div className="text-tertiary text-micro font-mono">
          © {new Date().getUTCFullYear()} Datacrawlr · Built for ML engineers
        </div>
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
  links: { label: string; href: string; external?: boolean }[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-tertiary text-micro font-mono uppercase tracking-wider">
        {title}
      </div>
      <ul className="flex flex-col">
        {links.map((link) =>
          link.external ? (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary text-caption block py-1 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ) : (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-secondary hover:text-primary text-caption block py-1 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
