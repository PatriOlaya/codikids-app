import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function StudentAccess({studentId,nombre}) {
 const [enabled,setEnabled]=useState(null),[error,setError]=useState(''),[saving,setSaving]=useState(false),[reload,setReload]=useState(0),[message,setMessage]=useState('')
 useEffect(()=>{
  const controller=new AbortController();setEnabled(null);setError('');setMessage('')
  async function load(){
   try{
    const {data}=await supabase.auth.getSession()
    const r=await fetch(`/api/student-access?studentId=${encodeURIComponent(studentId)}`,{headers:{Authorization:`Bearer ${data.session?.access_token || ''}`},cache:'no-store',signal:controller.signal}),body=await r.json()
    if(!r.ok)throw Error(body.error || 'No se pudo consultar el acceso.')
    setEnabled(body.enabled)
   }catch(e){if(e.name!=='AbortError')setError(e.message)}
  }
  load();return()=>controller.abort()
 },[studentId,reload])
 async function toggle(){
  const next=!enabled
  if(!window.confirm(next?`¿Reactivar el acceso de ${nombre}? Sus proyectos y progreso seguirán disponibles.`:`¿Cerrar el acceso de ${nombre}? Conservará sus proyectos y progreso para cuando retome la ruta.`))return
  setSaving(true);setError('');setMessage('')
  try{
   const {data}=await supabase.auth.getSession()
   const r=await fetch('/api/student-access',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session?.access_token || ''}`},body:JSON.stringify({studentId,enabled:next})}),body=await r.json()
   if(!r.ok)throw Error(body.error || 'No se pudo cambiar el acceso.')
   setEnabled(body.enabled);setMessage(body.enabled?'Acceso reactivado.':'Acceso cerrado. Sus proyectos y progreso se conservan.')
  }catch(e){setError(e.message)}finally{setSaving(false)}
 }
 return <div className="card" style={{marginBottom:16,borderColor:enabled===false?'#f4a1a95c':'#a3e6cc38'}}>
  <div style={{display:'flex',gap:16,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}><div><strong>Acceso a la plataforma</strong><p style={{fontSize:13,color:enabled===false?'#ffc5cd':'#a9e8d1',margin:'6px 0'}}>{enabled===null?'Comprobando acceso…':enabled?'● Activo':'● Cerrado'}</p><span style={{fontSize:12,color:'#b9b6d4'}}>Puedes pausar el acceso mientras no continúa la ruta y reactivarlo después.</span></div>{enabled!==null && <button type="button" className="btn-ghost" disabled={saving} onClick={toggle} style={{padding:'10px 16px',color:enabled?'#ffc0cb':'#abf4d8',borderColor:enabled?'#dc91a269':'#9cd8c869'}}>{saving?'Guardando…':enabled?'Cerrar acceso':'Reactivar acceso'}</button>}</div>
  {error && <p role="alert" style={{color:'#ffc5cd',fontSize:13}}>{error} <button type="button" className="btn-ghost" onClick={()=>setReload(n=>n+1)}>Reintentar</button></p>}{message && <p role="status" style={{fontSize:13,color:'#baefd9',marginTop:12}}>{message}</p>}
 </div>
}
