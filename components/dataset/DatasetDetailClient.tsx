"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { CitationsTab } from "@/components/dataset/CitationsTab"
import { DatasetAISummary } from "@/components/dataset/DatasetAISummary"
import { DatasetMetricsGrid } from "@/components/dataset/DatasetMetricsGrid"
import { DatasetRail } from "@/components/dataset/DatasetRail"
import { ModelsTrainedOnSection } from "@/components/dataset/ModelsTrainedOnSection"
import {
  type DatasetTab,
  DatasetTabs,
} from "@/components/dataset/DatasetTabs"
import { DiscussionTab } from "@/components/dataset/DiscussionTab"
import { LineageTab } from "@/components/dataset/LineageTab"
import { MarkdownBlock } from "@/components/dataset/MarkdownBlock"
import { SchemaViewer } from "@/components/dataset/SchemaViewer"
import { SourcesTab } from "@/components/dataset/SourcesTab"
import {
  deriveInsights,
  paddedAISummary,
} from "@/lib/dataset-derivations"
import type { Dataset } from "@/lib/types"

interface DatasetDetailClientProps {
  dataset: Dataset
  related: Dataset[]
}

export function DatasetDetailClient({
  dataset,
  related,
}: DatasetDetailClientProps) {
  const [activeTab, setActiveTab] = useState<DatasetTab>("overview")
  const insights = deriveInsights(dataset)
  const summary = paddedAISummary(dataset)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <main id="main" className="lg:col-span-8">
          <DatasetTabs active={activeTab} onChange={setActiveTab} />
          <div className="pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{
                  duration: activeTab === "overview" ? 0.18 : 0.18,
                  ease: "easeOut",
                }}
              >
                <TabBody
                  tab={activeTab}
                  dataset={dataset}
                  summary={summary}
                  insights={insights}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <div className="lg:col-span-4">
          <DatasetRail dataset={dataset} related={related} />
        </div>
      </div>
    </div>
  )
}

function TabBody({
  tab,
  dataset,
  summary,
  insights,
}: {
  tab: DatasetTab
  dataset: Dataset
  summary: string
  insights: string[]
}) {
  switch (tab) {
    case "overview":
      return (
        <>
          <DatasetAISummary summary={summary} insights={insights} />
          <DatasetMetricsGrid dataset={dataset} />
          <ModelsTrainedOnSection trainedBy={dataset.trainedBy ?? []} />
          <section className="mt-12">
            <MarkdownBlock content={dataset.longDescription} />
          </section>
        </>
      )
    case "schema":
      return <SchemaViewer schema={dataset.schema} />
    case "sources":
      return <SourcesTab sources={dataset.sources} />
    case "lineage":
      return <LineageTab slug={dataset.slug} focusId={dataset.id} />
    case "citations":
      return <CitationsTab citations={dataset.citations} />
    case "discussion":
      return <DiscussionTab />
  }
}
