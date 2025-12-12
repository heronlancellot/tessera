"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { Button } from "@/shared/components/shadcn/button"
import { FormModal } from "@/shared/components/modals/FormModal"
import { ExpirationOption } from "@/shared/types/api-key"
import { useActiveAccount } from "thirdweb/react"

import { ApiKeysFilters } from "./components/ApiKeysFilters"
import { ApiKeysTable } from "./components/ApiKeysTable"
import { ApiKeyForm } from "./components/ApiKeyForm"
import { NewKeyModal } from "./components/NewKeyModal"
import { useApiKeys } from "./hooks/useApiKeys"
import { toast} from "sonner"

export function ApiKeysPage() {
  const account = useActiveAccount()
  console.log("account22", account)
  if (!account) return toast.error("No account found")

  // API Keys data & operations
  const { apiKeys, isLoading, createKey, deleteKey, hideFullToken } = useApiKeys({
    walletAddress: account.address,
  })

  // Local UI state
  const [search, setSearch] = useState("")
  const [showFormModal, setShowFormModal] = useState(false)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyData, setNewKeyData] = useState<{ id: string; name: string; token: string } | null>(null)
  const [keyName, setKeyName] = useState("")
  const [keyExpiration, setKeyExpiration] = useState<ExpirationOption>("never")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtered keys
  const filteredKeys = useMemo(
    () => apiKeys.filter((key) => key.name.toLowerCase().includes(search.toLowerCase())),
    [apiKeys, search]
  )

  const handleOpenCreate = () => {
    setKeyName("")
    setKeyExpiration("never")
    setShowFormModal(true)
  }

  const handleCloseFormModal = () => {
    setShowFormModal(false)
    setKeyName("")
    setKeyExpiration("never")
  }

  const handleCloseNewKeyModal = () => {
    if (newKeyData) {
      // Replace full token with prefix only
      hideFullToken(newKeyData.id)
    }
    setShowNewKeyModal(false)
    setNewKeyData(null)
  }

  const handleSubmit = async () => {
    if (!keyName.trim()) return
    toast.info("Creating API key...")
    setIsSubmitting(true)
    try {
      const newKey = await createKey(keyName, keyExpiration)
      if (newKey) {
        handleCloseFormModal()
        // Show the new key modal
        setNewKeyData({
          id: newKey.id,
          name: newKey.name,
          token: newKey.token,
        })
        setShowNewKeyModal(true)
        toast.success("API key created successfully")
      }
    } finally {
      setIsSubmitting(false)
      toast.dismiss()
    }
  }

  return (
    <BaseLayout title="API Keys">
      <motion.div
        className="flex flex-1 flex-col gap-6 p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="API Keys"
          description="Manage your API keys for accessing Tessera services"
          action={
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="size-4" />
              Create API Key
            </Button>
          }
        />

        <ApiKeysFilters search={search} onSearchChange={setSearch} />

        <ApiKeysTable
          keys={filteredKeys}
          onDeleteKey={deleteKey}
          isLoading={isLoading}
        />

        {filteredKeys.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing {filteredKeys.length} of {apiKeys.length} keys
          </p>
        )}
      </motion.div>

      {/* Form Modal (Create) */}
      <FormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        title="Create API Key"
        description="Create a new API key to access Tessera services."
        onSubmit={handleSubmit}
        onCancel={handleCloseFormModal}
        submitLabel="Create Key"
        isSubmitting={isSubmitting}
      >
        <ApiKeyForm
          name={keyName}
          onNameChange={setKeyName}
          expiration={keyExpiration}
          onExpirationChange={setKeyExpiration}
        />
      </FormModal>

      {/* New Key Modal (Show full token once) */}
      {newKeyData && (
        <NewKeyModal
          open={showNewKeyModal}
          onClose={handleCloseNewKeyModal}
          apiKey={newKeyData.token}
          keyName={newKeyData.name}
        />
      )}
    </BaseLayout>
  )
}
