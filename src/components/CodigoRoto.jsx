import { useRef, useEffect, useState, useCallback } from 'react'

const DIRS = {
  arriba:    { dx: 0, dy: -1 },
  derecha:   { dx: 1, dy:  0 },
  abajo:     { dx: 0, dy:  1 },
  izquierda: { dx:-1, dy:  0 },
}
const ICONOS = { arriba:'↑', derecha:'→', abajo:'↓', izquierda:'←' }
const COLORES = { arriba:'#5DCAA5', derecha:'#7F77DD', abajo:'#EF9F27', izquierda:'#f09595' }

const NIVELES = [
  {
    titulo: 'El Primer Mundo',
    desc: 'Lleva al robot hasta la estrella ⭐',
    cols: 6, rows: 5,
    robot: { x: 0, y: 4 },
    meta:  { x: 5, y: 0 },
    paredes: [{ x:2,y:1 },{ x:2,y:2 },{ x:2,y:3 },{ x:4,y:1 },{ x:4,y:2 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'El Gran Océano',
    desc: '¡Cuidado con los muros! Planifica tu ruta',
    cols: 6, rows: 6,
    robot: { x: 0, y: 5 },
    meta:  { x: 5, y: 5 },
    paredes: [{ x:1,y:3 },{ x:1,y:4 },{ x:1,y:5 },{ x:3,y:0 },{ x:3,y:1 },{ x:3,y:2 },{ x:3,y:3 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'Vida en el Planeta',
    desc: 'Recoge la gema 💎 antes de llegar a la estrella',
    cols: 6, rows: 6,
    robot: { x: 0, y: 5 },
    meta:  { x: 5, y: 0 },
    gema:  { x: 5, y: 5 },
    paredes: [{ x:2,y:2 },{ x:2,y:3 },{ x:2,y:4 },{ x:4,y:1 },{ x:4,y:2 },{ x:4,y:3 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'La Gran Ciudad',
    desc: 'Recorre el laberinto y llega a la estrella',
    cols: 7, rows: 6,
    robot: { x: 0, y: 0 },
    meta:  { x: 6, y: 5 },
    paredes: [{ x:1,y:1 },{ x:2,y:1 },{ x:3,y:1 },{ x:1,y:3 },{ x:2,y:3 },{ x:3,y:3 },{ x:5,y:0 },{ x:5,y:1 },{ x:5,y:2 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'Energía Infinita',
    desc: 'Dos gemas 💎💎 y luego la estrella — ¡en orden!',
    cols: 6, rows: 6,
    robot: { x: 0, y: 0 },
    meta:  { x: 5, y: 5 },
    gema:  { x: 0, y: 5 },
    gema2: { x: 5, y: 0 },
    paredes: [{ x:2,y:1 },{ x:2,y:2 },{ x:4,y:3 },{ x:4,y:4 },{ x:1,y:4 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'La Misión Secreta',
    desc: 'El laberinto más difícil hasta ahora 🔥',
    cols: 7, rows: 7,
    robot: { x: 0, y: 6 },
    meta:  { x: 6, y: 0 },
    paredes: [{ x:1,y:4 },{ x:1,y:5 },{ x:1,y:6 },{ x:3,y:2 },{ x:3,y:3 },{ x:3,y:4 },{ x:5,y:1 },{ x:5,y:2 },{ x:5,y:3 },{ x:2,y:0 },{ x:2,y:1 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'El Portal Dimensional',
    desc: 'Recoge la gema y escapa por la estrella',
    cols: 7, rows: 6,
    robot: { x: 3, y: 5 },
    meta:  { x: 6, y: 0 },
    gema:  { x: 0, y: 0 },
    paredes: [{ x:1,y:2 },{ x:2,y:2 },{ x:4,y:3 },{ x:4,y:4 },{ x:4,y:5 },{ x:2,y:4 },{ x:5,y:2 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
  {
    titulo: 'El Invento Completo',
    desc: '¡El reto final! Dos gemas y la estrella 🏆',
    cols: 7, rows: 7,
    robot: { x: 0, y: 6 },
    meta:  { x: 6, y: 6 },
    gema:  { x: 6, y: 0 },
    gema2: { x: 0, y: 0 },
    paredes: [{ x:2,y:1 },{ x:2,y:2 },{ x:2,y:3 },{ x:4,y:3 },{ x:4,y:4 },{ x:4,y:5 },{ x:1,y:5 },{ x:5,y:1 },{ x:5,y:2 }],
    bloques: ['arriba','derecha','abajo','izquierda'],
  },
]

function esperar(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function CodigoRoto({ misionesCompletadas = 0, onCerrar }) {
  const canvasRef = useRef(null)
  const [nivelIdx, setNivelIdx]       = useState(0)
  const [programa, setPrograma]       = useState([])
  const [dragging, setDragging]       = useState(null)
  const [animando, setAnimando]       = useState(false)
  const [msg, setMsg]                 = useState(null)   // { tipo:'ok'|'err', texto }
  const [pasoActivo, setPasoActivo]   = useState(-1)
  const [gemas, setGemas]             = useState({ g1: false, g2: false })
  const [robotPos, setRobotPos]       = useState(null)

  const nivel = NIVELES[nivelIdx]
  const desbloqueados = Math.min(misionesCompletadas + 1, NIVELES.length)

  const dibujar = useCallback((rp, gemasState) => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const C = Math.min(cv.width / nivel.cols, cv.height / nivel.rows)
    ctx.clearRect(0, 0, cv.width, cv.height)

    for (let r = 0; r < nivel.rows; r++) {
      for (let c = 0; c < nivel.cols; c++) {
        const esPared = nivel.paredes?.some(p => p.x === c && p.y === r)
        ctx.fillStyle = esPared ? '#2a1060' : '#1a0f3c'
        ctx.fillRect(c * C, r * C, C, C)
        ctx.strokeStyle = 'rgba(255,255,255,.06)'
        ctx.strokeRect(c * C, r * C, C, C)
        if (esPared) {
          ctx.font = `${C * .45}px sans-serif`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillStyle = 'rgba(255,255,255,.15)'
          ctx.fillText('🧱', c * C + C / 2, r * C + C / 2)
        }
      }
    }

    const s = (emoji, x, y) => {
      ctx.font = `${C * .62}px sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(emoji, x * C + C / 2, y * C + C / 2)
    }

    // meta
    s('⭐', nivel.meta.x, nivel.meta.y)
    // gemas
    if (nivel.gema  && !gemasState?.g1) s('💎', nivel.gema.x,  nivel.gema.y)
    if (nivel.gema2 && !gemasState?.g2) s('💎', nivel.gema2.x, nivel.gema2.y)
    // robot
    const rPos = rp || { x: nivel.robot.x, y: nivel.robot.y }
    s('🤖', rPos.x, rPos.y)
  }, [nivel])

  // Redibujar cuando cambia nivel o robotPos
  useEffect(() => {
    dibujar(robotPos, gemas)
  }, [dibujar, robotPos, gemas, nivelIdx])

  // Al cambiar nivel, resetear todo
  useEffect(() => {
    setPrograma([])
    setPasoActivo(-1)
    setMsg(null)
    setGemas({ g1: false, g2: false })
    setRobotPos({ x: nivel.robot.x, y: nivel.robot.y })
  }, [nivelIdx])

  async function ejecutar() {
    if (animando || programa.length === 0) return
    setAnimando(true)
    setPasoActivo(-1)
    setMsg(null)
    const gemasLocal = { g1: false, g2: false }
    setGemas(gemasLocal)

    let pos = { x: nivel.robot.x, y: nivel.robot.y }
    dibujar(pos, gemasLocal)

    for (let i = 0; i < programa.length; i++) {
      setPasoActivo(i)
      const d = DIRS[programa[i]]
      pos = { x: pos.x + d.dx, y: pos.y + d.dy }

      const fueraRango = pos.x < 0 || pos.x >= nivel.cols || pos.y < 0 || pos.y >= nivel.rows
      const chocoPared = nivel.paredes?.some(p => p.x === pos.x && p.y === pos.y)

      if (fueraRango || chocoPared) {
        dibujar(pos, gemasLocal)
        setMsg({ tipo: 'err', texto: '💥 ¡Chocó! Revisa el camino e intenta de nuevo.' })
        setRobotPos({ x: nivel.robot.x, y: nivel.robot.y })
        setPasoActivo(-1)
        setAnimando(false)
        return
      }

      // recoger gemas
      const nuevoGemas = { ...gemasLocal }
      if (nivel.gema  && pos.x === nivel.gema.x  && pos.y === nivel.gema.y)  nuevoGemas.g1 = true
      if (nivel.gema2 && pos.x === nivel.gema2.x && pos.y === nivel.gema2.y) nuevoGemas.g2 = true
      gemasLocal.g1 = nuevoGemas.g1
      gemasLocal.g2 = nuevoGemas.g2
      setGemas({ ...nuevoGemas })

      dibujar(pos, nuevoGemas)
      await esperar(220)
    }

    setPasoActivo(-1)
    setAnimando(false)
    setRobotPos(pos)

    const llegó = pos.x === nivel.meta.x && pos.y === nivel.meta.y
    const necesitaG1 = !!nivel.gema
    const necesitaG2 = !!nivel.gema2
    const gemasOk = (!necesitaG1 || gemasLocal.g1) && (!necesitaG2 || gemasLocal.g2)

    if (llegó && gemasOk) {
      setMsg({ tipo: 'ok', texto: '🎉 ¡Perfecto! ¡El robot llegó a la estrella!' })
    } else if (llegó && !gemasOk) {
      setMsg({ tipo: 'err', texto: '⭐ Llegaste pero te falta recoger la(s) gema(s) 💎 primero.' })
      setRobotPos({ x: nivel.robot.x, y: nivel.robot.y })
    } else {
      setMsg({ tipo: 'err', texto: '🤔 El programa terminó pero el robot no llegó. Ajusta las instrucciones.' })
      setRobotPos({ x: nivel.robot.x, y: nivel.robot.y })
    }
  }

  function agregarBloque(nombre) {
    setPrograma(p => [...p, nombre])
    setMsg(null)
  }

  function borrarPaso(i) {
    setPrograma(p => p.filter((_, idx) => idx !== i))
    setMsg(null)
  }

  function resetear() {
    setPrograma([])
    setPasoActivo(-1)
    setMsg(null)
    setGemas({ g1: false, g2: false })
    setRobotPos({ x: nivel.robot.x, y: nivel.robot.y })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,5,32,.95)', zIndex: 200, overflow: 'auto', padding: '1rem' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>🔧 Código Roto</div>
          <div style={{ flex: 1 }} />
          <button className="btn-ghost" style={{ padding: '.4rem 1rem', fontSize: '.85rem' }} onClick={onCerrar}>✕ Cerrar</button>
        </div>

        {/* Selector de niveles */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {NIVELES.map((n, i) => {
            const bloq = i >= desbloqueados
            return (
              <button key={i} onClick={() => !bloq && setNivelIdx(i)}
                style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, cursor: bloq ? 'not-allowed' : 'pointer',
                  background: nivelIdx === i ? '#534AB7' : bloq ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.08)',
                  border: `1px solid ${nivelIdx === i ? '#7F77DD' : 'rgba(255,255,255,.12)'}`,
                  color: bloq ? 'rgba(255,255,255,.25)' : '#fff', opacity: bloq ? .6 : 1 }}>
                {bloq ? '🔒' : i + 1 <= misionesCompletadas ? '✅' : ''} {n.titulo}
              </button>
            )
          })}
        </div>

        {/* Descripción */}
        <div style={{ background: 'rgba(83,74,183,.2)', border: '1px solid rgba(127,119,221,.3)', borderRadius: 10, padding: '8px 14px', fontSize: '.85rem', color: 'rgba(255,255,255,.8)', marginBottom: '1rem' }}>
          🗺 <strong>{nivel.titulo}</strong> — {nivel.desc}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', alignItems: 'start' }}>

          {/* Canvas */}
          <div className="card" style={{ padding: '1rem' }}>
            <canvas ref={canvasRef} width={400} height={340}
              style={{ width: '100%', borderRadius: 8, background: '#0d0820', display: 'block' }} />
          </div>

          {/* Panel derecho */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Bloques disponibles */}
            <div className="card" style={{ padding: '.75rem' }}>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: '.5rem' }}>Instrucciones</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {nivel.bloques.map(b => (
                  <div key={b} onClick={() => !animando && agregarBloque(b)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
                      border: `1px solid rgba(255,255,255,.12)`, background: 'rgba(255,255,255,.06)',
                      cursor: animando ? 'not-allowed' : 'pointer', fontSize: 13, color: '#fff', userSelect: 'none',
                      transition: 'all .15s' }}
                    onMouseOver={e => !animando && (e.currentTarget.style.borderColor = COLORES[b])}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'}>
                    <span style={{ fontSize: 16, color: COLORES[b], fontWeight: 700 }}>{ICONOS[b]}</span>
                    <span style={{ textTransform: 'capitalize' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Programa */}
            <div className="card" style={{ padding: '.75rem' }}>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: '.5rem' }}>
                Tu programa ({programa.length} pasos)
              </div>
              <div style={{ minHeight: 80, border: '1.5px dashed rgba(255,255,255,.12)', borderRadius: 8,
                padding: 6, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
                {programa.length === 0
                  ? <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center', padding: '1rem' }}>Toca una instrucción para agregar</div>
                  : programa.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
                      borderRadius: 6, border: `1px solid ${pasoActivo === i ? COLORES[b] : 'rgba(255,255,255,.1)'}`,
                      background: pasoActivo === i ? `${COLORES[b]}22` : 'rgba(255,255,255,.04)', fontSize: 12, color: '#fff' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#534AB7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{i+1}</span>
                      <span style={{ color: COLORES[b], fontWeight: 700 }}>{ICONOS[b]}</span>
                      <span style={{ flex: 1, textTransform: 'capitalize' }}>{b}</span>
                      <span onClick={() => !animando && borrarPaso(i)}
                        style={{ cursor: 'pointer', color: 'rgba(255,80,80,.6)', fontSize: 13, padding: '0 2px' }}>✕</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn-primary" style={{ width: '100%', opacity: animando ? .6 : 1 }} onClick={ejecutar} disabled={animando}>
                {animando ? '⏳ Ejecutando...' : '▶ Ejecutar'}
              </button>
              <button className="btn-ghost" style={{ width: '100%', fontSize: '.85rem' }} onClick={resetear}>↺ Reiniciar</button>
            </div>

            {/* Mensaje resultado */}
            {msg && (
              <div style={{ borderRadius: 8, padding: '10px 12px', fontSize: '.82rem', fontWeight: 600, textAlign: 'center',
                background: msg.tipo === 'ok' ? 'rgba(29,158,117,.2)' : 'rgba(220,50,50,.15)',
                border: `1px solid ${msg.tipo === 'ok' ? 'rgba(29,158,117,.4)' : 'rgba(220,50,50,.3)'}`,
                color: msg.tipo === 'ok' ? '#5DCAA5' : '#f09595' }}>
                {msg.texto}
                {msg.tipo === 'ok' && nivelIdx < NIVELES.length - 1 && (
                  <button onClick={() => setNivelIdx(i => i + 1)}
                    style={{ display: 'block', width: '100%', marginTop: 8, background: '#534AB7',
                      border: 'none', color: '#fff', borderRadius: 6, padding: '6px', cursor: 'pointer', fontSize: 12 }}>
                    Siguiente reto →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
