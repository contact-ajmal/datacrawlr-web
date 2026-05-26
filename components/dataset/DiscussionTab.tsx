"use client"

import { MessageSquare } from "lucide-react"
import { toast } from "sonner"

import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"

export function DiscussionTab() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Discussion is coming soon"
      description="We're working on a way for ML engineers to share notes, gotchas, and recommended preprocessing for each dataset."
      actions={
        <Button
          variant="outline"
          onClick={() => toast("We'll let you know.")}
        >
          Notify me
        </Button>
      }
    />
  )
}
