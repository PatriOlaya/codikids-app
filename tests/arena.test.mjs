import {test} from 'node:test'
import assert from 'node:assert/strict'
import {ARENAS,PREGUNTAS,preguntaPara,premiar,plataformasPara} from '../src/games/arena.js'
test('Todas las preguntas tienen una sola respuesta correcta después de mezclar',()=>{for(let r=0;r<4;r++)for(let i=0;i<PREGUNTAS.length;i++){const q=preguntaPara(i,r);assert.equal(q.opciones.filter(o=>o.correcta).length,1);assert.equal(new Set(q.opciones.map(o=>o.texto)).size,3);assert.ok(q.explicacion)}})
test('Puntos y vidas respetan límites y solo premian respuestas correctas',()=>{const s={puntos:0,vidas:5,aciertos:0};assert.deepEqual(premiar(s,true),{puntos:100,vidas:5,aciertos:1});assert.deepEqual(premiar({...s,vidas:1},false),{puntos:0,vidas:0,aciertos:0});assert.equal(s.puntos,0)})
test('Cada salto entre islas tiene un hueco alcanzable con la velocidad e impulso del personaje',()=>{for(let r=0;r<4;r++){const ps=plataformasPara(r);assert.ok(ps.length>ARENAS[r].objetivo);for(let i=1;i<ps.length;i++){const a=ps[i-1],b=ps[i],dy=b.y-a.y;const t=(8.5+Math.sqrt(8.5**2-2*22*dy))/22;const dx=Math.max(0,Math.abs(b.x-a.x)-(a.w+b.w)/2),dz=Math.max(0,Math.abs(b.z-a.z)-(a.d+b.d)/2);assert.ok(Math.hypot(dx,dz)+.5<4.4*t,`Salto ${i} en arena ${r}`)}}})

test('El pedestal bloquea el paso a nivel de la isla y deja espacio para rodearlo', async ()=>{
 const {chocaConBlanco}=await import('../src/games/arena.js')
 const blanco={x:2,y:3,z:-5.7}
 assert.equal(chocaConBlanco(2,.54,-5.7,blanco),true)
 assert.equal(chocaConBlanco(2,.54,-4.9,blanco),true)
 assert.equal(chocaConBlanco(3.2,.54,-5.7,blanco),false)
 assert.equal(chocaConBlanco(2,-3,-5.7,blanco),false)
})
