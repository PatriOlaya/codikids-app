import { useEffect, useState } from 'react'
const SLIDES = [
 { id:'scratch', titulo:'De jugador a creador', categoria:'VIDEOJUEGOS CON SCRATCH', texto:'Personajes, aventuras y mundos que nacen de sus propias ideas.', ruta:'/curso-scratch-para-ninos', enlace:'Descubre Scratch', acento:'#9cf4d8', icono:'✦' },
 { id:'web', titulo:'Su primera página web', categoria:'PEQUEÑAS IDEAS, GRANDES WEBS', texto:'Diseña, experimenta y dale un lugar en internet a su imaginación.', ruta:'/curso-creacion-paginas-web-para-ninos', enlace:'Explora creación web', acento:'#c9b9ff', icono:'</>' },
 { id:'robot', titulo:'Ideas que se mueven', categoria:'PRINCIPIOS DE ROBÓTICA', texto:'Descubre cómo las instrucciones pueden poner una idea en movimiento.', ruta:'/principios-de-robotica-para-ninos', enlace:'Conoce robótica', acento:'#ffd690', icono:'⚡' },
]
function Scene({tipo}) {
 if(tipo==='scratch')return <div className="mh-game-art"><img src="/scratch/previews/portal.svg" alt="Un videojuego de plataformas creado con Scratch" width="480" height="300"/><span className="mh-pixel">✦</span><div className="mh-code-chip"><i/> al presionar <b>⚑</b><br/><span>mover 10 pasos ↗</span></div></div>
 if(tipo==='web')return <div className="mh-web-art"><div className="mh-mini-nav"><b>mi.universo</b><span>Inicio　Ideas　✦</span></div><div className="mh-web-content"><span>¡HOLA, MUNDO!</span><h3>Un sitio.<br/>Mil posibilidades.</h3><div className="mh-web-shapes"><i/><i/><i/></div><div className="mh-mini-button">Hecho por mí ↗</div></div><div className="mh-code-chip web-code">&lt;h1&gt; Mi gran idea &lt;/h1&gt;</div></div>
 return <div className="mh-robot-art"><svg viewBox="0 0 480 300" role="img" aria-label="Robot educativo rodeado de instrucciones"><defs><linearGradient id="mh-robot" x2="1" y2="1"><stop stopColor="#cfffee"/><stop offset="1" stopColor="#73d3bd"/></linearGradient></defs><ellipse cx="242" cy="266" rx="112" ry="16" fill="#17274a" opacity=".2"/><g className="mh-robot-float"><path d="M240 65V40" stroke="#5f5f91" strokeWidth="8"/><circle cx="240" cy="32" r="10" fill="#ffd790"/><rect x="153" y="67" width="177" height="128" rx="37" fill="url(#mh-robot)"/><rect x="174" y="90" width="136" height="71" rx="24" fill="#293854"/><path d="M197 118h17m52 0h17" stroke="#b4ffe9" strokeWidth="9" strokeLinecap="round"/><path d="M226 143q15 13 30 0" stroke="#b4ffe9" strokeWidth="4" fill="none"/><rect x="188" y="198" width="105" height="49" rx="16" fill="#a7e3cf"/><circle cx="214" cy="255" r="18" fill="#4c507a"/><circle cx="272" cy="255" r="18" fill="#4c507a"/><path d="M150 132l-32 28m216-28 30-27" stroke="#a7e3cf" strokeWidth="18" strokeLinecap="round"/><circle cx="112" cy="164" r="11" fill="#ffd790"/><circle cx="369" cy="100" r="11" fill="#ffd790"/></g><g fill="#8177b5" fontSize="26" fontFamily="sans-serif"><text x="62" y="82">✦</text><text x="390" y="218">✧</text><text x="358" y="58">+</text></g></svg><div className="mh-code-chip robot-code">si hay una idea…<br/><span>¡ponerla en marcha! ⚡</span></div></div>
}
export default function HeroCarousel() {
 const [actual,setActual]=useState(0),[automatico,setAutomatico]=useState(true),[dentro,setDentro]=useState(false),[visible,setVisible]=useState(true)
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)')
  const reducir=()=>{if(media.matches)setAutomatico(false)};reducir();media.addEventListener('change',reducir)
  const visibilidad=()=>setVisible(!document.hidden);document.addEventListener('visibilitychange',visibilidad)
  return()=>{media.removeEventListener('change',reducir);document.removeEventListener('visibilitychange',visibilidad)}
 },[])
 useEffect(()=>{
  if(!automatico||dentro||!visible)return
  const timer=setInterval(()=>setActual(i=>(i+1)%SLIDES.length),6500)
  return()=>clearInterval(timer)
 },[automatico,dentro,visible])
 function ir(i){setActual((i+SLIDES.length)%SLIDES.length);setAutomatico(false)}
 return <section className="mh-carousel" role="region" aria-roledescription="carrusel" aria-label="Lo que tu hijo puede crear" onMouseEnter={()=>setDentro(true)} onMouseLeave={()=>setDentro(false)} onFocusCapture={()=>setDentro(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDentro(false)}}>
  <div className="mh-orbit" aria-hidden="true"/><span className="mh-float-tag" aria-hidden="true">✦ imaginación en acción</span>
  <div className="mh-slides">{SLIDES.map((s,i)=><article key={s.id} className={`mh-slide ${actual===i?'is-active':''}`} inert={actual!==i} aria-hidden={actual!==i} role="group" aria-roledescription="diapositiva" aria-label={`${i+1} de 3: ${s.titulo}`} style={{'--slide-accent':s.acento}}>
   <div className="mh-browser-bar"><span><i/><i/><i/></span><b>CODIKIDS · LAB CREATIVO</b><span>↗</span></div>
   <Scene tipo={s.id}/><div className="mh-slide-copy"><span>{s.categoria}</span><h2>{s.titulo}</h2><p>{s.texto}</p><a href={s.ruta}>{s.enlace} <span aria-hidden="true">↗</span></a></div>
  </article>)}</div>
  <div className="mh-controls"><div className="mh-dots" role="group" aria-label="Elegir ruta destacada">{SLIDES.map((s,i)=><button key={s.id} type="button" aria-label={`Ver ${s.categoria.toLowerCase()}`} aria-pressed={actual===i} onClick={()=>ir(i)}><span/></button>)}</div><span className="mh-slide-number" aria-live={automatico?'off':'polite'}>0{actual+1} <i>/ 03</i></span><button type="button" aria-label={automatico?'Pausar carrusel de rutas':'Activar carrusel de rutas'} onClick={()=>setAutomatico(a=>!a)}>{automatico?'Ⅱ':'▶'}</button><button type="button" aria-label="Ruta anterior" onClick={()=>ir(actual-1)}>←</button><button type="button" aria-label="Ruta siguiente" onClick={()=>ir(actual+1)}>→</button></div>
 </section>
}
