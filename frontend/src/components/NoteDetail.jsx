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
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-ghost text-mist hover:text-fog text-sm flex items-center gap-1.5">
          <BackIcon /> Back
        </button>
        <button
          onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
          className="btn-ghost text-mist hover:text-cyan"
          aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            width="20"
            height="20"
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

        <div className="flex gap-4 mt-6 pt-4 border-t border-white/[0.07] text-sm">
          <button onClick={() => setEditing(true)} className="btn-ghost text-cyan font-medium">
            Edit
          </button>

          {confirmingDelete ? (
            <span className="flex items-center gap-2.5">
              <span className="text-mist text-xs">Move to trash?</span>
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
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
      }
