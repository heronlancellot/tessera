"use client"

import { forwardRef, InputHTMLAttributes } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/shared/utils/utils"

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, className, containerClassName, placeholder = "Search...", ...props }, ref) => {
    const handleClear = () => {
      onChange("")
      onClear?.()
    }

    return (
      <div className={cn("relative", containerClassName)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-9 pl-9 pr-9 rounded-md border border-input bg-background",
            "text-sm placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            "transition-colors",
            className
          )}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted transition-colors"
          >
            <X className="size-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"
