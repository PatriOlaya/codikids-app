import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Certificado from '../components/Certificado'

const APP_URL = 'https://codikids-app.vercel.app'

export default function Admin({ user, onLogout }) {
  const [estudiantes, setEstudiantes] = useState([])
  const [misiones,    setMisiones]    = useState([])
  const [inventos,    setInventos]    = useState([])
  const [progreso,    setProgreso]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [activeTab,   setActiveTab]   = useState('estudiantes')
  const [estudianteActivo, setEstudianteActivo] = useState(null)
  const [toast,       setToast]       = useState('')
  const [modalNuevo,  setModalNuevo]  = useState(false)
  const [certData,    setCertData]    = useState(null)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    const [{ data: ests }, { data: mis }, { data: inv }, { data: prog }] = await Promise.all([
      supabase.from('estudiantes').select('*').order('nombre'),
      supabase.from('misiones').select('*').eq('nivel', 2).order('numero'),
      supabase.from('inventos').select('*').order('created_at', { ascending: false }),
      supabase.from('progreso').select('*')
    ])
    setEstudiantes(ests || [])
    setMisiones(mis || [])
    setInventos(inv || [])
    setProgreso(prog || [])
    setLoading(false)
    if (ests?.length > 0 && !estudianteActivo) setEstudianteActivo(ests[0].id)
  }

  async function aprobarMision(estudianteId, misionId, xpReward) {
    const existe = progreso.find(p => p.estudiante_id === estudianteId && p.mision_id === misionId)
    if (existe) {
      await supabase.from('progreso').update({ completada: true, completada_at: new Date().toISOString() }).eq('id', existe.id)
    } else {
      await supabase.from('progreso').insert({ estudiante_id: estudianteId, mision_id: misionId, completada: true, completada_at: new Date().toISOString() })
    }
    const est = estudiantes.find(e => e.id === estudianteId)
    await supabase.from('estudiantes').update({ xp_total: (est?.xp_total || 0) + xpReward }).eq('id', estudianteId)
    mostrarToast('¡Misión aprobada! ✅')
    cargarDatos()
  }

  async function rechazarMision(estudianteId, misionId) {
    await supabase.from('progreso').delete().eq('estudiante_id', estudianteId).eq('mision_id', misionId)
    mostrarToast('Misión devuelta al estudiante')
    cargarDatos()
  }

  async function borrarInvento(inventoId, titulo) {
    if (!confirm(`¿Borrar "${titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('inventos').delete().eq('id', inventoId)
    if (error) { mostrarToast('Error al borrar ❌'); return }
    mostrarToast('Invento borrado 🗑')
    cargarDatos()
  }

  function mostrarToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function copiar(texto, msg = 'Copiado ✅') {
    navigator.clipboard.writeText(texto).then(() => mostrarToast(msg))
  }

  function linkPadre(id) { return `${APP_URL}/padre/${id}` }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#1a0f3c' }}>
      <div style={{ fontSize:48, animation:'flotar 2s ease-in-out infinite' }}>🚀</div>
    </div>
  )

  const estActivo   = estudiantes.find(e => e.id === estudianteActivo)
  const progresoEst = progreso.filter(p => p.estudiante_id === estudianteActivo)
  const inventosEst = inventos.filter(i => i.estudiante_id === estudianteActivo)
  const completadas = progresoEst.filter(p => p.completada).length
  const nivelCompletado = misiones.length > 0 && completadas === misiones.length

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at 30% 20%, #2d1b6b 0%, #1a0f3c 50%, #0a0520 100%)', fontFamily:'var(--font-body)' }}>
      <Stars />

      {toast && (
        <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', background:'#1D9E75', color:'#fff', borderRadius:99, padding:'8px 24px', fontWeight:700, fontSize:14, zIndex:100, whiteSpace:'nowrap' }}>
          {toast}
        </div>
      )}

      {/* Certificado modal */}
      {certData && (
        <div style={{ position:'fixed', inset:0, background:'rgba(10,5,32,.9)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:820, maxHeight:'90vh', overflow:'auto' }}>
            <Certificado nombre={certData.nombre} nivel={certData.nivel} fecha={certData.fecha} onCerrar={() => setCertData(null)} />
          </div>
        </div>
      )}

      <div style={{ maxWidth:980, margin:'0 auto', padding:'1.5rem 1rem' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#534AB7,#5DCAA5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>👩‍💻</div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem' }}>Panel de Patricia</div>
            <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.5)' }}>CodiKids Admin · {estudiantes.length} estudiantes</div>
          </div>
          <button className="btn-ghost" onClick={onLogout} style={{ marginLeft:'auto', padding:'.5rem 1rem', fontSize:'.85rem' }}>Salir</button>
        </header>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
          {[['estudiantes','👨‍🎓 Estudiantes'],['misiones','✅ Misiones']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:'.6rem 1.2rem', borderRadius:99, border:`1px solid ${activeTab===tab ? 'rgba(127,119,221,.5)' : 'rgba(255,255,255,.12)'}`, background: activeTab===tab ? 'rgba(127,119,221,.2)' : 'transparent', color:activeTab===tab ? '#fff' : 'rgba(255,255,255,.5)', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'.9rem', cursor:'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════ TAB ESTUDIANTES ══════════════ */}
        {activeTab === 'estudiantes' && (
          <>
            {/* Stats globales */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
              <StatCard valor={estudiantes.length}                                emoji="👨‍🎓" label="estudiantes"      color="#7F77DD" />
              <StatCard valor={progreso.filter(p=>p.completada).length}           emoji="✅"  label="misiones aprobadas" color="#5DCAA5" />
              <StatCard valor={inventos.length}                                   emoji="🎮"  label="inventos subidos"   color="#EF9F27" />
            </div>

            {/* Lista + detalle */}
            <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.5rem' }}>

              {/* Lista estudiantes */}
              <div>
                <div className="card" style={{ padding:'1rem', marginBottom:'1rem' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'.9rem', marginBottom:'.75rem' }}>Inventores</div>
                  {estudiantes.map(est => {
                    const comp = progreso.filter(p => p.estudiante_id === est.id && p.completada).length
                    const activo = estudianteActivo === est.id
                    return (
                      <div key={est.id} onClick={() => setEstudianteActivo(est.id)} style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.6rem .75rem', borderRadius:10, cursor:'pointer', background: activo ? 'rgba(127,119,221,.2)' : 'transparent', border: activo ? '1px solid rgba(127,119,221,.4)' : '1px solid transparent', marginBottom:4, transition:'all .15s' }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#534AB7,#5DCAA5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🚀</div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:'.85rem' }}>{est.nombre}</div>
                          <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.45)' }}>{comp}/{misiones.length} misiones</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button className="btn-primary" style={{ width:'100%', padding:'.75rem' }} onClick={() => setModalNuevo(true)}>
                  + Nuevo estudiante
                </button>
              </div>

              {/* Detalle estudiante */}
              {estActivo && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

                  {/* Info del estudiante */}
                  <div className="card">
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                      <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#534AB7,#5DCAA5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🚀</div>
                      <div>
                        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem' }}>{estActivo.nombre}</div>
                        <div style={{ fontSize:'.85rem', color:'rgba(255,255,255,.5)' }}>Nivel {estActivo.nivel} · {estActivo.xp_total} XP</div>
                      </div>
                      <div style={{ marginLeft:'auto', textAlign:'right' }}>
                        <div style={{ fontWeight:700, color:'#5DCAA5', fontSize:'1.2rem' }}>{completadas}/{misiones.length}</div>
                        <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)' }}>misiones</div>
                      </div>
                    </div>

                    {/* Link de padres */}
                    <div style={{ background:'rgba(29,158,117,.1)', border:'1px solid rgba(29,158,117,.25)', borderRadius:12, padding:'1rem', marginBottom:'1rem' }}>
                      <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', marginBottom:6 }}>🔗 LINK PARA LOS PADRES</div>
                      <div style={{ fontSize:'.8rem', color:'#5DCAA5', wordBreak:'break-all', marginBottom:8 }}>{linkPadre(estActivo.id)}</div>
                      <button className="btn-primary" style={{ padding:'.4rem 1rem', fontSize:'.8rem' }} onClick={() => copiar(linkPadre(estActivo.id), 'Link copiado ✅')}>
                        📋 Copiar link
                      </button>
                    </div>

                    {/* Certificado */}
                    {nivelCompletado ? (
                      <div style={{ background:'rgba(186,117,23,.1)', border:'1px solid rgba(186,117,23,.3)', borderRadius:12, padding:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div>
                          <div style={{ fontWeight:700, color:'#EF9F27' }}>🏆 ¡Nivel completado!</div>
                          <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.5)', marginTop:2 }}>Genera el certificado de {estActivo.nombre}</div>
                        </div>
                        <button className="btn-primary" style={{ background:'#BA7517', padding:'.6rem 1.2rem', fontSize:'.85rem', flexShrink:0 }}
                          onClick={() => setCertData({ nombre: estActivo.nombre, nivel: estActivo.nivel, fecha: new Date().toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' }) })}>
                          📜 Generar certificado
                        </button>
                      </div>
                    ) : (
                      <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:12, padding:'1rem', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ fontSize:24 }}>📜</div>
                        <div style={{ fontSize:'.85rem', color:'rgba(255,255,255,.5)' }}>El certificado estará disponible cuando {estActivo.nombre} complete las {misiones.length} misiones ({completadas}/{misiones.length} completadas)</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════ TAB MISIONES ══════════════ */}
        {activeTab === 'misiones' && (
          <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.5rem' }}>

            <div className="card" style={{ padding:'1rem', height:'fit-content' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'.9rem', marginBottom:'.75rem' }}>Inventores</div>
              {estudiantes.map(est => {
                const comp = progreso.filter(p => p.estudiante_id === est.id && p.completada).length
                const activo = estudianteActivo === est.id
                return (
                  <div key={est.id} onClick={() => setEstudianteActivo(est.id)} style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.6rem .75rem', borderRadius:10, cursor:'pointer', background: activo ? 'rgba(127,119,221,.2)' : 'transparent', border: activo ? '1px solid rgba(127,119,221,.4)' : '1px solid transparent', marginBottom:4 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#534AB7,#5DCAA5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🚀</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'.85rem' }}>{est.nombre}</div>
                      <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.45)' }}>{comp}/{misiones.length} misiones</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {estActivo && (
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div className="card">
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>{estActivo.nombre}</div>
                    <div style={{ fontSize:'.85rem', color:'rgba(255,255,255,.5)' }}>· {completadas}/{misiones.length} misiones · {estActivo.xp_total} XP</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                    {misiones.map(m => {
                      const prog    = progresoEst.find(p => p.mision_id === m.id)
                      const completada = prog?.completada
                      const invento = inventosEst.find(i => i.mision_id === m.id)
                      return (
                        <div key={m.id} style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.75rem 1rem', background: completada ? 'rgba(29,158,117,.1)' : invento ? 'rgba(239,159,39,.08)' : 'rgba(255,255,255,.03)', border:`1px solid ${completada ? 'rgba(29,158,117,.3)' : invento ? 'rgba(239,159,39,.25)' : 'rgba(255,255,255,.07)'}`, borderRadius:10 }}>
                          <div style={{ fontSize:20 }}>{completada ? '✅' : invento ? '⏳' : '🔒'}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600, fontSize:'.88rem' }}>{m.titulo}</div>
                            {invento ? (
                              <a href={invento.scratch_url} target="_blank" rel="noreferrer" style={{ fontSize:'.75rem', color:'#7F77DD' }}>🎮 {invento.titulo} — ver en Scratch →</a>
                            ) : (
                              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.35)' }}>{completada ? 'Aprobada' : 'Sin invento aún'}</div>
                            )}
                          </div>
                          <div style={{ fontSize:'.78rem', color:'#7F77DD', fontWeight:700 }}>+{m.xp_reward} XP</div>
                          {invento && !completada && (
                            <div style={{ display:'flex', gap:'.5rem' }}>
                              <button className="btn-primary" style={{ padding:'.4rem .9rem', fontSize:'.8rem' }} onClick={() => aprobarMision(estActivo.id, m.id, m.xp_reward)}>✅ Aprobar</button>
                              <button className="btn-ghost" style={{ padding:'.4rem .9rem', fontSize:'.8rem' }} onClick={() => rechazarMision(estActivo.id, m.id)}>↩ Devolver</button>
                            </div>
                          )}
                          {completada && <span style={{ fontSize:'.78rem', color:'#5DCAA5', fontWeight:700 }}>Aprobada</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {inventosEst.length > 0 && (
                  <div className="card">
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'.95rem', marginBottom:'1rem' }}>Inventos de {estActivo.nombre}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'.75rem' }}>
                      {inventosEst.map(inv => (
                        <div key={inv.id} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.09)', borderRadius:12, padding:'1rem', position:'relative' }}>
                          <button onClick={() => borrarInvento(inv.id, inv.titulo)} title="Borrar invento"
                            style={{ position:'absolute', top:8, right:8, background:'rgba(220,50,50,.15)', border:'1px solid rgba(220,50,50,.3)', borderRadius:6, color:'#ff7b7b', cursor:'pointer', fontSize:13, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
                            🗑
                          </button>
                          <div style={{ fontSize:24, marginBottom:'.4rem' }}>🎮</div>
                          <div style={{ fontWeight:700, fontSize:'.85rem', paddingRight:28 }}>{inv.titulo}</div>
                          {inv.descripcion && <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.45)', marginTop:2 }}>{inv.descripcion}</div>}
                          <a href={inv.scratch_url} target="_blank" rel="noreferrer" style={{ fontSize:'.72rem', color:'#7F77DD', marginTop:'.4rem', display:'block' }}>Ver en Scratch →</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {modalNuevo && (
        <ModalNuevoEstudiante
          onClose={() => setModalNuevo(false)}
          onCreado={() => { setModalNuevo(false); cargarDatos(); mostrarToast('¡Estudiante creado! ✅') }}
          onError={(msg) => mostrarToast('Error: ' + msg)}
        />
      )}
    </div>
  )
}

// ── Modal crear estudiante
function ModalNuevoEstudiante({ onClose, onCreado, onError }) {
  const [nombre,   setNombre]   = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [nivel,    setNivel]    = useState(2)
  const [saving,   setSaving]   = useState(false)

  async function crear() {
    if (!nombre || !email || !password) return
    setSaving(true)
    try {
      const res = await fetch('/api/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, nivel })
      })
      const data = await res.json()
      if (data.error) { onError(data.error); setSaving(false); return }
      onCreado()
    } catch (e) {
      onError(e.message)
      setSaving(false)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(10,5,32,.88)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }} onClick={onClose}>
      <div className="card" style={{ width:'100%', maxWidth:440, padding:'2rem' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, marginBottom:'1.5rem' }}>Nuevo estudiante 🚀</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', display:'block', marginBottom:4 }}>Nombre del estudiante</label>
            <input type="text" placeholder="Ej: Jero" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', display:'block', marginBottom:4 }}>Correo electrónico</label>
            <input type="email" placeholder="jero@codikids.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', display:'block', marginBottom:4 }}>Contraseña</label>
            <input type="text" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:'.82rem', color:'rgba(255,255,255,.5)', display:'block', marginBottom:4 }}>Nivel</label>
            <select value={nivel} onChange={e => setNivel(Number(e.target.value))} style={{ width:'100%', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.18)', borderRadius:'var(--radius-sm)', color:'#fff', fontFamily:'var(--font-body)', fontSize:'1rem', padding:'.75rem 1rem' }}>
              <option value={1}>Nivel 1 — Scratch Exploradores</option>
              <option value={2}>Nivel 2 — Scratch Ninja</option>
            </select>
          </div>
          <div style={{ background:'rgba(29,158,117,.1)', border:'1px solid rgba(29,158,117,.2)', borderRadius:10, padding:'10px 14px', fontSize:'.82rem', color:'rgba(255,255,255,.55)', lineHeight:1.6 }}>
            📋 Guarda estas credenciales para enviárselas al estudiante. Luego encontrarás el link para los padres en su perfil.
          </div>
          <div style={{ display:'flex', gap:'.75rem', marginTop:'.5rem' }}>
            <button className="btn-ghost" style={{ flex:1 }} onClick={onClose}>Cancelar</button>
            <button className="btn-primary" style={{ flex:1, opacity: saving ? .7 : 1 }} onClick={crear} disabled={saving}>
              {saving ? 'Creando...' : '¡Crear estudiante!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ emoji, valor, label, color }) {
  return (
    <div className="card" style={{ padding:'1rem', textAlign:'center' }}>
      <div style={{ fontSize:28, marginBottom:4 }}>{emoji}</div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:700, color }}>{valor}</div>
      <div style={{ fontSize:'.78rem', color:'rgba(255,255,255,.45)', marginTop:2 }}>{label}</div>
    </div>
  )
}

function Stars() {
  const stars = Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*1.5+.8,delay:Math.random()*4}))
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none' }}>
      {stars.map(s=><div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:'50%', background:'#fff', animation:`twinkle ${2+s.delay}s ease-in-out infinite`, animationDelay:`${s.delay}s` }}/>)}
    </div>
  )
}
