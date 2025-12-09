"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { DataTable, Column } from "@/shared/components/ui"
import { StatusIcon } from "@/shared/components/animated-icons/status-icons"
import { TokenIcon } from "@/shared/components/icons/TokenIcon"
import type { ActivityRequest } from "../types"

interface ActivityTableProps {
  requests: ActivityRequest[]
  isLoading?: boolean
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatRequestType = (type: string) => `/${type}`

const getRequestPayload = (req: ActivityRequest) => ({
  url: req.url,
  apiKeyUsed: req.apiKeyName || "Unknown",
  ...(req.errorMessage && { error: req.errorMessage }),
})

const renderPayload = (payload: ReturnType<typeof getRequestPayload>) => (
  <div className="bg-slate-950 rounded-md p-3 border border-slate-800">
    <pre className="font-mono text-xs text-emerald-400 overflow-x-auto">
      {JSON.stringify(payload, null, 2)}
    </pre>
  </div>
)

export function ActivityTable({ requests, isLoading }: ActivityTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const columns: Column<ActivityRequest>[] = [
    {
      key: "created",
      header: "Date",
      width: "15%",
      render: (req) => (
        <span className="text-muted-foreground font-mono text-xs">
          {formatDate(req.createdAt)}
        </span>
      ),
    },
    {
      key: "type",
      header: "Endpoint",
      width: "15%",
      render: (req) => (
        <code className="font-mono text-sm">
          {formatRequestType(req.requestType)}
        </code>
      ),
    },
    {
      key: "amount",
      header: "Credits",
      width: "12%",
      align: "right",
      render: (req) => (
        <div className="flex items-center justify-end gap-1.5">
          <TokenIcon size={16} />
          <span className="font-mono text-sm text-destructive">
            -{req.amountUsd.toFixed(4)}
          </span>
        </div>
      ),
    },
    {
      key: "responseTime",
      header: "Response Time",
      width: "15%",
      align: "right",
      hideOnTablet: true,
      render: (req) => (
        <span className="text-muted-foreground font-mono text-sm">
          {req.responseTimeMs ? `${req.responseTimeMs}ms` : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "10%",
      align: "center",
      render: (req) => (
        <div className="flex items-center justify-center">
          <StatusIcon status={req.status} size={20} />
        </div>
      ),
    },
    {
      key: "expand",
      header: "",
      width: "3%",
      render: (req) => (
        <button
          onClick={() => toggleRow(req.id)}
          className="hover:bg-accent rounded p-1 transition-colors"
        >
          {expandedRows.has(req.id) ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
      ),
    },
  ]

  const renderExpandedContent = (req: ActivityRequest) => {
    if (!expandedRows.has(req.id)) return null

    return (
      <div className="px-4 py-3 bg-muted/50 border-t">
        {renderPayload(getRequestPayload(req))}
      </div>
    )
  }

  const renderMobileCard = (req: ActivityRequest) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="font-mono text-sm">
              {formatRequestType(req.requestType)}
            </code>
            <StatusIcon status={req.status} size={16} />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {formatDate(req.createdAt)}
          </span>
        </div>
        <button
          onClick={() => toggleRow(req.id)}
          className="hover:bg-accent rounded p-1 transition-colors flex-shrink-0"
        >
          {expandedRows.has(req.id) ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <TokenIcon size={14} />
          <span className="font-mono text-destructive">-{req.amountUsd.toFixed(4)}</span>
        </div>
        {req.responseTimeMs && (
          <span className="text-muted-foreground font-mono">
            {req.responseTimeMs}ms
          </span>
        )}
      </div>

      {expandedRows.has(req.id) && (
        <div className="pt-2 border-t">
          {renderPayload(getRequestPayload(req))}
        </div>
      )}
    </div>
  )

  return (
    <DataTable
      columns={columns}
      data={requests}
      keyExtractor={(req) => req.id}
      isLoading={isLoading}
      mobileCard={renderMobileCard}
      expandedContent={renderExpandedContent}
      emptyState={
        <div className="text-center py-8">
          <p className="text-muted-foreground">No activity found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Your API requests will appear here
          </p>
        </div>
      }
    />
  )
}
