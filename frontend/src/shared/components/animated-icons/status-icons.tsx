"use client"

import { motion, type Transition } from "framer-motion"
import { cn } from "@/shared/utils/utils"

interface StatusIconProps {
  className?: string
  size?: number
}

const baseSvgProps = {
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
}

const basePathProps = {
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  duration: 0.3,
}

// Completed/Success Icon - Check
export function CheckIcon({ className, size = 16 }: StatusIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      {...baseSvgProps}
      className={cn("text-primary", className)}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={springTransition}
    >
      <motion.path
        d="M13.3334 4L6.00002 11.3333L2.66669 8"
        stroke="currentColor"
        {...basePathProps}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
    </motion.svg>
  )
}

// Failed/Error Icon - X
export function XIcon({ className, size = 16 }: StatusIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      {...baseSvgProps}
      className={cn("text-destructive", className)}
      initial={{ scale: 0, rotate: 90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={springTransition}
    >
      <motion.path
        d="M12 4L4 12"
        stroke="currentColor"
        {...basePathProps}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.path
        d="M4 4L12 12"
        stroke="currentColor"
        {...basePathProps}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </motion.svg>
  )
}

// Pending Icon - Hourglass
export function HourglassIcon({ className, size = 16 }: StatusIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-secondary-foreground", className)}
      animate={{
        rotateZ: [0, 180, 180, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 0.5,
        ease: "easeInOut"
      }}
    >
      <path
        d="M3.33331 2H12.6666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33331 14H12.6666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6666 2L9.99998 8L12.6666 14H3.33331L5.99998 8L3.33331 2H12.6666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M6 5.5L10 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.6}
        animate={{
          y: [0, 4, 4, 0],
          opacity: [0.6, 0.6, 0, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  )
}

// Wrapper component to select the right icon based on status
interface StatusIconWrapperProps {
  status: "completed" | "pending" | "failed"
  className?: string
  size?: number
}

export function StatusIcon({ status, className, size }: StatusIconWrapperProps) {
  switch (status) {
    case "completed":
      return <CheckIcon className={className} size={size} />
    case "pending":
      return <HourglassIcon className={className} size={size} />
    case "failed":
      return <XIcon className={className} size={size} />
    default:
      return null
  }
}
