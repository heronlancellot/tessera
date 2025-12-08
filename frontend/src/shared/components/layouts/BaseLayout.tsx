"use client"

import { AppSidebar } from "@/widgets/sidebar/AppSidebar"
import { WalletButton } from "@/shared/components/WalletButton"
import { NetworkSelector } from "@/shared/components/NetworkSelector"
import { Separator } from "@/shared/components/shadcn/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/shadcn/sidebar"

interface BaseLayoutProps {
  children: React.ReactNode
  title: string
}

export function BaseLayout({ children, title }: BaseLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
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
