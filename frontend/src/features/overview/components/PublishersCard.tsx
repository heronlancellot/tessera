"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import Link from "next/link"
import { useActiveAccount } from "thirdweb/react"
import { usePublishers } from "@/shared/hooks/usePublishers"
import { OverviewCard } from "./OverviewCard"

export function PublishersCard() {
  const account = useActiveAccount()
  const { publishers, requestCounts, isLoading } = usePublishers({
    walletAddress: account?.address,
  })

  // Mock: alguns publishers desabilitados inicialmente
  const [enabledPublishers, setEnabledPublishers] = useState<Set<string>>(() => {
    const enabled = new Set(publishers.map((p) => p.id))
    // Desabilita o segundo e quarto publisher (se existirem)
    const publishersArray = Array.from(enabled)
    if (publishersArray[1]) enabled.delete(publishersArray[1])
    if (publishersArray[3]) enabled.delete(publishersArray[3])
    return enabled
  })

  const togglePublisher = (id: string) => {
    setEnabledPublishers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <OverviewCard
      title="Publishers"
      description="Available paywalls"
      viewAllHref="/dashboard/publishers"
      isLoading={isLoading}
      isEmpty={publishers.length === 0}
      emptyMessage="No publishers available"
    >
      <div className="flex flex-col gap-2">
        {publishers.slice(0, 6).map((publisher) => {
          const isEnabled = enabledPublishers.has(publisher.id)
          const requestCount = requestCounts.get(publisher.id) || 0

          return (
            <div
              key={publisher.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/30 transition-colors"
            >
              {publisher.logo_url ? (
                <img
                  src={publisher.logo_url}
                  alt={publisher.name}
                  className="size-5 rounded object-contain flex-shrink-0"
                />
              ) : (
                <div className="size-5 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <Globe className="size-3 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                {publisher.website ? (
                  <Link
                    href={publisher.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium truncate hover:text-primary transition-colors"
                  >
                    {publisher.name}
                  </Link>
                ) : (
                  <span className="text-xs font-medium truncate">
                    {publisher.name}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">
                  {requestCount} fetched
                </span>
              </div>
              <button
                onClick={() => togglePublisher(publisher.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                  isEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                    isEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </OverviewCard>
  )
}
