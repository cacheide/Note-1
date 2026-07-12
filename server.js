import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { requireAuth } from './middleware/auth.js'
import notesRouter from './routes/notes.js'

const app = express()

const allowedOrigin = process.env.ALLOWED_ORIGIN
if (!allowedOrigin) {
  console.warn(
    'Warning: ALLOWED_ORIGIN is not set. No browser origin will be allowed until it is.'
  )
}

// Only the one configured frontend origin may call this API — never "*".
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: '100kb' }))

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/notes', requireAuth, notesRouter)

// Fallback error handler so unexpected failures return JSON, not an HTML
// stack trace, and never leak internals to the client.
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong.' })
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Backend listening on port ${port}`))
