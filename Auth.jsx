import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    if (!EMAIL_RE.test(email)) return 'Enter a valid email address.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    const { error } =
      mode === 'signin' ? await signIn(email, password) : await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signup') {
      setInfo('Account created. Check your email to confirm, then sign in.')
      setMode('signin')
    }
  }

  return (
    <div className="perspective min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass p-8">
        <div className="mb-8">
          <div className="w-9 h-9 rounded-lg bg-grad-brand shadow-glow mb-5" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Notebook
          </h1>
          <p className="text-mist mt-1.5 text-sm">
            {mode === 'signin' ? 'Sign in to your notes.' : 'Create an account to get started.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-mist mb-1.5 tracking-wide uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark w-full px-3.5 py-2.5 text-sm focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-mist mb-1.5 tracking-wide uppercase">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark w-full px-3.5 py-2.5 text-sm focus:outline-none"
              minLength={8}
              required
            />
            <p className="text-xs text-mist/70 mt-1.5">At least 8 characters.</p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger bg-danger/10 border border-danger/25 rounded-lg px-3.5 py-2.5">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-sm text-cyan bg-cyan/10 border border-cyan/25 rounded-lg px-3.5 py-2.5">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-brand w-full py-2.5 text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <span className="spinner" style={{ borderTopColor: '#08090D' }} />}
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
            setInfo('')
          }}
          className="btn-ghost w-full text-center text-sm text-mist hover:text-fog mt-6"
        >
          {mode === 'signin' ? "No account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
