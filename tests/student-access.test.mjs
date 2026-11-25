import { test } from 'node:test'
import assert from 'node:assert/strict'
import { accessEnabled, createStudentAccessHandler } from '../api/student-access.js'
import { createStudentStatusHandler } from '../api/student-status.js'
const id='a1111111-1111-4111-8111-111111111111',adminId='b2222222-2222-4222-8222-222222222222',clock=Date.parse('2026-11-25T20:00:00Z')
function response(){return{code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(v){this.body=v;return this}}}
function setup({authorized=true,student=true,fail=false,self=false}={}){
 let target={id,email:self?'patriciaolaya23@gmail.com':'student@example.invalid',app_metadata:{provider:'email',preserved:'keep'}};const updates=[]
 const client={
  from:()=>({select:()=>({eq:()=>({single:async()=>student?{data:{id,nombre:'Prueba'}}:{error:{message:'Missing'}}})})}),
  auth:{
   getUser:async()=>({data:{user:{id,app_metadata:{}}}}),
   admin:{
    getUserById:async()=>({data:{user:target}}),
    updateUserById:async(userId,fields)=>{
     updates.push({userId,fields})
     if(fail)return{error:{message:'Unavailable'}}
     target={...target,app_metadata:fields.app_metadata,banned_until:fields.ban_duration==='none'?null:'2126-11-25T20:00:00Z'}
     return{data:{user:target}}
    },
   },
  },
 }

 const authorize=async(req,res)=>{if(!authorized){res.status(401).json({error:'Unauthorized'});return null}return{supabaseAdmin:client,user:{id:adminId}}}
 const handler=createStudentAccessHandler({authorize,now:()=>clock}),status=createStudentStatusHandler({makeClient:()=>client,now:()=>clock})
 async function request(method,body={}){const res=response();await handler({method,body,query:{studentId:id}},res);return res}
 async function current(token='test-token'){const res=response();await status({method:'GET',headers:{authorization:token?'Bearer '+token:''}},res);return res}
 return{updates,request,current}
}
test('Cerrar y reactivar conserva metadatos y no borra progreso ni proyectos',async()=>{
 const s=setup();assert.equal((await s.request('GET')).body.enabled,true)
 const close=await s.request('POST',{studentId:id,enabled:false});assert.equal(close.code,200);assert.equal(close.body.enabled,false)
 assert.equal(s.updates[0].fields.ban_duration,'876000h');assert.equal(s.updates[0].fields.app_metadata.preserved,'keep')
 assert.equal((await s.request('GET')).body.enabled,false)
 const open=await s.request('POST',{studentId:id,enabled:true});assert.equal(open.body.enabled,true);assert.equal(s.updates[1].fields.ban_duration,'none')
})
test('La autorización es administrativa y no se permite cerrar la cuenta administradora',async()=>{
 const denied=setup({authorized:false});assert.equal((await denied.request('POST',{studentId:id,enabled:false})).code,401);assert.equal(denied.updates.length,0)
 const self=setup({self:true});assert.equal((await self.request('POST',{studentId:id,enabled:false})).code,403);assert.equal(self.updates.length,0)
})
test('Solo modifica estudiantes existentes y rechaza estados ambiguos',async()=>{
 const missing=setup({student:false});assert.equal((await missing.request('POST',{studentId:id,enabled:false})).code,404)
 const s=setup();for(const body of [{studentId:'bad',enabled:false},{studentId:id,enabled:'false'},{studentId:id}])assert.equal((await s.request('POST',body)).code,400)
 assert.equal(s.updates.length,0)
})
test('Una falla no informa cierre exitoso',async()=>{
 const s=setup({fail:true});assert.equal((await s.request('POST',{studentId:id,enabled:false})).code,503);assert.equal((await s.request('GET')).body.enabled,true)
})
test('La sesión abierta se comprueba contra el estado actual, no contra el JWT antiguo',async()=>{
 const s=setup();assert.equal((await s.current()).body.enabled,true)
 await s.request('POST',{studentId:id,enabled:false});assert.equal((await s.current()).code,403)
 await s.request('POST',{studentId:id,enabled:true});assert.equal((await s.current()).body.enabled,true)
 assert.equal((await s.current('')).code,401)
})
test('La comprobación considera veto vigente, bandera administrativa y ausencia de cuenta',()=>{
 assert.equal(accessEnabled(undefined,clock),false);assert.equal(accessEnabled({banned_until:'2126-01-01'},clock),false);assert.equal(accessEnabled({app_metadata:{codikids_access_disabled:true}},clock),false);assert.equal(accessEnabled({banned_until:'2020-01-01'},clock),true)
})
