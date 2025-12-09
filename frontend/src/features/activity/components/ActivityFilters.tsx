"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select"
import type { FilterType, FilterStatus } from "../types"

interface ActivityFiltersProps {
  type: FilterType
  onTypeChange: (value: FilterType) => void
  status: FilterStatus
  onStatusChange: (value: FilterStatus) => void
}

export function ActivityFilters({
  type,
  onTypeChange,
  status,
  onStatusChange,
}: ActivityFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Endpoint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Endpoints</SelectItem>
          <SelectItem value="preview"><code className="font-mono text-xs">/preview</code></SelectItem>
          <SelectItem value="fetch"><code className="font-mono text-xs">/fetch</code></SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
