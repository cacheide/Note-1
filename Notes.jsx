import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { notesApi } from '../lib/api'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'
import { useToasts, ToastStack } from './Toast'

function NoteSkeleton() {
  return (
    <div className="skeleton p-5 h-28">
      <div className="h-4 w-1/3 bg-white/[0.06] rounded" />
      <div className="h-3 w-full bg-white/[0.04] rounded mt-4" />
      <div className="h-3 w-2/3 bg-white/[0.04] rounded mt-2" />
    </div>
  )
}

export default function Notes() {
  const { user, signOut } = useAuth()
  const { toasts, push, dismiss } = useToasts()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [savingNew, setSavingNew] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadNotes() {
      setLoading(true)
      try {
        const data = await notesApi.list()
        if (!cancelled) setNotes(data)
      } catch (err) {
        if (!cancelled) push(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNotes()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreate(fields) {
    setSavingNew(true)
    try {
      const created = await notesApi.create(fields)
      setNotes((prev) => [created, ...prev])
      setCreating(false)
    } catch (err) {
      push(err.message)
    } finally {
      setSavingNew(false)
    }
  }

  async function handleUpdate(id, fields) {
    try {
      const updated = await notesApi.update(id, fields)
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    } catch (err) {
      push(err.message)
    }
  }

  async function handleDelete(id) {
    // Optimistic removal — the card leaves immediately, we only
    // roll back and notify if the backend actually rejects it.
    const prevNotes = notes
    setNotes((prev) => prev.filter((n) => n.id !== id))
    try {
      await notesApi.remove(id)
    } catch (err) {
      setNotes(prevNotes)
      push(err.message)
    }
  }

  return (
    <div className="perspective min-h-screen max-w-2xl mx-auto px-4 py-10">
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-grad-brand shadow-glow shrink-0" />
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">Notebook</h1>
            <p className="text-xs text-mist font-mono mt-0.5">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="btn-ghost text-sm text-mist hover:text-fog border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20"
        >
          Sign out
        </button>
      </header>

      {creating ? (
        <div className="mb-6">
          <NoteForm
            saving={savingNew}
            onCancel={() => setCreating(false)}
            onSave={handleCreate}
          />
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="btn-ghost glass-interactive w-full mb-6 border-dashed py-4 text-sm text-mist hover:text-fog flex items-center justify-center gap-2"
        >
          <span className="text-cyan text-base leading-none">+</span> New note
        </button>
      )}

      {loading ? (
        <div className="space-y-4">
          <NoteSkeleton />
          <NoteSkeleton />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-mist">No notes yet. Write your first one above.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note, i) => (
            <div key={note.id} className="enter" style={{ animationDelay: `${Math.min(i, 6) * 35}ms` }}>
              <NoteCard note={note} onUpdate={handleUpdate} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
