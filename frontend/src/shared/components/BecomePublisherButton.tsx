"use client"

import { Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/shadcn/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/shadcn/tooltip"

export function BecomePublisherButton() {
  const router = useRouter()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/publishers/new")}
            className="shrink-0"
          >
            <Briefcase className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Want to start earning?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
