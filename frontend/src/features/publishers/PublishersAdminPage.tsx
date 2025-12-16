"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useActiveAccount } from "thirdweb/react"
import { useRouter } from "next/navigation"
import { Plus, ShieldAlert, Wallet } from "lucide-react"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { Button } from "@/shared/components/shadcn/button"
import { PublishersAdminFilters } from "./components/PublishersAdminFilters"
import { PublishersAdminTable } from "./components/PublishersAdminTable"
import { usePublishersAdmin } from "./hooks/usePublishersAdmin"
import type { PublisherStatus } from "@/shared/services/publishersAdminService"
import { createFeeSplitter } from "@/shared/services/contracts/createFeeSplitter"
import { toast } from "@/shared/utils/toast"
import { useUserRole } from "@/shared/hooks/useUserRole"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/shadcn/alert"

export function PublishersAdminPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PublisherStatus | "all">("all")
  const account = useActiveAccount()
  const router = useRouter()
  const { isAdmin, isLoading: roleLoading, role } = useUserRole()

  // Build filters for API
  const apiFilters = useMemo(() => {
    const filters: { status?: PublisherStatus; is_active?: boolean } = {}

    if (statusFilter !== "all") {
      filters.status = statusFilter
    }

    return filters
  }, [statusFilter])

  const { publishers, isLoading, rejectPublisher, refresh } = usePublishersAdmin(apiFilters)

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
    if (!account) {
      toast.error("Wallet not connected", "Please connect your wallet to approve publishers")
      return
    }

    try {
      // Create fee splitter contract and approve publisher
      await createFeeSplitter({
        publisherId: id,
        account,
      })

      // Refresh the publishers list to show updated status
      await refresh()

      toast.success("Publisher approved!", "Fee splitter contract created successfully")
    } catch (error) {
      // Error is already handled in createFeeSplitter
      console.error("Failed to approve publisher:", error)
    }
  }

  const handleReject = async (id: string) => {
    await rejectPublisher(id)
  }

  // Show loading while checking role
  if (roleLoading) {
    return (
      <BaseLayout title="Publishers Admin">
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </BaseLayout>
    )
  }

  // Show access denied if not admin
  if (!isAdmin) {
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
            description="Admin access required"
            action={
              <>
              <div className="flex items-center gap-2">
              <Button onClick={() => router.push("/publishers/new")}>
                <Plus className="size-4" />
                Add Publisher
              </Button>
              <Button onClick={() => router.push("/publishers/withdraw")}>
                <Wallet className="size-4" />
                Withdraw
              </Button>
              </div>
              </>
            }
          />

          <Alert variant="destructive">
            <ShieldAlert className="size-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You need admin privileges to access this page.
              {role && <span className="block mt-2">Your current role: <strong>{role}</strong></span>}
              {!account && <span className="block mt-2">Please connect your wallet first.</span>}
            </AlertDescription>
          </Alert>
        </motion.div>
      </BaseLayout>
    )
  }

  // Admin users see the full page
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
          action={
            <Button onClick={() => router.push("/publishers/new")}>
              <Plus className="size-4" />
              Add Publisher
            </Button>
          }
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
