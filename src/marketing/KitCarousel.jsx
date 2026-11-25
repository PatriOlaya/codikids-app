import { useState } from 'react'
const URL='https://codikids-kit-misiones.p-olaya.chatgpt.site/?utm_source=codikids-vercel&utm_medium=referral&utm_campaign=kit-misiones'
const SLIDES=[
 {numero:'01',tag:'UNA RUTA PARA EXPLORAR',titulo:'30 misiones. Muchas ideas por descubrir.',texto:'Retos en español para aprender haciendo y avanzar paso a paso, a su propio ritmo.',arte:'misiones'},
 {numero:'02',tag:'PRACTICAR, PROBAR Y CREAR',titulo:'Más autonomía, una misión a la vez.',texto:'Recursos y proyectos de solución para acompañar la práctica y volver a intentarlo cuando lo necesite.',arte:'proyectos'},
 {numero:'03',tag:'UN FORMATO PARA TU FAMILIA',titulo:'Un espacio para aprender a su ritmo.',texto:'Un kit de actividades para practicar desde casa. Revisa su contenido y sus condiciones antes de elegirlo.',arte:'casa'},
]
function KitArt({tipo}){
 return <div className={`kit-art kit-art-${tipo}`} aria-hidden="true"><div className="kit-art-top"><span>● ● ●</span> MI CUADERNO DE MISIONES <b>✦</b></div><div className="kit-art-body"><span className="kit-art-label">CODIKIDS · PEQUEÑOS CREADORES</span><div className="kit-art-map"><span>01</span><i/><span>02</span><i/><span>03</span></div><div className="kit-art-task"><span>{tipo==='misiones'?'✦':tipo==='proyectos'?'</>':'⌂'}</span><div><strong>{tipo==='misiones'?'Mi próxima misión':tipo==='proyectos'?'Mi próximo proyecto':'Mi momento para crear'}</strong><p>{tipo==='misiones'?'Explorar · probar · descubrir':tipo==='proyectos'?'Imaginar · construir · mejorar':'En casa · a mi ritmo'}</p></div></div><div className="kit-art-checks"><span><i/> Un reto para empezar</span><span><i/> Ideas para practicar</span><span><i/> Un proyecto por descubrir</span></div><div className="kit-art-bottom">¡Vamos paso a paso! <b>↗</b></div></div><span className="kit-sticker">30<br/><small>MISIONES</small></span></div>
}
export default function KitCarousel(){
 const [actual,setActual]=useState(0),s=SLIDES[actual]
 function ir(i){setActual((i+SLIDES.length)%SLIDES.length)}
 return <section className="m-section kit-section" id="kit-misiones" aria-labelledby="kit-title"><div className="kit-intro"><span className="m-label">KIT DE MISIONES CODIKIDS</span><h2 id="kit-title">¿Quieres que tu hijo aprenda a su ritmo y gane <em>autonomía</em>?</h2><p>Este kit puede ser para tu familia. Dale un espacio para explorar, practicar y crear con retos guiados.</p></div>
  <div className="kit-carousel" role="region" aria-roledescription="carrusel" aria-label="Conoce el Kit de Misiones"><div className="kit-slide" role="group" aria-roledescription="diapositiva" aria-label={`${actual+1} de 3: ${s.titulo}`}><div className="kit-slide-copy"><span className="kit-tag">{s.tag}</span><h3>{s.titulo}</h3><p>{s.texto}</p><a className="m-button kit-cta" href={URL} target="_blank" rel="noopener noreferrer">Quiero conocer el kit ↗</a><span className="kit-note">Requiere computador con teclado y ayuda de un adulto para comenzar. No incluye clases en vivo.</span></div><KitArt tipo={s.arte}/></div>
   <div className="kit-controls"><div role="group" aria-label="Elegir información del kit">{SLIDES.map((item,i)=><button type="button" key={item.numero} aria-label={`Ver opción ${i+1} del kit`} aria-pressed={actual===i} onClick={()=>ir(i)}>{item.numero}</button>)}</div><span aria-live="polite">{actual+1} / 3</span><button type="button" aria-label="Kit: anterior" onClick={()=>ir(actual-1)}>←</button><button type="button" aria-label="Kit: siguiente" onClick={()=>ir(actual+1)}>→</button></div>
  </div>
 </section>
}
