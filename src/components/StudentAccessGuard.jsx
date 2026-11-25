import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
export default function StudentAccessGuard({user,onLogout,children}) {
 const [status,setStatus]=useState('checking'),[message,setMessage]=useState(''),[retry,setRetry]=useState(0)
 useEffect(()=>{
  const controller=new AbortController();let checking=false
  async function check(){
   if(checking || document.hidden)return
   checking=true
   try{
    const {data}=await supabase.auth.getSession()
    const r=await fetch('/api/student-status',{headers:{Authorization:`Bearer ${data.session?.access_token || ''}`},cache:'no-store',signal:controller.signal}),body=await r.json()
    if(controller.signal.aborted)return
    if(r.ok && body.enabled===true){setStatus('active');setMessage('')}
    else{setStatus(r.status===403?'closed':r.status===401?'session':'error');setMessage(body.error || 'No se pudo verificar el acceso.')}
   }catch(e){if(e.name!=='AbortError'){setStatus('error');setMessage('No pudimos comprobar tu acceso. Revisa tu conexión e inténtalo de nuevo.')}}finally{checking=false}
  }
  check();const timer=setInterval(check,30000),focus=()=>check();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus)
  return()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus)}
 },[user.id,retry])
 if(status==='active')return children
 return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#111b35',color:'#eef4ff'}}><section style={{maxWidth:480,textAlign:'center'}}><span style={{fontSize:42,color:'#9aefd3'}} aria-hidden="true">✦</span><h1 style={{fontSize:25}}>{status==='checking'?'Comprobando tu acceso…':status==='closed'?'Tu acceso está en pausa':status==='session'?'Inicia sesión de nuevo':'No pudimos comprobar tu acceso'}</h1>{message && <p role="status" style={{lineHeight:1.8,color:'#c9d5e7'}}>{message}</p>}{status!=='checking' && <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:12,marginTop:20}}>{status==='closed'?<a className="btn-primary" href="https://wa.me/573193579832">Contactar a CODIKIDS</a>:<button type="button" className="btn-primary" onClick={()=>{setStatus('checking');setRetry(n=>n+1)}}>Reintentar</button>}<button type="button" className="btn-ghost" onClick={onLogout}>Salir de mi cuenta</button></div>}</section></main>
}
