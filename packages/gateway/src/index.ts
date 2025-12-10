// Load env vars BEFORE any other imports
import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import { previewRouter } from './routes/preview.js'
import { fetchRouter } from './routes/fetch.js'
import { validateApiKey } from './middleware/apiKey.js'

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN || '*', // Allow all origins in dev, restrict in production
    origin:  '*', // Allow all origins in dev, restrict in production
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-PAYMENT'],
  })
)

app.use(express.json())

// Handle preflight OPTIONS requests (CORS)
app.options('*', (_, res) => {
  res.sendStatus(200)
})

// Health check (no auth required)
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Key validation (required for all routes below)
app.use(validateApiKey(true))

// Routes
app.use('/preview', previewRouter)
app.use('/fetch', fetchRouter)

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`)
})
