import { lazy, Suspense, useState } from 'react'
import { articles, faq, levels, pages, whatsapp, learningRoutes, newCourses, courseWhatsApp } from './content'
import './marketing.css'


const ProyectosScratch = lazy(() => import('../components/ProyectosScratch'))
const DEMOS_SCRATCH = [
 { id:'estelar', nombre:'Aventura Estelar', etiqueta:'NIVEL 1 · EXPLORADORES', descripcion:'Pilota una nave, reúne estrellas y evita meteoritos en tres mundos llenos de color.', habilidad:'Movimiento, puntos y vidas', accion:'Jugar Aventura Estelar' },
 { id:'portal', nombre:'Guardianes del Portal', etiqueta:'NIVEL 3 · MAESTRO', descripcion:'Domina el doble salto, esquiva la lava y reúne cristales para abrir cada portal.', habilidad:'Saltos, colisiones y escenarios', accion:'Jugar Guardianes del Portal' },
 { id:'bosque', nombre:'El bosque de los colores', etiqueta:'CUENTO ANIMADO · 3 MINIJUEGOS', descripcion:'Elige tu compañero y tu camino. Devuelve la luz al bosque con memoria, música y exploración.', habilidad:'Historias, decisiones e interacción', accion:'Explorar el bosque de los colores' },
]
function ScratchShowcase() {
 const [proyecto,setProyecto] = useState(null)
 function abrir(e,id) {
  if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return
  e.preventDefault();setProyecto(id)
 }
 return <section id="juegos-scratch" className="m-section m-scratch-showcase" aria-labelledby="m-scratch-title">
  <span className="m-label">HECHO CON SCRATCH · JUEGA SIN REGISTRARTE</span>
  <h2 id="m-scratch-title">Primero lo juegan. Después, aprenden a crearlo.</h2>
  <p>Prueba dos videojuegos y una historia interactiva de CODIKIDS. Son ejemplos de lo que se puede construir programando con bloques.</p>
  <div className="m-grid">{DEMOS_SCRATCH.map(j=><article className="m-card m-scratch-card" key={j.id}>
   <img src={`/scratch/previews/${j.id}.svg`} alt={`Escenario de ${j.nombre}`} width="480" height="300" loading="lazy"/>
   <div className="m-scratch-copy"><span className="m-label">{j.etiqueta}</span><h3>{j.nombre}</h3><p>{j.descripcion}</p><span className="m-scratch-skill">✦ {j.habilidad}</span><a className="m-button" href={`/scratch/player.html?proyecto=${j.id}`} aria-label={j.accion} aria-haspopup="dialog" onClick={e=>abrir(e,j.id)}>{j.id==='bosque'?'Explorar el cuento':'▶ Jugar ahora'}</a></div>
  </article>)}</div>
  <p className="m-small">Gratis, desde el navegador y sin iniciar sesión. Pulsa la bandera verde para comenzar.</p>
  {proyecto && <Suspense fallback={<div className="m-game-loading" role="status"><p>Preparando tu proyecto de Scratch…</p><button type="button" onClick={()=>setProyecto(null)}>Cerrar</button></div>}><ProyectosScratch proyecto={proyecto} onCerrar={()=>setProyecto(null)}/></Suspense>}
 </section>
}

const CTA = () => <a className="m-button" href={whatsapp}>Consultar por WhatsApp ↗</a>
function Cards() { return <div className="m-grid">{levels.map(([name, intro, topics, project], i) => <article className="m-card" key={name}><span className="m-label">NIVEL 0{i + 1}</span><h3>{name}</h3><strong>{intro}</strong><p>{topics}</p><p><b>Proyecto:</b> {project}</p><a href="/curso-scratch-para-ninos">Conocer la ruta →</a></article>)}</div> }
function FAQ() { return <section className="m-section"><h2>Preguntas frecuentes</h2>{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section> }
function Method() { return <section className="m-section"><span className="m-label">APRENDER HACIENDO</span><h2>Una idea. Ocho clases. Un proyecto propio.</h2><div className="m-grid">{[['01 · Explorar', 'La docente explica una mecánica y el niño prueba cómo funciona.'], ['02 · Construir', 'Cada clase de 45 minutos añade reglas y desafíos al proyecto.'], ['03 · Compartir', 'El niño entrega sus inventos, recibe revisión y la familia sigue su progreso.']].map(([t, p]) => <article className="m-card" key={t}><h3>{t}</h3><p>{p}</p></article>)}</div></section> }
function BlogLinks({ current }) { return <section className="m-section"><h2>Ideas para acompañar su aprendizaje</h2><div className="m-grid">{articles.filter(a => a.slug !== current).map(a => <article className="m-card" key={a.slug}><span className="m-label">GUÍA PARA FAMILIAS</span><h3><a href={'/blog/' + a.slug}>{a.title}</a></h3><p>{a.description}</p><a href={'/blog/' + a.slug}>Leer la guía →</a></article>)}</div></section> }
function Projects() { return <section className="m-section"><h2>De las instrucciones a los videojuegos</h2><p>Un laberinto para practicar movimiento y colisiones. Un juego de atrapar objetos para añadir puntos y vidas. Un mundo marino con dificultad y récords. Un juego de plataformas con saltos y escenarios.</p><p>Son ejemplos de la ruta educativa; el proyecto final se adapta a la experiencia y las ideas de cada estudiante.</p></section> }
function RouteCards({ current }) {
  return <section id="rutas" className="m-section">
    <span className="m-label">RUTAS DE APRENDIZAJE</span>
    <h2>{current ? 'Sigue explorando CODIKIDS' : 'Elige qué quiere crear tu hijo'}</h2>
    <div className="m-grid">{learningRoutes.filter(route => route.path !== current).map(route =>
      <article className="m-card m-route-card" key={route.path}>
        <span className="m-label">{route.tag}</span>
        <h3>{route.name}</h3><p>{route.short}</p>
        <a className="m-secondary" href={route.path}>Conoce {route.name} →</a>
        <a href={courseWhatsApp(route.name)} aria-label={'Consultar por WhatsApp sobre ' + route.name}>Consultar por WhatsApp ↗</a>
      </article>)}</div>
  </section>
}
function NewCourse({ course }) {
  const consult = <a className="m-button" href={courseWhatsApp(course.name)}>{course.cta} por WhatsApp ↗</a>
  return <>
    <section className="m-page-head"><span className="m-label">{course.tag}</span>
      <h1>{course.name} para niños</h1>{course.firstLevel && <p className="m-label">NIVEL 1 · {course.firstLevel}</p>}<p>{course.intro}</p>{consult}
    </section>
    <section className="m-section"><h2>{course.firstLevel ? "Qué aprenderá en Web Exploradores" : "Qué aprenderá tu hijo"}</h2><div className="m-grid">
      {course.topics.map(([title, description]) => <article className="m-card" key={title}><h3>{title}</h3><p>{description}</p></article>)}
    </div></section>
    <section className="m-section m-banner"><h2>Consulta horarios y requisitos</h2>
      <p>Cuéntanos la edad de tu hijo y qué le gustaría crear. Te orientamos sobre los cupos y lo que necesita para empezar.</p>{consult}
    </section>
    <RouteCards current={course.path}/>
  </>
}
function Home() { return <><section className="m-hero"><div><span className="m-label">ACADEMIA DE TECNOLOGÍA PARA NIÑOS</span><h1>Juegos, páginas web y robots.<br/><em>Tu hijo puede empezar a crearlos.</em></h1><p>Tres rutas para aprender haciendo: programar con Scratch, diseñar una primera página web o descubrir cómo funciona un robot.</p><div className="m-actions"><a className="m-button" href="/#rutas">Explorar las tres rutas</a><a className="m-secondary" href="#juegos-scratch">Probar juegos gratis ↓</a><CTA/></div></div><div className="m-code"><div className="m-code-bar">● ● ● <span>LABORATORIO CODIKIDS</span></div>{learningRoutes.map((route, index) => <a className="m-block m-hero-link" key={route.path} href={route.path}><span aria-hidden="true">0{index + 1} · </span>{route.name} →</a>)}</div></section><ScratchShowcase/><RouteCards/><section className="m-section"><span className="m-label">TU RUTA EN SCRATCH</span><h2>Empieza pequeño. Crea cada vez más.</h2><Cards/></section><Method/><Projects/><section className="m-section m-banner"><h2>Nacimos en Ibagué. Aprendemos online.</h2><p>Una academia colombiana para familias que quieren acompañar a sus hijos a crear tecnología.</p><a href="/programacion-para-ninos-ibague">Conoce CODIKIDS en Ibagué →</a></section><section className="m-section"><h2>También puedes aprender a tu ritmo</h2><p>El Kit de Misiones CODIKIDS incluye 30 misiones en español, recursos y proyectos de solución. Requiere computador con teclado y ayuda de un adulto para empezar. No incluye clases en vivo.</p><a className="m-secondary" href="https://codikids-kit-misiones.p-olaya.chatgpt.site/?utm_source=codikids-vercel&utm_medium=referral&utm_campaign=kit-misiones">Ver contenido y condiciones del kit ↗</a></section><BlogLinks/></> }
function Course() { return <><section className="m-page-head"><span className="m-label">DE PRINCIPIANTE A CREADOR</span><h1>Curso Scratch para niños</h1><p>Una ruta online para niños de 8 a 12 años: Exploradores, Ninja y Maestro. Aprenderán a programar videojuegos con bloques, probar sus ideas y explicar sus decisiones.</p><CTA/></section><section className="m-section"><h2>Tres niveles para avanzar con sentido</h2><p>Cada nivel comprende 8 clases en vivo de 45 minutos. La experiencia previa orienta el punto de entrada; consulta horarios y cupos antes de inscribirte.</p><Cards/></section><Method/><Projects/><section className="m-section"><h2>Experiencias de las familias</h2><p>¿Quieres conocer cómo se trabaja en clase? Escríbenos para consultar ejemplos de proyectos y experiencias que las familias autoricen compartir. Publicaremos testimonios identificados únicamente con su consentimiento.</p><CTA/></section><FAQ/><RouteCards current="/curso-scratch-para-ninos"/><BlogLinks/></> }
function Ibague() { return <><section className="m-page-head"><span className="m-label">IBAGUÉ, TOLIMA · CLASES ONLINE</span><h1>Programación para niños en Ibagué</h1><p>CODIKIDS nació en Ibagué para acompañar a niños y familias a crear tecnología. Conoce nuestras rutas y consulta cómo participar desde Ibagué o desde otra ciudad.</p><CTA/></section><section className="m-section"><h2>Quién es CODIKIDS</h2><p>Somos una academia virtual de programación infantil. Enseñamos con proyectos y actividades guiadas: tu hijo puede crear videojuegos con Scratch, diseñar una página web o explorar cómo funcionan los robots.</p><p>Consulta la modalidad, los horarios y los materiales de la ruta que elijas.</p></section><RouteCards/><BlogLinks/></> }
export default function PublicSite({ path = '/' }) {
  const article = articles.find(a => '/blog/' + a.slug === path)
  const known = pages[path]
  const course = newCourses.find(item => item.path === path)
  return <div className="marketing"><a className="m-skip" href="#contenido">Saltar al contenido</a><header className="m-header"><a className="m-logo" href="/" aria-label="CODIKIDS, inicio"><span aria-hidden="true">✦</span> CODIKIDS</a><nav aria-label="Navegación principal"><a href="/#rutas">Rutas</a><a href="/#juegos-scratch">Juegos gratis</a><a href="/programacion-para-ninos-ibague">Ibagué</a><a href="/blog">Blog</a><a className="m-access" href="/entrar">Acceso estudiantes</a></nav></header><main id="contenido">{path !== '/' && <nav className="m-crumb" aria-label="Ruta de navegación"><a href="/">Inicio</a> / {article && <><a href="/blog">Blog</a> / </>}{article?.title || course?.name || (path === '/blog' ? 'Blog' : path.includes('ibague') ? 'Ibagué' : known ? 'Curso Scratch' : 'Página no encontrada')}</nav>}{path === '/' ? <Home/> : course ? <NewCourse course={course}/> : path === '/curso-scratch-para-ninos' ? <Course/> : path === '/programacion-para-ninos-ibague' ? <Ibague/> : path === '/blog' ? <><section className="m-page-head"><h1>Blog de programación para niños</h1><p>Guías de CODIKIDS para elegir una ruta y acompañar los primeros proyectos.</p></section><BlogLinks/></> : article ? <><article className="m-article"><span className="m-label">GUÍA PARA FAMILIAS · CODIKIDS</span><h1>{article.title}</h1><p className="m-lead">{article.description}</p><p className="m-small">Equipo CODIKIDS · Actualizado el 5 de octubre de 2026</p>{article.sections.map(([t, p]) => <section key={t}><h2>{t}</h2><p>{p}</p></section>)}<section><h2>Fuentes y lectura adicional</h2><ul>{article.sources.map(([t, url]) => <li key={url}><a href={url}>{t} ↗</a></li>)}</ul></section><a className="m-secondary" href="/curso-scratch-para-ninos">Conoce el curso Scratch de CODIKIDS →</a></article><BlogLinks current={article.slug}/></> : <section className="m-page-head"><h1>Página no encontrada</h1><p>Esta dirección no corresponde a una página de CODIKIDS.</p><a className="m-button" href="/">Volver al inicio</a></section>}{known && !course && <section className="m-section m-banner"><h2>Empecemos por las ideas de tu hijo</h2><p>Cuéntanos su edad y experiencia. Te orientamos sobre el nivel, los horarios y la inscripción.</p><CTA/></section>}</main><footer className="m-footer"><div><a className="m-logo" href="/">✦ CODIKIDS</a><p>Academia online nacida en Ibagué, Colombia.</p><a href="https://codikids-app.vercel.app">codikids-app.vercel.app</a></div><nav aria-label="Enlaces del pie de página">{learningRoutes.map(route => <a key={route.path} href={route.path}>{route.name}</a>)}<a href="/programacion-para-ninos-ibague">Programación en Ibagué</a><a href="/blog">Blog para familias</a><a href="/entrar">Acceso estudiantes</a></nav><div><a href={whatsapp}>WhatsApp: +57 319 357 9832</a><a href="mailto:codikidspro@gmail.com">codikidspro@gmail.com</a><p>© 2026 CODIKIDS</p></div></footer></div>
}
