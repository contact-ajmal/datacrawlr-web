import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-base hover:bg-accent/90",
        secondary:
          "bg-elevated border border-subtle text-primary hover:border-strong",
        ghost:
          "text-secondary hover:bg-elevated hover:text-primary",
        outline:
          "border border-strong text-primary hover:bg-elevated",
        destructive:
          "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
        link:
          "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 text-caption has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 text-caption has-[>svg]:px-2.5",
        lg: "h-10 px-6 text-body has-[>svg]:px-4",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
