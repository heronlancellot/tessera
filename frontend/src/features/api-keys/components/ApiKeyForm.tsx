import { Label } from "@/shared/components/shadcn/label"
import { Input } from "@/shared/components/shadcn/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select"
import { EXPIRATION_OPTIONS, ExpirationOption } from "@/shared/types/api-key"

interface ApiKeyFormProps {
  name: string
  onNameChange: (name: string) => void
  expiration: ExpirationOption
  onExpirationChange: (expiration: ExpirationOption) => void
  nameError?: string
}

export function ApiKeyForm({
  name,
  onNameChange,
  expiration,
  onExpirationChange,
  nameError,
}: ApiKeyFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="key-name">API Key Name</Label>
        <Input
          id="key-name"
          placeholder="e.g., Production Key"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          autoFocus
        />
        {nameError && <p className="text-sm text-destructive">{nameError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiration">Expiration</Label>
        <Select value={expiration} onValueChange={(value) => onExpirationChange(value as ExpirationOption)}>
          <SelectTrigger id="expiration">
            <SelectValue placeholder="Select expiration" />
          </SelectTrigger>
          <SelectContent>
            {EXPIRATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
