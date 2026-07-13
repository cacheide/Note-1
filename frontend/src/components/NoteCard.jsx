function truncate(body, max = 120) {
  if (!body) return ''
  const clean = body.trim()
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean
}

export default function NoteCard({ note, onOpen, onToggleFavorite }) {
  const date = new Date(note.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const preview = truncate(note.body)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(note.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(note.id)
      }}
      className="glass-interactive p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-semibold break-words">{note.title}</h3>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(note.id, !note.is_favorite)
            }}
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

      {preview && (
        <p className="text-sm text-fog/75 mt-2.5 break-words leading-relaxed">{preview}</p>
      )}
    </div>
  )
}
