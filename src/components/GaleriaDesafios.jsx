import './galeria-desafios.css'

const JUEGOS=[
 {id:'nucita',titulo:'Nucita: el misterio del parque',tipo:'Cuento interactivo',detalle:'Resuelve el misterio del farol, explora dos rutas y descubre cuatro finales.',color:'#e4bbfa',fondo:'#43275d'},
 {id:'islas',titulo:'Islas del Código',tipo:'Aventura 3D',detalle:'Salta entre islas, esquiva pulsos y resuelve retos de Scratch.',color:'#91f4da',fondo:'#143f52'},
 {id:'robot',titulo:'Código Roto',tipo:'Lógica',detalle:'Ordena instrucciones para guiar al robot por ocho misiones.',color:'#b4cbff',fondo:'#243966'},
 {id:'circuito',titulo:'Guardianes del Circuito',tipo:'Rompecabezas',detalle:'Gira piezas y conecta ocho reactores.',color:'#fcd98c',fondo:'#4f315b'},
 {id:'espacio',titulo:'Expedición espacial',tipo:'Reflejos',detalle:'Pilota tu nave entre meteoritos y reúne estrellas.',color:'#ffaeba',fondo:'#42274d'},
]
function Portada({id}){
 return <svg viewBox="0 0 260 108" aria-hidden="true" className="galeria-portada">
 <g opacity=".35" fill="currentColor"><circle cx="213" cy="39" r="48"/><circle cx="24" cy="94" r="32"/><circle cx="34" cy="26" r="3"/><circle cx="192" cy="17" r="2"/><circle cx="228" cy="75" r="3"/><path d="M57 57l4-8 4 8-4 8zM190 76l4-8 4 8-4 8z"/></g>
 {id==='nucita'&&<g stroke="#654267" strokeWidth="3"><path d="M107 61Q80 8 98 7q11-3 25 38M135 44q6-39 20-39 15 4-4 54" fill="#fff1dc"/><ellipse cx="130" cy="69" rx="38" ry="31" fill="#fff1dc"/><path d="M112 64h1m32 0h1" stroke="#44304e" strokeWidth="7" strokeLinecap="round"/><path d="M125 76q5 7 10 0" fill="none"/><path d="M115 97l17-8 17 8-17 5z" fill="#ed92ae"/><circle cx="104" cy="76" r="5" fill="#f0a6b3" stroke="none"/><circle cx="154" cy="76" r="5" fill="#f0a6b3" stroke="none"/></g>}
 {id==='islas'&&<g stroke="#b2ffeb" strokeWidth="2"><path d="M80 52l52-19 53 17-54 21z" fill="#55bca5"/><path d="M80 52l51 19 54-21-15 35-39 14-32-15z" fill="#255c72"/><path d="M130 51V18m-10 7 10-10 10 10" fill="none"/><path d="M47 67l23-9 22 8-24 9zM171 81l25-9 25 8-25 10z" fill="#62caaf"/></g>}
 {id==='robot'&&<g stroke="#bdcbff" strokeWidth="3"><rect x="89" y="34" width="83" height="55" rx="18" fill="#626fc3"/><rect x="101" y="45" width="59" height="30" rx="9" fill="#1b244a"/><path d="M129 34V19" strokeLinecap="round"/><circle cx="129" cy="16" r="5" fill="#fff2b4"/><path d="M115 60h2m25 0h2" stroke="#a1ffdf" strokeWidth="7" strokeLinecap="round"/><path d="M80 56h9m83 0h9" strokeWidth="8" strokeLinecap="round"/></g>}
 {id==='circuito'&&<g stroke="#ffe6a8" strokeWidth="4" fill="none"><rect x="102" y="27" width="57" height="57" rx="11" fill="#704779"/><path d="M102 43H76V25M102 66H64v20m95-43h26V25m-26 41h35v20M123 27V13m15 71v13"/>{[[76,25],[64,86],[185,25],[194,86],[123,13],[138,97]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4" fill="#ffdf9b"/>)}<path d="M135 39l-15 19h11l-5 14 17-21h-11z" fill="#ffe6a8" stroke="none"/></g>}
 {id==='espacio'&&<g transform="translate(130 56) rotate(30)"><path d="M-14 19l-8 18 18-5m18-13 8 18-18-5" fill="#ec89aa"/><path d="M0-38q26 20 14 59h-28Q-26-18 0-38z" fill="#f5e3f3" stroke="#a884c4" strokeWidth="3"/><circle cy="-6" r="9" fill="#6959a0" stroke="#e0c4ff" strokeWidth="3"/><path d="M-7 26Q-10 38 0 48q10-10 7-22z" fill="#ffd490"/></g>}
 </svg>
}
export default function GaleriaDesafios({abrir}){
 return <section className="galeria-desafios" id="central-desafios" aria-labelledby="titulo-desafios">
  <div className="galeria-intro"><span className="galeria-eyebrow">🎮 ZONA DE JUEGOS</span><h2 id="titulo-desafios">Central de desafíos</h2><p>Elige tu próxima aventura. Hay cinco juegos para explorar.</p></div>
  <div className="galeria-grid">{JUEGOS.map(j=><article key={j.id} className="galeria-juego" style={{'--acento':j.color,'--portada':j.fondo}}>
   <Portada id={j.id}/><div className="galeria-detalle"><small>{j.tipo}</small><h3>{j.titulo}</h3><p>{j.detalle}</p><button type="button" aria-label={`Jugar a ${j.titulo}`} onClick={()=>abrir[j.id]()}>▶ Jugar</button></div>
  </article>)}</div>
 </section>
}
