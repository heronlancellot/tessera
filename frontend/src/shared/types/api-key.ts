export interface ApiKey {
  id: string
  name: string
  token: string
  expiresAt: string | null
  lastUsed: string | null
  created: string
}

export type ExpirationOption = "never" | "7days" | "30days" | "90days" | "1year"

export const EXPIRATION_OPTIONS: { value: ExpirationOption; label: string; days: number | null }[] = [
  { value: "never", label: "Never", days: null },
  { value: "7days", label: "7 days", days: 7 },
  { value: "30days", label: "30 days", days: 30 },
  { value: "90days", label: "90 days", days: 90 },
  { value: "1year", label: "1 year", days: 365 },
]
