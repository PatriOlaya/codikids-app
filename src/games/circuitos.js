export const CIRCUITOS = [
 {nombre:'Encendido',size:4,path:[0,1,5,6,10,11,15],objetivo:12},
 {nombre:'Jardín solar',size:4,path:[0,4,8,9,5,6,10,11,15],objetivo:16},
 {nombre:'Estación lunar',size:5,path:[0,1,6,11,12,7,8,13,18,19,24],objetivo:20},
 {nombre:'La serpiente',size:5,path:[0,5,10,11,12,7,2,3,8,13,18,19,24],objetivo:28},
 {nombre:'Laboratorio oceánico',size:6,path:[0,1,7,13,12,18,24,25,26,20,14,15,16,22,28,29,35],objetivo:32},
 {nombre:'Ciudad de neón',size:6,path:[0,6,12,13,14,8,2,3,9,15,21,20,26,32,33,34,28,29,35],objetivo:36},
 {nombre:'Núcleo volcánico',size:7,path:[0,1,8,15,14,21,28,29,30,23,16,17,18,25,32,39,40,41,48],objetivo:36},
 {nombre:'Reactor maestro',size:7,path:[0,7,14,15,16,9,2,3,10,17,24,23,30,37,38,31,32,33,40,47,48],objetivo:40},
]
// Las direcciones de las piezas son N E S O, en sentido horario.
export function crearCircuito(level){const {size,path}=level;return Array.from({length:size*size},(_,i)=>{
 const j=path.indexOf(i);if(j<0)return null
 const direction=to=>to===i-size?0:to===i+1?1:to===i+size?2:3
 const base=[j>0?direction(path[j-1]):3,j<path.length-1?direction(path[j+1]):1]
 return {base,rot:(i*7+j*3+1)%4}
})}
export function conectado(level,piezas){
 const {size,path}=level;const seen=new Set(),queue=[path[0]]
 while(queue.length){const i=queue.shift();if(seen.has(i))continue;seen.add(i);const p=piezas[i];if(!p)continue
 for(const d of p.base.map(n=>(n+p.rot)%4)){const x=i%size,y=Math.floor(i/size),nx=x+[0,1,0,-1][d],ny=y+[-1,0,1,0][d];if(nx<0||ny<0||nx>=size||ny>=size)continue;const ni=ny*size+nx,n=piezas[ni];if(n&&n.base.some(v=>(v+n.rot)%4===(d+2)%4)&&!seen.has(ni))queue.push(ni)}
 }
 return {seen,gana:path.every(i=>seen.has(i))&&piezas[path[0]].base.some(v=>(v+piezas[path[0]].rot)%4===3)&&piezas[path.at(-1)].base.some(v=>(v+piezas[path.at(-1)].rot)%4===1)}
}
