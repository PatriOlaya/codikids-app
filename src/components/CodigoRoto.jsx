import { useEffect, useRef, useState } from 'react'
import { RETOS, DIRS, ICONOS, iniciar, mover, victoria } from '../games/robot'
const EMOJI={S:'🚀',G:'⭐',B:'🔋',K:'🔑',D:'🚪',X:'⚡',P:'🌀',Q:'🌀',I:'🧊','#':'▰'}
export default function CodigoRoto({ estudianteId='invitado', onCerrar }) {
 const storage=`codikids-robot-v2-${estudianteId}`
 const [ganados,setGanados]=useState(()=>{try{return JSON.parse(localStorage.getItem(storage))||[]}catch{return []}})
 const [idx,setIdx]=useState(0),[programa,setPrograma]=useState([]),[estado,setEstado]=useState(()=>iniciar(RETOS[0])),[mensaje,setMensaje]=useState(''),[ejecutando,setEjecutando]=useState(false),[paso,setPaso]=useState(-1)
 const cancel=useRef(0),reto=RETOS[idx]
 useEffect(()=>()=>{cancel.current++},[])
 function cambiar(i){cancel.current++;setEjecutando(false);setIdx(i);setPrograma([]);setEstado(iniciar(RETOS[i]));setMensaje('');setPaso(-1)}
 async function ejecutar(){
  if(ejecutando||!programa.length)return
  const token=++cancel.current;setEjecutando(true);setMensaje('');let s=iniciar(reto);setEstado(s)
  for(let i=0;i<programa.length;i++){
   if(token!==cancel.current)return
   setPaso(i);const r=mover(reto,s,programa[i]);if(r.error){setMensaje(`Paso ${i+1}: ${r.error}`);setEjecutando(false);return} s=r.estado;setEstado(s);await new Promise(resolve=>setTimeout(resolve,320))
  }
  if(token!==cancel.current)return
  setEjecutando(false);setPaso(-1)
  if(victoria(reto,s)){const next=[...new Set([...ganados,idx])];setGanados(next);try{localStorage.setItem(storage,JSON.stringify(next))}catch{}setMensaje('¡Reto superado! Has abierto la siguiente misión.')}else setMensaje('Aún no: termina en ⭐ y recoge todas las baterías. Modifica tu programa y prueba otra vez.')
 }
 return <div className="game-overlay"><div className="game-shell">
 <header className="game-header"><div><small>ACADEMIA DE LÓGICA</small><h2>🤖 Código Roto · Operaciones</h2></div><button className="btn-ghost" onClick={onCerrar}>Cerrar ✕</button></header>
 <nav className="game-tabs" aria-label="Retos de Código Roto">{RETOS.map((r,i)=><button key={r.nombre} disabled={ejecutando||(i>0&&!ganados.includes(i-1))} aria-current={idx===i?'step':undefined} onClick={()=>cambiar(i)}>{ganados.includes(i)?'✓':i>0&&!ganados.includes(i-1)?'🔒':i+1} {r.nombre}</button>)}</nav>
 <div className="game-brief" style={{borderColor:reto.color}}><h3>{idx+1}. {reto.nombre}</h3><p>{reto.regla}</p><span>Energía: {estado.paso}/{reto.limite} · Llave: {estado.llave?'sí':'no'} · Baterías: {estado.baterias.length}</span></div>
 <div className="game-workspace"><div><div className="robot-board" style={{gridTemplateColumns:`repeat(${reto.mapa[0].length},1fr)`}}>{reto.mapa.flatMap((row,y)=>[...row].map((c,x)=><div key={`${x}-${y}`} className={`robot-tile ${c==='#'?'wall':''}`} style={{background:c==='X'?(estado.paso%2?'#552b37':'#245c53'):undefined}} aria-label={`Fila ${y+1} columna ${x+1}: ${estado.x===x&&estado.y===y?'robot':c}`}>
 {estado.x===x&&estado.y===y?'🤖':c==='B'&&estado.baterias.includes(`${x},${y}`)?'':c==='K'&&estado.llave?'':EMOJI[c]||''}</div>))}</div><p className="game-muted">🔋 Batería · 🔑 Llave · 🚪 Puerta · ⚡ Láser · 🌀 Portal · 🧊 Hielo</p><p className="game-muted">El progreso de estos retos se conserva en este navegador para tu usuario. No cambia tus XP ni tus certificados.</p></div>
 <section className="game-program"><h3>Tu programa · {programa.length}/{reto.limite}</h3><div className="game-actions">{Object.keys(DIRS).filter(d=>d!=='esperar'||idx>=3).map(d=><button key={d} disabled={ejecutando||programa.length>=reto.limite} onClick={()=>setPrograma(p=>[...p,d])}>{ICONOS[d]} {d}</button>)}</div><ol className="program-list">{programa.map((d,i)=><li key={i} className={paso===i?'active':''}><span>{ICONOS[d]} {d}</span><button aria-label={`Eliminar paso ${i+1}`} disabled={ejecutando} onClick={()=>setPrograma(p=>p.filter((_,j)=>j!==i))}>×</button></li>)}</ol><button className="btn-primary" disabled={ejecutando||!programa.length} onClick={ejecutar}>{ejecutando?'Ejecutando…':'▶ Probar programa'}</button><button className="btn-ghost" onClick={()=>cambiar(idx)}>Reiniciar</button></section></div>
 <p role="status" className="game-feedback">{mensaje||'Planea antes de ejecutar. Cada movimiento consume energía.'}</p>{ganados.includes(idx)&&idx<7&&<button className="btn-primary" disabled={ejecutando} onClick={()=>cambiar(idx+1)}>Siguiente operación →</button>}
 </div></div>
}
