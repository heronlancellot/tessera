/**
 * API Key Validation Middleware
 *
 * Validates Tessera API keys from Authorization header
 * Attaches userId and apiKeyId to request for analytics
 */

import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { supabase } from '../lib/supabase.js'

// Extend Express Request to include auth context
declare global {
  namespace Express {
    interface Request {
      userId?: string
      apiKeyId?: string
    }
  }
}

// Type for API key validation result from database function
interface ApiKeyValidationResult {
  is_valid: boolean
  expires_at: string | null
  user_id: string
  api_key_id: string
}

/**
 * Hash API key using SHA-256 (same as frontend)
 */
function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Validate API key middleware
 *
 * Optional by default - if no API key provided, allows request through
 * Set required=true to enforce API key validation
 */
export function validateApiKey(required = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Allow OPTIONS requests (CORS preflight) to pass through
      if (req.method === 'OPTIONS') {
        next()
        return
      }

      // Extract API key from Authorization header
      const authHeader = req.headers['authorization']

      if (!authHeader) {
        if (required) {
          res.status(401).json({
            error: 'API key required',
            message: 'Please provide an API key in Authorization header: Bearer tsr_...'
          })
          return
        }
        // Optional mode - allow through without auth
        next()
        return
      }

      // Parse Bearer token
      const parts = authHeader.split(' ')
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
          error: 'Invalid authorization header',
          message: 'Format: Authorization: Bearer tsr_...'
        })
        return
      }

      const apiKey = parts[1]

      // Validate key format (should start with tsr_)
      if (!apiKey.startsWith('tsr_')) {
        res.status(401).json({
          error: 'Invalid API key format',
          message: 'API key must start with tsr_'
        })
        return
      }

      // Hash the key for lookup
      const keyHash = hashApiKey(apiKey)

      // Validate API key using secure function
      const { data: validationResult, error } = await supabase
        .rpc('validate_api_key', { p_key_hash: keyHash })
        .single() as { data: ApiKeyValidationResult | null; error: any }

      if (error || !validationResult) {
        res.status(401).json({
          error: 'Invalid API key',
          message: 'API key not found or has been revoked'
        })
        return
      }

      // Check if key is valid (function checks is_active and expiration)
      if (!validationResult.is_valid) {
        const expiresAt = validationResult.expires_at
        const message = expiresAt && new Date(expiresAt) < new Date()
          ? `This API key expired on ${new Date(expiresAt).toISOString()}`
          : 'This API key has been deactivated'

        res.status(401).json({
          error: 'API key invalid',
          message
        })
        return
      }

      // TODO: Rate limiting check
      // if (validationResult.rate_limit) {
      //   // Check requests in last hour against rate_limit
      // }

      // Update last_used_at timestamp (fire and forget)
      supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', validationResult.api_key_id)
        .then() // Don't await

      // Attach auth context to request
      req.userId = validationResult.user_id
      req.apiKeyId = validationResult.api_key_id

      next()
    } catch (error) {
      console.error('API key validation error:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to validate API key'
      })
    }
  }
}
