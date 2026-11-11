import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nuevaAventura, desbloqueado, evaluarPrograma } from '../src/games/nucita.js'

test('Nucita necesita sus pistas antes de programar y avanzar',()=>{
 const s=nuevaAventura()
 assert.equal(desbloqueado('camino',s),false)
 s.pistas.push('huellas','hoja')
 assert.equal(desbloqueado('camino',s),true)
 assert.equal(desbloqueado('pio',s),false)
 s.camino=true
 assert.equal(desbloqueado('pio',s),true)
 s.pio=true
 assert.equal(desbloqueado('farol',s),false)
 s.pistas.push('cinta')
 assert.equal(desbloqueado('farol',s),true)
})
test('La secuencia, el mensaje y la condición deben coincidir con el objetivo',()=>{
 assert.equal(evaluarPrograma('camino',['evento','disfraz','mensaje']),true)
 assert.equal(evaluarPrograma('camino',['disfraz','evento','mensaje']),false)
 assert.equal(evaluarPrograma('pio',['llamar']),true)
 assert.equal(evaluarPrograma('pio',['saludar']),false)
 assert.equal(evaluarPrograma('farol',['moneda','luz']),true)
 assert.equal(evaluarPrograma('farol',['tocar','luz']),false)
})
