"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { useActiveAccount } from "thirdweb/react"

import { ActivityFilters } from "./components/ActivityFilters"
import { ActivityTable } from "./components/ActivityTable"
import { useActivity } from "./hooks/useActivity"
import type { FilterType, FilterStatus } from "./types"

export function ActivityPage() {
  const account = useActiveAccount()

  const { requests, isLoading, filterRequests } = useActivity({
    walletAddress: account?.address,
  })

  const [type, setType] = useState<FilterType>("all")
  const [status, setStatus] = useState<FilterStatus>("all")

  const filteredRequests = useMemo(
    () => filterRequests(type, status),
    [filterRequests, type, status]
  )

  const totalSpent = useMemo(
    () => filteredRequests.reduce((sum, req) => sum + req.amountUsd, 0),
    [filteredRequests]
  )

  return (
    <BaseLayout title="Activity">
      <motion.div
        className="flex flex-1 flex-col gap-6 p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="Activity"
          description="View your API request history and usage"
        />

        <ActivityFilters
          type={type}
          onTypeChange={setType}
          status={status}
          onStatusChange={setStatus}
        />

        <ActivityTable requests={filteredRequests} isLoading={isLoading} />

        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
            <p className="font-mono">
              Total spent: <span className="text-destructive">-{totalSpent.toFixed(4)}</span>
            </p>
          </div>
        )}
      </motion.div>
    </BaseLayout>
  )
}
