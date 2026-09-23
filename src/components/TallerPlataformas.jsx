import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MUNDOS_NIVEL_TRES } from '../data/nivelTres'

const W = 960, H = 540, GROUND = 455
const LESSONS = [
  { title:'Salto vertical', prompt:'Al pulsar ↑, ¿qué debe cambiar para que el gato suba?', options:['velocidad vertical = − impulso','velocidad horizontal = impulso','gravedad = 0'], correct:0, detail:'El impulso negativo lo mueve hacia arriba; la gravedad lo vuelve a bajar.' },
  { title:'Movimiento horizontal', prompt:'Al pulsar →, ¿qué variable mueve al gato a la derecha?', options:['velocidad horizontal = rapidez','velocidad vertical = rapidez','vidas = rapidez'], correct:0, detail:'La velocidad horizontal cambia su posición de izquierda a derecha.' },
  { title:'Plataformas', prompt:'Al caer sobre una plataforma, ¿qué evita atravesarla?', options:['apoyar los pies arriba y detener la caída','sumar gravedad dos veces','ocultar el personaje'], correct:0, detail:'Comparamos los pies antes y después de caer y detenemos el descenso en la superficie.' },
  { title:'Fondo con scroll', prompt:'Cuando el gato avanza, ¿cómo damos sensación de profundidad?', options:['mover las capas lejanas más despacio','mover todo a la misma velocidad','borrar el fondo'], correct:0, detail:'El paralaje hace que las montañas se muevan más lentamente que el suelo.' },
  { title:'Peligros y vidas', prompt:'Al tocar un obstáculo, ¿qué debe pasar?', options:['restar una vida y dar protección breve','restar vidas en cada fotograma','sumar puntos'], correct:0, detail:'La protección temporal evita perder todas las vidas de un solo golpe.' },
  { title:'Poder de salto', prompt:'Al recoger una estrella, ¿cómo funciona el poder?', options:['aumentar el salto por unos segundos','dejarlo activado para siempre','detener el juego'], correct:0, detail:'Un temporizador devuelve el salto a su valor original.' },
  { title:'Guardián', prompt:'¿Cuándo cuenta un golpe sobre el guardián?', options:['al aterrizar sobre él mientras caes','al rozarlo por el lado','cada fotograma que lo toques'], correct:0, detail:'Solo un aterrizaje desde arriba cuenta como golpe.' },
  { title:'Estreno', prompt:'Antes de publicar, ¿qué compruebas?', options:['controles, pausa, meta y recorrido completo','solo el color del título','que el gato nunca se mueva'], correct:0, detail:'Una prueba completa permite corregir errores antes de compartir.' },
]
const keyFor = id => `codikids-n3-juego-${id}`
const clamp = (n, a, b) => Math.max(a, Math.min(b, n))

function drawCat(ctx, x, y, t, facing, invulnerable) {
  if (invulnerable && Math.floor(t * 12) % 2) return
  ctx.save(); ctx.translate(x + 22, y + 22); ctx.scale(facing, 1)
  ctx.shadowColor = '#ffb152'; ctx.shadowBlur = 17
  ctx.strokeStyle = '#a94420'; ctx.lineWidth = 8; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(-13, 14); ctx.bezierCurveTo(-37, 24, -31, -16, -42, -9); ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#f78b35'; ctx.strokeStyle = '#9e3c1d'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.ellipse(0, 14, 21, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * 10, -10); ctx.lineTo(side * 20, -39); ctx.lineTo(side * 2, -29); ctx.fill(); ctx.stroke() }
  ctx.beginPath(); ctx.ellipse(0, -11, 24, 23, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-9, -13, 7, 10, 0, 0, 7); ctx.ellipse(9, -13, 7, 10, 0, 0, 7); ctx.fill()
  ctx.fillStyle = '#17223f'; ctx.beginPath(); ctx.arc(-7, -12, 3, 0, 7); ctx.arc(11, -12, 3, 0, 7); ctx.fill()
  ctx.fillStyle = '#fce1bb'; ctx.beginPath(); ctx.ellipse(0, 0, 12, 9, 0, 0, 7); ctx.fill()
  ctx.fillStyle = '#a94420'; ctx.beginPath(); ctx.moveTo(-4, -3); ctx.lineTo(4, -3); ctx.lineTo(0, 2); ctx.fill()
  ctx.strokeStyle = '#4d3144'; ctx.lineWidth = 1.5
  for (const side of [-1, 1]) for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(side * 9, i * 4); ctx.lineTo(side * 27, i * 7 - 3); ctx.stroke() }
  ctx.restore()
}

export default function TallerPlataformas({ estudianteId, misiones, inventos, onVolver }) {
  const unlocked = Math.min(8, 1 + misiones.reduce((n, m) => n + Number(inventos.some(i => i.mision_id === m.id)), 0))
  const [lesson, setLesson] = useState(() => Math.min(unlocked, 8))
  const [built, setBuilt] = useState(() => { try { return JSON.parse(localStorage.getItem(keyFor(estudianteId))) || [] } catch { return [] } })
  const [choice, setChoice] = useState(null)
  const [message, setMessage] = useState('Elige el bloque correcto para programar esta parte de tu juego.')
  const [sync, setSync] = useState('Cargando progreso…')
  const [paused, setPaused] = useState(false)
  const [hud, setHud] = useState({ lives:3, won:false, power:false })
  const canvas = useRef(null), keys = useRef({}), game = useRef(null)
  const active = built.includes(lesson)
  const maxBuilt = Math.max(0, ...built)

  useEffect(() => {
    let mounted = true
    supabase.from('nivel3_juegos').select('clases_programadas').eq('estudiante_id', estudianteId).maybeSingle().then(({ data, error }) => {
      if (!mounted) return
      if (!error) { setBuilt(old => [...new Set([...old, ...(Array.isArray(data?.clases_programadas) ? data.clases_programadas : [])])].filter(n => Number.isInteger(n) && n >= 1 && n <= 8)); setSync('Progreso sincronizado') }
      else setSync('Guardado en este dispositivo · activa la tabla para sincronizar')
    })
    return () => { mounted = false }
  }, [estudianteId])
  useEffect(() => { localStorage.setItem(keyFor(estudianteId), JSON.stringify(built)) }, [built, estudianteId])
  useEffect(() => {
    const down = e => { if (['ArrowUp','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault(); keys.current[e.code] = true }
    const up = e => { keys.current[e.code] = false }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])
  useEffect(() => { game.current = { x:80, y:GROUND-52, vx:0, vy:0, ground:true, camera:0, lives:3, inv:0, power:0, boss:3, score:0, won:false, t:0, jumpHeld:false } ; setHud({ lives:3, won:false, power:false }) }, [lesson, built])
  useEffect(() => {
    const el = canvas.current; if (!el) return
    const ctx = el.getContext('2d'); let raf, last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    el.width = W * dpr; el.height = H * dpr; ctx.setTransform(dpr,0,0,dpr,0,0)
    const render = stamp => {
      const dt = Math.min((stamp - (last || stamp)) / 1000, .035); last = stamp
      const g = game.current; if (!g) return
      const stage = Math.min(lesson, maxBuilt), world = W * (stage >= 4 ? 3 : stage >= 2 ? 2 : 1)
      const platforms = stage >= 3 ? [{x:400,y:370,w:150},{x:680,y:300,w:160},{x:1020,y:350,w:170},{x:1340,y:285,w:150},{x:1660,y:355,w:170},{x:2050,y:320,w:170}] : []
      if (!paused && !g.won) {
        g.t += dt; g.inv = Math.max(0,g.inv-dt); g.power = Math.max(0,g.power-dt)
        if (stage >= 2) { const dir = Number(!!keys.current.ArrowRight || !!keys.current.right) - Number(!!keys.current.ArrowLeft || !!keys.current.left); g.vx = dir * (g.power ? 330 : 235); g.x = clamp(g.x + g.vx*dt, 8, world-52) }
        if (stage >= 1) {
          const jumping = keys.current.ArrowUp || keys.current.Space || keys.current.up
          if (jumping && !g.jumpHeld && g.ground) { g.vy = g.power ? -680 : -525; g.ground = false }
          g.jumpHeld = !!jumping
          const oldFoot = g.y+52; g.vy += 1280*dt; g.y += g.vy*dt; g.ground = false
          for (const p of platforms) if (g.vy >= 0 && oldFoot <= p.y+9 && g.y+52 >= p.y && g.x+37 > p.x && g.x+7 < p.x+p.w) { g.y=p.y-52; g.vy=0; g.ground=true }
          if (g.y+52 >= GROUND) { g.y=GROUND-52; g.vy=0; g.ground=true }
        }
        if (stage >= 5 && g.x > 505 && g.x < 565 && g.y+52 > GROUND-26 && g.inv <= 0) { g.lives--; g.inv=1.5; g.vy=-260; if (g.lives<=0) { g.lives=3; g.x=80; g.y=GROUND-52 } setHud(h => ({...h,lives:g.lives})) }
        if (stage >= 6 && g.x > 760 && g.x < 810 && !g.score) { g.power=8; g.score=1; setHud(h => ({...h,power:true})) }
        if (stage >= 7 && g.x > world-255 && g.x < world-175 && g.y+52 > GROUND-95 && g.inv<=0) { if (g.vy>0 && g.y+52 < GROUND-55) { g.boss--; g.vy=-420; g.inv=.5 } else { g.lives--; g.inv=1.5; setHud(h => ({...h,lives:g.lives})) } }
        if (stage >= 8 && g.x > world-90 && g.boss <= 0) { g.won=true; setHud(h => ({...h,won:true})) }
        g.camera += ((stage >= 4 ? clamp(g.x - W*.36,0,world-W) : 0)-g.camera)*Math.min(1,dt*5)
      }
      const theme = MUNDOS_NIVEL_TRES[lesson-1]; const sky = ctx.createLinearGradient(0,0,0,H); sky.addColorStop(0,theme.cielo); sky.addColorStop(1,'#5384a2'); ctx.fillStyle=sky;ctx.fillRect(0,0,W,H)
      const cam=g.camera
      // Three vector layers are drawn at full device resolution; each scrolls at a different speed.
      for (let layer=0;layer<3;layer++) { const factor=[.15,.38,.65][layer];ctx.fillStyle=['#ffffff20','#183b6388','#143f4da8'][layer];for(let i=-2;i<14;i++){ const x=i*220-(cam*factor%220);ctx.beginPath();ctx.moveTo(x-130,H);ctx.lineTo(x+95,220+layer*68+(i%3)*24);ctx.lineTo(x+320,H);ctx.fill() } }
      ctx.fillStyle='#fff7cd';ctx.shadowColor='#fff4b8';ctx.shadowBlur=38;ctx.beginPath();ctx.arc(760-cam*.12,90,39,0,7);ctx.fill();ctx.shadowBlur=0
      ctx.fillStyle='#213c42';ctx.fillRect(-cam,GROUND,world,85)
      ctx.fillStyle='#58b985';ctx.fillRect(-cam,GROUND,world,15)
      ctx.fillStyle='#74d9b1';for(let i=0;i<world/40;i++){let x=i*40-cam;ctx.fillRect(x,GROUND+17,16,3)}
      for(const p of platforms){ctx.fillStyle='#69457d';ctx.fillRect(p.x-cam,p.y,p.w,23);ctx.fillStyle='#9ae4a8';ctx.fillRect(p.x-cam,p.y,p.w,9)}
      if(stage>=5){ctx.fillStyle='#ff7180';ctx.beginPath();ctx.moveTo(510-cam,GROUND);ctx.lineTo(535-cam,GROUND-36);ctx.lineTo(560-cam,GROUND);ctx.fill()}
      if(stage>=6&&!g.score){ctx.fillStyle='#ffe086';ctx.font='48px system-ui';ctx.fillText('✦',765-cam,GROUND-45)}
      if(stage>=7&&g.boss>0){ctx.fillStyle='#963985';ctx.fillRect(world-245-cam,GROUND-83,75,83);ctx.fillStyle='#fff';ctx.font='25px system-ui';ctx.fillText('★',world-220-cam,GROUND-40);ctx.fillStyle='#ff9fa4';ctx.fillRect(world-245-cam,GROUND-105,75*g.boss/3,9)}
      if(stage>=8){ctx.fillStyle='#73ffe1';ctx.fillRect(world-75-cam,GROUND-115,15,115);ctx.font='44px system-ui';ctx.fillText('🏁',world-100-cam,GROUND-115)}
      drawCat(ctx,g.x-cam,g.y,g.t,g.vx<0?-1:1,g.inv>0)
      ctx.fillStyle='#ffffffed';ctx.font='bold 22px system-ui';ctx.fillText(`CLASE ${lesson} · ${LESSONS[lesson-1].title}`,25,38)
      if(stage>=5)ctx.fillText(`❤️ ${g.lives}`,25,72)
      if(g.power>0){ctx.fillStyle='#ffe086';ctx.fillText(`✦ Poder ${Math.ceil(g.power)}s`,200,72)}
      if(stage===0){ctx.fillStyle='#1b2145c9';ctx.fillRect(220,180,530,135);ctx.fillStyle='white';ctx.font='bold 27px system-ui';ctx.fillText('Programa un bloque para empezar',257,240);ctx.font='18px system-ui';ctx.fillText('Tu juego crecerá con cada clase.',305,278)}
      if(paused||g.won){ctx.fillStyle='#11182acc';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='white';ctx.font='bold 42px system-ui';ctx.fillText(g.won?'¡Juego terminado! 🎉':'Juego en pausa',W/2,H/2);ctx.textAlign='left'}
      raf=requestAnimationFrame(render)
    }
    raf=requestAnimationFrame(render);return()=>cancelAnimationFrame(raf)
  },[lesson,built,paused,maxBuilt])
  const programar = async () => {
    if (choice !== LESSONS[lesson-1].correct) { setMessage('Prueba otro bloque: piensa qué cambia en el personaje.'); return }
    const next = [...new Set([...built,lesson])].sort((a,b)=>a-b);setBuilt(next);setMessage(`¡Programaste ${LESSONS[lesson-1].title.toLowerCase()}! ${LESSONS[lesson-1].detail} Prueba tu juego y sube tu invento de esta clase en el laboratorio.`)
    const { error } = await supabase.from('nivel3_juegos').upsert({ estudiante_id:estudianteId, clases_programadas:next, updated_at:new Date().toISOString() },{ onConflict:'estudiante_id' })
    setSync(error ? 'Guardado en este dispositivo · activa la tabla para sincronizar' : 'Progreso sincronizado')
  }
  const control = (code,label) => <button type="button" aria-label={label} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current[code]=true}} onPointerUp={()=>{keys.current[code]=false}} onPointerCancel={()=>{keys.current[code]=false}} style={{minWidth:62,minHeight:54,borderRadius:14,background:'#313768',border:'2px solid #8de3d6',color:'white',fontSize:25,touchAction:'none'}}>{label}</button>
  return <div style={{minHeight:'100vh',background:'#10162d',color:'white',padding:'1rem'}}><div style={{maxWidth:1080,margin:'auto'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><button className="btn-ghost" onClick={onVolver}>← Volver al laboratorio</button><h1 style={{fontSize:'clamp(1.2rem,3vw,2rem)',margin:8}}>🎮 Mi juego de plataformas</h1><span style={{fontSize:'.78rem',color:'#9ae4d6'}}>{sync}</span></div>
    <p style={{color:'#d1dcf5'}}>Cada invento abre la siguiente clase. Programa un bloque, juega y continúa construyendo el mismo juego.</p>
    <div style={{display:'flex',gap:6,overflowX:'auto',padding:'8px 0 16px'}}>{LESSONS.map((c,i)=><button key={i} type="button" disabled={i>=unlocked} onClick={()=>{setLesson(i+1);setChoice(null);setMessage('Elige el bloque correcto para programar esta parte de tu juego.');setPaused(false)}} style={{whiteSpace:'nowrap',padding:'9px 12px',borderRadius:12,border:lesson===i+1?'2px solid #82f4d5':'1px solid #637197',background:lesson===i+1?'#226d69':'#222b4c',color:'white',opacity:i>=unlocked?.45:1}}>{i>=unlocked?'🔒':built.includes(i+1)?'✓':'🎯'} {i+1}. {c.title}</button>)}</div>
    <canvas ref={canvas} role="img" aria-label="Juego de plataformas con un gato, montañas con desplazamiento y las mecánicas programadas" style={{display:'block',width:'100%',aspectRatio:'16 / 9',borderRadius:18,border:'2px solid #69d9bf',boxShadow:'0 12px 55px #00b79a33'}} />
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,margin:'12px 0',flexWrap:'wrap'}}><div style={{display:'flex',gap:8}}>{control('left','←')}{control('up','↑')}{control('right','→')}</div><span style={{color:'#cfdbf4',fontSize:'.85rem'}}>Teclado: ← → para caminar, ↑ o espacio para saltar</span><button className="btn-ghost" onClick={()=>setPaused(v=>!v)}>{paused?'▶ Continuar':'⏸ Pausa'}</button></div>
    <section className="card" style={{marginTop:16}}><div style={{color:'#74ead8',fontWeight:800}}>CLASE {lesson} · CONSTRUYE TU MECÁNICA</div><h2 style={{fontSize:'1.25rem'}}>{LESSONS[lesson-1].prompt}</h2><div style={{display:'grid',gap:9}}>{LESSONS[lesson-1].options.map((o,i)=><button key={i} type="button" onClick={()=>setChoice(i)} style={{textAlign:'left',padding:12,borderRadius:12,border:choice===i?'2px solid #80f2d7':'1px solid #5a6882',background:choice===i?'#285d68':'#202a47',color:'white',fontFamily:'monospace',cursor:'pointer'}}>🧩 {o}</button>)}</div><div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',marginTop:16}}><button className="btn-primary" disabled={choice===null} onClick={programar}>{active?'Volver a probar el bloque':'Programar y probar'}</button><span role="status" style={{color:'#e4effe',fontSize:'.9rem'}}>{message}</span></div><p style={{color:'#b9c8dd',fontSize:'.84rem',marginBottom:0}}>La entrega de Scratch abre la siguiente clase; tu profesor revisa cada invento para otorgar XP y el certificado.</p></section>
  </div></div>
}
