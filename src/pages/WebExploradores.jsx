import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TITULOS=['Mi primera web','Elijo mi tema','Textos e imágenes','Secciones de mi mundo','Colores y estilos','Botones y enlaces','Termino mi web','Presento mi proyecto']
const initial={titulo:'Mi Mundo Digital',tema:'espacio',descripcion:'¡Bienvenidos a mi página!',color:'#6654db',html:'',css:''}
const safeColor=v=>/^#[0-9a-fA-F]{6}$/.test(v)?v:'#6654db'
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
function buildDocument(p,clase){
 const title=escapeHtml(p.titulo),desc=escapeHtml(p.descripcion),theme=escapeHtml(p.tema),color=safeColor(p.color)
 const base=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:system-ui;margin:0;background:#f5f2ff;color:#272040}header{padding:45px 22px;background:${color};color:white;text-align:center}main{max-width:780px;margin:auto;padding:24px}.card{padding:24px;border-radius:18px;background:white;box-shadow:0 5px 22px #ddd}a{color:${color}}${clase>=5?p.css:''}</style></head><body><header><h1>${title}</h1><p>${desc}</p></header><main><div class="card"><h2>Mi tema: ${theme}</h2><p>Estoy creando mi primera página con CodiKids.</p>${clase>=6?'<a href="#sobre-mi">Conoce más</a><section id="sobre-mi"><h3>Sobre mi proyecto</h3><p>¡Sigue explorando!</p></section>':''}</div></main></body></html>`
 // Nunca ejecutar HTML libre con los permisos de la plataforma.
 return clase>=4 && p.html.trim()?p.html:base
}
export default function WebExploradores({user}){
 const [status,setStatus]=useState('loading'),[limit,setLimit]=useState(1),[clase,setClase]=useState(1),[p,setP]=useState(initial),[saving,setSaving]=useState(''),[mode,setMode]=useState('visual')
 useEffect(()=>{let active=true;(async()=>{
 const {data:m,error}=await supabase.from('web_matriculas').select('activa,clases_habilitadas').eq('estudiante_id',user.id).maybeSingle()
 if(!active)return
 if(error){setStatus('error');return}
 if(!m?.activa){setStatus('blocked');return}
 setLimit(m.clases_habilitadas);const {data:project}=await supabase.from('web_proyectos').select('titulo,tema,descripcion,color,html,css').eq('estudiante_id',user.id).maybeSingle()
 if(active){if(project)setP({...initial,...project});setStatus('ready')}
 })();return()=>{active=false}},[user.id])
 const doc=useMemo(()=>buildDocument(p,clase),[p,clase])
 async function save(){
 setSaving('Guardando…')
 const {error}=await supabase.from('web_proyectos').upsert({...p,estudiante_id:user.id,updated_at:new Date().toISOString()},{onConflict:'estudiante_id'})
 setSaving(error?'Error al guardar. Intenta de nuevo.':'Proyecto guardado')
 }
 if(status!=='ready')return <main style={{padding:40,color:'#222'}}><h1>🌐 CodiKids Web Exploradores</h1><p>{status==='loading'?'Comprobando matrícula…':status==='blocked'?'Este curso es exclusivo para estudiantes matriculados. Solicita acceso a CodiKids.':'No se pudo verificar tu matrícula. Contacta a CodiKids.'}</p><Link to="/laboratorio">Volver al laboratorio</Link></main>
 return <main style={{minHeight:'100vh',background:'#eeeafb',color:'#252039',padding:24}}>
 <header style={{maxWidth:1150,margin:'auto'}}><Link to="/laboratorio">← Laboratorio</Link><h1>🌐 Web Exploradores</h1><p>Construye tu primera página · Clase {clase} de 8</p></header>
 <nav aria-label="Clases" style={{maxWidth:1150,margin:'20px auto',display:'flex',gap:8,flexWrap:'wrap'}}>{TITULOS.map((t,i)=><button key={t} disabled={i+1>limit} onClick={()=>setClase(i+1)} style={{padding:10,borderRadius:10,background:i+1===clase?'#6654db':'white',color:i+1===clase?'white':'#252039',cursor:'pointer'}}> {i+1>limit?'🔒 ':''}{i+1}. {t}</button>)}</nav>
 <section style={{maxWidth:1150,margin:'auto'}}><h2>{TITULOS[clase-1]}</h2><p>{clase<=2?'Diseña tu página cambiando textos y el tema.':clase<=4?'Descubre la estructura de una página y experimenta con HTML.':clase<=6?'Personaliza estilos y agrega navegación.':'Completa tu sitio y preséntalo.'}</p>
 <div style={{display:'flex',gap:10,marginBottom:12}}><button onClick={()=>setMode('visual')}>🎨 Visual</button><button onClick={()=>setMode('code')}>💻 Código</button><button onClick={save}>💾 Guardar</button><span role="status">{saving}</span></div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:20}}>
 <div style={{background:'white',padding:20,borderRadius:18}}>
 {mode==='visual'?<div style={{display:'grid',gap:14}}>
 <label>Título<input style={{display:'block',width:'100%'}} value={p.titulo} maxLength={80} onChange={e=>setP({...p,titulo:e.target.value})}/></label>
 <label>Mi tema<select style={{display:'block'}} value={p.tema} onChange={e=>setP({...p,tema:e.target.value})}>{['espacio','fútbol','animales','videojuegos','naturaleza','arte'].map(t=><option key={t}>{t}</option>)}</select></label>
 <label>Descripción<textarea style={{display:'block',width:'100%'}} value={p.descripcion} maxLength={250} onChange={e=>setP({...p,descripcion:e.target.value})}/></label>
 <label>Color principal<input type="color" value={safeColor(p.color)} onChange={e=>setP({...p,color:e.target.value})}/></label>
 </div>:<div><p>HTML desde la clase 4; CSS desde la clase 5.</p><textarea aria-label="Código HTML" disabled={clase<4} spellCheck="false" style={{width:'100%',minHeight:230,fontFamily:'monospace'}} value={p.html} placeholder="Escribe HTML para personalizar tu página" onChange={e=>setP({...p,html:e.target.value})}/><textarea aria-label="Código CSS" disabled={clase<5} spellCheck="false" style={{width:'100%',minHeight:100,fontFamily:'monospace'}} value={p.css} placeholder="Escribe CSS" onChange={e=>setP({...p,css:e.target.value})}/><button onClick={()=>setP({...p,html:doc})}>Usar plantilla actual como HTML</button></div>}
 </div>
 <div style={{background:'white',padding:12,borderRadius:18}}><h3>👀 Vista previa</h3><iframe title="Vista previa aislada" sandbox="" referrerPolicy="no-referrer" srcDoc={doc} style={{width:'100%',height:440,border:'1px solid #ddd',borderRadius:12}}/></div>
 </div></section></main>
}