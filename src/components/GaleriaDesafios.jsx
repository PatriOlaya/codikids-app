import { useMemo, useState } from 'react'
import './galeria-desafios.css'

const JUEGOS=[
 {id:'turbo',titulo:'Circuito Turbo',tipo:'Carreras 3D · Nuevo',detalle:'Corre en cuatro pistas y cambia de cámara o programa tu estrategia.',color:'#a4f9dc',fondo:'#225359'},
 {id:'nucita',titulo:'Nucita: el misterio del parque',tipo:'Cuento interactivo',detalle:'Resuelve el misterio del farol, explora dos rutas y descubre cuatro finales.',color:'#e4bbfa',fondo:'#43275d'},
 {id:'islas',titulo:'Islas del Código',tipo:'Aventura 3D',detalle:'Salta entre islas, esquiva pulsos y resuelve retos de Scratch.',color:'#91f4da',fondo:'#143f52'},
 {id:'robot',titulo:'Código Roto',tipo:'Lógica',detalle:'Ordena instrucciones para guiar al robot por ocho misiones.',color:'#b4cbff',fondo:'#243966'},
 {id:'circuito',titulo:'Guardianes del Circuito',tipo:'Rompecabezas',detalle:'Gira piezas y conecta ocho reactores.',color:'#fcd98c',fondo:'#4f315b'},
 {id:'tresraya',titulo:'Tres en raya IA',tipo:'Duelo estratégico · Contra la máquina',detalle:'Desafía a una IA en tres dificultades, incluida una imbatible.',color:'#9debd9',fondo:'#253e6b'},
 {id:'matematicas',titulo:'Duelo Matemático',tipo:'Cálculo rápido · Contra la máquina',detalle:'Compite en 10 rondas y supera al robot con sumas, restas y multiplicaciones.',color:'#ffe49d',fondo:'#5d345a'},
 {id:'espacio',titulo:'Expedición espacial',tipo:'Reflejos',detalle:'Pilota tu nave entre meteoritos y reúne estrellas.',color:'#ffaeba',fondo:'#42274d'},
]
function Portada({id}){
 return <svg viewBox="0 0 260 108" aria-hidden="true" className="galeria-portada">
 <g opacity=".35" fill="currentColor"><circle cx="213" cy="39" r="48"/><circle cx="24" cy="94" r="32"/><circle cx="34" cy="26" r="3"/><circle cx="192" cy="17" r="2"/><circle cx="228" cy="75" r="3"/><path d="M57 57l4-8 4 8-4 8zM190 76l4-8 4 8-4 8z"/></g>
 {id==='turbo'&&<g stroke="#bcffef" strokeWidth="3"><path d="M49 89l26-26h109l28 26z" fill="#314b66"/><path d="M92 66l18-23h46l18 23 14 9v15H77V75z" fill="#55bda9"/><path d="M110 47h46l13 18h-73z" fill="#203352"/><circle cx="104" cy="88" r="10" fill="#242842"/><circle cx="165" cy="88" r="10" fill="#242842"/><path d="M53 45h32m92-17h35m-30 24h45" strokeLinecap="round"/></g>}
 {id==='nucita'&&<g stroke="#654267" strokeWidth="3"><path d="M107 61Q80 8 98 7q11-3 25 38M135 44q6-39 20-39 15 4-4 54" fill="#fff1dc"/><ellipse cx="130" cy="69" rx="38" ry="31" fill="#fff1dc"/><path d="M112 64h1m32 0h1" stroke="#44304e" strokeWidth="7" strokeLinecap="round"/><path d="M125 76q5 7 10 0" fill="none"/><path d="M115 97l17-8 17 8-17 5z" fill="#ed92ae"/><circle cx="104" cy="76" r="5" fill="#f0a6b3" stroke="none"/><circle cx="154" cy="76" r="5" fill="#f0a6b3" stroke="none"/></g>}
 {id==='islas'&&<g stroke="#b2ffeb" strokeWidth="2"><path d="M80 52l52-19 53 17-54 21z" fill="#55bca5"/><path d="M80 52l51 19 54-21-15 35-39 14-32-15z" fill="#255c72"/><path d="M130 51V18m-10 7 10-10 10 10" fill="none"/><path d="M47 67l23-9 22 8-24 9zM171 81l25-9 25 8-25 10z" fill="#62caaf"/></g>}
 {id==='robot'&&<g stroke="#bdcbff" strokeWidth="3"><rect x="89" y="34" width="83" height="55" rx="18" fill="#626fc3"/><rect x="101" y="45" width="59" height="30" rx="9" fill="#1b244a"/><path d="M129 34V19" strokeLinecap="round"/><circle cx="129" cy="16" r="5" fill="#fff2b4"/><path d="M115 60h2m25 0h2" stroke="#a1ffdf" strokeWidth="7" strokeLinecap="round"/><path d="M80 56h9m83 0h9" strokeWidth="8" strokeLinecap="round"/></g>}
 {id==='circuito'&&<g stroke="#ffe6a8" strokeWidth="4" fill="none"><rect x="102" y="27" width="57" height="57" rx="11" fill="#704779"/><path d="M102 43H76V25M102 66H64v20m95-43h26V25m-26 41h35v20M123 27V13m15 71v13"/>{[[76,25],[64,86],[185,25],[194,86],[123,13],[138,97]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4" fill="#ffdf9b"/>)}<path d="M135 39l-15 19h11l-5 14 17-21h-11z" fill="#ffe6a8" stroke="none"/></g>}
 {id==='tresraya'&&<g fontSize="47" fontWeight="bold" textAnchor="middle"><text x="105" y="70" fill="#a7f4e2">✕</text><text x="160" y="70" fill="#ffe1a3">○</text></g>}
 {id==='matematicas'&&<g fontSize="36" fontWeight="bold" textAnchor="middle"><text x="105" y="70" fill="#fff2a8">7</text><text x="160" y="70" fill="#c1e7ff">×</text></g>}
 {id==='espacio'&&<g transform="translate(130 56) rotate(30)"><path d="M-14 19l-8 18 18-5m18-13 8 18-18-5" fill="#ec89aa"/><path d="M0-38q26 20 14 59h-28Q-26-18 0-38z" fill="#f5e3f3" stroke="#a884c4" strokeWidth="3"/><circle cy="-6" r="9" fill="#6959a0" stroke="#e0c4ff" strokeWidth="3"/><path d="M-7 26Q-10 38 0 48q10-10 7-22z" fill="#ffd490"/></g>}
 </svg>
}
const CATEGORIAS = [
 {id:'todos',nombre:'Todos',icono:'✨'},
 {id:'aventura',nombre:'Aventura',icono:'🚀'},
 {id:'ingenio',nombre:'Ingenio',icono:'🧩'},
 {id:'duelos',nombre:'Contra la máquina',icono:'🤖'},
]
const GRUPOS={turbo:'aventura',nucita:'aventura',islas:'aventura',robot:'ingenio',circuito:'ingenio',tresraya:'duelos',matematicas:'duelos',espacio:'aventura'}
const ICONOS={turbo:'🏎️',nucita:'🐰',islas:'🏝️',robot:'🤖',circuito:'⚡',tresraya:'⭕',matematicas:'🧠',espacio:'🚀'}
const DIFICULTADES={turbo:'Velocidad',nucita:'Exploración',islas:'Aventura',robot:'Lógica',circuito:'Ingenio',tresraya:'Estrategia',matematicas:'Cálculo',espacio:'Reflejos'}
export default function GaleriaDesafios({abrir}){
 const [categoria,setCategoria]=useState('todos')
 const [busqueda,setBusqueda]=useState('')
 const [destacado,setDestacado]=useState('islas')
 const visibles=useMemo(()=>JUEGOS.filter(j=>(categoria==='todos'||GRUPOS[j.id]===categoria)&&(`${j.titulo} ${j.tipo} ${j.detalle}`.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es')))),[categoria,busqueda])
 const elegido=JUEGOS.find(j=>j.id===destacado)||JUEGOS[0]
 function jugar(id){if(typeof abrir?.[id]==='function')abrir[id]()}
 return <section className="galeria-desafios" id="central-desafios" aria-labelledby="titulo-desafios">
  <div className="arcade-stars" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>
  <header className="arcade-hero">
   <div className="arcade-hero-copy"><span className="arcade-eyebrow"><span className="arcade-live-dot"/> C O D I K I D S · A R C A D E</span><h2 id="titulo-desafios">¡Tu próxima <em>aventura</em> comienza aquí!</h2><p>Ocho mundos para explorar, resolver acertijos y desafiar a la máquina. ¿Cuál eliges hoy?</p><div className="arcade-hero-stats"><span>🎮 <strong>8</strong> juegos</span><span>🤖 <strong>2</strong> duelos IA</span><span>✨ <strong>3</strong> estilos de desafío</span></div></div>
   <div className="arcade-hero-mascot" aria-hidden="true"><div className="arcade-orbit orbit-one"/><div className="arcade-orbit orbit-two"/><div className="arcade-mascot">👾</div><span className="arcade-spark spark-one">✦</span><span className="arcade-spark spark-two">✧</span><span className="arcade-spark spark-three">★</span></div>
  </header>
  <div className="arcade-featured" style={{'--acento':elegido.color,'--portada':elegido.fondo}}>
   <div className="arcade-featured-art"><Portada id={elegido.id}/><span className="arcade-featured-emblem">{ICONOS[elegido.id]}</span></div>
   <div className="arcade-featured-copy"><span className="arcade-featured-label">⭐ MISIÓN DESTACADA</span><h3>{elegido.titulo}</h3><p>{elegido.detalle}</p><div className="arcade-featured-actions"><button type="button" className="arcade-primary" onClick={()=>jugar(elegido.id)}>▶ ¡Jugar ahora!</button><span>🎯 {DIFICULTADES[elegido.id]}</span></div></div>
  </div>
  <div className="arcade-toolbar"><div className="arcade-tabs" role="group" aria-label="Filtrar desafíos">{CATEGORIAS.map(c=><button key={c.id} type="button" className={categoria===c.id?'active':''} aria-pressed={categoria===c.id} onClick={()=>setCategoria(c.id)}>{c.icono} {c.nombre}</button>)}</div><label className="arcade-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar juego" placeholder="Buscar un juego..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}/></label></div>
  <div className="arcade-section-heading"><div><span className="arcade-section-kicker">ELIGE TU DESAFÍO</span><h3>Explora los mundos <span>✦</span></h3></div><span className="arcade-counter">{visibles.length} {visibles.length===1?'juego':'juegos'}</span></div>
  {visibles.length?<div className="galeria-grid">{visibles.map((j,i)=><article key={j.id} className="galeria-juego" style={{'--acento':j.color,'--portada':j.fondo,'--orden':i}}>
   <div className="arcade-card-art"><Portada id={j.id}/><span className="arcade-card-icon">{ICONOS[j.id]}</span><span className="arcade-card-category">{GRUPOS[j.id]==='duelos'?'VS MÁQUINA':GRUPOS[j.id]==='ingenio'?'MENTE ACTIVA':'AVENTURA'}</span></div>
   <div className="galeria-detalle"><span className="arcade-card-type">✦ {j.tipo}</span><h4>{j.titulo}</h4><p>{j.detalle}</p><div className="arcade-card-bottom"><span>🎯 {DIFICULTADES[j.id]}</span><button type="button" aria-label={`Jugar a ${j.titulo}`} onClick={()=>{setDestacado(j.id);jugar(j.id)}}>JUGAR <span aria-hidden="true">↗</span></button></div></div>
  </article>)}</div>:<div className="arcade-empty"><span>🛸</span><p>No encontramos ese juego. Prueba otra búsqueda.</p><button type="button" onClick={()=>{setCategoria('todos');setBusqueda('')}}>Ver todos los juegos</button></div>}
  <footer className="arcade-footer">🏆 Cada desafío es una nueva oportunidad para aprender jugando. <span>¡A por la próxima misión!</span></footer>
 </section>
}
