import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'node:crypto'
import { requireAdmin } from './_auth.js'

const BUCKET = 'codikids-family-reviews'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const clean = value => typeof value === 'string' ? Array.from(value).filter(c => { const n=c.codePointAt(0); return n!==127 && (n>=32 || n===9 || n===10) }).join('').trim() : ''
const missing = error => ['404', 'NoSuchBucket', 'not_found'].includes(String(error?.statusCode || error?.status || error?.code)) || /not found|does not exist/i.test(error?.message || '')
const duplicate = error => ['409', 'Duplicate', 'ResourceAlreadyExists'].includes(String(error?.statusCode || error?.status || error?.code)) || /already exists|duplicate/i.test(error?.message || '')

export function createReviewsHandler({ makeClient, authorize = requireAdmin, now = () => Date.now(), secret = () => process.env.SUPABASE_SERVICE_KEY } = {}) {
 return async function handler(req, res) {
  res.setHeader('Allow', 'GET, POST, DELETE')
  res.setHeader('Cache-Control', 'no-store')
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) return res.status(405).json({ error:'Método no permitido.' })
  try {
   if (req.method === 'DELETE') {
    const auth = await authorize(req,res)
    if (!auth) return
    const id = clean(req.body?.id)
    if (!UUID.test(id)) return res.status(400).json({error:'Comentario no válido.'})
    const { error } = await auth.supabaseAdmin.storage.from(BUCKET).remove([`reviews/${id}.json`])
    if (error) throw error
    return res.status(200).json({ ok:true })
   }
   if (req.method === 'POST') {
    const body=req.body || {}
    if (body.website) return res.status(400).json({error:'No se pudo enviar. Recarga la página e inténtalo de nuevo.'})
    const displayName=clean(body.displayName),comment=clean(body.comment),id=clean(body.requestId)
    if (body.consent !== true) return res.status(400).json({error:'Debes autorizar la publicación para compartir tu experiencia.'})
    if (displayName.length<2 || displayName.length>70 || comment.length<20 || comment.length>1000 || !UUID.test(id)) return res.status(400).json({error:'Revisa el nombre (2 a 70 caracteres) y el comentario (20 a 1000 caracteres).'})
    const elapsed=Number(body.elapsedMs)
    if (!Number.isFinite(elapsed) || elapsed<2000 || elapsed>86400000) return res.status(400).json({error:'Recarga el formulario y vuelve a enviar tu comentario.'})
    const client=makeClient(),storage=client.storage
    const {error:bucketError}=await storage.getBucket(BUCKET)
    if (bucketError) {
     if (!missing(bucketError)) throw bucketError
     const {error}=await storage.createBucket(BUCKET,{public:false,fileSizeLimit:8192,allowedMimeTypes:['application/json']})
     if (error && !duplicate(error)) throw error
    }
    const bucket=storage.from(BUCKET)
    const {data:existing,error:existingError}=await bucket.download(`reviews/${id}.json`)
    if (existing) return res.status(200).json({ok:true,id,alreadySubmitted:true})
    if (existingError && !missing(existingError)) throw existingError
    // One review per connection per day. Raw IP addresses are never stored or published.
    const forwarded=req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress
    if (!forwarded) return res.status(503).json({error:'No se pudo verificar la conexión. Vuelve a intentarlo.'})
    const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now()))
    const fingerprint=createHmac('sha256',secret()).update(String(forwarded).split(',')[0].trim()+'|'+day).digest('hex')
    const limitPath=`limits/${day}-${fingerprint}.json`
    const {error:limitError}=await bucket.upload(limitPath,JSON.stringify({id,createdAt:new Date(now()).toISOString()}),{contentType:'application/json',upsert:false})
    if (limitError) {
     if (duplicate(limitError)) return res.status(429).json({error:'Ya se envió un comentario desde esta conexión hoy. Si necesitas corregirlo, escríbenos por WhatsApp.'})
     throw limitError
    }
    const review={id,displayName,comment,createdAt:new Date(now()).toISOString(),consent:true,consentVersion:'2026-11-25'}
    const {error}=await bucket.upload(`reviews/${id}.json`,JSON.stringify(review),{contentType:'application/json',upsert:false})
    if (error) {
     await bucket.remove([limitPath])
     if (duplicate(error)) return res.status(200).json({ok:true,id,alreadySubmitted:true})
     throw error
    }
    return res.status(201).json({ok:true,id})
   }
   const client=makeClient(),bucket=client.storage.from(BUCKET)
   const {data:files,error}=await bucket.list('reviews',{limit:100,sortBy:{column:'created_at',order:'desc'}})
   if (error) {
    if (missing(error)) return res.status(200).json({reviews:[]})
    throw error
   }
   const reviews=[]
   // Bound concurrency and read only review objects, never connection limits.
   const names=(files || []).filter(f=>UUID.test(f.name.replace(/\.json$/,'')) && f.name.endsWith('.json'))
   for(let i=0;i<names.length;i+=8) {
    const batch=await Promise.all(names.slice(i,i+8).map(async file=>{
     const {data,error}=await bucket.download(`reviews/${file.name}`)
     if(error) {
      if(missing(error))return null
      throw error
     }
     let value
     try{value=JSON.parse(await data.text())}catch{return null}
     if(value?.consent!==true || !UUID.test(value.id) || !clean(value.displayName) || !clean(value.comment) || !Number.isFinite(Date.parse(value.createdAt)))return null
     return {id:value.id,displayName:clean(value.displayName).slice(0,70),comment:clean(value.comment).slice(0,1000),createdAt:value.createdAt}
    }))
    reviews.push(...batch.filter(Boolean))
   }
   reviews.sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))
   return res.status(200).json({reviews})
  } catch {
   return res.status(503).json({error:'Los comentarios no están disponibles en este momento. Inténtalo más tarde o escríbenos por WhatsApp.'})
  }
 }
}

export default createReviewsHandler({makeClient:()=>{
 const url=process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_KEY
 if(!url || !key)throw Error('Server configuration incomplete')
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
}})
