"use client"

import { forwardRef, ButtonHTMLAttributes } from "react"
import { cn } from "@/shared/utils/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn/tooltip"

export type IconButtonVariant = "ghost" | "destructive" | "secondary"
export type IconButtonSize = "sm" | "md" | "lg"

const variantStyles: Record<IconButtonVariant, string> = {
  ghost: "hover:bg-muted text-muted-foreground hover:text-foreground",
  destructive: "hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
  secondary: "hover:bg-secondary text-muted-foreground hover:text-foreground",
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-9",
}

const iconSizeStyles: Record<IconButtonSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  tooltip?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", tooltip, children, ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          iconSizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )

    if (tooltip) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }
)

IconButton.displayName = "IconButton"
