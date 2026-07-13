import { useState } from 'react'
import NoteForm from './NoteForm'

export default function NoteDetail({ note, onBack, onUpdate, onDelete, onToggleFavorite }) {
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
              height="19"
              viewBox="0 0 24 24"
              fill={note.is_favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={note.is_favorite ? 'text-cyan' : ''}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <div className="glass border-danger/30 mb-4 px-4 py-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-fog/85">Move this note to trash?</span>
          <span className="flex items-center gap-3 shrink-0">
            <button
              onClick={async () => {
                setBusy(true)
                await onDelete(note.id)
              }}
              disabled={busy}
              className="btn-ghost text-danger font-medium disabled:opacity-50"
            >
              {busy ? 'Moving…' : 'Move'}
            </button>
            <button onClick={() => setConfirmingDelete(false)} className="btn-ghost text-mist hover:text-fog">
              Cancel
            </button>
          </span>
        </div>
      )}

      <div className="glass p-6">
        <h1 className="font-display text-2xl font-semibold break-words">{note.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-xs text-mist/70">{date}</span>
          {note.folder && (
            <span className="text-[10px] font-mono text-violet bg-violet/10 border border-violet/25 rounded-full px-2 py-0.5">
              {note.folder}
            </span>
          )}
        </div>

        {note.body && (
          <p className="text-sm text-fog/85 mt-5 whitespace-pre-wrap break-words leading-relaxed">
            {note.body}
          </p>
        )}
      </div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}
