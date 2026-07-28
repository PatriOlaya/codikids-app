import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Planeta from '../components/Planeta'

export default function VistaParent() {
  const { estudianteId } = useParams()
  const [estudiante, setEstudiante] = useState(null)
  const [misiones, setMisiones]     = useState([])
  const [progreso, setProgreso]     = useState([])
  const [inventos, setInventos]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)

  useEffect(() => { cargarDatos() }, [estudianteId])

  async function cargarDatos() {
    const [{ data: est }, { data: mis }, { data: prog }, { data: inv }] = await Promise.all([
      supabase.from('estudiantes').select('*').eq('id', estudianteId).single(),
      supabase.from('misiones').select('*').eq('nivel', 2).order('numero'),
      supabase.from('progreso').select('*').eq('estudiante_id', estudianteId),
      supabase.from('inventos').select('*').eq('estudiante_id', estudianteId).order('created_at', { ascending: false })
    ])
    if (!est) { setError(true); setLoading(false); return }
    setEstudiante(est)
    setMisiones(mis || [])
    setProgreso(prog || [])
    setInventos(inv || [])
    setLoading(false)
  }

  if (loading) return <Cargando />
  if (error)   return <Error />

  const completadas = progreso.filter(p => p.completada).length
  const total       = misiones.length || 8
  const pct         = Math.round((completadas / total) * 100)
  const xp          = estudiante.xp_total || 0

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, #2d1b6b 0%, #1a0f3c 50%, #0a0520 100%)', fontFamily: 'var(--font-body)' }}>
      <Stars />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#534AB7,#5DCAA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto .75rem' }}>🚀</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '.85rem', color: 'rgba(255,255,255,.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '.25rem' }}>CodiKids</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700 }}>
            El mundo de {estudiante.nombre}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', marginTop: '.4rem' }}>
            Nivel 2 · Scratch Ninja
          </p>
        </div>

        {/* Planeta */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '100%', maxWidth: 260, animation: 'flotar 5s ease-in-out infinite' }}>
            <Planeta misionesCompletadas={completadas} totalMisiones={total} />
          </div>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.4rem' }}>
              <span style={{ color: 'rgba(255,255,255,.6)' }}>{completadas} de {total} misiones completadas</span>
              <span style={{ color: '#7F77DD', fontWeight: 700 }}>{pct}%</span>
            </div>
            <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          <StatCard emoji="⚡" valor={xp} label="XP ganados" color="#7F77DD" />
          <StatCard emoji="🏆" valor={completadas} label="misiones" color="#5DCAA5" />
          <StatCard emoji="🎮" valor={inventos.length} label="inventos" color="#EF9F27" />
        </div>

        {/* Misiones */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
            Progreso de misiones 🗺
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {misiones.map((m, i) => {
              const completada = progreso.some(p => p.mision_id === m.id && p.completada)
              const insignias  = ['🌍','🌊','🌳','🏙','⚡','🌙','🌀','⭐']
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem 1rem', background: completada ? 'rgba(29,158,117,.1)' : 'rgba(255,255,255,.03)', border: `1px solid ${completada ? 'rgba(29,158,117,.25)' : 'rgba(255,255,255,.07)'}`, borderRadius: 10, opacity: completada ? 1 : .5 }}>
                  <div style={{ fontSize: 18 }}>{completada ? '✅' : insignias[i]}</div>
                  <div style={{ flex: 1, fontSize: '.88rem', fontWeight: completada ? 600 : 400 }}>{m.titulo}</div>
                  <div style={{ fontSize: '.78rem', color: completada ? '#5DCAA5' : 'rgba(255,255,255,.35)', fontWeight: 600 }}>
                    {completada ? `+${m.xp_reward} XP` : 'Pendiente'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Inventos */}
        {inventos.length > 0 && (
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
              Inventos creados 🔬
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '.75rem' }}>
              {inventos.map(inv => (
                <a key={inv.id} href={inv.scratch_url} target="_blank" rel="noreferrer"
                  style={{ display: 'block', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 12, padding: '1rem', transition: 'border-color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(127,119,221,.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.09)'}>
                  <div style={{ fontSize: 26, marginBottom: '.4rem' }}>🎮</div>
                  <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{inv.titulo}</div>
                  {inv.descripcion && <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{inv.descripcion}</div>}
                  <div style={{ fontSize: '.75rem', color: '#7F77DD', marginTop: '.5rem' }}>Jugar en Scratch →</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '1rem 0', color: 'rgba(255,255,255,.25)', fontSize: '.8rem' }}>
          CodiKids · Academia de Inventores 💙
        </div>

      </div>
    </div>
  )
}

function StatCard({ emoji, valor, label, color }) {
  return (
    <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
      <div style={{ fontSize: 22, marginBottom: '.25rem' }}>{emoji}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color }}>{valor}</div>
      <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function Cargando() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: '#1a0f3c' }}>
      <div style={{ fontSize: 48, animation: 'flotar 2s ease-in-out infinite' }}>🚀</div>
      <p style={{ color: 'rgba(255,255,255,.5)', fontFamily: 'var(--font-body)' }}>Cargando el progreso...</p>
    </div>
  )
}

function Error() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: '#1a0f3c' }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <p style={{ color: 'rgba(255,255,255,.5)', fontFamily: 'var(--font-body)' }}>No encontramos este estudiante.</p>
    </div>
  )
}

function Stars() {
  const stars = Array.from({ length: 20 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 1.5 + .8, delay: Math.random() * 4 }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      {stars.map(s => <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', animation: `twinkle ${2 + s.delay}s ease-in-out infinite`, animationDelay: `${s.delay}s` }} />)}
    </div>
  )
}
