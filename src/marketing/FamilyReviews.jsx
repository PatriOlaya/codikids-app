import { useEffect, useRef, useState } from 'react'
import { whatsapp } from './content'
import './family-reviews.css'

export function ReviewsList({ admin=false, token, onRemoved }) {
 const [reviews,setReviews]=useState([]),[status,setStatus]=useState('loading'),[visible,setVisible]=useState(6),[deleting,setDeleting]=useState(''),[message,setMessage]=useState('')
 useEffect(()=>{
  const controller=new AbortController()
  async function load(){
   try{
    const r=await fetch('/api/reviews',{signal:controller.signal,cache:'no-store'}),data=await r.json()
    if(!r.ok || !Array.isArray(data.reviews))throw Error('Unavailable')
    setReviews(data.reviews);setStatus('ready')
   }catch(e){if(e.name!=='AbortError')setStatus('error')}
  }
  load()
  const focus=()=>{if(!document.hidden)load()};window.addEventListener('focus',focus)
  return()=>{controller.abort();window.removeEventListener('focus',focus)}
 },[])
 async function remove(review){
  if(!window.confirm(`¿Retirar el comentario de ${review.displayName} de la página?`))return
  setDeleting(review.id);setMessage('')
  try{
   const accessToken=await token()
   const r=await fetch('/api/reviews',{method:'DELETE',headers:{'Content-Type':'application/json',Authorization:`Bearer ${accessToken}`},body:JSON.stringify({id:review.id})})
   if(!r.ok)throw Error('No se pudo retirar el comentario. Vuelve a intentarlo.')
   setReviews(all=>all.filter(item=>item.id!==review.id));setMessage('Comentario retirado.');onRemoved?.()
  }catch(e){setMessage(e.message)}finally{setDeleting('')}
 }
 return <>
  {status==='loading' && <p role="status">Cargando experiencias de las familias…</p>}
  {status==='error' && <p role="status">No pudimos cargar los comentarios. Intenta de nuevo más tarde.</p>}
  {status==='ready' && reviews.length===0 && <div className="fr-empty"><span aria-hidden="true">“</span><p>Este espacio está listo para las experiencias de nuestras familias.</p><p>¿Tu hijo ya ha tenido clases en CODIKIDS? Nos encantará leer cómo las ha vivido.</p></div>}
  {!!reviews.length && <div className="fr-grid">{reviews.slice(0,visible).map(r=><article className="fr-review" key={r.id}><span className="fr-quote" aria-hidden="true">“</span><blockquote>{r.comment}</blockquote><footer><span className="fr-avatar" aria-hidden="true">{Array.from(r.displayName)[0]?.toLocaleUpperCase('es')}</span><div><strong>{r.displayName}</strong><time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleDateString('es-CO',{month:'long',year:'numeric',timeZone:'America/Bogota'})}</time></div></footer>{admin && <button type="button" disabled={!!deleting} onClick={()=>remove(r)}>{deleting===r.id?'Retirando…':'Retirar de la página'}</button>}</article>)}</div>}
  {visible<reviews.length && <button className="fr-more" type="button" onClick={()=>setVisible(v=>v+6)}>Ver más comentarios</button>}
  {message && <p role="status">{message}</p>}
 </>
}
export default function FamilyReviews() {
 return <section className="m-section fr-section" id="familias" aria-labelledby="fr-heading"><span className="m-label">VOCES DE NUESTRAS FAMILIAS</span><h2 id="fr-heading">Cada proyecto tiene una historia detrás.</h2><p>Las familias comparten, con sus propias palabras, su experiencia en CODIKIDS.</p><ReviewsList/><a className="m-secondary fr-share" href="/comparte-tu-experiencia">Compartir mi experiencia ↗</a></section>
}
export function ReviewForm() {
 const [name,setName]=useState(''),[comment,setComment]=useState(''),[consent,setConsent]=useState(false),[website,setWebsite]=useState(''),[sending,setSending]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('')
 const startedAt=useRef(null),requestId=useRef(null),success=useRef(null)
 useEffect(()=>{startedAt.current=Date.now();requestId.current=crypto.randomUUID()},[])
 useEffect(()=>{if(done)success.current?.focus()},[done])
 async function submit(e){
  e.preventDefault();if(sending)return;setError('');setSending(true)
  try{
   const r=await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({displayName:name,comment,consent,website,elapsedMs:Date.now()-startedAt.current,requestId:requestId.current})})
   const data=await r.json()
   if(!r.ok)throw Error(data.error || 'No se pudo enviar. Vuelve a intentarlo.')
   setDone(true)
  }catch(e){setError(e.message || 'Revisa tu conexión y vuelve a intentar.')}finally{setSending(false)}
 }
 return <section className="m-section fr-form-section">
  {done?<div className="fr-success" ref={success} tabIndex="-1"><span aria-hidden="true">✦</span><h1>¡Gracias por compartir tu experiencia!</h1><p>Tu comentario ya fue publicado en la página de CODIKIDS con el nombre que elegiste.</p><a className="m-button" href="/#familias">Ver mi comentario →</a></div>:<>
   <span className="m-label">FAMILIAS CODIKIDS</span><h1>Tu experiencia inspira a otras familias.</h1><p>Cuéntanos cómo ha sido aprender con CODIKIDS. Puedes hablar de lo que disfruta tu hijo, su proyecto o lo que ha aprendido. Comparte con libertad lo que piensas.</p>
   <form className="fr-form" onSubmit={submit}>
    <label htmlFor="fr-name">¿Con qué nombre quieres aparecer?</label><input id="fr-name" name="displayName" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={70} autoComplete="nickname" placeholder="Ej.: Carolina, mamá de un estudiante" required aria-describedby="fr-name-help"/><small id="fr-name-help">Puedes usar solo tu primer nombre o un alias. No incluyas el nombre completo de tu hijo.</small>
    <label htmlFor="fr-comment">Tu experiencia en CODIKIDS</label><textarea id="fr-comment" name="comment" value={comment} onChange={e=>setComment(e.target.value)} minLength={20} maxLength={1000} rows={6} placeholder="¿Cómo han vivido las clases? ¿Qué te gustaría contarle a otra familia?" required aria-describedby="fr-comment-help"/><small id="fr-comment-help">Entre 20 y 1000 caracteres. Evita teléfonos, direcciones o datos personales de niños. <span>{comment.length}/1000</span></small>
    <div className="fr-honeypot" aria-hidden="true"><label htmlFor="fr-website">Sitio web</label><input id="fr-website" name="website" value={website} onChange={e=>setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"/></div>
    <label className="fr-consent"><input type="checkbox" name="consent" checked={consent} onChange={e=>setConsent(e.target.checked)} required/><span>Autorizo a CODIKIDS a publicar este comentario y el nombre que escribí en su página web.</span></label>
    <p className="fr-publish-note">Al enviarlo, tu comentario aparecerá directamente en la página. Si después quieres corregirlo o retirarlo, <a href={whatsapp}>escríbenos por WhatsApp</a>.</p>
    {error && <p className="fr-error" role="alert">{error}</p>}
    <button className="m-button" type="submit" disabled={sending}>{sending?'Publicando tu comentario…':'Publicar mi experiencia ↗'}</button>
   </form>
  </>}
 </section>
}
