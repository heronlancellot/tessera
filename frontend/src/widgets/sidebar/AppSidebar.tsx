"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { HomeIcon, type HomeIconHandle } from "@/shared/components/animated-icons/home"
import { TerminalIcon, type TerminalIconHandle } from "@/shared/components/animated-icons/terminal"
import { KeyIcon, type KeyIconHandle } from "@/shared/components/animated-icons/key"
import { ActivityIcon, type ActivityIconHandle } from "@/shared/components/animated-icons/activity"
import { SlidersHorizontalIcon, type SlidersHorizontalIconHandle } from "@/shared/components/animated-icons/sliders-horizontal"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/shared/components/shadcn/sidebar"

const mainNavItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Playground",
    url: "/dashboard/playground",
    icon: TerminalIcon,
  },
]

const bottomNavItems = [
  {
    title: "API Keys",
    url: "/dashboard/api-keys",
    icon: KeyIcon,
  },
  {
    title: "Activity",
    url: "/dashboard/activity",
    icon: ActivityIcon,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SlidersHorizontalIcon,
  },
]

type IconHandle = HomeIconHandle | TerminalIconHandle | KeyIconHandle | ActivityIconHandle | SlidersHorizontalIconHandle

function AnimatedMenuItem({
  item,
  isActive
}: {
  item: typeof mainNavItems[number] | typeof bottomNavItems[number]
  isActive: boolean
}) {
  const iconRef = React.useRef<IconHandle>(null)

  const handleMouseEnter = React.useCallback(() => {
    iconRef.current?.startAnimation()
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    iconRef.current?.stopAnimation()
  }, [])

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="data-[active=true]:bg-green-800 data-[active=true]:text-white data-[active=true]:hover:bg-green-700"
      >
        <Link
          href={item.url}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <item.icon ref={iconRef} size={16} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tessera</span>
                  <span className="truncate text-xs">AI Gateway</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <AnimatedMenuItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <AnimatedMenuItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
