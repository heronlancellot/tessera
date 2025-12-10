"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Play, Eye, Download, Copy, Check, AlertTriangle } from "lucide-react"
import { fadeInVariants } from "@/shared/utils/animations"
import { BaseLayout } from "@/shared/components/layouts/BaseLayout"
import { PageHeader } from "@/shared/components/ui"
import { Tessera } from "@tessera-sdk/sdk"
import type { PreviewResponse, FetchResponse } from "@tessera-sdk/sdk"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card"
import { Button } from "@/shared/components/shadcn/button"
import { Input } from "@/shared/components/shadcn/input"
import { Label } from "@/shared/components/shadcn/label"
import { ScrollArea } from "@/shared/components/shadcn/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/shadcn/alert"
import { env } from "@/shared/config/env"
import { toast } from "@/shared/utils/toast"

export function PlaygroundPage() {
  const [baseUrl, setBaseUrl] = useState(env.gatewayUrl || "http://localhost:3001")
  const [privateKey, setPrivateKey] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [url, setUrl] = useState("")
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [previewResult, setPreviewResult] = useState<PreviewResponse | null>(null)
  const [fetchResult, setFetchResult] = useState<FetchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handlePreview = async () => {
    if (!url.trim()) {
      toast.error("URL is required", "Please enter a URL to preview")
      return
    }

    setIsLoadingPreview(true)
    setError(null)
    setPreviewResult(null)
    setFetchResult(null)

    try {
      const tessera = new Tessera({
        baseUrl,
        apiKey: apiKey || undefined,
      })

      const result = await tessera.preview(url)
      setPreviewResult(result)
      toast.success("Preview successful!", "Content preview loaded")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to preview content"
      setError(errorMessage)
      toast.error("Preview failed", errorMessage)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error("URL is required", "Please enter a URL to fetch")
      return
    }

    if (!privateKey.trim()) {
      toast.error("Private key required", "Private key is needed for payments")
      return
    }

    setIsLoadingFetch(true)
    setError(null)
    setFetchResult(null)

    try {
      const tessera = new Tessera({
        baseUrl,
        apiKey: apiKey || undefined,
        privateKey: privateKey.trim(),
      })

      const result = await tessera.fetch(url)
      setFetchResult(result)
      toast.success("Fetch successful!", "Content fetched and payment processed")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch content"
      setError(errorMessage)
      toast.error("Fetch failed", errorMessage)
    } finally {
      setIsLoadingFetch(false)
    }
  }

  const handleCopyResult = () => {
    const textToCopy = fetchResult
      ? JSON.stringify(fetchResult, null, 2)
      : previewResult
        ? JSON.stringify(previewResult, null, 2)
        : ""

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Copied!", "Result copied to clipboard")
    }
  }

  return (
    <BaseLayout title="Playground">
      <motion.div
        className="flex flex-1 flex-col gap-6 p-6"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title="SDK Playground"
          description="Test the Tessera SDK interactively. Preview content for free or fetch full content with automatic payments."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure your SDK instance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Gateway URL</Label>
                <Input
                  id="baseUrl"
                  type="text"
                  placeholder="http://localhost:3001"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privateKey">Private Key (Required for Fetch)</Label>
                <Input
                  id="privateKey"
                  type="password"
                  placeholder="0x..."
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="size-4" />
                  <AlertTitle>Security Warning</AlertTitle>
                  <AlertDescription>
                    Never share your private key. This is for testing purposes only.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Article URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://publisher.com/article/123"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handlePreview}
                  disabled={isLoadingPreview || isLoadingFetch}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoadingPreview ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" />
                      Preview
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleFetch}
                  disabled={isLoadingPreview || isLoadingFetch || !privateKey.trim()}
                  className="flex-1"
                >
                  {isLoadingFetch ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="size-4" />
                      Fetch
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Results</CardTitle>
                  <CardDescription>View preview or fetch results</CardDescription>
                </div>
                {(previewResult || fetchResult) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyResult}
                    aria-label="Copy result"
                  >
                    {copied ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {previewResult && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Preview Result</h3>
                    <ScrollArea className="h-[400px] rounded-lg border p-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Title:</span>
                          <p className="mt-1">{previewResult.title}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Publisher:</span>
                          <p className="mt-1">{previewResult.publisher}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Price:</span>
                          <p className="mt-1">${previewResult.price}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Preview:</span>
                          <p className="mt-1 text-sm whitespace-pre-wrap">{previewResult.preview}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">URL:</span>
                          <p className="mt-1 text-sm break-all">{previewResult.url}</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {fetchResult && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Fetch Result</h3>
                    <ScrollArea className="h-[400px] rounded-lg border p-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Publisher:</span>
                          <p className="mt-1">{fetchResult.publisher}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Fetched At:</span>
                          <p className="mt-1">{new Date(fetchResult.fetched_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Markdown Content:</span>
                          <ScrollArea className="h-[250px] mt-2 rounded border p-3 bg-muted">
                            <pre className="text-xs whitespace-pre-wrap font-mono">
                              {fetchResult.markdown}
                            </pre>
                          </ScrollArea>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {!previewResult && !fetchResult && !error && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <Play className="size-12 mb-4 opacity-50" />
                  <p className="text-sm">Configure settings and click Preview or Fetch to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </BaseLayout>
  )
}
