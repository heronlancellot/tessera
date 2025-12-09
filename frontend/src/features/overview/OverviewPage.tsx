"use client"

import { motion } from "framer-motion"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { UsageCard } from "./components/UsageCard"
import { SDKSetupCard } from "./components/SDKSetupCard"
import { PublishersCard } from "./components/PublishersCard"

export function OverviewPage() {
  return (
    <BaseLayout title="Overview">
      <motion.div
        className="flex flex-1 flex-col gap-6 p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="Overview"
          description="Welcome to your Tessera dashboard"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UsageCard />
          <SDKSetupCard />
          <PublishersCard />
        </div>
      </motion.div>
    </BaseLayout>
  )
}
