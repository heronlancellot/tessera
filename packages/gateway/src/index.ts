// Load env vars BEFORE any other imports
import 'dotenv/config'

import express from 'express'
import { previewRouter } from './routes/preview.js'
import { fetchRouter } from './routes/fetch.js'
import { validateApiKey } from './middleware/apiKey.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

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
