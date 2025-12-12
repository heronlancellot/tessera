"use client"

import { AppSidebar } from "@/widgets/sidebar/AppSidebar"
import { WalletButton } from "@/shared/components/WalletButton"
import { NetworkSelector } from "@/shared/components/NetworkSelector"
import { BecomePublisherButton } from "@/shared/components/BecomePublisherButton"
import { useUser } from "@/shared/hooks/useUser"
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/shadcn/sidebar"

interface BaseLayoutProps {
  children: React.ReactNode
  title: string
}

export function BaseLayout({ children, title }: BaseLayoutProps) {
  const { isAdmin } = useUser()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          {!isAdmin && (
            <div className="flex items-center gap-2">
              <BecomePublisherButton />
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <NetworkSelector />
            <WalletButton />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
