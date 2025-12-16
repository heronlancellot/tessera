import { Router, Request, Response } from 'express'
import type { Router as RouterType } from 'express'
import { publisherService } from '../services/publisherService.js'
import { validateApiKey } from '../middleware/apiKey.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

export const publishersRouter: RouterType = Router()

/**
 * POST /publishers/register
 * Register a new publisher (public - any authenticated user can submit)
 *
 * Body:
 * {
 *   "wallet_address": "0x123...",
 *   "name": "Publisher Name",
 *   "slug": "publisher-slug",
 *   "website": "https://publisher.com",
 *   "logo_url": "https://logo.com/logo.png" (optional)
 * }
 */
publishersRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { wallet_address, name, slug, website, logo_url } = req.body

    // Validation
    if (!wallet_address) {
      return res.status(400).json({
        error: 'Missing required field: wallet_address'
      })
    }

    if (!name) {
      return res.status(400).json({
        error: 'Missing required field: name'
      })
    }

    if (!slug) {
      return res.status(400).json({
        error: 'Missing required field: slug'
      })
    }

    // Check if slug already exists
    const existingBySlug = await publisherService.findBySlug(slug)
    if (existingBySlug) {
      return res.status(409).json({
        error: 'Publisher with this slug already exists'
      })
    }

    // Check if wallet already registered
    const existingByWallet = await publisherService.findByWallet(wallet_address)
    if (existingByWallet) {
      return res.status(409).json({
        error: 'Publisher with this wallet address already exists',
        publisher: existingByWallet
      })
    }

    // Create publisher with pending status
    const publisher = await publisherService.create({
      wallet_address,
      name,
      slug,
      website: website || null,
      logo_url: logo_url || null,
      status: 'pending',
      is_active: false,
      submitted_at: new Date().toISOString()
    })

    res.status(201).json({
      message: 'Publisher registration submitted successfully',
      publisher
    })
  } catch (error: any) {
    console.error('Error registering publisher:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * GET /publishers
 * List all publishers with optional filters (admin endpoint)
 *
 * Query params:
 * - status: 'pending' | 'approved' | 'rejected'
 * - is_active: 'true' | 'false'
 */
publishersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { status, is_active } = req.query

    // Build filters
    const filters: any = {}

    if (status && ['pending', 'approved', 'rejected'].includes(status as string)) {
      filters.status = status as 'pending' | 'approved' | 'rejected'
    }

    if (is_active !== undefined) {
      filters.is_active = is_active === 'true'
    }

    const publishers = await publisherService.findAll(filters)

    res.json({
      count: publishers.length,
      publishers
    })
  } catch (error: any) {
    console.error('Error listing publishers:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * GET /publishers/wallet/:walletAddress
 * Get publisher by wallet address
 * 
 * Returns the publisher with contract_address for the given wallet address
 * Used by frontend to get contract address for withdraw operations
 */
publishersRouter.get('/wallet/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params

    console.log('[GET /publishers/wallet/:walletAddress] Request received:', { 
      walletAddress,
      raw: walletAddress,
      decoded: decodeURIComponent(walletAddress)
    })

    if (!walletAddress) {
      return res.status(400).json({
        error: 'Wallet address is required'
      })
    }

    // Decode URL-encoded wallet address and normalize to lowercase
    const decodedAddress = decodeURIComponent(walletAddress)
    const normalizedAddress = decodedAddress.trim().toLowerCase()
    
    console.log('[GET /publishers/wallet/:walletAddress] Processing:', {
      original: walletAddress,
      decoded: decodedAddress,
      normalized: normalizedAddress,
      length: normalizedAddress.length,
      startsWith0x: normalizedAddress.startsWith('0x')
    })

    if (!normalizedAddress.startsWith('0x')) {
      return res.status(400).json({
        error: 'Invalid wallet address format',
        received: normalizedAddress
      })
    }

    const publisher = await publisherService.findByWallet(normalizedAddress)

    if (!publisher) {
      console.log('[GET /publishers/wallet/:walletAddress] ❌ Publisher not found for:', normalizedAddress)
      return res.status(404).json({
        error: 'Publisher not found',
        walletAddress: normalizedAddress
      })
    }

    console.log('[GET /publishers/wallet/:walletAddress] ✅ Publisher found:', {
      id: publisher.id,
      name: publisher.name,
      contract_address: publisher.contract_address
    })

    res.json({ publisher })
  } catch (error: any) {
    console.error('[GET /publishers/wallet/:walletAddress] Error:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * GET /publishers/:id
 * Get single publisher by ID
 */
publishersRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const publisher = await publisherService.findById(id)

    if (!publisher) {
      return res.status(404).json({
        error: 'Publisher not found'
      })
    }

    res.json({ publisher })
  } catch (error: any) {
    console.error('Error fetching publisher:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * POST /publishers/:id/approve
 * Approve a publisher (admin endpoint)
 *
 * Body:
 * {
 *   "contract_address": "0xABC..." (optional)
 * }
 */
publishersRouter.post('/:id/approve', validateApiKey(true), requireAdmin(), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { contract_address } = req.body

    // Check if publisher exists
    const existing = await publisherService.findById(id)
    if (!existing) {
      return res.status(404).json({
        error: 'Publisher not found'
      })
    }

    // Check if already approved
    if (existing.status === 'approved') {
      return res.status(400).json({
        error: 'Publisher is already approved',
        publisher: existing
      })
    }

    // Approve publisher
    const publisher = await publisherService.approve(id, contract_address)

    res.json({
      message: 'Publisher approved successfully',
      publisher
    })
  } catch (error: any) {
    console.error('Error approving publisher:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * POST /publishers/:id/reject
 * Reject a publisher (admin endpoint)
 */
publishersRouter.post('/:id/reject', validateApiKey(true), requireAdmin(), async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if publisher exists
    const existing = await publisherService.findById(id)
    if (!existing) {
      return res.status(404).json({
        error: 'Publisher not found'
      })
    }

    // Check if already rejected
    if (existing.status === 'rejected') {
      return res.status(400).json({
        error: 'Publisher is already rejected',
        publisher: existing
      })
    }

    // Reject publisher
    const publisher = await publisherService.reject(id)

    res.json({
      message: 'Publisher rejected',
      publisher
    })
  } catch (error: any) {
    console.error('Error rejecting publisher:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * PUT /publishers/:id
 * Update publisher details (admin endpoint)
 *
 * Body: Any publisher fields to update
 */
publishersRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if publisher exists
    const existing = await publisherService.findById(id)
    if (!existing) {
      return res.status(404).json({
        error: 'Publisher not found'
      })
    }

    // Update publisher
    const publisher = await publisherService.update(id, updates)

    res.json({
      message: 'Publisher updated successfully',
      publisher
    })
  } catch (error: any) {
    console.error('Error updating publisher:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})

/**
 * DELETE /publishers/:id
 * Soft delete (deactivate) publisher (admin endpoint)
 */
publishersRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if publisher exists
    const existing = await publisherService.findById(id)
    if (!existing) {
      return res.status(404).json({
        error: 'Publisher not found'
      })
    }

    // Soft delete
    const publisher = await publisherService.softDelete(id)

    res.json({
      message: 'Publisher deactivated successfully',
      publisher
    })
  } catch (error: any) {
    console.error('Error deleting publisher:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
})
