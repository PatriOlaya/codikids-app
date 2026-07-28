import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos. ¡Inténtalo de nuevo!')
      setLoading(false)
    } else {
      onLogin(data.user)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'radial-gradient(ellipse at 60% 40%, #2d1b6b 0%, #1a0f3c 60%, #0a0520 100%)'
    }}>
      {/* Estrellas de fondo */}
      <Stars />

      <div style={{ width: '100%', maxWidth: 420, animation: 'slideUp .4s ease' }}>
        {/* Logo / título */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #534AB7, #5DCAA5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 1rem'
          }}>🚀</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem', fontWeight: 700,
            background: 'linear-gradient(135deg, #fff, #9FE1CB)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>CodiKids</h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.95rem', marginTop: '.25rem' }}>
            Tu academia de inventores 🌟
          </p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            ¡Bienvenido, Inventor!
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '.4rem' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.6)', display: 'block', marginBottom: '.4rem' }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(226,75,74,.15)',
                border: '1px solid rgba(226,75,74,.35)',
                borderRadius: 'var(--radius-sm)',
                padding: '.75rem 1rem',
                fontSize: '.9rem',
                color: '#f09595'
              }}>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ marginTop: '.5rem', opacity: loading ? .7 : 1 }}
            >
              {loading ? 'Entrando...' : '¡Entrar a mi laboratorio! 🚀'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.85rem', color: 'rgba(255,255,255,.35)' }}>
          ¿No tienes cuenta? Pídele a tu profe que te registre 👩‍💻
        </p>
      </div>
    </div>
  )
}

function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: '#fff',
          animation: `twinkle ${2 + s.delay}s ease-in-out infinite`,
          animationDelay: `${s.delay}s`
        }} />
      ))}
    </div>
  )
}
