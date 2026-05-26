import {
  Brain,
  FileText,
  GitBranch,
  Newspaper,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import type { SourceProvider } from "@/lib/types"

export const SOURCE_ICON: Record<SourceProvider, LucideIcon> = {
  huggingface: Brain,
  kaggle: Trophy,
  github: GitBranch,
  paper: FileText,
  blog: Newspaper,
}

export const SOURCE_LABEL: Record<SourceProvider, string> = {
  huggingface: "HuggingFace",
  kaggle: "Kaggle",
  github: "GitHub",
  paper: "Paper",
  blog: "Blog",
}
