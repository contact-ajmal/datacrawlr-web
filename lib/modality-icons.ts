import {
  Box,
  FileText,
  Film,
  Image as ImageIcon,
  Layers,
  LineChart,
  Music,
  Network,
  Table,
  type LucideIcon,
} from "lucide-react"

import type { Modality } from "@/lib/types"

export const MODALITY_ICONS: Record<Modality, LucideIcon> = {
  text: FileText,
  image: ImageIcon,
  audio: Music,
  video: Film,
  tabular: Table,
  multimodal: Layers,
  graph: Network,
  time_series: LineChart,
  other: Box,
}
