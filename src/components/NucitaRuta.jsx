import {useId,useState} from 'react'
import {Coneja} from './NucitaEscena'
import {RUTAS,ejecutarRuta} from '../games/nucitaRutas'

function Escenario({ruta,etapa,total,final}){
 const id=useId().replace(/:/g,''),fiesta=ruta==='fiesta'
 return <div className="nucita-escena">
 <svg viewBox="0 0 960 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
 <defs><linearGradient id={id+'-cielo'} x2="0" y2="1"><stop stopColor={fiesta?'#503f76':'#233956'}/><stop offset="1" stopColor={fiesta?'#e4a399':'#a9ced5'}/></linearGradient><radialGradient id={id+'-halo'}><stop stopColor="#fff2ad" stopOpacity=".9"/><stop offset="1" stopColor="#ffe4a2" stopOpacity="0"/></radialGradient></defs>
 <rect width="960" height="430" fill={`url(#${id}-cielo)`}/>
 <circle cx="748" cy="81" r="46" fill="#fff0be"/><circle cx="770" cy="64" r="37" fill={fiesta?'#796084':'#526b85'}/>
 {Array.from({length:26},(_,i)=><circle className="nucita-luciernaga" key={i} cx={25+(i*97)%915} cy={20+(i*47)%156} r={i%3+1} fill="#fff2bf"/>)}
 <path d="M0 243Q140 120 291 226T595 209T960 183V430H0Z" fill={fiesta?'#604e76':'#415e74'}/>
 {fiesta?<g>
  <path d="M0 303Q230 244 454 284T960 260V430H0Z" fill="#57415d"/>
  <path d="M461 327V186l130-47 152 47v141z" fill="#773d65"/><path d="M447 188l144-57 164 57" fill="none" stroke="#f4b5a4" strokeWidth="12" strokeLinejoin="round"/>
  <rect x="481" y="206" width="239" height="103" rx="8" fill={etapa>=2?'#ffdea7':'#432c50'}/>
  <path d="M350 150Q542 227 834 142" fill="none" stroke="#fff0c6" strokeWidth="3"/>
  {Array.from({length:Math.min(total,3)},(_,i)=><path key={i} d={`M${467+i*76} ${183+(i===1?7:0)}h33l-17 34z`} fill={['#f7a6b6','#ffe390','#9aebcb'][i]}/>)}
  {final==='teatro'&&<g fill="#4f3a67"><path d="M538 285q-22-15-10-38l-6-24q9-12 19 20l12-23q12 3 2 25 17 26-4 40z"/><path d="M614 286q-19-19-2-30-5-25 11-25 17 0 19 19l17 5-15 11q6 15-11 20z"/></g>}
  {final==='coro'&&<text x="598" y="275" textAnchor="middle" fontSize="64" fill="#71477b">♪ ♫</text>}
  <g transform="translate(793 279)"><path d="M22 34q70-27 27-68-40-8-26 23 20 22-8 22" fill="#c88361"/><ellipse cy="34" rx="24" ry="27" fill="#d79c74"/><circle cy="3" r="23" fill="#edbd8d"/><path d="M-18-11l-5-24 21 17m9 0 17-17-4 24" fill="#edbd8d"/><circle cx="-7" cy="1" r="3" fill="#3e304f"/><circle cx="8" cy="1" r="3" fill="#3e304f"/></g>
 </g>:<g>
  <path d="M0 300Q126 244 347 280T960 249V430H0Z" fill="#354d55"/>
  <path d="M362 256Q450 266 544 255L764 430H358Q507 344 362 256Z" fill="#789fad"/>
  <path d="M398 292q82 19 128 3m-99 34q113 22 150 0m-134 53q148 24 206-2" fill="none" stroke="#b5d8d5" strokeWidth="5" opacity=".7"/>
  <path d="M343 317Q482 264 665 309l29 24q-176-50-367 10z" fill="#bc9674"/><path d="M346 314Q500 265 672 314" fill="none" stroke="#e1c499" strokeWidth="7"/>
  {etapa<2&&<path d="M536 317v-55h85" stroke="#f1a595" fill="none" strokeWidth="10"/>}
  {Array.from({length:Math.min(total,4)},(_,i)=><g key={i}><path d={`M${388+i*76} ${314-(i===1||i===2?13:0)}v-27`} stroke="#eee6b9" strokeWidth="4"/><circle cx={388+i*76} cy={287-(i===1||i===2?13:0)} r="7" fill="#ffed9d"/></g>)}
  {final&&<g transform="translate(724 155)"><path d="M5 112V52l56-42 58 42v60" fill="#996d70"/><path d="M-4 55l65-48 67 48" fill="none" stroke="#dfb29d" strokeWidth="8"/><rect x="48" y="65" width="25" height="22" fill="#ffdf9b"/><text x="61" y="104" fontSize="12" textAnchor="middle" fill="white">{final==='refugio'?'REFUGIO':'CASA'}</text></g>}
  <g transform="translate(705 301)"><ellipse cx="28" cy="33" rx="32" ry="11" fill="#694a58" transform="rotate(-22 28 33)"/><ellipse cy="22" rx="26" ry="31" fill="#a77467"/><circle cy="-5" r="23" fill="#c58e77"/><circle cx="-17" cy="-22" r="7" fill="#c58e77"/><circle cx="17" cy="-22" r="7" fill="#c58e77"/><circle cx="-8" cy="-9" r="3" fill="#352a45"/><circle cx="8" cy="-9" r="3" fill="#352a45"/><rect x="-6" y="3" width="12" height="10" rx="2" fill="#fff0df"/></g>
 </g>}
 {etapa>=2&&<circle className="nucita-brillo" cx={fiesta?603:646} cy={fiesta?244:286} r="100" fill={`url(#${id}-halo)`} opacity=".68"/>}
 </svg><Coneja exploradora feliz={etapa>=2}/></div>
}

export default function NucitaRuta({ruta,avance,descubiertos,onGuardar,onMapa}){
 const info=RUTAS[ruta],etapa=avance.etapa||0
 const [bloques,setBloques]=useState({}),[feedback,setFeedback]=useState(''),[totalPrueba,setTotalPrueba]=useState(null),[ayuda,setAyuda]=useState(false)
 const reto=info.retos[etapa],final=info.finales.find(f=>f.id===avance.final)
 const total=totalPrueba??(etapa>0?(ruta==='fiesta'?3:4):0)
 function probar(){
  const r=ejecutarRuta(ruta,etapa,bloques);setFeedback(r.nota)
  if(r.total!==undefined)setTotalPrueba(r.total)
  if(r.ok){onGuardar({...avance,etapa:etapa+1});setBloques({});setAyuda(false);setTotalPrueba(null)}
 }
 return <>
 <div className="nucita-chapter"><span>03 · {info.nombre}</span><span>Finales descubiertos · {descubiertos}/4</span></div>
 <Escenario ruta={ruta} etapa={etapa} total={total} final={final?.id}/>
 <section className="nucita-editor">
  <div className="nucita-speaker">{final?'FIN DEL CUENTO':info.personaje}</div>
  <h3>{final?`${final.icono} ${final.nombre}`:info.nombre}</h3>
  <p>{final?final.texto:etapa===0?info.inicio:etapa===1?info.siguiente:info.decide}</p>
  {reto&&<>
   <h3>{reto.titulo}</h3><div className="nucita-ruta-bloques">{reto.campos.map(c=><label className="nucita-bloque" data-tipo={c.id==='mensaje'?'evento':'control'} key={c.id}>{c.texto} <select value={bloques[c.id]??''} onChange={e=>setBloques({...bloques,[c.id]:e.target.value})}><option value="" disabled>Elige</option>{c.opciones.map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
   {etapa===0&&<p aria-live="polite">{ruta==='fiesta'?'Banderines':'Reflectores'}: <strong>{total}</strong></p>}
   <div className="nucita-actions"><button className="nucita-primary" disabled={!reto.campos.every(c=>bloques[c.id])} onClick={probar}>▶ Ejecutar programa</button><button className="nucita-secondary" aria-expanded={ayuda} onClick={()=>setAyuda(!ayuda)}>💡 {ayuda?'Ocultar pista':'Ver pista'}</button></div>
   {ayuda&&<p>{reto.pista}</p>}
  </>}
  {etapa>=2&&!final&&<div className="nucita-actions">{info.finales.map(f=><button key={f.id} className="nucita-primary" onClick={()=>onGuardar({...avance,final:f.id},f.id)}>{f.icono} {f.nombre}</button>)}</div>}
  {feedback&&!final&&<p className="nucita-feedback" role="status">{feedback}</p>}
  <div className="nucita-actions"><button className="nucita-secondary" onClick={onMapa}>← Volver al mapa de rutas</button>{final&&<button className="nucita-secondary" onClick={()=>onGuardar({...avance,final:null})}>Elegir otro desenlace</button>}</div>
 </section></>
}
