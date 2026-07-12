import { useState } from 'react'

const MAX_TITLE = 120
const MAX_BODY = 5000

export default function NoteForm({ initial, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()

    if (!trimmedTitle) {
      setError('Give the note a title.')
      return
    }
    if (trimmedTitle.length > MAX_TITLE) {
      setError(`Title must be under ${MAX_TITLE} characters.`)
      return
    }
    if (trimmedBody.length > MAX_BODY) {
      setError(`Note body must be under ${MAX_BODY} characters.`)
      return
    }

    setError('')
    onSave({ title: trimmedTitle, body: trimmedBody })
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-3 p-5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={MAX_TITLE}
        className="w-full bg-transparent font-display text-lg font-semibold focus:outline-none placeholder:text-mist/50"
        autoFocus
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something…"
        rows={6}
        maxLength={MAX_BODY}
        className="w-full bg-transparent text-sm leading-relaxed text-fog/90 focus:outline-none resize-none placeholder:text-mist/50"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost px-3.5 py-1.5 text-sm text-mist hover:text-fog"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="btn-brand px-4 py-1.5 text-sm disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <span className="spinner" style={{ borderTopColor: '#08090D' }} />}
          {saving ? 'Saving…' : 'Save note'}
        </button>
      </div>
    </form>
  )
}
