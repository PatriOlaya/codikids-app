import {test} from 'node:test'
import assert from 'node:assert/strict'
import {RUTAS,ejecutarRuta} from '../src/games/nucitaRutas.js'

test('La plaza acepta programas distintos que colocan exactamente tres banderines',()=>{
 assert.equal(ejecutarRuta('fiesta',0,{repetir:3,sumar:1}).ok,true)
 assert.equal(ejecutarRuta('fiesta',0,{repetir:1,sumar:3}).ok,true)
 assert.equal(ejecutarRuta('fiesta',0,{repetir:2,sumar:2}).total,4)
 assert.equal(ejecutarRuta('fiesta',0,{repetir:2,sumar:2}).ok,false)
})
test('El puente requiere cuatro reflectores en parejas y el mensaje del sensor',()=>{
 assert.equal(ejecutarRuta('sendero',0,{repetir:4,sumar:1}).ok,false)
 assert.equal(ejecutarRuta('sendero',0,{repetir:2,sumar:2}).ok,true)
 assert.equal(ejecutarRuta('sendero',1,{condicion:'oscuridad',mensaje:'abrir_puente'}).ok,false)
 assert.equal(ejecutarRuta('sendero',1,{condicion:'luz',mensaje:'abrir_puente'}).ok,true)
})
test('La fiesta solo se inaugura con los tres banderines y el mensaje correcto',()=>{
 assert.equal(ejecutarRuta('fiesta',1,{condicion:'Banderines = 0',mensaje:'fiesta_lista'}).ok,false)
 assert.equal(ejecutarRuta('fiesta',1,{condicion:'Banderines = 3',mensaje:'guardar_farol'}).ok,false)
 assert.equal(ejecutarRuta('fiesta',1,{condicion:'Banderines = 3',mensaje:'fiesta_lista'}).ok,true)
 assert.equal(new Set(Object.values(RUTAS).flatMap(r=>r.finales.map(f=>f.id))).size,4)
})
