"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/shared/utils/utils"

// Column definition
export interface Column<T> {
  key: string
  header: string
  width?: string
  align?: "left" | "center" | "right"
  render: (item: T) => ReactNode
  /** Hide on mobile (< 640px) */
  hideOnMobile?: boolean
  /** Hide on tablet (< 1024px) */
  hideOnTablet?: boolean
}

// Table props
interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyState?: ReactNode
  isLoading?: boolean
  className?: string
  /** Render function for mobile card view */
  mobileCard?: (item: T) => ReactNode
}

const rowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
  isLoading,
  className,
  mobileCard,
}: DataTableProps<T>) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  if (isLoading) {
    return (
      <div className={cn("border rounded-lg overflow-hidden", className)}>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Loading...
        </div>
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("border rounded-lg overflow-hidden", className)}>
        <div className="flex items-center justify-center h-32">
          {emptyState}
        </div>
      </div>
    )
  }

  // Mobile card view
  if (mobileCard) {
    return (
      <>
        {/* Mobile card view */}
        <div className={cn("md:hidden space-y-3", className)}>
          {data.map((item, index) => (
            <motion.div
              key={keyExtractor(item)}
              className="border rounded-lg p-4 bg-card"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.03 }}
            >
              {mobileCard(item)}
            </motion.div>
          ))}
        </div>

        {/* Desktop table view */}
        <div className={cn("hidden md:block border rounded-lg overflow-hidden", className)}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                        alignmentClasses[column.align || "left"],
                        column.hideOnTablet && "hidden lg:table-cell"
                      )}
                      style={{ width: column.width }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((item, index) => (
                  <motion.tr
                    key={keyExtractor(item)}
                    className="hover:bg-muted/30 transition-colors"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.03 }}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-4 py-3 text-sm",
                          alignmentClasses[column.align || "left"],
                          column.hideOnTablet && "hidden lg:table-cell"
                        )}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  }

  // Default table-only view with horizontal scroll
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-muted/50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                    alignmentClasses[column.align || "left"],
                    column.hideOnMobile && "hidden sm:table-cell",
                    column.hideOnTablet && "hidden lg:table-cell"
                  )}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item)}
                className="hover:bg-muted/30 transition-colors"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.03 }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm",
                      alignmentClasses[column.align || "left"],
                      column.hideOnMobile && "hidden sm:table-cell",
                      column.hideOnTablet && "hidden lg:table-cell"
                    )}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
