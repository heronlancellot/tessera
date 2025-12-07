import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn/dialog"
import { Button } from "@/shared/components/shadcn/button"
import { ReactNode } from "react"

interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSubmit: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isSubmitting = false,
}: FormModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="py-4 space-y-4">{children}</div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
