"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { DataTable, Column, IconButton } from "@/shared/components/ui"
import { ConfirmModal } from "@/shared/components/modals/ConfirmModal"
import { ApiKey } from "@/shared/types/api-key"

interface ApiKeysTableProps {
  keys: ApiKey[]
  onDeleteKey: (id: string) => void
  isLoading?: boolean
}

export function ApiKeysTable({
  keys,
  onDeleteKey,
  isLoading,
}: ApiKeysTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null)

  const handleDeleteClick = (key: ApiKey) => {
    setKeyToDelete(key)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (keyToDelete) {
      await onDeleteKey(keyToDelete.id)
      setKeyToDelete(null)
    }
  }
  const formatExpiration = (expiresAt: string | null) => {
    if (!expiresAt) return <span className="text-muted-foreground">Never</span>

    const date = new Date(expiresAt)
    const now = new Date()
    const isExpired = date < now
    const daysUntilExpiry = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (isExpired) {
      return <span className="text-destructive font-medium">Expired</span>
    }

    if (daysUntilExpiry <= 7) {
      return <span className="text-amber-500 font-medium">{daysUntilExpiry}d left</span>
    }

    return <span>{date.toLocaleDateString()}</span>
  }

  const columns: Column<ApiKey>[] = [
    {
      key: "name",
      header: "Name",
      width: "25%",
      render: (key) => <span className="font-medium">{key.name}</span>,
    },
    {
      key: "token",
      header: "Token",
      width: "30%",
      render: (key) => (
        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
          {key.token}
        </code>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      width: "15%",
      render: (key) => formatExpiration(key.expiresAt),
    },
    {
      key: "lastUsed",
      header: "Last Used",
      width: "15%",
      hideOnTablet: true,
      render: (key) => (
        <span className="text-muted-foreground">
          {key.lastUsed || "Never"}
        </span>
      ),
    },
    {
      key: "created",
      header: "Created",
      width: "10%",
      hideOnTablet: true,
      render: (key) => (
        <span className="text-muted-foreground">{key.created}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "5%",
      align: "right",
      render: (key) => (
        <IconButton
          size="sm"
          variant="destructive"
          onClick={() => handleDeleteClick(key)}
          tooltip="Delete API key"
        >
          <Trash2 />
        </IconButton>
      ),
    },
  ]

  // Mobile card render
  const renderMobileCard = (key: ApiKey) => (
    <div className="space-y-3">
      {/* Header: Name + Actions */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-base">{key.name}</span>
        <IconButton size="sm" variant="destructive" onClick={() => handleDeleteClick(key)}>
          <Trash2 />
        </IconButton>
      </div>

      {/* Token */}
      <code className="block text-xs font-mono bg-muted px-2 py-1.5 rounded truncate">
        {key.token}
      </code>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Expires: {formatExpiration(key.expiresAt)}</span>
        <span>Created: {key.created}</span>
      </div>
    </div>
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={keys}
        keyExtractor={(key) => key.id}
        isLoading={isLoading}
        mobileCard={renderMobileCard}
        emptyState={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No API keys found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Create your first API key to get started
            </p>
          </div>
        }
      />

      {/* Delete Confirmation Modal */}
      {keyToDelete && (
        <ConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          title="Delete API Key"
          description={`Are you sure you want to delete the API key "${keyToDelete.name}"? This action cannot be undone.`}
          confirmText="DELETE"
          onConfirm={handleConfirmDelete}
          variant="destructive"
        />
      )}
    </>
  )
}
