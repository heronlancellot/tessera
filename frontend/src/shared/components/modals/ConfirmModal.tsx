"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn/dialog"
import { Button } from "@/shared/components/shadcn/button"
import { Input } from "@/shared/components/shadcn/input"
import { Label } from "@/shared/components/shadcn/label"

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText: string
  onConfirm: () => void | Promise<void>
  variant?: "destructive" | "warning" | "default"
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  onConfirm,
  variant = "destructive",
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = inputValue === confirmText

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!open) {
      setInputValue("")
      setIsSubmitting(false)
    }
  }, [open])

  const handleConfirm = async () => {
    if (!isValid) return

    setIsSubmitting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleConfirm()
  }

  const variantStyles = {
    destructive: {
      icon: "text-red-600 dark:text-red-500",
      border: "border-red-200 dark:border-red-800/50",
      bg: "bg-red-50/50 dark:bg-red-900/10",
    },
    warning: {
      icon: "text-amber-600 dark:text-amber-500",
      border: "border-amber-200 dark:border-amber-800/50",
      bg: "bg-amber-50/50 dark:bg-amber-900/10",
    },
    default: {
      icon: "text-blue-600 dark:text-blue-500",
      border: "border-blue-200 dark:border-blue-800/50",
      bg: "bg-blue-50/50 dark:bg-blue-900/10",
    },
  }

  const styles = variantStyles[variant]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Warning Banner */}
            <div className={`flex items-start gap-3 rounded-lg border ${styles.border} ${styles.bg} p-3`}>
              <AlertTriangle className={`size-5 ${styles.icon} flex-shrink-0`} />
              <p className="text-sm font-medium text-foreground">
                This action cannot be undone
              </p>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <Label htmlFor="confirm-input" className="text-sm font-medium block">
                Type <code className="font-mono text-sm font-semibold bg-muted px-1.5 py-0.5 rounded">{confirmText}</code> to confirm
              </Label>
              <Input
                id="confirm-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={confirmText}
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={variant === "destructive" ? "destructive" : "default"}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
