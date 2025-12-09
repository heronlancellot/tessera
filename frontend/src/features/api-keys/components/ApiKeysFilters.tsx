"use client"

import { SearchInput } from "@/shared/components/ui"

interface ApiKeysFiltersProps {
  search: string
  onSearchChange: (value: string) => void
}

export function ApiKeysFilters({ search, onSearchChange }: ApiKeysFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search API keys..."
        containerClassName="flex-1 max-w-sm"
      />
    </div>
  )
}
