import { createClient } from '@supabase/supabase-js'
import { accessEnabled } from './student-access.js'
export function createStudentStatusHandler({makeClient,now=()=>Date.now()}) {
 return async function handler(req,res){
  res.setHeader('Allow','GET');res.setHeader('Cache-Control','no-store')
  if(req.method!=='GET')return res.status(405).json({error:'Método no permitido.'})
  const header=req.headers.authorization || '',token=header.startsWith('Bearer ')?header.slice(7):''
  if(!token)return res.status(401).json({error:'Inicia sesión para continuar.'})
  try{
   const client=makeClient(),{data,error}=await client.auth.getUser(token)
   if(error?.code==='user_banned' || /banned/i.test(error?.message || ''))return res.status(403).json({enabled:false,error:'Tu acceso a CODIKIDS está en pausa. Comunícate con la academia para retomarlo.'})
   if(error || !data?.user)return res.status(401).json({error:'Tu sesión no está disponible. Inicia sesión de nuevo.'})
   // Read the current account on the server, not stale claims in a previously issued JWT.
   const {data:current,error:currentError}=await client.auth.admin.getUserById(data.user.id)
   if(currentError || !current?.user)throw Error('Unavailable')
   if(!accessEnabled(current.user,now()))return res.status(403).json({enabled:false,error:'Tu acceso a CODIKIDS está en pausa. Comunícate con la academia para retomarlo.'})
   return res.status(200).json({enabled:true})
  }catch{return res.status(503).json({error:'No pudimos comprobar tu acceso. Revisa tu conexión e inténtalo de nuevo.'})}
 }
}
export default createStudentStatusHandler({makeClient:()=>{
 const url=process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_KEY
 if(!url || !key)throw Error('Server configuration incomplete')
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
}})
