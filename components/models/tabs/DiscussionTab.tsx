import { MessagesSquare } from "lucide-react"

import { HeroCard } from "@/components/shared/Cards"

export function DiscussionTab() {
  return (
    <HeroCard className="flex items-start gap-4 p-8">
      <MessagesSquare
        className="text-tertiary mt-1 size-5 shrink-0"
        aria-hidden="true"
      />
      <div>
        <h3 className="text-h4 font-semibold tracking-tight">
          Discussion is coming soon.
        </h3>
        <p className="text-secondary text-body mt-2 max-w-2xl">
          We&apos;re working on threaded notes per model — annotations,
          gotchas, and field reports from people who&apos;ve actually
          shipped with this model. Until then, the source-platform link
          on the right rail is where most of the community chatter lives.
        </p>
      </div>
    </HeroCard>
  )
}
