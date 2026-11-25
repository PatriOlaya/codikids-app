import { useEffect, useRef } from 'react'
import './proyectos-scratch.css'
const PROYECTOS_SCRATCH = {
 estelar: { titulo:'Aventura Estelar', nivel:1, archivo:'Aventura_Estelar_Nivel_1.sb3', descripcion:'Pilota tu nave, reúne seis estrellas por mundo y evita meteoritos. Tres mundos para explorar con flechas o controles en pantalla.' },
 portal: { titulo:'Guardianes del Portal', nivel:3, archivo:'Guardianes_del_Portal_Nivel_3.sb3', descripcion:'Usa el doble salto para superar lava, drones y plataformas móviles. Reúne tres cristales y activa el interruptor de cada portal.' },
 bosque: { titulo:'El bosque de los colores', archivo:'El_Bosque_de_los_Colores_Interactivo.sb3', descripcion:'Un cuento animado de seis escenas: elige compañero y camino, cambia entre día y noche y juega con luciérnagas, parejas y melodías.' },
}
export default function ProyectosScratch({ proyecto, onCerrar }) {
 const datos=PROYECTOS_SCRATCH[proyecto], panel=useRef(null), boton=useRef(null)
 useEffect(()=>{
  const anterior=document.activeElement, overflow=document.body.style.overflow
  document.body.style.overflow='hidden';boton.current?.focus()
  function teclas(e){
   if(e.key==='Escape')onCerrar()
   if(e.key==='Tab'){
    const elementos=[...panel.current.querySelectorAll('button,a,iframe')],primero=elementos[0],ultimo=elementos.at(-1)
    if(e.shiftKey&&document.activeElement===primero){e.preventDefault();ultimo.focus()}
    else if(!e.shiftKey&&document.activeElement===ultimo){e.preventDefault();primero.focus()}
   }
  }
  window.addEventListener('keydown',teclas)
  return()=>{document.body.style.overflow=overflow;anterior?.focus();window.removeEventListener('keydown',teclas)}
 },[onCerrar])
 if(!datos)return null
 return <div className="scratch-overlay" role="dialog" aria-modal="true" aria-labelledby="scratch-title"><section ref={panel} className="scratch-window">
  <header><div><small>CODIKIDS · PROYECTO SCRATCH{datos.nivel?` · NIVEL ${datos.nivel}`:''}</small><h2 id="scratch-title">{datos.titulo}</h2></div><button ref={boton} type="button" onClick={onCerrar}>✕ Cerrar</button></header>
  <p className="scratch-description">{datos.descripcion}</p>
  <iframe title={`${datos.titulo} — escenario de Scratch`} src={`/scratch/player.html?proyecto=${proyecto}`} allow="fullscreen; autoplay" allowFullScreen />
  <footer><span>Todos los movimientos, decisiones y minijuegos están programados con bloques de Scratch.</span><a href={`/scratch/${datos.archivo}`} download>↓ Descargar .sb3</a></footer>
 </section></div>
}
