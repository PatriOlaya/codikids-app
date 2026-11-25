import { requireAdmin } from './_auth.js'

const validId = id => typeof id==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
export function accessEnabled(user,now=Date.now()) {
 return Boolean(user && user.app_metadata?.codikids_access_disabled!==true && !(user.banned_until && Date.parse(user.banned_until)>now))
}
export function createStudentAccessHandler({authorize=requireAdmin,now=()=>Date.now()}={}) {
 return async function handler(req,res) {
  res.setHeader('Allow','GET, POST');res.setHeader('Cache-Control','no-store')
  if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Método no permitido.'})
  try {
   const auth=await authorize(req,res);if(!auth)return
   const id=req.method==='GET'?req.query?.studentId:req.body?.studentId
   if(!validId(id))return res.status(400).json({error:'Selecciona un estudiante válido.'})
   if(req.method==='POST' && typeof req.body?.enabled!=='boolean')return res.status(400).json({error:'Indica si quieres cerrar o reactivar el acceso.'})
   const {data:student,error:studentError}=await auth.supabaseAdmin.from('estudiantes').select('id,nombre').eq('id',id).single()
   if(studentError || !student)return res.status(404).json({error:'No se encontró ese estudiante.'})
   const {data,error}=await auth.supabaseAdmin.auth.admin.getUserById(id)
   if(error || !data?.user)return res.status(404).json({error:'No se encontró la cuenta del estudiante.'})
   const target=data.user
   const adminEmail=(process.env.ADMIN_EMAIL || 'patriciaolaya23@gmail.com').trim().toLowerCase()
   if(id===auth.user?.id || target.email?.toLowerCase()===adminEmail)return res.status(403).json({error:'Esta opción solo cambia el acceso de estudiantes.'})
   if(req.method==='GET')return res.status(200).json({studentId:id,enabled:accessEnabled(target,now()),changedAt:target.app_metadata?.codikids_access_changed_at || null})
   const enabled=req.body.enabled
   const {data:updated,error:updateError}=await auth.supabaseAdmin.auth.admin.updateUserById(id,{
    ban_duration:enabled?'none':'876000h',
    app_metadata:{...target.app_metadata,codikids_access_disabled:!enabled,codikids_access_changed_at:new Date(now()).toISOString()},
   })
   if(updateError || !updated?.user)throw Error('Update failed')
   return res.status(200).json({studentId:id,enabled:accessEnabled(updated.user,now()),changedAt:updated.user.app_metadata?.codikids_access_changed_at || null})
  }catch{return res.status(503).json({error:'No se pudo cambiar el acceso. Inténtalo de nuevo.'})}
 }
}
export default createStudentAccessHandler()
