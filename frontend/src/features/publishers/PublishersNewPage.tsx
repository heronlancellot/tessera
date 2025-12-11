
"use client"

import { motion } from "framer-motion"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { NewPublisherForm } from "./components/NewPublisherForm"

export function PublishersNewPage() {

  return (
    <BaseLayout title="New Publisher">
      <motion.div
        className="flex flex-1 flex-col gap-6 p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="New Publisher"
          description="Create a new publisher to access Tessera services."
        />
        <NewPublisherForm />

      </motion.div>
    </BaseLayout>
  )
}
