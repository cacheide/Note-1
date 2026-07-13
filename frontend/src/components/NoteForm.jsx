import { useState } from 'react'

const MAX_TITLE = 120
const MAX_BODY = 5000
const MAX_FOLDER = 60

export default function NoteForm({ initial, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [folder, setFolder] = useState(initial?.folder ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()
    const trimmedFolder = folder.trim()

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
    if (trimmedFolder.length > MAX_FOLDER) {
      setError(`Folder name must be under ${MAX_FOLDER} characters.`)
      return
    }

    setError('')
    onSave({ title: trimmedTitle, body: trimmedBody, folder: trimmedFolder || null })
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
      <input
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        placeholder="Folder (optional)"
        maxLength={MAX_FOLDER}
        className="w-full bg-transparent text-xs font-mono text-violet focus:outline-none placeholder:text-mist/40"
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
