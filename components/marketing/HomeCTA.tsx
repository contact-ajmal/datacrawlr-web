import Link from "next/link"
import { Compass } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HomeCTA() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-h2 font-semibold tracking-tight">
          Stop hunting. Start training.
        </h2>
        <p className="text-secondary text-lead mx-auto mt-3 max-w-xl">
          Datacrawlr maps every public dataset worth knowing — so you can spend
          your day on the model, not the search.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/explore">
              Open Explore
              <Compass className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
