import { supabase } from '../lib/supabase.js'

// Types matching Supabase schema
type PublisherStatus = 'pending' | 'approved' | 'rejected'

type Publisher = {
  id: string
  name: string
  slug: string
  website: string | null
  logo_url: string | null
  wallet_address: string | null
  contract_address: string | null
  status: PublisherStatus | null
  is_active: boolean | null
  submitted_at: string | null
  created_at: string | null
  updated_at: string | null
}

type PublisherInsert = {
  name: string
  slug: string
  website?: string | null
  logo_url?: string | null
  wallet_address?: string | null
  contract_address?: string | null
  status?: PublisherStatus | null
  is_active?: boolean | null
  submitted_at?: string | null
  created_at?: string | null
  id?: string
  updated_at?: string | null
}

type PublisherUpdate = {
  name?: string
  slug?: string
  website?: string | null
  logo_url?: string | null
  wallet_address?: string | null
  contract_address?: string | null
  status?: PublisherStatus | null
  is_active?: boolean | null
  submitted_at?: string | null
  created_at?: string | null
  id?: string
  updated_at?: string | null
}

type PublisherFilters = {
  status?: PublisherStatus
  is_active?: boolean
}

export const publisherService = {
  /**
   * Create a new publisher
   */
  async create(data: PublisherInsert): Promise<Publisher> {
    const { data: publisher, error } = await supabase
      .from('publishers')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Error creating publisher:', error)
      throw new Error(error.message)
    }

    return publisher
  },

  /**
   * Find all publishers with optional filters
   */
  async findAll(filters?: PublisherFilters): Promise<Publisher[]> {
    console.log('[publisherService.findAll] Called with filters:', filters)

    let query = supabase
      .from('publishers')
      .select('*')
      .order('submitted_at', { ascending: false, nullsFirst: false })

    // Apply filters
    if (filters?.status) {
      console.log('[publisherService.findAll] Filtering by status:', filters.status)
      query = query.eq('status', filters.status)
    }

    if (filters?.is_active !== undefined) {
      console.log('[publisherService.findAll] Filtering by is_active:', filters.is_active)
      query = query.eq('is_active', filters.is_active)
    }

    const { data, error } = await query

    if (error) {
      console.error('[publisherService.findAll] Error fetching publishers:', error)
      throw new Error(error.message)
    }

    console.log(`[publisherService.findAll] Found ${data?.length || 0} publishers`)
    if (data && data.length > 0) {
      console.log('[publisherService.findAll] First publisher:', data[0])
    }

    return data || []
  },

  /**
   * Find publisher by ID
   */
  async findById(id: string): Promise<Publisher | null> {
    const { data, error } = await supabase
      .from('publishers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      // PGRST116 = No rows found
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching publisher:', error)
      throw new Error(error.message)
    }

    return data
  },

  /**
   * Find publisher by slug
   */
  async findBySlug(slug: string): Promise<Publisher | null> {
    const { data, error } = await supabase
      .from('publishers')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching publisher by slug:', error)
      throw new Error(error.message)
    }

    return data
  },

  /**
   * Find publisher by wallet address
   * Normalizes wallet address to lowercase for consistent querying
   */
  async findByWallet(walletAddress: string): Promise<Publisher | null> {
    // Normalize wallet address to lowercase for consistent querying
    // Remove any whitespace and ensure it starts with 0x
    const normalizedAddress = walletAddress.trim().toLowerCase()
    
    if (!normalizedAddress.startsWith('0x')) {
      console.error('[publisherService.findByWallet] Invalid wallet address format:', normalizedAddress)
      throw new Error('Invalid wallet address format')
    }

    console.log('[publisherService.findByWallet] Searching for wallet:', normalizedAddress)
    console.log('[publisherService.findByWallet] Wallet address length:', normalizedAddress.length)

    // Query with exact match (wallet_address in DB is already lowercase)
    const { data, error } = await supabase
      .from('publishers')
      .select('*')
      .eq('wallet_address', normalizedAddress)
      .maybeSingle()

    console.log('[publisherService.findByWallet] Query result:', {
      hasData: !!data,
      hasError: !!error,
      errorCode: error?.code,
      errorMessage: error?.message,
      dataId: data?.id,
      dataWallet: data?.wallet_address
    })

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - this is expected if publisher doesn't exist
        console.log('[publisherService.findByWallet] Publisher not found (PGRST116) for wallet:', normalizedAddress)
        return null
      }
      console.error('[publisherService.findByWallet] Error fetching publisher by wallet:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(error.message)
    }

    if (data) {
      console.log('[publisherService.findByWallet] ✅ Publisher found:', {
        id: data.id,
        name: data.name,
        wallet_address: data.wallet_address,
        contract_address: data.contract_address,
        status: data.status
      })
    } else {
      console.log('[publisherService.findByWallet] ❌ Publisher not found for wallet:', normalizedAddress)
    }

    return data
  },

  /**
   * Update publisher
   */
  async update(id: string, updates: PublisherUpdate): Promise<Publisher> {
    const { data, error } = await supabase
      .from('publishers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating publisher:', error)
      throw new Error(error.message)
    }

    return data
  },

  /**
   * Soft delete (deactivate) publisher
   */
  async softDelete(id: string): Promise<Publisher> {
    return this.update(id, { is_active: false })
  },

  /**
   * Hard delete publisher from database
   */
  async hardDelete(id: string): Promise<Publisher> {
    const { data, error } = await supabase
      .from('publishers')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting publisher:', error)
      throw new Error(error.message)
    }

    return data
  },

  /**
   * Approve publisher and optionally set contract address
   * Automatically creates a default endpoint if none exists
   */
  async approve(id: string, contractAddress?: string): Promise<Publisher> {
    // Get publisher info first
    const publisher = await this.findById(id)
    if (!publisher) {
      throw new Error('Publisher not found')
    }

    const updates: PublisherUpdate = {
      status: 'approved',
      is_active: true
    }

    if (contractAddress) {
      updates.contract_address = contractAddress
    }

    const approvedPublisher = await this.update(id, updates)

    // Check if publisher has any endpoints
    const { data: existingEndpoints, error: endpointsError } = await supabase
      .from('endpoints')
      .select('id')
      .eq('publisher_id', id)
      .limit(1)

    // If no endpoints exist, create a default one
    if (!endpointsError && (!existingEndpoints || existingEndpoints.length === 0)) {
      // Build default API path based on website
      let defaultPath = `${publisher.website || 'https://api.example.com'}/tessera/articles/:id`
      
      // If website is a Vercel/deployment URL, use it directly
      if (publisher.website && (publisher.website.includes('vercel.app') || publisher.website.includes('railway.app'))) {
        defaultPath = `${publisher.website}/tessera/articles/:id`
      }

      // Create default endpoint
      const { error: endpointError } = await supabase
        .from('endpoints')
        .insert({
          publisher_id: id,
          path: defaultPath,
          method: 'GET',
          name: 'Default Article Endpoint',
          description: `Default endpoint for ${publisher.name}. Update this with your actual API path.`,
          price_usd: 0.01, // Default price: $0.01
          is_active: true
        })

      if (endpointError) {
        console.error('Error creating default endpoint:', endpointError)
        // Don't fail the approval if endpoint creation fails
      } else {
        console.log(`✅ Created default endpoint for publisher ${publisher.name}`)
      }
    }

    return approvedPublisher
  },

  /**
   * Reject publisher
   */
  async reject(id: string): Promise<Publisher> {
    return this.update(id, {
      status: 'rejected',
      is_active: false
    })
  }
}
