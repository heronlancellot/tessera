"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { PublishersAdminFilters } from "./components/PublishersAdminFilters"
import { PublishersAdminTable } from "./components/PublishersAdminTable"
import { usePublishersAdmin } from "./hooks/usePublishersAdmin"
import type { PublisherStatus } from "@/shared/services/publishersAdminService"

export function PublishersAdminPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PublisherStatus | "all">("all")

  // Build filters for API
  const apiFilters = useMemo(() => {
    const filters: { status?: PublisherStatus; is_active?: boolean } = {}
    
    if (statusFilter !== "all") {
      filters.status = statusFilter
    }

    return filters
  }, [statusFilter])

  const { publishers, isLoading, approvePublisher, rejectPublisher } = usePublishersAdmin(apiFilters)

  // Filter by search term
  const filteredPublishers = useMemo(
    () =>
      publishers.filter(
        (publisher) =>
          publisher.name.toLowerCase().includes(search.toLowerCase()) ||
          publisher.slug.toLowerCase().includes(search.toLowerCase()) ||
          (publisher.website?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (publisher.wallet_address?.toLowerCase().includes(search.toLowerCase()) ?? false)
      ),
    [publishers, search]
  )

  const handleApprove = async (id: string) => {
    await approvePublisher(id)
  }

  const handleReject = async (id: string) => {
    await rejectPublisher(id)
  }

  return (
    <BaseLayout title="Publishers Admin">
      <motion.div
        className="flex flex-1 flex-col gap-6 p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="Publishers Management"
          description="Review and manage publisher registrations. Approve or reject publishers to activate their integration with Tessera."
        />

        <PublishersAdminFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <PublishersAdminTable
          publishers={filteredPublishers}
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={isLoading}
        />

        {filteredPublishers.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing {filteredPublishers.length} of {publishers.length} publishers
          </p>
        )}
      </motion.div>
    </BaseLayout>
  )
}
