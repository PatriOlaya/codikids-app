import {useCallback,useEffect,useRef,useState} from 'react'
import {supabase} from '../lib/supabase'
export default function ChatDocente({user,estudiantes=[],esDocente=false}){
 const [seleccion,setSeleccion]=useState(esDocente?'':user.id)
 const [mensajes,setMensajes]=useState([]),[texto,setTexto]=useState(''),[error,setError]=useState(''),[enviando,setEnviando]=useState(false),[abierto,setAbierto]=useState(esDocente)
 const last=useRef(null)
 const cargar=useCallback(async()=>{
  if(!seleccion)return
  const {data,error:e}=await supabase.from('chat_mensajes').select('id,estudiante_id,remitente_id,remitente_rol,contenido,creado_at').eq('estudiante_id',seleccion).order('creado_at',{ascending:false}).limit(100)
  if(e){setError('No se pudieron cargar los mensajes. Comprueba la configuración del chat.');return}
  setError('');setMensajes((data||[]).reverse())
 },[seleccion])
 useEffect(()=>{if(!abierto)return;last.current=null;cargar();const t=setInterval(cargar,8000);return()=>clearInterval(t)},[cargar,abierto])
 async function enviar(e){e.preventDefault();const contenido=texto.trim();if(!contenido||contenido.length>1000||enviando||!seleccion)return;setEnviando(true);setError('')
 const {error:envioError}=await supabase.from('chat_mensajes').insert({estudiante_id:seleccion,remitente_id:user.id,remitente_rol:esDocente?'docente':'estudiante',contenido})
 if(envioError)setError('No se pudo enviar el mensaje. Intenta de nuevo.');else{setTexto('');await cargar()}setEnviando(false)}
 const panel=<section style={{background:'#1d183b',color:'#fff',border:'1px solid #7365ae',borderRadius:16,padding:16,maxWidth:esDocente?'100%':380,width:'100%',boxShadow:'0 14px 35px #0006'}} aria-label="Chat privado con CodiKids">
 <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}><h3 style={{margin:'0 0 10px'}}>💬 {esDocente?'Mensajes de estudiantes':'Hablar con mi profe'}</h3>{!esDocente&&<button onClick={()=>setAbierto(false)} aria-label="Cerrar chat">✕</button>}</header>
 {esDocente&&<label style={{display:'block',marginBottom:12}}>Conversación<select value={seleccion} onChange={e=>setSeleccion(e.target.value)} style={{display:'block',width:'100%',padding:10}}><option value="">Selecciona un estudiante</option>{estudiantes.map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}</select></label>}
 {!seleccion?<p>Selecciona un estudiante para consultar sus mensajes.</p>:<>
 <div role="log" aria-live="polite" aria-relevant="additions" style={{height:260,overflowY:'auto',padding:8,background:'#100e27',borderRadius:10,display:'flex',flexDirection:'column',gap:10}}>
 {mensajes.length===0&&<p style={{color:'#d5cee9'}}>Todavía no hay mensajes. Puedes iniciar la conversación.</p>}
 {mensajes.map(m=><div key={m.id} style={{maxWidth:'90%',alignSelf:m.remitente_id===user.id?'flex-end':'flex-start',background:m.remitente_id===user.id?'#5545a4':'#294b60',padding:'9px 12px',borderRadius:12,overflowWrap:'anywhere'}}><small style={{display:'block',opacity:.8}}>{m.remitente_rol==='docente'?'Profe':'Estudiante'} · {new Date(m.creado_at).toLocaleString('es-CO')}</small>{m.contenido}</div>)}
 </div><form onSubmit={enviar} style={{display:'flex',gap:8,marginTop:12}}><label style={{flex:1}}><span className="sr-only">Escribir mensaje</span><input aria-label="Escribir mensaje" value={texto} onChange={e=>setTexto(e.target.value)} maxLength={1000} placeholder="Escribe tu mensaje…" style={{width:'100%',padding:11}}/></label><button type="submit" disabled={!texto.trim()||enviando} className="btn-primary">{enviando?'…':'Enviar'}</button></form></>}
 {error&&<p role="alert" style={{color:'#ffb5b5'}}>{error}</p>}
 <p style={{fontSize:12,color:'#c4b9dc',marginBottom:0}}>Chat privado de CodiKids. La profesora responde cuando esté disponible. No compartas contraseñas ni datos personales.</p>
 </section>
 if(esDocente)return panel
 return <div style={{position:'fixed',bottom:16,right:16,zIndex:1000,maxWidth:'calc(100vw - 32px)'}}>{abierto?panel:<button className="btn-primary" onClick={()=>setAbierto(true)} style={{borderRadius:40,padding:'14px 20px',boxShadow:'0 8px 24px #0006'}}>💬 ¿Necesitas ayuda?</button>}</div>
}
