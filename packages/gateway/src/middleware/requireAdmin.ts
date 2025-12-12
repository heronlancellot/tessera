/**
 * Admin Authorization Middleware
 *
 * Ensures that only users with 'admin' role can access protected routes
 * Must be used AFTER validateApiKey middleware
 */

import { Request, Response, NextFunction } from 'express'
import { supabase } from '../lib/supabase.js'

/**
 * Require Admin middleware
 *
 * Checks if the authenticated user has 'admin' role
 * Returns 403 Forbidden if user is not admin
 *
 * @requires validateApiKey middleware must be applied first (sets req.userId)
 */
export function requireAdmin() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user is authenticated (from validateApiKey middleware)
      if (!req.userId) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'You must be authenticated to access this resource'
        })
        return
      }

      // Get user role from database
      const { data: user, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.userId)
        .single()

      if (error || !user) {
        console.error('[requireAdmin] Error fetching user:', error)
        res.status(403).json({
          error: 'Access denied',
          message: 'Could not verify user permissions'
        })
        return
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        console.warn(`[requireAdmin] Access denied for user ${req.userId} with role: ${user.role}`)
        res.status(403).json({
          error: 'Access denied',
          message: 'This action requires admin privileges',
          requiredRole: 'admin',
          currentRole: user.role
        })
        return
      }

      // User is admin - allow access
      console.log(`[requireAdmin] Admin access granted for user ${req.userId}`)
      next()
    } catch (error) {
      console.error('[requireAdmin] Unexpected error:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to verify admin permissions'
      })
    }
  }
}
