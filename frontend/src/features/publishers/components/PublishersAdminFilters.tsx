"use client"

import { SearchInput } from "@/shared/components/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn/select"
import type { PublisherStatus } from "@/shared/services/publishersAdminService"

interface PublishersAdminFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: PublisherStatus | "all"
  onStatusChange: (status: PublisherStatus | "all") => void
}

export function PublishersAdminFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: PublishersAdminFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search publishers..."
        containerClassName="flex-1 max-w-sm"
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
