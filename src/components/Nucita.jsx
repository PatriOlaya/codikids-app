import {useState} from 'react'
import NucitaEscena,{Coneja} from './NucitaEscena'
import {PISTAS,BLOQUES,RETOS,evaluarPrograma,nuevaAventura,desbloqueado} from '../games/nucita'
import './nucita.css'

export default function Nucita({estudianteId,onCerrar}){
 const key=`codikids-nucita-v1-${estudianteId}`
 const [s,setS]=useState(()=>{
  try{const data=JSON.parse(localStorage.getItem(key));if(data&&Array.isArray(data.pistas))return {...nuevaAventura(),...data}}catch{}
  return nuevaAventura()
 })
 const [reto,setReto]=useState(null),[programa,setPrograma]=useState([]),[pista,setPista]=useState(null),[feedback,setFeedback]=useState(''),[ayuda,setAyuda]=useState(false)
 const parque=s.camino
 const capitulo=s.final?'Desenlace':parque?'02 · El parque':'01 · El bosque'
 function guardar(estado){setS(estado);try{localStorage.setItem(key,JSON.stringify(estado))}catch{}}
 function recoger(id){
  if(!s.pistas.includes(id))guardar({...s,pistas:[...s.pistas,id]})
  setPista(id)
 }
 function abrir(r){setReto(r);setPrograma([]);setFeedback('');setAyuda(false)}
 function probar(){
  if(!evaluarPrograma(reto,programa)){setFeedback('El programa todavía no funciona. Revisa el mensaje o el orden de los bloques y vuelve a probar.');return}
  guardar({...s,[reto]:true});setReto(null);setPista(null)
  setFeedback({camino:'¡Funciona! Nucita cambió de disfraz y llegó al parque.',pio:'¡Pío recibió el mensaje! Habla con él para saber dónde está la cinta.',farol:'¡El farol se encendió! Decide qué hará Nucita con su luz.'}[reto])
 }
 function reiniciar(){guardar(nuevaAventura());setReto(null);setPista(null);setPrograma([]);setFeedback('');setAyuda(false)}
 const proximo=!parque?'camino':!s.pio?'pio':!s.farol?'farol':null
 const dialogo=s.final==='fiesta'?'El parque se llenó de luces y vecinos. Nucita y Pío celebraron juntos la fiesta del farol.':s.final==='sendero'?'Nucita colocó el farol en el sendero. Su luz ayudó a los vecinos a volver a casa por el bosque.':s.farol?'El farol está listo. ¿Usamos su luz para celebrar en el parque o para guiar a los vecinos por el sendero?':s.pio?'¡Nucita! Encontré el farol cerca de la fuente. Busca la cinta para completar tu pista.':parque?'Pío debe estar cerca. La nota del bosque dice qué mensaje debo enviarle.':'¡El farol de la fiesta no está! Busca dos pistas en el bosque para encontrar el camino.'
 return <div className="game-overlay nucita-overlay"><main className="nucita-shell">
 <header className="nucita-header"><div><small>CUENTO INTERACTIVO · AVENTURA 01</small><h2>Nucita: el misterio del parque</h2></div><button type="button" className="nucita-secondary" onClick={onCerrar}>Salir del cuento ×</button></header>
 <div className="nucita-chapter"><span>{capitulo}</span><span>Cuaderno · {s.pistas.length}/3 pistas</span></div>
 <NucitaEscena parque={parque} farol={s.farol} pio={s.pio} final={s.final}>
  <Coneja exploradora={parque} feliz={s.farol}/>
  {!parque&&<><button className="nucita-punto nucita-huellas" onClick={()=>recoger('huellas')}>🐾 Huellas {s.pistas.includes('huellas')&&'✓'}</button><button className="nucita-punto nucita-hoja" onClick={()=>recoger('hoja')}>🍃 Nota {s.pistas.includes('hoja')&&'✓'}</button></>}
  {s.pio&&!s.final&&<button className="nucita-punto nucita-cinta" onClick={()=>recoger('cinta')}>🎀 Cinta {s.pistas.includes('cinta')&&'✓'}</button>}
 </NucitaEscena>
 <div className="nucita-content">
  <section className="nucita-dialogo"><div className="nucita-speaker">{s.final?'FIN DEL CUENTO':s.pio&&!s.farol?'PÍO':'NUCITA'}</div><p>{dialogo}</p>
   {s.final?<button className="nucita-primary" onClick={reiniciar}>Volver al bosque y probar otro final</button>:s.farol?<div className="nucita-actions"><button className="nucita-primary" onClick={()=>guardar({...s,final:'fiesta'})}>✨ Celebrar en el parque</button><button className="nucita-secondary" onClick={()=>guardar({...s,final:'sendero'})}>🏮 Iluminar el sendero</button></div>:proximo&&desbloqueado(proximo,s)&&reto!==proximo?<button className="nucita-primary" onClick={()=>abrir(proximo)}>{RETOS[proximo].titulo} →</button>:null}
   {!reto&&feedback&&!s.final&&<p className="nucita-feedback" role="status">{feedback}</p>}
  </section>
  <aside className="nucita-cuaderno"><h3>Cuaderno de pistas</h3>{s.pistas.length===0?<p>Toca las huellas y la nota en la ilustración.</p>:<div className="nucita-actions">{s.pistas.map(id=><button key={id} className="nucita-secondary" aria-pressed={pista===id} onClick={()=>setPista(id)}>{PISTAS[id].icono} {PISTAS[id].nombre}</button>)}</div>}
   {pista&&<p role="status">{PISTAS[pista].texto}</p>}
  </aside>
 </div>
 {reto&&<section className="nucita-editor" aria-label="Mesa de programación">
  <div className="nucita-speaker">MESA DE PROGRAMACIÓN</div><h3>{RETOS[reto].titulo}</h3><p>{reto==='pio'?'Elige el mensaje para llamar a Pío.':'Toca los bloques para ponerlos en el orden en que deben ejecutarse.'}</p>
  <div className="nucita-actions">{RETOS[reto].disponibles.map(id=><button key={id} data-tipo={BLOQUES[id].tipo} className="nucita-bloque" disabled={programa.length>=RETOS[reto].solucion.length} onClick={()=>{setPrograma([...programa,id]);setFeedback('')}}>{BLOQUES[id].texto}</button>)}</div>
  <ol className="nucita-programa" aria-label="Tu programa">{programa.map((id,i)=><li key={i}><span data-tipo={BLOQUES[id].tipo} className="nucita-bloque">{BLOQUES[id].texto}</span><button className="nucita-secondary" onClick={()=>setPrograma(programa.filter((_,j)=>j!==i))} aria-label={`Quitar bloque ${i+1}`}>×</button></li>)}</ol>
  <div className="nucita-actions"><button className="nucita-primary" disabled={!programa.length} onClick={probar}>▶ Probar mi programa</button><button className="nucita-secondary" onClick={()=>setAyuda(!ayuda)} aria-expanded={ayuda}>💡 {ayuda?'Ocultar pista':'Necesito una pista'}</button></div>
  {ayuda&&<p>{RETOS[reto].pista}</p>}{feedback&&<p className="nucita-feedback" role="status">{feedback}</p>}
 </section>}
 <footer className="nucita-footer">Practica secuencias, disfraces, mensajes y condiciones. Tu historia se guarda en este navegador.</footer>
 </main></div>
}
