import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Planeta from '../components/Planeta'
import Avatar from '../components/Avatar'
import ConstructorAvatar from './ConstructorAvatar'
import MinijuegoEstrellas from '../components/MinijuegoEstrellas'
import Insignias from '../components/Insignias'
import CodigoRoto from '../components/CodigoRoto'

const INSIGNIAS = ['🌍','🌊','🌳','🏙','⚡','🌙','🌀','⭐']

export default function Laboratorio({ user, onLogout }) {
  const [estudiante, setEstudiante]     = useState(null)
  const [misiones, setMisiones]         = useState([])
  const [progreso, setProgreso]         = useState([])
  const [inventos, setInventos]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [modalInvento, setModalInvento] = useState(null)
  const [enConstructor, setEnConstructor] = useState(false)
  const [enMinijuego, setEnMinijuego]     = useState(false)
  const [enCodigoRoto, setEnCodigoRoto]   = useState(false)
  const [cajaAbierta, setCajaAbierta]     = useState(false)
  const [premioGanado, setPremioGanado]   = useState(null)

  const hoyKey = `caja_${user.id}_${new Date().toISOString().slice(0,10)}`
  const cajaDisponible = !localStorage.getItem(hoyKey)

  function abrirCaja() {
    const premios = [
      { emoji: '⭐', texto: '¡+30 XP extra!', desc: 'Los puntos ya están en tu laboratorio', tipo: 'xp' },
      { emoji: '🧩', texto: '¡Pieza nueva para tu avatar!', desc: 'Ve al constructor a personalizar tu inventor', tipo: 'avatar' },
      { emoji: '🔑', texto: '¡Llave secreta!', desc: 'Guárdala, desbloquea cofres especiales', tipo: 'llave' },
      { emoji: '💎', texto: '¡Gema rara conseguida!', desc: '¡Colecciónalas para premios especiales!', tipo: 'gema' },
    ]
    const p = premios[Math.floor(Math.random() * premios.length)]
    setPremioGanado(p)
    setCajaAbierta(true)
    localStorage.setItem(hoyKey, '1')
  }

  useEffect(() => { cargarDatos() }, [user])

  async function cargarDatos() {
    const [{ data: est }, { data: mis }, { data: prog }, { data: inv }] = await Promise.all([
      supabase.from('estudiantes').select('*').eq('id', user.id).single(),
      supabase.from('misiones').select('*').eq('nivel', 2).order('numero'),
      supabase.from('progreso').select('*').eq('estudiante_id', user.id),
      supabase.from('inventos').select('*').eq('estudiante_id', user.id).order('created_at', { ascending: false })
    ])
    setEstudiante(est)
    setMisiones(mis || [])
    setProgreso(prog || [])
    setInventos(inv || [])
    setLoading(false)
  }

  const misionesCompletadas = progreso.filter(p => p.completada).length
  const totalMisiones       = misiones.length || 8
  const xpTotal             = estudiante?.xp_total || 0
  const pct                 = totalMisiones > 0 ? Math.round((misionesCompletadas / totalMisiones) * 100) : 0

  if (loading) return <Cargando />

  if (enConstructor) return (
    <ConstructorAvatar
      user={user}
      onVolver={() => setEnConstructor(false)}
      onGuardado={async (nuevaConfig) => {
        // Actualizar avatar en pantalla inmediatamente
        if (nuevaConfig) setEstudiante(prev => ({ ...prev, avatar_config: nuevaConfig }))
        setEnConstructor(false)
        // Recargar datos completos en background
        cargarDatos()
      }}
    />
  )

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, #2d1b6b 0%, #1a0f3c 50%, #0a0520 100%)' }}>
      <Stars />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>

        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#534AB7,#5DCAA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚀</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>CodiKids</div>
            <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)' }}>Laboratorio de {estudiante?.nombre || user.email}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div onClick={() => setEnConstructor(true)} style={{ cursor: 'pointer', animation: 'flotar 4s ease-in-out infinite' }} title="Personalizar mi inventor">
              <Avatar key={JSON.stringify(estudiante?.avatar_config)} config={estudiante?.avatar_config || { seed: estudiante?.nombre || 'Inventor' }} size={52} />
            </div>
          </div>
          <button className="btn-ghost" onClick={onLogout} style={{ padding: '.5rem 1rem', fontSize: '.85rem' }}>Salir</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', alignSelf: 'flex-start' }}>Mi Planeta 🌍</div>
            <div style={{ width: '100%', maxWidth: 280, animation: 'flotar 5s ease-in-out infinite' }}>
              <Planeta misionesCompletadas={misionesCompletadas} totalMisiones={totalMisiones} />
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.4rem' }}>
                <span style={{ color: 'rgba(255,255,255,.6)' }}>Nivel 2 · Scratch Ninja</span>
                <span style={{ color: '#7F77DD', fontWeight: 700 }}>{pct}%</span>
              </div>
              <div className="xp-bar-track"><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <StatCard emoji="⚡" valor={xpTotal} label="XP ganados" color="#7F77DD" />
            <StatCard emoji="🏆" valor={misionesCompletadas} label={`de ${totalMisiones} misiones`} color="#5DCAA5" />
            <StatCard emoji="🎮" valor={inventos.length} label="inventos creados" color="#EF9F27" />
            <StatCard emoji="🔥" valor={estudiante?.racha_dias || 0} label="días de racha" color="#f09595" />
          </div>
        </div>

        {/* Minijuego */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'1rem' }}>🎮 Reto del Inventor</div>
              <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.45)', marginTop:2 }}>Atrapa estrellas, evita asteroides y caza supernovas ✨</div>
            </div>
            <button className="btn-primary" style={{ padding:'.5rem 1.2rem', fontSize:'.85rem' }} onClick={() => setEnMinijuego(true)}>
              ¡Jugar!
            </button>
          </div>
          <div style={{ display:'flex', gap:16, fontSize:'.8rem', color:'rgba(255,255,255,.6)' }}>
            <span>⭐ +1 estrella</span>
            <span style={{ color:'#FFD700' }}>✨ +5 supernova</span>
            <span style={{ color:'#E85D4A' }}>☄️ -2 asteroide</span>
          </div>
        </div>

        {/* Código Roto */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'.75rem' }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'1rem' }}>🔧 Código Roto</div>
              <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.45)', marginTop:2 }}>
                Repara el programa del robot para que llegue a la estrella ⭐
              </div>
            </div>
            <button className="btn-primary" style={{ padding:'.5rem 1.2rem', fontSize:'.85rem', background:'linear-gradient(135deg,#534AB7,#1D9E75)' }} onClick={() => setEnCodigoRoto(true)}>
              ¡Reparar!
            </button>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', fontSize:'.78rem', color:'rgba(255,255,255,.5)' }}>
            <span>🗺 8 mapas</span>
            <span>·</span>
            <span>⬆ Instrucciones de movimiento</span>
            <span>·</span>
            <span>💎 Recoge gemas</span>
            <span>·</span>
            <span style={{ color:'#7F77DD' }}>Se desbloquean con tus misiones</span>
          </div>
        </div>

        {/* ── Caja Misteriosa Diaria ── */}
        <div className="card" style={{ marginBottom:'1.5rem', background: cajaDisponible ? 'rgba(83,74,183,.18)' : 'rgba(255,255,255,.04)', border:`1px solid ${cajaDisponible ? 'rgba(127,119,221,.45)' : 'rgba(255,255,255,.08)'}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ fontSize:44, animation: cajaDisponible ? 'flotar 2s ease-in-out infinite' : 'none', filter: cajaDisponible ? 'drop-shadow(0 0 12px rgba(239,159,39,.5))' : 'grayscale(1) opacity(.4)' }}>🎁</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem' }}>{cajaDisponible ? '¡Tu caja del día está lista!' : 'Caja abierta hoy ✅'}</div>
              <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.5)', marginTop:2 }}>{cajaDisponible ? 'Abre tu caja diaria y gana una sorpresa 🌟' : 'Vuelve mañana para una nueva sorpresa'}</div>
            </div>
            {cajaDisponible && (
              <button className="btn-primary" style={{ padding:'.6rem 1.4rem', fontSize:'.9rem' }} onClick={abrirCaja}>¡Abrir!</button>
            )}
          </div>
        </div>

        {/* ── Mapa de Aventura ── */}
        <div className="card" style={{ marginBottom:'1.5rem' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'1rem', marginBottom:'1.25rem' }}>🗺 Mapa de Aventura — Nivel 2</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'.75rem', marginBottom:'1rem' }}>
            {misiones.map((m, i) => {
              const completada   = progreso.some(p => p.mision_id === m.id && p.completada)
              const pendiente    = progreso.some(p => p.mision_id === m.id && !p.completada)
              const desbloqueada = i === 0 || progreso.some(p => p.mision_id === misiones[i-1]?.id && p.completada)
              const colores = ['#1D9E75','#185FA5','#534AB7','#993556','#854F0B','#3B6D11','#0F6E56','#BA7517']
              return (
                <div key={m.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem', opacity: desbloqueada || completada ? 1 : .35, cursor: (desbloqueada && !completada && !pendiente) ? 'pointer' : 'default' }}
                  onClick={() => desbloqueada && !completada && !pendiente && setModalInvento({ misionId: m.id })}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background: colores[i] || '#534AB7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28,
                    boxShadow: completada ? `0 0 18px ${colores[i]}88` : pendiente ? '0 0 14px rgba(239,159,39,.5)' : desbloqueada ? `0 0 0 2.5px ${colores[i]},0 0 14px ${colores[i]}55` : 'none',
                    animation: (desbloqueada && !completada && !pendiente) ? 'flotar 3s ease-in-out infinite' : 'none', transition:'all .3s', position:'relative' }}>
                    {INSIGNIAS[i]}
                    {completada && <span style={{ position:'absolute', top:-4, right:-4, width:20, height:20, background:'#5DCAA5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>✓</span>}
                    {pendiente  && <span style={{ position:'absolute', top:-4, right:-4, width:20, height:20, background:'#EF9F27', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>⏳</span>}
                    {!desbloqueada && !completada && <span style={{ position:'absolute', top:-4, right:-4, width:20, height:20, background:'#444', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>🔒</span>}
                  </div>
                  <div style={{ fontSize:'.72rem', fontWeight:600, textAlign:'center', color: completada ? '#5DCAA5' : pendiente ? '#EF9F27' : 'rgba(255,255,255,.75)', lineHeight:1.3 }}>{m.titulo}</div>
                  <div style={{ fontSize:'.68rem', color:'#7F77DD', fontWeight:700 }}>+{m.xp_reward} XP</div>
                  {desbloqueada && !completada && !pendiente && (
                    <div style={{ fontSize:'.68rem', background:'rgba(83,74,183,.3)', border:'1px solid rgba(127,119,221,.4)', borderRadius:8, padding:'2px 8px', color:'#bfbbf5' }}>Subir invento</div>
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,.07)', margin:'0 0 .75rem' }} />
          <div style={{ display:'flex', gap:16, fontSize:'.75rem', color:'rgba(255,255,255,.45)' }}>
            <span>✓ Aprobada</span><span>⏳ En revisión</span><span>🔒 Bloqueada</span><span style={{ color:'#7F77DD' }}>· Toca un planeta desbloqueado para subir tu invento</span>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem' }}>Mis Inventos 🔬</h2>
            <button className="btn-primary" style={{ padding: '.5rem 1rem', fontSize: '.85rem' }} onClick={() => setModalInvento({})}>+ Nuevo invento</button>
          </div>
          {inventos.length === 0
            ? <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem' }}>Sube tu primer invento cuando completes una misión 🚀</p>
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
                {inventos.map(inv => <InventoCard key={inv.id} invento={inv} />)}
              </div>
          }
        </div>

        {/* Insignias */}
        <Insignias
          misionesCompletadas={misionesCompletadas}
          habilidades={estudiante?.habilidades || []}
        />

      </div>

      {enMinijuego && (
        <div style={{ position:'fixed', inset:0, background:'rgba(10,5,32,.88)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }} onClick={() => setEnMinijuego(false)}>
          <div onClick={e => e.stopPropagation()}>
            <MinijuegoEstrellas onCerrar={() => setEnMinijuego(false)} />
          </div>
        </div>
      )}

      {modalInvento !== null && (
        <ModalInvento
          userId={user.id}
          misiones={misiones}
          misionIdInicial={modalInvento?.misionId}
          onClose={() => setModalInvento(null)}
          onGuardado={() => { setModalInvento(null); cargarDatos() }}
        />
      )}

      {enCodigoRoto && (
        <CodigoRoto
          misionesCompletadas={misionesCompletadas}
          onCerrar={() => setEnCodigoRoto(false)}
        />
      )}

      {cajaAbierta && premioGanado && (
        <div style={{ position:'fixed', inset:0, background:'rgba(10,5,32,.92)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={() => setCajaAbierta(false)}>
          <div className="card" style={{ maxWidth:340, width:'100%', textAlign:'center', padding:'2.5rem 2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:80, marginBottom:'1rem', animation:'flotar 1.5s ease-in-out infinite' }}>{premioGanado.emoji}</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.3rem', marginBottom:'.5rem' }}>{premioGanado.texto}</div>
            <div style={{ fontSize:'.85rem', color:'rgba(255,255,255,.5)', marginBottom:'1.5rem' }}>{premioGanado.desc}</div>
            <button className="btn-primary" style={{ width:'100%', padding:'.75rem' }} onClick={() => setCajaAbierta(false)}>
              ¡Genial! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MisionItem({ mision, completada, pendiente, desbloqueada, insignia, tieneInvento, onSubirInvento }) {
  const icono = completada ? '✅' : pendiente ? '⏳' : desbloqueada ? insignia : '🔒'
  const bg    = completada ? 'rgba(29,158,117,.12)' : pendiente ? 'rgba(239,159,39,.08)' : 'rgba(255,255,255,.04)'
  const borde = completada ? 'rgba(29,158,117,.3)' : pendiente ? 'rgba(239,159,39,.25)' : 'rgba(255,255,255,.08)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', background: bg, border: `1px solid ${borde}`, borderRadius: 'var(--radius-sm)', opacity: desbloqueada || completada ? 1 : .4, transition: 'all .2s' }}>
      <div style={{ fontSize: 22, flexShrink: 0 }}>{icono}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{mision.titulo}</div>
        <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginTop: 2 }}>
          {completada ? '¡Misión aprobada por tu profe!' : pendiente ? 'Tu profe está revisando tu trabajo...' : mision.descripcion}
        </div>
      </div>
      <div style={{ fontSize: '.78rem', color: '#7F77DD', fontWeight: 700, flexShrink: 0 }}>+{mision.xp_reward} XP</div>
      {desbloqueada && !completada && !pendiente && (
        <button className="btn-primary" style={{ padding: '.4rem .9rem', fontSize: '.8rem', flexShrink: 0 }} onClick={onSubirInvento}>
          {tieneInvento ? 'Ver invento' : 'Subir invento'}
        </button>
      )}
    </div>
  )
}

function StatCard({ emoji, valor, label, color }) {
  return (
    <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{emoji}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color }}>{valor}</div>
        <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)' }}>{label}</div>
      </div>
    </div>
  )
}

function InventoCard({ invento }) {
  return (
    <a href={invento.scratch_url} target="_blank" rel="noreferrer" style={{ display: 'block', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 'var(--radius-md)', padding: '1rem', transition: 'border-color .15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(127,119,221,.5)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.10)'}>
      <div style={{ fontSize: 28, marginBottom: '.5rem' }}>🎮</div>
      <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{invento.titulo}</div>
      {invento.descripcion && <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginTop: '.25rem' }}>{invento.descripcion}</div>}
      <div style={{ fontSize: '.75rem', color: '#7F77DD', marginTop: '.5rem' }}>Ver en Scratch →</div>
    </a>
  )
}

function ModalInvento({ userId, misiones, misionIdInicial, onClose, onGuardado }) {
  const [titulo, setTitulo]           = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [url, setUrl]                 = useState('')
  const [misionId, setMisionId]       = useState(misionIdInicial || '')
  const [saving, setSaving]           = useState(false)

  async function guardar() {
    if (!titulo || !url) return
    setSaving(true)
    await supabase.from('inventos').insert({ estudiante_id: userId, mision_id: misionId || null, titulo, descripcion, scratch_url: url })
    setSaving(false)
    onGuardado()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,5,32,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.5rem' }}>Subir invento 🔬</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="Nombre de tu invento" value={titulo} onChange={e => setTitulo(e.target.value)} />
          <input type="text" placeholder="Descripción (opcional)" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <input type="text" placeholder="Link de Scratch (https://scratch.mit.edu/...)" value={url} onChange={e => setUrl(e.target.value)} />
          <select value={misionId} onChange={e => setMisionId(e.target.value)} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 'var(--radius-sm)', color: '#fff', padding: '.75rem 1rem', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
            <option value="">Misión relacionada (opcional)</option>
            {misiones.map(m => <option key={m.id} value={m.id}>{m.titulo}</option>)}
          </select>
          <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>
            Tu profe revisará tu invento y aprobará la misión cuando esté listo ✨
          </p>
          <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
            <button className="btn-primary" style={{ flex: 1, opacity: saving ? .7 : 1 }} onClick={guardar} disabled={saving}>{saving ? 'Guardando...' : '¡Enviar a mi profe!'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Cargando() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: '#1a0f3c' }}>
      <div style={{ fontSize: 48, animation: 'flotar 2s ease-in-out infinite' }}>🚀</div>
      <p style={{ color: 'rgba(255,255,255,.5)' }}>Cargando tu laboratorio...</p>
    </div>
  )
}

function Stars() {
  const stars = Array.from({ length: 25 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 4 }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
      {stars.map(s => <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', background: '#fff', animation: `twinkle ${2 + s.delay}s ease-in-out infinite`, animationDelay: `${s.delay}s` }} />)}
    </div>
  )
}
