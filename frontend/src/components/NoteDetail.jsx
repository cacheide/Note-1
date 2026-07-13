import { useState } from 'react'
import NoteForm from './NoteForm'

export default function NoteDetail({ note, onBack, onUpdate, onDelete, onToggleFavorite, onToggleArchive }) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const date = new Date(note.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (editing) {
    return (
      <div className="enter">
        <button
          onClick={() => setEditing(false)}
          className="btn-ghost text-mist hover:text-fog text-sm mb-4 flex items-center gap-1.5"
        >
          <BackIcon /> Cancel edit
        </button>
        <NoteForm
          initial={note}
          saving={busy}
          onCancel={() => setEditing(false)}
          onSave={async (fields) => {
            setBusy(true)
            await onUpdate(note.id, fields)
            setBusy(false)
            setEditing(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="enter">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="btn-ghost text-mist hover:text-fog p-1.5 -ml-1.5" aria-label="Back">
          <BackIcon />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditing(true)}
            className="btn-ghost text-mist hover:text-cyan p-1.5"
            aria-label="Edit note"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onToggleArchive(note.id, !note.is_archived)}
            className={`btn-ghost p-1.5 ${note.is_archived ? 'text-violet' : 'text-mist hover:text-violet'}`}
            aria-label={note.is_archived ? 'Unarchive note' : 'Archive note'}
          >
            <ArchiveIcon />
          </button>
          <button
            onClick={() => setConfirmingDelete(true)}
            className="btn-ghost text-mist hover:text-danger p-1.5"
            aria-label="Delete note"
          >
            <TrashIcon />
          </button>
          <button
            onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
            className="btn-ghost text-mist hover:text-cyan p-1.5"
            aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              width="19"
