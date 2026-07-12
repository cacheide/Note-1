import { Router } from 'express'
import { supabaseAdmin } from '../supabaseAdmin.js'

const router = Router()

const MAX_TITLE = 120
const MAX_BODY = 5000

function validateNote(body) {
  if (typeof body?.title !== 'string' || !body.title.trim()) return 'Title is required.'
  if (body.title.trim().length > MAX_TITLE) return `Title must be under ${MAX_TITLE} characters.`
  if (body.body !== undefined && typeof body.body !== 'string') return 'Body must be text.'
  if (typeof body.body === 'string' && body.body.length > MAX_BODY) return `Body must be under ${MAX_BODY} characters.`
  return null
}

router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const validationError = validateNote(req.body)
  if (validationError) return res.status(400).json({ error: validationError })
  const { data, error } = await supabaseAdmin
    .from('notes')
    .insert({ title: req.body.title.trim(), body: (req.body.body ?? '').trim(), user_id: req.user.id })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

router.put('/:id', async (req, res) => {
  const validationError = validateNote(req.body)
  if (validationError) return res.status(400).json({ error: validationError })
  const { data: existing } = await supabaseAdmin
    .from('notes').select('id').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
  if (!existing) return res.status(404).json({ error: 'Note not found.' })
  const { data, error } = await supabaseAdmin
    .from('notes')
    .update({ title: req.body.title.trim(), body: (req.body.body ?? '').trim() })
    .eq('id', req.params.id).eq('user_id', req.user.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabaseAdmin
    .from('notes').select('id').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
  if (!existing) return res.status(404).json({ error: 'Note not found.' })
  const { error } = await supabaseAdmin
    .from('notes').delete().eq('id', req.params.id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

export default router
