"use client"

import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "@/shared/components/shadcn/input"
import { Button } from "@/shared/components/shadcn/button"
import { Label } from "@/shared/components/shadcn/label"
import { supabase } from "@/shared/utils/supabase"

type NewPublisherFormInputs = {
  wallet_address: string
  name: string
  slug: string
  website: string
  logo_url?: string
}

interface NewPublisherFormProps {
  onSuccess?: (publisher: any) => void
  onCancel?: () => void
}

export const NewPublisherForm = ({ onSuccess, onCancel }: NewPublisherFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewPublisherFormInputs>()

  const onSubmit: SubmitHandler<NewPublisherFormInputs> = async (data) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Insert directly into Supabase (uses authenticated session from login)
      const { data: publisher, error: insertError } = await supabase
        .from('publishers')
        .insert({
          wallet_address: data.wallet_address,
          name: data.name,
          slug: data.slug,
          website: data.website,
          logo_url: data.logo_url || null,
          status: 'pending',
          is_active: false,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      setSuccess(true)
      reset()

      if (onSuccess) {
        onSuccess(publisher)
      }
    } catch (err: any) {
      console.error('Error registering publisher:', err)
      setError(err.message || 'An error occurred while registering the publisher')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Wallet Address */}
      <div className="space-y-2">
        <Label htmlFor="wallet_address">
          Wallet Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="wallet_address"
          placeholder="0x1234567890abcdef..."
          {...register("wallet_address", {
            required: "Wallet address is required",
            pattern: {
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum wallet address format",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.wallet_address && (
          <p className="text-sm text-destructive">{errors.wallet_address.message}</p>
        )}
      </div>

      {/* Publisher Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Publisher Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., My News Platform"
          {...register("name", {
            required: "Publisher name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">
          Slug (Unique Identifier) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          placeholder="e.g., /article/ai-agents-2025 or my-news-platform"
          {...register("slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9\/-]+$/,
              message: "Slug can only contain lowercase letters, numbers, hyphens, and forward slashes",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Used for URL matching. Can be a path like "/article/title" or a simple identifier like "publisher-name".
        </p>
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <Label htmlFor="website">
          Website URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="website"
          placeholder="https://example.com"
          {...register("website", {
            required: "Website URL is required",
            pattern: {
              value: /^https?:\/\/.+\..+/,
              message: "Please enter a valid URL (http:// or https://)",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.website && (
          <p className="text-sm text-destructive">{errors.website.message}</p>
        )}
      </div>

      {/* Logo URL (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL (Optional)</Label>
        <Input
          id="logo_url"
          placeholder="https://example.com/logo.png"
          {...register("logo_url", {
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Please enter a valid URL",
            },
          })}
          disabled={isSubmitting}
        />
        {errors.logo_url && (
          <p className="text-sm text-destructive">{errors.logo_url.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Publisher registration submitted successfully! Your application is pending review.
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Register Publisher"}
        </Button>
      </div>
    </form>
  )
}
