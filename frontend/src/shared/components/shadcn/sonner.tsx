"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const TOAST_CLASS_NAMES = {
  toast:
    "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
  description: "group-[.toast]:text-muted-foreground",
  actionButton:
    "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
  cancelButton:
    "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
  success: "[&_svg]:!text-green-500",
  error: "[&_svg]:!text-red-500",
  warning: "[&_svg]:!text-orange-500",
  info: "[&_svg]:!text-blue-500",
} as const

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: TOAST_CLASS_NAMES,
      }}
      {...props}
    />
  )
}

export { Toaster }
