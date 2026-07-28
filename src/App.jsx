import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Laboratorio from './pages/Laboratorio'
import Admin from './pages/Admin'
import VistaParent from './pages/VistaParent'

const ADMIN_EMAIL = 'patriciaolaya23@gmail.com'

export default function App() {
  const [user, setUser]         = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0f3c' }}>
      <div style={{ fontSize: 40 }}>🚀</div>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing pública */}
        <Route path="/" element={<Landing />} />

        {/* Login en /entrar */}
        <Route path="/entrar" element={
          user
            ? user.email === ADMIN_EMAIL
              ? <Navigate to="/admin" replace />
              : <Navigate to="/laboratorio" replace />
            : <Login onLogin={setUser} />
        } />

        {/* Laboratorio del estudiante */}
        <Route path="/laboratorio" element={
          user && user.email !== ADMIN_EMAIL
            ? <Laboratorio user={user} onLogout={handleLogout} />
            : <Navigate to="/entrar" replace />
        } />

        {/* Panel admin */}
        <Route path="/admin" element={
          user && user.email === ADMIN_EMAIL
            ? <Admin user={user} onLogout={handleLogout} />
            : <Navigate to="/entrar" replace />
        } />

        {/* Vista pública para padres */}
        <Route path="/padre/:estudianteId" element={<VistaParent />} />

        {/* Cualquier otra ruta → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
