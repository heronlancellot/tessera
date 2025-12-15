import { ActivityIcon, ActivityIconHandle } from "@/src/shared/components/animated-icons/activity"
import { GlobeIcon, GlobeIconHandle } from "@/src/shared/components/animated-icons/globe"
import { HomeIcon, HomeIconHandle } from "@/src/shared/components/animated-icons/home"
import { KeyIcon, KeyIconHandle } from "@/src/shared/components/animated-icons/key"
import { SlidersHorizontalIconHandle } from "@/src/shared/components/animated-icons/sliders-horizontal"
import { TerminalIcon, TerminalIconHandle } from "@/src/shared/components/animated-icons/terminal"

export const mainNavItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Playground",
      url: "/playground",
      icon: TerminalIcon,
    },
  ]
  
export const bottomNavItems = [
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
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
    //   icon: SlidersHorizontalIcon,
    // },
  ]
  
export const publishersNavItems = [
    {
      title: "Publishers",
      url: "/publishers",
      icon: GlobeIcon,
    },
  ]

export type IconHandle = HomeIconHandle | TerminalIconHandle | KeyIconHandle | ActivityIconHandle | SlidersHorizontalIconHandle | GlobeIconHandle
