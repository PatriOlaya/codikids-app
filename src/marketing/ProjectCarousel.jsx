import { useId, useRef, useState } from 'react'
export default function ProjectCarousel({items,children}) {
 const track=useRef(null),id=useId(),[actual,setActual]=useState(0)
 function ir(i){
  const n=(i+items.length)%items.length,el=track.current
  el.scrollTo({left:el.children[n].offsetLeft-el.children[0].offsetLeft,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
 }
 function scroll(){const el=track.current;setActual(Math.round(el.scrollLeft/el.clientWidth))}
 return <div className="mp-carousel" role="region" aria-roledescription="carrusel" aria-label="Proyectos Scratch para jugar">
  <div className="mp-toolbar"><span>HECHO CON BLOQUES. LLENO DE POSIBILIDADES.</span><div><span className="mp-counter" aria-live="polite">{actual+1} / {items.length}</span><button type="button" aria-label="Proyecto anterior" aria-controls={id} onClick={()=>ir(actual-1)}>←</button><button type="button" aria-label="Proyecto siguiente" aria-controls={id} onClick={()=>ir(actual+1)}>→</button></div></div>
  <div className="mp-track" id={id} ref={track} onScroll={scroll} tabIndex="0" aria-label="Desliza para explorar los proyectos" onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();ir(actual+(e.key==='ArrowRight'?1:-1))}}}>{children}</div>
  <div className="mp-tabs" role="group" aria-label="Elegir proyecto">{items.map((p,i)=><button type="button" key={p.id} aria-pressed={i===actual} onClick={()=>ir(i)}><span>0{i+1}</span>{p.nombre}<b aria-hidden="true">↗</b></button>)}</div><p className="mp-swipe-hint">← Desliza, usa las flechas o elige tu aventura →</p>
 </div>
}
