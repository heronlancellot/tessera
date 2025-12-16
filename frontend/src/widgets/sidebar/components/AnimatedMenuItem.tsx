"use client"

import Link from "next/link"
import { useRef, useCallback } from "react"
import { mainNavItems, bottomNavItems, publishersNavItems, IconHandle } from "../constants"
import { SidebarMenuItem, SidebarMenuButton } from "@/shared/components/shadcn/sidebar"

export const AnimatedMenuItem = ({
  item,
  isActive
}: {
  item: typeof mainNavItems[number] | typeof bottomNavItems[number] | typeof publishersNavItems[number]
  isActive: boolean
}) => {

    const iconRef = useRef<IconHandle>(null)

    const handleMouseEnter = useCallback(() => {
      iconRef.current?.startAnimation()
    }, [])
  
    const handleMouseLeave = useCallback(() => {
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