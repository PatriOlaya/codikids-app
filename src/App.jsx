import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

const Landing = lazy(() => import('./marketing/PublicSite'))
const Login = lazy(() => import('./pages/Login'))
const Laboratorio = lazy(() => import('./pages/Laboratorio'))
const Admin = lazy(() => import('./pages/Admin'))
const VistaParent = lazy(() => import('./pages/VistaParent'))

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'patriciaolaya23@gmail.com').toLowerCase()

function LoadingScreen() {
  return <div className="app-loading" role="status" aria-live="polite"><span aria-hidden="true">🚀</span><span>Cargando CodiKids…</span></div>
}

export default function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      setUser(session?.user ?? null)
      setChecking(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (checking) return <LoadingScreen />
  const isAdmin = Boolean(user && ADMIN_EMAIL && user.email?.toLowerCase() === ADMIN_EMAIL)

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/entrar" element={user ? <Navigate to={isAdmin ? '/admin' : '/laboratorio'} replace /> : <Login onLogin={setUser} />} />
          <Route path="/laboratorio" element={user && !isAdmin ? <Laboratorio user={user} onLogout={handleLogout} /> : <Navigate to="/entrar" replace />} />
          <Route path="/admin" element={isAdmin ? <Admin user={user} onLogout={handleLogout} /> : <Navigate to="/entrar" replace />} />
          <Route path="/padre/:estudianteId" element={<VistaParent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
