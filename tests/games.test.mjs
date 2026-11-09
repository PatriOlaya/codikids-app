import { test } from 'node:test'
import assert from 'node:assert/strict'
import { RETOS, DIRS, iniciar, mover, victoria } from '../src/games/robot.js'
import { CIRCUITOS, crearCircuito, conectado } from '../src/games/circuitos.js'
for (const r of RETOS) test(`Ruta resoluble: ${r.nombre}`,()=>{
 const queue=[{s:iniciar(r),path:[]}],seen=new Set();let solucion
 while(queue.length){const {s,path}=queue.shift();if(victoria(r,s)){solucion=path;break}if(s.paso>=r.limite)continue;for(const d of Object.keys(DIRS)){const t=mover(r,s,d);if(!t.estado)continue;const n=t.estado,k=JSON.stringify([n.x,n.y,n.paso,n.llave,[...n.baterias].sort()]);if(!seen.has(k)){seen.add(k);queue.push({s:n,path:[...path,d]})}}}
 assert.ok(solucion);assert.ok(solucion.length<=r.limite)
})
test('La puerta bloquea sin llave y el láser exige un paso par',()=>{
 const r={mapa:['SDXG'],limite:8};assert.match(mover(r,iniciar(r),'derecha').error,/llave/)
 assert.match(mover({...r,mapa:['SX.G']},iniciar(r),'derecha').error,/Láser/)
 const s=mover({...r,mapa:['SX.G']},iniciar(r),'esperar').estado;assert.ok(mover({...r,mapa:['SX.G']},s,'derecha').estado)
})
test('No gana sin baterías ni permite superar la energía',()=>{
 const r={mapa:['SBG'],limite:1};assert.equal(victoria(r,{x:2,y:0,baterias:[]}),false);const s=mover(r,iniciar(r),'derecha').estado;assert.match(mover(r,s,'derecha').error,/energía/)
})
for (const c of CIRCUITOS) test(`Circuito completo y orientación obligatoria: ${c.nombre}`,()=>{
 const p=crearCircuito(c);for(const v of p)if(v)v.rot=0
 assert.equal(conectado(c,p).gana,true)
 p[c.path[0]].rot=1;assert.equal(conectado(c,p).gana,false)
})
