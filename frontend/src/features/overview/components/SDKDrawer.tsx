"use client"

import { useState, useEffect } from "react"
import { X, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useActiveAccount } from "thirdweb/react"
import { useApiKeys } from "@/features/api-keys/hooks/useApiKeys"
import { env } from "@/shared/config/env"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select"

interface SDKDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const LANGUAGES = [
  { id: "js", name: "JavaScript" },
  { id: "curl", name: "cURL" },
]

const getCodeSnippet = (language: string, apiKey: string) => {
  const jsSnippet = `import { Tessera } from '@tessera/sdk'

// Initialize SDK
const tessera = new Tessera({
  privateKey: process.env.AGENT_PRIVATE_KEY,
  baseUrl: '${env.gatewayUrl}',
  apiKey: '${apiKey}'
})

// Preview content (free)
const preview = await tessera.preview('https://example.com/article')
console.log(preview.title, preview.price)

// Fetch full content (pays with USDC)
const content = await tessera.fetch('https://example.com/article')
console.log(content.markdown)`

  const curlSnippet = `# Preview content (free)
curl "${env.gatewayUrl}/preview?url=https://example.com/article" \\
  -H "Authorization: Bearer ${apiKey}"

# Fetch full content (requires payment)
curl "${env.gatewayUrl}/fetch?url=https://example.com/article" \\
  -H "Authorization: Bearer ${apiKey}"`

  const snippets: Record<string, string> = {
    js: jsSnippet,
    curl: curlSnippet,
  }

  return snippets[language] || jsSnippet
}

export function SDKDrawer({ isOpen, onClose }: SDKDrawerProps) {
  const account = useActiveAccount()
  const { apiKeys, isLoading } = useApiKeys({ walletAddress: account?.address })
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState("js")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (apiKeys.length > 0 && !selectedApiKeyId) {
      setSelectedApiKeyId(apiKeys[0].id)
    }
  }, [apiKeys, selectedApiKeyId])

  const handleCopy = () => {
    const code = getCodeSnippet(selectedLanguage, "YOUR_API_KEY")
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedKey = apiKeys.find((k) => k.id === selectedApiKeyId)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Code Snippets
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Quick integration examples
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* API Key Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select API Key
                </label>
                <Select
                  value={selectedApiKeyId}
                  onValueChange={setSelectedApiKeyId}
                  disabled={isLoading || apiKeys.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an API key" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiKeys.map((apiKey) => (
                      <SelectItem key={apiKey.id} value={apiKey.id}>
                        {apiKey.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {apiKeys.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No API keys found. Create one first.
                  </p>
                )}
              </div>

              {/* Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Quick Start</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Preview paywalled content for free, then fetch full content with automatic USDC payments.
                </p>

                {/* Language Tabs */}
                <div className="flex gap-2 mb-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        selectedLanguage === lang.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                {/* Code Block */}
                <div className="relative">
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 bg-muted hover:bg-muted/80 rounded transition-colors"
                    disabled={!selectedKey}
                  >
                    {copied ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{getCodeSnippet(selectedLanguage, "YOUR_API_KEY")}</code>
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
