import { useState } from 'react'
import NoteForm from './NoteForm'

export default function NoteCard({ note, onUpdate, onDelete, onToggleFavorite }) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const date = new Date(note.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  if (editing) {
    return (
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
    )
  }

  return (
    <div className="glass-interactive p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold break-words">{note.title}</h3>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
            className="btn-ghost text-mist hover:text-cyan"
            aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              width="16"
              height="16"
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
          <span className="font-mono text-[11px] text-mist/70 whitespace-nowrap pt-0.5">{date}</span>
        </div>
      </div>

      {note.folder && (
        <span className="inline-block mt-1.5 text-[10px] font-mono text-violet bg-violet/10 border border-violet/25 rounded-full px-2 py-0.5">
          {note.folder}
        </span>
      )}

      {note.body && (
        <p className="text-sm text-fog/75 mt-2.5 whitespace-pre-wrap break-words leading-relaxed">
          {note.body}
        </p>
      )}

      <div className="flex gap-4 mt-4 pt-3.5 border-t border-white/[0.07] text-xs">
        <button onClick={() => setEditing(true)} className="btn-ghost text-mist hover:text-cyan font-medium">
          Edit
        </button>

        {confirmingDelete ? (
          <span className="flex items-center gap-2.5">
            <span className="text-mist">Move to trash?</span>
            <button
              onClick={async () => {
                setBusy(true)
                await onDelete(note.id)
              }}
              disabled={busy}
              className="btn-ghost text-danger font-medium hover:underline disabled:opacity-50"
            >
              {busy ? 'Moving…' : 'Yes, move'}
            </button>
            <button onClick={() => setConfirmingDelete(false)} className="btn-ghost text-mist hover:text-fog">
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="btn-ghost text-mist hover:text-danger font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
