"use client"

import { useState } from "react"
import { Code, Key } from "lucide-react"
import Link from "next/link"
import { OverviewCard } from "./OverviewCard"
import { SDKDrawer } from "./SDKDrawer"

export function SDKSetupCard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <OverviewCard
        title="Integration"
        description="Get started quickly"
      >
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-3 mb-auto mt-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              <Code className="size-4" />
              View Code Snippets
            </button>

            <Link
              href="/dashboard/api-keys"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-md hover:bg-accent transition-colors font-medium text-sm"
            >
              <Key className="size-4" />
              Manage API Keys
            </Link>
          </div>

          <Link
            href="/playground"
            className="text-xs text-center text-primary hover:text-primary/80 transition-colors font-medium mt-6"
          >
            Try the Playground →
          </Link>
        </div>
      </OverviewCard>

      <SDKDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
