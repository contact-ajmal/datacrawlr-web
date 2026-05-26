"use client"

import { ArrowUpDown, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortMode =
  | "relevance"
  | "newest"
  | "most-cited"
  | "smallest"
  | "largest"

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "most-cited", label: "Most cited" },
  { value: "smallest", label: "Smallest size" },
  { value: "largest", label: "Largest size" },
]

interface SearchSortMenuProps {
  value: SortMode
  onChange: (next: SortMode) => void
}

export function SearchSortMenu({ value, onChange }: SearchSortMenuProps) {
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" aria-label="Sort results">
          <ArrowUpDown className="size-3.5" aria-hidden="true" />
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-overlay border-subtle min-w-44"
      >
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onChange(opt.value)}
            className="text-secondary data-[highlighted]:bg-elevated data-[highlighted]:text-primary cursor-pointer text-caption"
          >
            <span className="flex-1">{opt.label}</span>
            {value === opt.value ? (
              <Check className="text-accent size-3.5" aria-hidden="true" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
