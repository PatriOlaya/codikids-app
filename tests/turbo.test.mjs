import {test} from 'node:test'
import assert from 'node:assert/strict'
import {CatmullRomCurve3,Vector3} from 'three'
import {PISTAS_TURBO,VUELTAS_TURBO,iniciarCarrera,avanzarTurbo,sectorTurbo} from '../src/games/turbo.js'
const opciones=['ritmo','curva','turbo']
for(const pista of PISTAS_TURBO)test(`Dos vueltas y medalla alcanzables: ${pista.nombre}`,()=>{
 const c=new CatmullRomCurve3(pista.nodos.map(n=>new Vector3(...n)),true,'centripetal')
 c.arcLengthDivisions=600;c.updateArcLengths()
 const largo=c.getLength();let mejor=Infinity
 for(const a of opciones)for(const b of opciones)for(const c of opciones)for(const d of opciones){
  let s=iniciarCarrera()
  while(s.tiempo<65&&!s.fin)s=avanzarTurbo(s,{dt:1/60,largo,pista,modo:'programa',ordenes:[a,b,c,d],controles:{}})
  assert.equal(s.fin,true);assert.equal(s.distancia,largo*VUELTAS_TURBO)
  mejor=Math.min(mejor,s.tiempo)
 }
 assert.ok(mejor<=pista.meta)
})
test('Turbo gasta energía, frenar reduce velocidad y el sector se reinicia al dar una vuelta',()=>{
 const base={dt:.05,largo:240,pista:PISTAS_TURBO[0],modo:'manual',ordenes:[]}
 const s={...iniciarCarrera(),velocidad:15}
 const turbo=avanzarTurbo(s,{...base,controles:{acel:true,turbo:true}})
 const freno=avanzarTurbo(s,{...base,controles:{freno:true,turbo:true}})
 assert.ok(turbo.velocidad>s.velocidad&&turbo.energia<s.energia)
 assert.ok(freno.velocidad<s.velocidad&&freno.energia===100)
 assert.equal(sectorTurbo(240,240),0)
})
