export const DIRS = { arriba:[0,-1], derecha:[1,0], abajo:[0,1], izquierda:[-1,0], esperar:[0,0] }
export const ICONOS = {arriba:'↑',derecha:'→',abajo:'↓',izquierda:'←',esperar:'⏳'}
// Cada tablero incorpora una regla nueva. Las filas describen obstáculos reales.
export const RETOS = [
 {nombre:'Rescate orbital',regla:'Llega al portal con un máximo de 6 movimientos.',mapa:['S..#','##.#','...G'],limite:6,color:'#68dac4'},
 {nombre:'Carga de energía',regla:'Recoge las dos baterías antes del portal. Máximo 9 movimientos.',mapa:['S.B.','.##.','B..G'],limite:9,color:'#78bfff'},
 {nombre:'La puerta sellada',regla:'Recoge la llave para atravesar la puerta D. Máximo 10 movimientos.',mapa:['S.K#','##.#','...D','G###'],limite:10,color:'#c59aff'},
 {nombre:'El puente láser',regla:'El láser X solo se apaga en pasos pares. Usa Esperar para sincronizarte.',mapa:['SX..G','#####'],limite:7,color:'#ffb36a'},
 {nombre:'Salto dimensional',regla:'Entrar en P te transporta a Q. Recoge B antes de llegar.',mapa:['S.P##','#####','QB..G'],limite:8,color:'#ff8fcb'},
 {nombre:'Pista de hielo',regla:'En I sigues deslizándote en la misma dirección hasta salir del hielo.',mapa:['SIII.','####.','G.B..'],limite:7,color:'#8bdef1'},
 {nombre:'Doble seguridad',regla:'Recoge la llave, cruza D y sincroniza X con pasos pares.',mapa:['S.K##','##D##','..X.G','B####'],limite:13,color:'#ffe08b'},
 {nombre:'Operación maestra',regla:'Combina baterías, llave, puerta y teletransporte sin superar 13 pasos.',mapa:['SK.P##','######','QB.D.G','##B###'],limite:13,color:'#aaf5a5'},
]
export function iniciar(reto){let x=0,y=0;reto.mapa.forEach((r,j)=>[...r].forEach((v,i)=>{if(v==='S'){x=i;y=j}}));return {x,y,paso:0,baterias:[],llave:false}}
export function mover(reto,estado,dir){
 const delta=DIRS[dir];if(!delta)return {error:'Instrucción desconocida.'}
 const s={...estado,baterias:[...estado.baterias],paso:estado.paso+1}
 if(s.paso>reto.limite)return {error:'Se agotó tu energía. Busca una ruta más corta.'}
 let x=s.x+delta[0],y=s.y+delta[1]
 const celda=(a,b)=>reto.mapa[b]?.[a]||'#'
 const entrar=(a,b)=>{
  const c=celda(a,b)
  if(c==='#')return 'Hay un muro. Revisa este paso.'
  if(c==='D'&&!s.llave)return 'La puerta necesita la llave.'
  if(c==='X'&&s.paso%2!==0)return 'Láser encendido: debe ser un paso par. Añade Esperar.'
  if(c==='K')s.llave=true
  if(c==='B'&&!s.baterias.includes(`${a},${b}`))s.baterias.push(`${a},${b}`)
  return null
 }
 let error=entrar(x,y);if(error)return {error}
 if(dir!=='esperar')while(celda(x,y)==='I'){x+=delta[0];y+=delta[1];error=entrar(x,y);if(error)return {error}}
 if(celda(x,y)==='P'&&dir!=='esperar')reto.mapa.forEach((r,j)=>[...r].forEach((c,i)=>{if(c==='Q'){x=i;y=j}}))
 s.x=x;s.y=y;return {estado:s}
}
export function victoria(reto,s){return reto.mapa[s.y]?.[s.x]==='G'&&s.baterias.length===reto.mapa.join('').split('B').length-1}
