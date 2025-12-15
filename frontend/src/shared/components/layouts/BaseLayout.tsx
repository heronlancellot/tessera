"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/widgets/sidebar/AppSidebar"
import { WalletButton } from "@/shared/components/WalletButton"
import { NetworkSelector } from "@/shared/components/NetworkSelector"
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/shadcn/sidebar"

interface BaseLayoutProps {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
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
