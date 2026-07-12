import { useState } from 'react'
import NoteForm from './NoteForm'

export default function NoteCard({ note, onUpdate, onDelete }) {
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
        <span className="font-mono text-[11px] text-mist/70 whitespace-nowrap pt-1">{date}</span>
      </div>
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
            <span className="text-mist">Delete this note?</span>
            <button
              onClick={async () => {
                setBusy(true)
                await onDelete(note.id)
              }}
              disabled={busy}
              className="btn-ghost text-danger font-medium hover:underline disabled:opacity-50"
            >
              {busy ? 'Deleting…' : 'Yes, delete'}
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
