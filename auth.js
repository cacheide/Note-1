import { supabaseAdmin } from '../supabaseAdmin.js'

// Verifies the access token the frontend sends and attaches the real,
// server-verified user to the request. Every route behind this middleware
// can trust req.user — it is never taken from anything the client sent,
// only from what Supabase's own auth server confirms the token belongs to.
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token.' })
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' })
  }

  req.user = data.user
  next()
}
