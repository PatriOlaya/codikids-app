import {useEffect,useState} from 'react'
import {supabase} from '../lib/supabase'
const NOMBRES={turbo:'Circuito Turbo',nucita:'Nucita',islas:'Islas del Código',robot:'Código Roto',circuito:'Guardianes del Circuito',espacio:'Expedición espacial'}
export default function ActividadJuegos({estudiantes}){
 const [dias,setDias]=useState(7),[alumno,setAlumno]=useState('todos'),[eventos,setEventos]=useState([]),[error,setError]=useState(''),[cargando,setCargando]=useState(true)
 useEffect(()=>{let active=true;(async()=>{setCargando(true);const desde=new Date(Date.now()-dias*86400000).toISOString();let query=supabase.from('actividad_juegos').select('id,estudiante_id,juego,evento,fecha,duracion_segundos').gte('fecha',desde).order('fecha',{ascending:false}).limit(1000);if(alumno!=='todos')query=query.eq('estudiante_id',alumno);const {data,error:e}=await query;if(active){setEventos(data||[]);setError(e?.message||'');setCargando(false)}})();return()=>{active=false}},[dias,alumno])
 const nombres=Object.fromEntries(estudiantes.map(e=>[e.id,e.nombre]))
 const aperturas=eventos.filter(e=>e.evento==='abrir')
 const cierres=eventos.filter(e=>e.evento==='cerrar')
 const duracion=cierres.reduce((a,e)=>a+(e.duracion_segundos||0),0)
 const activos=new Set(aperturas.map(e=>e.estudiante_id)).size
 return <section className="card" style={{color:'#fff'}}><h2>📊 Actividad de videojuegos</h2><p style={{opacity:.7}}>Registros desde la activación del seguimiento; no reconstruye visitas anteriores.</p>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}><label>Período <select value={dias} onChange={e=>setDias(Number(e.target.value))}><option value={1}>24 horas</option><option value={7}>7 días</option><option value={30}>30 días</option></select></label><label>Estudiante <select value={alumno} onChange={e=>setAlumno(e.target.value)}><option value="todos">Todos</option>{estudiantes.map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}</select></label></div>
 <div style={{display:'flex',gap:20,flexWrap:'wrap',marginBottom:18}}><strong>👨‍🎓 {activos} estudiantes</strong><strong>🎮 {aperturas.length} aperturas</strong><strong>⏱ {Math.round(duracion/60)} minutos registrados</strong></div>
 {cargando?<p>Cargando registros…</p>:error?<p role="alert">No se pudo consultar la actividad: {error}. Comprueba que la migración esté aplicada.</p>:eventos.length===0?<p>Aún no hay actividad registrada en este período.</p>:<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',color:'inherit',textAlign:'left'}}><thead><tr><th>Estudiante</th><th>Juego</th><th>Acción</th><th>Fecha</th><th>Duración</th></tr></thead><tbody>{eventos.map(e=><tr key={e.id} style={{borderTop:'1px solid #ffffff22'}}><td>{nombres[e.estudiante_id]||'Estudiante'}</td><td>{NOMBRES[e.juego]||e.juego}</td><td>{e.evento==='abrir'?'Abrió':'Cerró'}</td><td>{new Date(e.fecha).toLocaleString('es-CO')}</td><td>{e.duracion_segundos==null?'—':Math.round(e.duracion_segundos/60)+' min'}</td></tr>)}</tbody></table></div>}
 <p style={{fontSize:12,opacity:.7}}>El tiempo se estima al cerrar un juego; sesiones interrumpidas pueden no registrar duración. Solo se muestran los 1.000 eventos más recientes del período.</p></section>
}
