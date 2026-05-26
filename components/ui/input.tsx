import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-subtle bg-elevated px-3 text-body text-primary outline-none transition-[color,box-shadow,border-color] duration-150",
        "placeholder:text-tertiary",
        "selection:bg-accent/20 selection:text-primary",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-caption file:font-medium file:text-primary",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
