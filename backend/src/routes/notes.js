import { Router } from 'express'
import { supabaseAdmin } from '../supabaseAdmin.js'

const router = Router()

const MAX_TITLE = 120
const MAX_BODY = 5000
const MAX_FOLDER = 60

function validateNote(body) {
  if (typeof body?.title !== 'string' || !body.title.trim()) return 'Title is required.'
  if (body.title.trim().length > MAX_TITLE) return `Title must be under ${MAX_TITLE} characters.`
  if (body.body !== undefined && typeof body.body !== 'string') return 'Body must be text.'
  if (typeof body.body === 'string' && body.body.length > MAX_BODY) return `Body must be under ${MAX_BODY} characters.`
  if (body.folder !== undefined && body.folder !== null && typeof body.folder !== 'string') return 'Folder must be text.'
  if (typeof body.folder === 'string' && body.folder.length > MAX_FOLDER) return `Folder must be under ${MAX_FOLDER} characters.`
  return null
}

router.get('/', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('user_id', req.user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.get('/trash', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('user_id', req.user.id)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const validationError = validateNote(req.body)
  if (validationError) return res.status(400).json({ error: validationError })
  const { data, error } = await supabaseAdmin
    .from('notes')
    .insert({
      title: req.body.title.trim(),
      body: (req.body.body ?? '').trim(),
      folder: req.body.folder ? req.body.folder.trim() : null,
      user_id: req.user.id,
    })
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
    .update({
      title: req.body.title.trim(),
      body: (req.body.body ?? '').trim(),
      folder: req.body.folder ? req.body.folder.trim() : null,
    })
    .eq('id', req.params.id).eq('user_id', req.user.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.patch('/:id/favorite', async (req, res) => {
  if (typeof req.body?.is_favorite !== 'boolean') {
    return res.status(400).json({ error: 'is_favorite must be true or false.' })
  }
  const { data: existing } = await supabaseAdmin
    .from('notes').select('id').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
  if (!existing) return res.status(404).json({ error: 'Note not found.' })
  const { data, error } = await supabaseAdmin
    .from('notes')
    .update({ is_favorite: req.body.is_favorite })
    .eq('id', req.params.id).eq('user_id', req.user.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id', async (req, res) => {
  const { data: existing } = await supabaseAdmin
    .from('notes').select('id').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
  if (!existing) return res.status(404).json({ error: 'Note not found.' })
  const { error } = await supabaseAdmin
    .from('notes')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', req.params.id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

router.post('/:id/restore', async (req, res) => {
  const { data: existing } = await supabaseAdmin
    .from('notes').select('id').eq('id', req.params.id).eq('user_id', req.user.id).maybeSingle()
  if (!existing) return res.status(404).json({ error: 'Note not found.' })
  const { data, error } = await supabaseAdmin
    .from('notes')
    .update({ deleted_at: null })
    .eq('id', req.params.id).eq('user_id', req.user.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id/permanent', async (req, res) => {
  const { data: existing } = await supabaseAdmin
    .from('notes')
    .select('id')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .not('deleted_at', 'is', null)
    .maybeSingle()
  if (!existing) return res.status(404).json({ error: 'Note not found in trash.' })
  const { error } = await supabaseAdmin
    .from('notes').delete().eq('id', req.params.id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).send()
})

export default router
