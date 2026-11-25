import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createReviewsHandler } from '../api/reviews.js'

const ID='a1111111-1111-4111-8111-111111111111',ID2='b2222222-2222-4222-8222-222222222222'
const clock=Date.parse('2026-11-25T20:00:00Z')
const missing={statusCode:'404',message:'Object not found'},duplicate={statusCode:'409',message:'Already exists'}
function setup({exists=true,failReview=false,allowAdmin=false}={}){
 const objects=new Map(),created=[]
 const bucket={
  download:async path=>objects.has(path)?{data:new Blob([objects.get(path)])}:{error:missing},
  upload:async(path,content)=>{if(failReview&&path.startsWith('reviews/'))return{error:{message:'Storage unavailable'}};if(objects.has(path))return{error:duplicate};objects.set(path,content);return{data:{path}}},
  list:async folder=>exists?{data:[...objects.keys()].filter(p=>p.startsWith(folder+'/')).map(p=>({name:p.split('/')[1]}))}:{error:{statusCode:'404',message:'Bucket not found'}},
  remove:async paths=>{for(const path of paths)objects.delete(path);return{data:paths}},
 }
 const client={storage:{from:()=>bucket,getBucket:async()=>exists?{data:{public:false}}:{error:{statusCode:'404',message:'Bucket not found'}},createBucket:async(name,options)=>{exists=true;created.push({name,options});return{data:{name}}}}}
 const handler=createReviewsHandler({makeClient:()=>client,now:()=>clock,secret:()=> 'test-only-secret',authorize:async(req,res)=>{if(!allowAdmin){res.status(401).json({error:'Unauthorized'});return null}return{supabaseAdmin:client}}})
 async function request(method='GET',body={},ip='203.0.113.22'){
  const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(data){this.body=data;return this}}
  await handler({method,body,headers:{'x-vercel-forwarded-for':ip}},res);return res
 }
 const payload={displayName:'Familia de prueba',comment:'Comentario de prueba utilizado solamente en pruebas locales.',consent:true,elapsedMs:10000,requestId:ID}
 return{objects,created,request,payload}
}
test('No publica sin autorización explícita, texto válido, UUID y tiempo de formulario',async()=>{
 const s=setup()
 for(const update of [{consent:false},{consent:'true'},{displayName:' '},{comment:'corto'},{comment:'x'.repeat(1001)},{requestId:'../secret'},{website:'bot.example'},{elapsedMs:0},{elapsedMs:'invalid'}])assert.equal((await s.request('POST',{...s.payload,...update})).code,400)
 assert.equal(s.objects.size,0)
})
test('Publica de inmediato, crea almacenamiento privado y expone solo el comentario autorizado',async()=>{
 const s=setup({exists:false});assert.deepEqual((await s.request()).body.reviews,[])
 const posted=await s.request('POST',s.payload);assert.equal(posted.code,201)
 assert.equal(s.created.length,1);assert.equal(s.created[0].options.public,false)
 const result=await s.request();assert.equal(result.headers['Cache-Control'],'no-store');assert.equal(result.body.reviews.length,1)
 assert.deepEqual(Object.keys(result.body.reviews[0]).sort(),['comment','createdAt','displayName','id'])
 assert.equal(result.body.reviews[0].comment,s.payload.comment)
 assert.ok(!JSON.stringify([...s.objects.values()]).includes('203.0.113.22'))
})
test('Un reintento de la misma publicación no duplica ni pierde el comentario',async()=>{
 const s=setup();await s.request('POST',s.payload)
 const again=await s.request('POST',s.payload);assert.equal(again.code,200);assert.equal(again.body.alreadySubmitted,true)
 assert.equal((await s.request()).body.reviews.length,1)
})
test('Limita publicaciones repetidas y resuelve envíos simultáneos',async()=>{
 const s=setup();const results=await Promise.all([s.request('POST',s.payload),s.request('POST',{...s.payload,requestId:ID2})])
 assert.deepEqual(results.map(r=>r.code).sort(),[201,429]);assert.equal((await s.request()).body.reviews.length,1)
})
test('Fallo de almacenamiento permite reintentar y nunca informa éxito falso',async()=>{
 const s=setup({failReview:true});assert.equal((await s.request('POST',s.payload)).code,503)
 assert.equal(s.objects.size,0)
})
test('Solo la administradora puede retirar comentarios y el cambio es público de inmediato',async()=>{
 const s=setup({allowAdmin:true});await s.request('POST',s.payload)
 assert.equal((await s.request('DELETE',{id:'../invalid'})).code,400)
 assert.equal((await s.request('DELETE',{id:ID})).code,200);assert.equal((await s.request()).body.reviews.length,0)
 const denied=setup();assert.equal((await denied.request('DELETE',{id:ID})).code,401)
})
test('No expone archivos no autorizados ni objetos de límites de conexión',async()=>{
 const s=setup();s.objects.set(`reviews/${ID}.json`,JSON.stringify({id:ID,displayName:'Sin permiso',comment:'No debe aparecer',consent:false,createdAt:new Date(clock).toISOString()}))
 s.objects.set('reviews/not-a-review.json','{}');s.objects.set('limits/private.json','{"private":"never expose"}')
 assert.deepEqual((await s.request()).body.reviews,[])
})
