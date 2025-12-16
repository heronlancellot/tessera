/**
 * Vercel Serverless Function Entry Point
 * This file is used by Vercel to handle all routes
 */
import app from '../src/index.js'

// Vercel expects a handler function, not the app directly
// But Express app can be exported directly when using @vercel/node
export default app
