import { useState } from 'react'

export default function TrashCard({ note, onRestore, onDeleteForever }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const deletedDate = note.deleted_at
    ? new Date(note.deleted_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <div className="glass p-5 opacity-80">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold break-words text-fog/70">
          {note.title}
        </h3>
        <span className="font-mono text-[11px] text-mist/60 whitespace-nowrap pt-1">
          Deleted {deletedDate}
        </span>
      </div>
      {note.body && (
        <p className="text-sm text-fog/50 mt-2.5 whitespace-pre-wrap break-words leading-relaxed line-clamp-3">
          {note.body}
        </p>
      )}

      <div className="flex gap-4 mt-4 pt-3.5 border-t border-white/[0.07] text-xs">
        <button
          onClick={async () => {
            setBusy(true)
            await onRestore(note.id)
          }}
          disabled={busy}
          className="btn-ghost text-cyan hover:underline font-medium disabled:opacity-50"
        >
          Restore
        </button>

        {confirmingDelete ? (
          <span className="flex items-center gap-2.5">
            <span className="text-mist">Delete forever?</span>
            <button
              onClick={async () => {
                setBusy(true)
                await onDeleteForever(note.id)
              }}
              disabled={busy}
              className="btn-ghost text-danger font-medium hover:underline disabled:opacity-50"
            >
              {busy ? 'Deleting…' : 'Yes, delete forever'}
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
            Delete forever
          </button>
        )}
      </div>
    </div>
  )
}
