import { toast } from "./toast"

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogOptions {
  showToast?: boolean
  toastMessage?: string
  context?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private log(level: LogLevel, message: string, options?: LogOptions) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    // Sempre loga no console em desenvolvimento
    if (this.isDevelopment) {
      const logMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.log
      if (options?.context) {
        logMethod(`${prefix} ${message}`, options.context)
      } else {
        logMethod(`${prefix} ${message}`)
      }
    }

    // Mostra toast se solicitado
    if (options?.showToast && options?.toastMessage) {
      if (level === "error") {
        toast.error(options.toastMessage, message)
      } else if (level === "warn") {
        toast.warning(options.toastMessage, message)
      } else if (level === "info") {
        toast.info(options.toastMessage, message)
      }
    }
  }

  info(message: string, options?: LogOptions) {
    this.log("info", message, options)
  }

  warn(message: string, options?: LogOptions) {
    this.log("warn", message, options)
  }

  error(message: string, error?: Error | unknown, options?: LogOptions) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    this.log("error", `${message}: ${errorMessage}`, {
      ...options,
      context: { ...options?.context, error },
    })
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log("debug", message, { context })
    }
  }
}

export const logger = new Logger()
