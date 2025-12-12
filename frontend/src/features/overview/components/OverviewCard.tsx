"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/shared/utils/utils"

interface OverviewCardProps {
  title: string
  description: string
  viewAllHref?: string
  children?: React.ReactNode
  className?: string
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  actionButton?: React.ReactNode
}

export function OverviewCard({
  title,
  description,
  viewAllHref,
  children,
  className,
  isLoading,
  isEmpty,
  emptyMessage = "No data available",
  actionButton,
}: OverviewCardProps) {
  return (
    <div className={cn("bg-card border rounded-lg p-6 shadow-sm flex flex-col transition-all hover:shadow-primary/20 hover:shadow-lg hover:border-primary/30", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {(viewAllHref || actionButton) && (
          <div className="flex items-center gap-2">
            {actionButton}
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                View All
                <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center flex-1 min-h-[200px]">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : isEmpty ? (
        <div className="flex items-center justify-center flex-1 min-h-[200px]">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
