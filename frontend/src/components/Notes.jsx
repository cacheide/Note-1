import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { notesApi } from '../lib/api'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'
import NoteDetail from './NoteDetail'
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
  archive: 'Archive',
  trash: 'Trash',
}

export default function Notes() {
  const { user, signOut } = useAuth()
  const { toasts, push, dismiss } = useToasts()
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [archivedNotes, setArchivedNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [trashLoading, setTrashLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [savingNew, setSavingNew] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('all')
  const [activeFolder, setActiveFolder] = useState(null)
  const [selectedNoteId, setSelectedNoteId] = useState(null)

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

  useEffect(() => {
    if (view !== 'archive') return
    let cancelled = false

    async function loadArchive() {
      setArchiveLoading(true)
      try {
        const data = await notesApi.archive()
        if (!cancelled) setArchivedNotes(data)
      } catch (err) {
        if (!cancelled) push(err.message)
      } finally {
        if (!cancelled) setArchiveLoading(false)
      }
    }

    loadArchive()
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

  async function handleDeleteFromDetail(id) {
    await handleDelete(id)
    setSelectedNoteId(null)
  }

  async function handleToggleArchive(id, value) {
    if (value) {
      const prevNotes = notes
      setNotes((prev) => prev.filter((n) => n.id !== id))
      try {
        await notesApi.setArchived(id, true)
        setSelectedNoteId(null)
      } catch (err) {
        setNotes(prevNotes)
        push(err.message)
      }
      return
    }

    const prevArchived = archivedNotes
    setArchivedNotes((prev) => prev.filter((n) => n.id !== id))
    try {
      const updated = await notesApi.setArchived(id, false)
      setNotes((prev) =>
