import {useEffect,useRef,useState} from 'react'
import {PISTAS_TURBO,VUELTAS_TURBO,ORDENES_TURBO,iniciarCarrera,avanzarTurbo,sectorTurbo} from '../games/turbo'
import {montarCircuito} from '../games/turboEscena'
import './circuito-turbo.css'

const VISTAS={persecucion:'Detrás del carro',cabina:'Desde la cabina',mapa:'Vista aérea'}
const COLORES=[['Mandarina',0xf78259],['Menta',0x4ddac1],['Violeta',0xa395ef]]
const TECLAS={ArrowUp:'acel',KeyW:'acel',ArrowDown:'freno',KeyS:'freno',ArrowLeft:'izq',KeyA:'izq',ArrowRight:'der',KeyD:'der',Space:'turbo'}
const formato=n=>n.toFixed(2)+' s'

export default function CircuitoTurbo({estudianteId,onCerrar}){
 const key=`codikids-turbo-v1-${estudianteId}`
 const [registros,setRegistros]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))||{}}catch{return {}}})
 const [idx,setIdx]=useState(0),[color,setColor]=useState(0),[vista,setVista]=useState('persecucion'),[modo,setModo]=useState('manual'),[ordenes,setOrdenes]=useState(['ritmo','curva','turbo','curva'])
 const [fase,setFase]=useState('lista'),[hud,setHud]=useState(iniciarCarrera),[largo,setLargo]=useState(1),[error,setError]=useState('')
 const host=useRef(null),engine=useRef(null),estado=useRef(iniciarCarrera()),keys=useRef({}),config=useRef({}),records=useRef(registros)
 const pista=PISTAS_TURBO[idx]
 config.current={vista,modo,ordenes,fase}
 useEffect(()=>{
  let juego
  try{juego=montarCircuito(host.current,pista,COLORES[color][1]);engine.current=juego;setLargo(juego.largo);setError('')}catch{setError('No se pudieron abrir los gráficos 3D en este navegador.');return}
  let anterior=0,ultimoHud=0,frame
  const down=e=>{
   if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return
   if(e.code==='KeyC'&&!e.repeat){setVista(v=>{const a=Object.keys(VISTAS);return a[(a.indexOf(v)+1)%a.length]});return}
   if(TECLAS[e.code]&&config.current.fase==='corriendo'){e.preventDefault();keys.current[e.code]=true}
  }
  const up=e=>{delete keys.current[e.code]}
  const blur=()=>{keys.current={};if(config.current.fase==='corriendo')setFase('pausa')}
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur)
  function loop(t){
   const dt=Math.min(.05,(t-(anterior||t))/1000);anterior=t
   const cfg=config.current
   if(cfg.fase==='corriendo'&&!estado.current.fin){
    const controles={}
    for(const [k,val] of Object.entries(keys.current))if(val)controles[TECLAS[k]||k]=true
    estado.current=avanzarTurbo(estado.current,{dt,largo:juego.largo,pista,modo:cfg.modo,ordenes:cfg.ordenes,controles})
    const s=estado.current
    if(t-ultimoHud>75||s.fin){ultimoHud=t;setHud(s)}
    if(s.fin){
     keys.current={};setFase('fin')
     const id=pista.id+'-'+cfg.modo,prev=records.current[id]
     if(!prev||s.tiempo<prev){const next={...records.current,[id]:s.tiempo};records.current=next;setRegistros(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}}
    }
   }
   juego.pintar(estado.current,cfg.vista);frame=requestAnimationFrame(loop)
  }
  frame=requestAnimationFrame(loop)
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);keys.current={};engine.current=null;juego.cerrar()}
 },[pista,color,key])
 function reset(){keys.current={};estado.current=iniciarCarrera();setHud(estado.current);setFase('lista')}
 function iniciar(){if(!engine.current)return;estado.current=iniciarCarrera();setHud(estado.current);keys.current={};setFase('corriendo')}
 const activo=fase==='corriendo'||fase==='pausa'
 const control=(nombre,etiqueta)=><button type="button" disabled={fase!=='corriendo'} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current[nombre]=true}} onLostPointerCapture={()=>{delete keys.current[nombre]}} onPointerUp={()=>{delete keys.current[nombre]}} onPointerCancel={()=>{delete keys.current[nombre]}}>{etiqueta}</button>
 const vuelta=Math.min(VUELTAS_TURBO,Math.floor(hud.distancia/largo)+1),sector=sectorTurbo(hud.distancia,largo)
 const record=registros[pista.id+'-'+modo]
 return <div className="game-overlay turbo-overlay"><main className="game-shell">
 <header className="game-header"><div><small>COLECCIÓN CODIKIDS · CARRERAS 3D</small><h2>🏁 Circuito Turbo</h2></div><button className="btn-ghost" onClick={onCerrar}>Cerrar ×</button></header>
 <nav className="turbo-pistas" aria-label="Pistas">{PISTAS_TURBO.map((p,i)=><button key={p.id} type="button" disabled={activo} aria-pressed={idx===i} onClick={()=>{reset();setIdx(i)}}><strong>{p.nombre}</strong><small>{p.tema}</small></button>)}</nav>
 <div className="turbo-vistas" aria-label="Cámaras">{Object.entries(VISTAS).map(([id,nombre])=><button type="button" key={id} aria-pressed={vista===id} onClick={()=>setVista(id)}>{nombre}</button>)}</div>
 <div className="turbo-hud"><strong>Vuelta {vuelta}/{VUELTAS_TURBO}</strong><span>Sector {sector+1}/4</span><span>{formato(hud.tiempo)}</span><span>{Math.round(hud.velocidad*3.6)} km/h</span><span>⚡ {Math.round(hud.energia)}%</span>{hud.derrape&&fase==='corriendo'&&<span className="turbo-aviso">Curva: baja la velocidad</span>}</div>
 <div className="turbo-stage"><div ref={host} className="turbo-canvas" aria-label="Pista de carreras tridimensional"/>
 {vista==='cabina'&&<div className="turbo-tablero" aria-hidden="true">◉ <span>CIRCUITO TURBO</span> ◉</div>}
 {error&&<div className="turbo-capa"><p>{error}</p></div>}{fase==='lista'&&!error&&<button className="turbo-inicio btn-primary" onClick={iniciar}>▶ Iniciar carrera</button>}
 {fase==='pausa'&&<div className="turbo-capa"><h3>Carrera en pausa</h3><button className="btn-primary" onClick={()=>setFase('corriendo')}>Continuar carrera</button></div>}
 {fase==='fin'&&<div className="turbo-capa"><h3>{hud.tiempo<=pista.meta?'🏆 ¡Medalla Turbo!':'🏁 ¡Carrera completada!'}</h3><p>Tiempo: {formato(hud.tiempo)} · Meta: {formato(pista.meta)}</p><button className="btn-primary" onClick={reset}>Volver a preparar la carrera</button></div>}
 </div>
 {modo==='manual'&&<div className="turbo-controles">{control('izq','← Izquierda')}{control('der','Derecha →')}{control('freno','Frenar')}{control('acel','Acelerar')}{control('turbo','⚡ Turbo')}</div>}
 <div className="turbo-panel">
  <h3>{pista.nombre}</h3><p>Dos vueltas · Mejor tiempo en este modo: <strong>{record?formato(record):'aún sin marca'}</strong></p>
  {!activo&&<div className="turbo-vistas"><button type="button" aria-pressed={modo==='manual'} onClick={()=>{reset();setModo('manual')}}>Conducir</button><button type="button" aria-pressed={modo==='programa'} onClick={()=>{reset();setModo('programa')}}>Programar el carro</button><label>Carro <select value={color} onChange={e=>{reset();setColor(Number(e.target.value))}}>{COLORES.map(([n],i)=><option key={n} value={i}>{n}</option>)}</select></label></div>}
  {modo==='programa'&&<><p>El carro repite la secuencia de cuatro sectores en cada vuelta. Cuida las curvas y guarda el turbo para los sectores rápidos.</p><div className="turbo-programa">{ordenes.map((o,i)=><label key={i}>Sector {i+1} · referencia {Math.round(pista.limites[i]*3.6)} km/h <select value={o} disabled={activo} onChange={e=>setOrdenes(ordenes.map((v,j)=>j===i?e.target.value:v))}>{Object.entries(ORDENES_TURBO).map(([id,n])=><option key={id} value={id}>{n}</option>)}</select></label>)}</div></>}
  <div className="turbo-vistas">{fase==='corriendo'&&<button onClick={()=>{keys.current={};setFase('pausa')}}>⏸ Pausa</button>}{activo&&<button onClick={reset}>Reiniciar</button>}</div>
  <p className="game-muted">En modo manual el carro sigue la pista y tú controlas velocidad, carril y turbo. Usa flechas o WASD, espacio para turbo y C para cámara. En celular usa los botones. Las marcas se guardan en este navegador.</p>
 </div>
 </main></div>
}
