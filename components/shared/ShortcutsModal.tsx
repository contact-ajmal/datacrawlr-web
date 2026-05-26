"use client"

import { Dialog as DialogPrimitive } from "radix-ui"

import { Kbd } from "@/components/shared/Kbd"

interface ShortcutItem {
  keys: string[]
  description: string
}

interface ShortcutGroup {
  title: string
  items: ShortcutItem[]
}

const GROUPS: ShortcutGroup[] = [
  {
    title: "Search",
    items: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["/"], description: "Focus inline search" },
      { keys: ["Esc"], description: "Close palette or modal" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { keys: ["g", "h"], description: "Go to home" },
      { keys: ["g", "s"], description: "Go to search" },
      { keys: ["g", "e"], description: "Go to explore" },
      { keys: ["g", "m"], description: "Go to models" },
    ],
  },
  {
    title: "Actions",
    items: [
      { keys: ["?"], description: "Show this shortcuts list" },
      { keys: ["↑", "↓"], description: "Navigate list items" },
      { keys: ["↵"], description: "Select highlighted item" },
    ],
  },
]

interface ShortcutsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsModal({ open, onOpenChange }: ShortcutsModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-modal="true"
          className="bg-overlay border-strong fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border p-6 shadow-[0_0_60px_rgba(94,234,212,0.08)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="text-h4 font-semibold">
            Keyboard shortcuts
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-tertiary text-caption mt-1 mb-5">
            Quick reference for navigating Datacrawlr.
          </DialogPrimitive.Description>

          <div className="space-y-6">
            {GROUPS.map((group) => (
              <section key={group.title}>
                <div className="text-tertiary text-micro mb-2 font-mono uppercase tracking-wider">
                  {group.title}
                </div>
                <ul className="border-subtle divide-subtle divide-y border-y">
                  {group.items.map((item) => (
                    <li
                      key={`${group.title}-${item.description}`}
                      className="flex items-center justify-between gap-4 py-2"
                    >
                      <span className="text-secondary text-caption">
                        {item.description}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {item.keys.map((k) => (
                          <Kbd key={k}>{k}</Kbd>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="text-tertiary text-micro mt-6">
            Press{" "}
            <Kbd>Esc</Kbd> or click outside to close.
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
