"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react"
import { DataTable, Column, IconButton } from "@/shared/components/ui"
import { Button } from "@/shared/components/shadcn/button"
import { ConfirmModal } from "@/shared/components/modals/ConfirmModal"
import { Badge } from "@/shared/components/shadcn/badge"
import type { PublisherAdmin, PublisherStatus } from "@/shared/services/publishersAdminService"

interface PublishersAdminTableProps {
  publishers: PublisherAdmin[]
  onApprove: (id: string, contractAddress?: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  isLoading?: boolean
}

export function PublishersAdminTable({
  publishers,
  onApprove,
  onReject,
  isLoading,
}: PublishersAdminTableProps) {
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [publisherToAction, setPublisherToAction] = useState<PublisherAdmin | null>(null)

  const handleApproveClick = (publisher: PublisherAdmin) => {
    setPublisherToAction(publisher)
    setApproveModalOpen(true)
  }

  const handleRejectClick = (publisher: PublisherAdmin) => {
    setPublisherToAction(publisher)
    setRejectModalOpen(true)
  }

  const handleConfirmApprove = async () => {
    if (publisherToAction) {
      await onApprove(publisherToAction.id)
      setPublisherToAction(null)
      setApproveModalOpen(false)
    }
  }

  const handleConfirmReject = async () => {
    if (publisherToAction) {
      await onReject(publisherToAction.id)
      setPublisherToAction(null)
      setRejectModalOpen(false)
    }
  }

  const getStatusBadge = (status: PublisherStatus | null) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="size-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="size-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="secondary">
            <Clock className="size-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const columns: Column<PublisherAdmin>[] = [
    {
      key: "name",
      header: "Publisher",
      width: "20%",
      render: (publisher) => (
        <div className="flex flex-col">
          <span className="font-medium">{publisher.name}</span>
          <span className="text-xs text-muted-foreground">{publisher.slug}</span>
        </div>
      ),
    },
    {
      key: "website",
      header: "Website",
      width: "20%",
      hideOnTablet: true,
      render: (publisher) =>
        publisher.website ? (
          <a
            href={publisher.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            {publisher.website}
            <ExternalLink className="size-3" />
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">N/A</span>
        ),
    },
    {
      key: "wallet",
      header: "Wallet",
      width: "15%",
      hideOnTablet: true,
      render: (publisher) => (
        <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate block max-w-[150px]">
          {publisher.wallet_address || "N/A"}
        </code>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "12%",
      render: (publisher) => getStatusBadge(publisher.status),
    },
    {
      key: "submitted",
      header: "Submitted",
      width: "12%",
      hideOnTablet: true,
      render: (publisher) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(publisher.submitted_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "21%",
      align: "right",
      render: (publisher) => {
        if (publisher.status === "approved") {
          return (
            <span className="text-sm text-muted-foreground">No actions</span>
          )
        }

        return (
          <div className="flex items-center gap-2 justify-end">
            {publisher.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleApproveClick(publisher)}
                  className="h-8"
                >
                  <CheckCircle2 className="size-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRejectClick(publisher)}
                  className="h-8"
                >
                  <XCircle className="size-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {publisher.status === "rejected" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => handleApproveClick(publisher)}
                className="h-8"
              >
                <CheckCircle2 className="size-4 mr-1" />
                Approve
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  // Mobile card render
  const renderMobileCard = (publisher: PublisherAdmin) => (
    <div className="space-y-3">
      {/* Header: Name + Status */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-base">{publisher.name}</span>
          <span className="text-xs text-muted-foreground">{publisher.slug}</span>
        </div>
        {getStatusBadge(publisher.status)}
      </div>

      {/* Website */}
      {publisher.website && (
        <a
          href={publisher.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1 text-sm"
        >
          {publisher.website}
          <ExternalLink className="size-3" />
        </a>
      )}

      {/* Wallet */}
      {publisher.wallet_address && (
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Wallet:</span>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded block truncate">
            {publisher.wallet_address}
          </code>
        </div>
      )}

      {/* Submitted date */}
      <div className="text-xs text-muted-foreground">
        Submitted: {formatDate(publisher.submitted_at)}
      </div>

      {/* Actions */}
      {publisher.status !== "approved" && (
        <div className="flex items-center gap-2 pt-2">
          {publisher.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleApproveClick(publisher)}
                className="flex-1"
              >
                <CheckCircle2 className="size-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRejectClick(publisher)}
                className="flex-1"
              >
                <XCircle className="size-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          {publisher.status === "rejected" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleApproveClick(publisher)}
              className="flex-1"
            >
              <CheckCircle2 className="size-4 mr-1" />
              Approve
            </Button>
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={publishers}
        keyExtractor={(publisher) => publisher.id}
        isLoading={isLoading}
        mobileCard={renderMobileCard}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No publishers found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {publishers.length === 0
                ? "No publishers have been registered yet"
                : "Try adjusting your filters"}
            </p>
          </div>
        }
      />

      {/* Approve Confirmation Modal */}
      {publisherToAction && (
        <ConfirmModal
          open={approveModalOpen}
          onOpenChange={setApproveModalOpen}
          title="Approve Publisher"
          description={`Are you sure you want to approve "${publisherToAction.name}"? This will activate the publisher and create a default endpoint.`}
          confirmText="APPROVE"
          onConfirm={handleConfirmApprove}
          variant="default"
        />
      )}

      {/* Reject Confirmation Modal */}
      {publisherToAction && (
        <ConfirmModal
          open={rejectModalOpen}
          onOpenChange={setRejectModalOpen}
          title="Reject Publisher"
          description={`Are you sure you want to reject "${publisherToAction.name}"? This will deactivate the publisher.`}
          confirmText="REJECT"
          onConfirm={handleConfirmReject}
          variant="destructive"
        />
      )}
    </>
  )
}
