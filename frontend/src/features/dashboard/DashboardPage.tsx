"use client"

import { BaseLayout } from "@/shared/components/layouts/BaseLayout"

export function DashboardPage() {
  return (
    <BaseLayout title="Dashboard">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your Tessera dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">API Keys</h3>
            <p className="text-sm text-muted-foreground">Manage your API keys</p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Active Agents</h3>
            <p className="text-sm text-muted-foreground">Configure your AI agents</p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Usage</h3>
            <p className="text-sm text-muted-foreground">View usage statistics</p>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
