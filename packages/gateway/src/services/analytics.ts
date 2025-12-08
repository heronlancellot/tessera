/**
 * Analytics Service
 *
 * Tracks API requests for usage analytics
 */

import { supabase } from '../lib/supabase.js'

export interface RequestLog {
  userId: string
  apiKeyId: string
  requestType: 'preview' | 'fetch'
  url: string
  endpointId?: string
  amountUsd: number
  txHash?: string
  status: 'pending' | 'completed' | 'failed'
  errorMessage?: string
  responseTimeMs?: number
  agentId?: string
}

/**
 * Log an API request
 * Fire-and-forget - doesn't block the response
 */
export async function logRequest(data: RequestLog): Promise<void> {
  try {
    console.log('[Analytics] Logging request:', { type: data.requestType, url: data.url, status: data.status })

    const { error } = await supabase.rpc('log_request', {
      p_user_id: data.userId,
      p_api_key_id: data.apiKeyId,
      p_request_type: data.requestType,
      p_url: data.url,
      p_endpoint_id: data.endpointId || null,
      p_amount_usd: data.amountUsd,
      p_tx_hash: data.txHash || null,
      p_status: data.status,
      p_error_message: data.errorMessage || null,
      p_response_time_ms: data.responseTimeMs || null,
      p_agent_id: data.agentId || null
    })

    if (error) {
      console.error('[Analytics] Failed to log request:', error)
    } else {
      console.log('[Analytics] Request logged successfully')
    }
  } catch (error) {
    // Log error but don't throw - analytics shouldn't break the request
    console.error('[Analytics] Exception while logging request:', error)
  }
}
