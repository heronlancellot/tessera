"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { TokenIcon } from "@/shared/components/icons/TokenIcon"
import { useActiveAccount } from "thirdweb/react"
import { useActivity } from "@/features/activity/hooks/useActivity"
import { ActivityRequest } from "@/features/activity/types"
import { OverviewCard } from "./OverviewCard"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface WeekDay {
  day: string
  date: Date
  amount: number
  count: number
}

const getWeeklyData = (requests: ActivityRequest[]): WeekDay[] => {
  const today = new Date()
  const weekData = WEEKDAYS.map((day, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return { day, date, amount: 0, count: 0 }
  })

  requests.forEach((req) => {
    const reqDate = new Date(req.createdAt)
    const dayIndex = weekData.findIndex(
      (w) => w.date.toDateString() === reqDate.toDateString()
    )
    if (dayIndex !== -1) {
      weekData[dayIndex].amount += req.amountUsd
      weekData[dayIndex].count += 1
    }
  })

  return weekData
}

export function UsageCard() {
  const account = useActiveAccount()
  const { requests, isLoading } = useActivity({
    walletAddress: account?.address,
  })

  const totalSpent = useMemo(
    () => requests.reduce((sum, req) => sum + req.amountUsd, 0),
    [requests]
  )

  const weeklyData = useMemo(() => getWeeklyData(requests), [requests])
  const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1)

  return (
    <OverviewCard
      title="Usage"
      description="Last 7 days"
      viewAllHref="/dashboard/activity"
      isLoading={isLoading}
      isEmpty={requests.length === 0}
      emptyMessage="No usage yet"
    >
      <div className="flex items-center gap-1.5">
        <TokenIcon size={16} />
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold font-mono text-destructive">
            -{totalSpent.toFixed(4)}
          </span>
          <span className="text-[10px] text-muted-foreground">total</span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-[180px]">
        {weeklyData.map(({ day, amount, count }, i) => {
          // Calculate bar height - scale up to fill more space
          const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
          const finalHeight = amount > 0 ? Math.max(percentage, 70) : 0

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full">
              <div className="w-full flex-1 flex flex-col justify-end">
                <motion.div
                  className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary min-h-[2px]"
                  initial={{ height: 0 }}
                  animate={{ height: finalHeight > 0 ? `${finalHeight}%` : "2px" }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-muted-foreground/80 font-mono">
                  {count}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {day}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </OverviewCard>
  )
}
