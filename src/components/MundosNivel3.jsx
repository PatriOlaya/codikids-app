import { MUNDOS_NIVEL_TRES } from '../data/nivelTres'

export default function MundosNivel3({ misiones, progreso, inventos, onSubir, lectura = false }) {
  const idsNivel = new Set(misiones.map(m => m.id))
  const entregadas = new Set(inventos.filter(i => idsNivel.has(i.mision_id)).map(i => i.mision_id))
  const aprobadas = new Set(progreso.filter(p => p.completada).map(p => p.mision_id))
  const retoActivo = misiones.find(m => !entregadas.has(m.id))

  return (
    <section className="card" style={{ marginBottom:'1.5rem', padding:'1.25rem' }} aria-label="Ruta de mundos del Nivel 3">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:'.75rem', color:'#8eece2', fontWeight:800, letterSpacing:2 }}>NIVEL 3 · AVENTURA DE PLATAFORMAS</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', margin:'5px 0' }}>Ocho mundos. Un juego creado por ti.</h2>
          <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.65)', margin:0 }}>Elige tus personajes y escenarios. En cada clase programas una parte nueva del mismo juego.</p>
        </div>
        <span style={{ background:'rgba(103,229,219,.16)', borderRadius:99, padding:'7px 12px', fontSize:'.8rem' }}>{entregadas.size} de {misiones.length || 8} entregas</span>
      </div>
      {misiones.length === 0 && <p>Las misiones del Nivel 3 todavía no están cargadas.</p>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))', gap:12 }}>
        {misiones.map((m, i) => {
          const mundo = MUNDOS_NIVEL_TRES[m.numero - 1] || MUNDOS_NIVEL_TRES[i]
          const abierta = i === 0 || entregadas.has(misiones[i - 1].id)
          const entregada = entregadas.has(m.id)
          const aprobada = aprobadas.has(m.id)
          const activa = retoActivo?.id === m.id && abierta
          return (
            <div key={m.id} style={{ borderRadius:16, border:`2px solid ${activa ? mundo.color : 'rgba(255,255,255,.12)'}`, overflow:'hidden', opacity:abierta ? 1 : .58, background:'#171630', boxShadow:activa ? `0 0 20px ${mundo.color}33` : 'none' }}>
              <div style={{ height:100, background:`radial-gradient(circle at 70% 28%, ${mundo.color}bb 0 12%, transparent 13%), linear-gradient(160deg, ${mundo.cielo}, #15172c)`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:43, filter:abierta ? `drop-shadow(0 4px 12px ${mundo.color})` : 'grayscale(1)' }}>{abierta ? mundo.icono : '🔒'}</span>
                <span style={{ position:'absolute', bottom:0, left:0, right:0, height:11, background:`repeating-linear-gradient(90deg,${mundo.color} 0 28px,${mundo.cielo} 28px 34px)`, opacity:.75 }} />
              </div>
              <div style={{ padding:12 }}>
                <div style={{ color:mundo.color, fontSize:'.7rem', fontWeight:800 }}>MUNDO {m.numero} · CLASE {m.numero}</div>
                <div style={{ fontWeight:800, lineHeight:1.25, minHeight:38, marginTop:4 }}>{mundo.nombre}</div>
                <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.65)' }}>{mundo.habilidad}</div>
                <div style={{ fontSize:'.72rem', marginTop:9, color:aprobada ? '#8eecc1' : entregada ? '#ffd166' : activa ? '#fff' : 'rgba(255,255,255,.55)' }}>
                  {aprobada ? '✓ Aprobado por tu profe' : entregada ? '✓ Entregado · en revisión' : activa ? '★ Reto disponible' : '🔒 Sube el experimento anterior'}
                </div>
                {!lectura && entregada && !aprobada && <button className="btn-ghost" style={{ fontSize:'.72rem', marginTop:8 }} onClick={() => onSubir(m.id)}>Enviar nueva versión</button>}
              </div>
            </div>
          )
        })}
      </div>
      {retoActivo && (() => {
        const mundo = MUNDOS_NIVEL_TRES[retoActivo.numero - 1]
        return <div style={{ marginTop:18, padding:18, borderRadius:16, background:`linear-gradient(125deg, ${mundo.cielo}, #171630)`, border:`1px solid ${mundo.color}88` }}>
          <div style={{ color:mundo.color, fontWeight:800, fontSize:'.78rem' }}>DESAFÍO ACTIVO · CLASE {retoActivo.numero}</div>
          <h3 style={{ margin:'5px 0 10px', fontFamily:'var(--font-display)' }}>{mundo.icono} {mundo.nombre}</h3>
          <p style={{ lineHeight:1.5, margin:'0 0 8px' }}>{mundo.reto}</p>
          <p style={{ lineHeight:1.5, fontSize:'.84rem', color:'rgba(255,255,255,.75)' }}><strong>Para superar el reto:</strong> {mundo.prueba}</p>
          <div style={{ fontSize:'.79rem', color:'#b8fff1' }}>Al subir esta versión del juego se abrirá el siguiente mundo. Tu profe la revisará antes de darte XP.</div>
          {!lectura && <button className="btn-primary" style={{ marginTop:14 }} onClick={() => onSubir(retoActivo.id)}>Subir mi experimento y abrir el siguiente mundo</button>}
        </div>
      })()}
      {!retoActivo && misiones.length > 0 && <p style={{ marginTop:16, color:'#b8fff1' }}>¡Entregaste los ocho experimentos! Tu profe aprobará las misiones para activar el certificado.</p>}
    </section>
  )
}
