import { supabase } from './supabaseClient'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('Missing VITE_API_URL. Copy .env.example to .env and set it.')
}

async function authedFetch(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) throw new Error('Not signed in.')

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const notesApi = {
  list: () => authedFetch('/api/notes'),
  trash: () => authedFetch('/api/notes/trash'),
  archive: () => authedFetch('/api/notes/archive'),
  create: (fields) =>
    authedFetch('/api/notes', { method: 'POST', body: JSON.stringify(fields) }),
  update: (id, fields) =>
    authedFetch(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(fields) }),
  setFavorite: (id, is_favorite) =>
    authedFetch(`/api/notes/${id}/favorite`, {
      method: 'PATCH',
      body: JSON.stringify({ is_favorite }),
    }),
  setArchived: (id, is_archived) =>
    authedFetch(`/api/notes/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ is_archived }),
    }),
  remove: (id) => authedFetch(`/api/notes/${id}`, { method: 'DELETE' }),
  restore: (id) => authedFetch(`/api/notes/${id}/restore`, { method: 'POST' }),
  removePermanent: (id) => authedFetch(`/api/notes/${id}/permanent`, { method: 'DELETE' }),
}
