import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { notesApi } from '../lib/api'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'
import TrashCard from './TrashCard'
import Sidebar from './Sidebar'
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

const VIEW_LABELS = {
  all: 'Notebook',
  favorites: 'Favorites',
  folder: 'Folder',
  trash: 'Trash',
}

export default function Notes() {
  const { user, signOut } = useAuth()
  const { toasts, push, dismiss } = useToasts()
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [trashLoading, setTrashLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [savingNew, setSavingNew] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('all')
  const [activeFolder, setActiveFolder] = useState(null)

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

  useEffect(() => {
    if (view !== 'trash') return
    let cancelled = false

    async function loadTrash() {
      setTrashLoading(true)
      try {
        const data = await notesApi.trash()
        if (!cancelled) setTrashedNotes(data)
      } catch (err) {
        if (!cancelled) push(err.message)
      } finally {
        if (!cancelled) setTrashLoading(false)
      }
    }

    loadTrash()
    return () => {
      cancelled = true
    }
  }, [view])

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

  async function handleToggleFavorite(id, value) {
    const prevNotes = notes
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, is_favorite: value } : n)))
    try {
      await notesApi.setFavorite(id, value)
    } catch (err) {
      setNotes(prevNotes)
      push(err.message)
    }
  }

  async function handleDelete(id) {
    const prevNotes = notes
    setNotes((prev) => prev.filter((n) => n.id !== id))
    try {
      await notesApi.remove(id)
    } catch (err) {
      setNotes(prevNotes)
      push(err.message)
    }
  }

  async function handleRestore(id) {
    const prevTrash = trashedNotes
    setTrashedNotes((prev) => prev.filter((n) => n.id !== id))
    try {
      const restored = await notesApi.restore(id)
      setNotes((prev) => [restored, ...prev])
    } catch (err) {
      setTrashedNotes(prevTrash)
      push(err.message)
    }
  }

  async function handlePermanentDelete(id) {
    const prevTrash = trashedNotes
    setTrashedNotes((prev) => prev.filter((n) => n.id !== id))
    try {
      await notesApi.removePermanent(id)
    } catch (err) {
      setTrashedNotes(prevTrash)
      push(err.message)
    }
  }

  const folders = [...new Set(notes.map((n) => n.folder).filter(Boolean))].sort()

  const baseList =
    view === 'favorites'
      ? notes.filter((n) => n.is_favorite)
      : view === 'folder'
      ? notes.filter((n) => n.folder === activeFolder)
      : notes

  const filteredNotes = query.trim()
    ? baseList.filter((n) => n.title.toLowerCase().includes(query.trim().toLowerCase()))
    : baseList

  const headerTitle = view === 'folder' && activeFolder ? activeFolder : VIEW_LABELS[view]

  return (
    <div className="perspective min-h-screen max-w-2xl mx-auto px-4 py-10">
      <ToastStack toasts={toasts} dismiss={dismiss} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        onSelectView={setView}
        folders={folders}
        activeFolder={activeFolder}
        onSelectFolder={(f) => {
          setActiveFolder(f)
          setView('folder')
        }}
        onSignOut={signOut}
      />

      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost text-mist hover:text-fog p-1.5 -ml-1.5"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-lg bg-grad-brand shadow-glow shrink-0" />
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">{headerTitle}</h1>
            <p className="text-xs text-mist font-mono mt-0.5">{user.email}</p>
          </div>
        </div>
      </header>

      {view !== 'trash' && !loading && notes.length > 0 && (
        <div className="relative mb-6">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/60 text-sm pointer-events-none">
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes by title…"
            className="input-dark w-full pl-9 pr-8 py-2.5 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-fog text-sm"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      )}

      {view !== 'trash' &&
        (creating ? (
          <div className="mb-6">
            <NoteForm saving={savingNew} onCancel={() => setCreating(false)} onSave={handleCreate} />
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="btn-ghost glass-interactive w-full mb-6 border-dashed py-4 text-sm text-mist hover:text-fog flex items-center justify-center gap-2"
          >
            <span className="text-cyan text-base leading-none">+</span> New note
          </button>
        ))}

      {view === 'trash' ? (
        trashLoading ? (
          <div className="space-y-4">
            <NoteSkeleton />
            <NoteSkeleton />
          </div>
        ) : trashedNotes.length === 0 ? (
          <p className="text-sm text-mist">Trash is empty.</p>
        ) : (
          <div className="space-y-4">
            {trashedNotes.map((note, i) => (
              <div key={note.id} className="enter" style={{ animationDelay: `${Math.min(i, 6) * 35}ms` }}>
                <TrashCard note={note} onRestore={handleRestore} onDeleteForever={handlePermanentDelete} />
              </div>
            ))}
          </div>
        )
      ) : loading ? (
        <div className="space-y-4">
          <NoteSkeleton />
          <NoteSkeleton />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-mist">No notes yet. Write your first one above.</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-sm text-mist">
          {view === 'favorites'
            ? 'No favorites yet.'
            : view === 'folder'
            ? `No notes in "${activeFolder}".`
            : `No notes match "${query}".`}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note, i) => (
            <div key={note.id} className="enter" style={{ animationDelay: `${Math.min(i, 6) * 35}ms` }}>
              <NoteCard
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
