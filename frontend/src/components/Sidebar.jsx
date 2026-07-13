import { useState } from 'react'

export default function Sidebar({
  open,
  onClose,
  view,
  onSelectView,
  folders,
  activeFolder,
  onSelectFolder,
  onSignOut,
}) {
  const [folderMenuOpen, setFolderMenuOpen] = useState(false)

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] z-50 glass rounded-none rounded-r-2xl p-5 flex flex-col overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-grad-brand shadow-glow shrink-0" />
          <h2 className="font-display text-lg font-semibold">Notebook</h2>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          <button
            onClick={() => {
              onSelectView('all')
              onClose()
            }}
            className={`btn-ghost text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
              view === 'all' ? 'bg-white/[0.06] text-fog' : 'text-mist hover:text-fog'
            }`}
          >
            <HomeIcon /> Home
          </button>

          <button
            onClick={() => {
              onSelectView('favorites')
              onClose()
            }}
            className={`btn-ghost text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
              view === 'favorites' ? 'bg-white/[0.06] text-fog' : 'text-mist hover:text-fog'
            }`}
          >
            <StarIcon /> Favorites
          </button>

          <button
            onClick={() => setFolderMenuOpen((v) => !v)}
            className={`btn-ghost text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
              view === 'folder' ? 'bg-white/[0.06] text-fog' : 'text-mist hover:text-fog'
            }`}
          >
            <FolderIcon /> Folder
          </button>

          {folderMenuOpen && (
            <div className="ml-8 mb-1 flex flex-col gap-1">
              {folders.length === 0 ? (
                <p className="text-xs text-mist/60 py-1">
                  No folders yet — add one when creating a note.
                </p>
              ) : (
                folders.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      onSelectFolder(f)
                      onClose()
                    }}
                    className={`btn-ghost text-left px-2 py-1.5 rounded-md text-xs ${
                      view === 'folder' && activeFolder === f
                        ? 'text-cyan'
                        : 'text-mist hover:text-fog'
                    }`}
                  >
                    {f}
                  </button>
                ))
              )}
            </div>
          )}

          <button
            onClick={() => {
              onSelectView('trash')
              onClose()
            }}
            className={`btn-ghost text-left px-3 py-2.5 rounded-lg flex items-center gap-3 ${
              view === 'trash' ? 'bg-white/[0.06] text-fog' : 'text-mist hover:text-fog'
            }`}
          >
            <TrashIcon /> Trash
          </button>
        </nav>

        <div className="mt-auto pt-4 border-t border-white/[0.07]">
          <button
            onClick={onSignOut}
            className="btn-ghost text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-mist hover:text-danger w-full"
          >
            <SignOutIcon /> Sign out
          </button>
        </div>
      </div>
    </>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12 12 4l9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
