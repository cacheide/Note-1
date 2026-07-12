import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './components/Auth'
import Notes from './components/Notes'

function Gate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="spinner" />
      </div>
    )
  }

  return user ? <Notes /> : <Auth />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="scene" aria-hidden="true" />
      <Gate />
    </AuthProvider>
  )
}
