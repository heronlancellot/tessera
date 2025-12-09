"use client"

import { useState } from "react"
import { Copy, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn/dialog"
import { Button } from "@/shared/components/shadcn/button"
import { IconButton } from "@/shared/components/ui"

interface NewKeyModalProps {
  open: boolean
  onClose: () => void
  apiKey: string
  keyName: string
}

export function NewKeyModal({ open, onClose, apiKey, keyName }: NewKeyModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy", error)
    }
  }

  const handleClose = () => {
    setCopied(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-500" />
            API Key Created
          </DialogTitle>
          <DialogDescription>
            Your API key <span className="font-medium text-foreground">{keyName}</span> has been created successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-4">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-600 dark:text-red-500 mb-1">
                Save your API key now
              </p>
              <p className="text-xs text-muted-foreground">
                You won't be able to see it again after closing this dialog.
              </p>
            </div>
          </div>

          {/* API Key Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">API Key</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-muted px-3 py-2.5 text-sm font-mono break-all border">
                {apiKey}
              </code>
              <IconButton
                size="lg"
                variant={copied ? "secondary" : "ghost"}
                onClick={handleCopy}
                tooltip={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? <CheckCircle2 className="text-green-500" /> : <Copy />}
              </IconButton>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            {copied ? "Done" : "I've copied my key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
