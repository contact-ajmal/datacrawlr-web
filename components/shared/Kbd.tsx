import * as React from "react"

import { cn } from "@/lib/utils"

type KbdProps = React.ComponentPropsWithoutRef<"kbd"> & {
  ref?: React.Ref<HTMLElement>
}

export function Kbd({ className, ref, ...props }: KbdProps) {
  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(
        "bg-overlay border-subtle text-secondary inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-micro",
        className
      )}
      {...props}
    />
  )
}
