export const PISTAS_TURBO=[
 {id:'costa',nombre:'Costa Esmeralda',tema:'Mar y palmeras',cielo:0x91d6ef,suelo:0x3f9f9e,borde:0x75f2ce,limites:[30,18,29,22],meta:22,nodos:[[-31,0,8],[-27,0,-30],[-8,1,-42],[35,2,-38],[49,0,-11],[30,0,14],[1,1,27],[-24,0,23]]},
 {id:'ciudad',nombre:'Ciudad Neón',tema:'Rascacielos al anochecer',cielo:0x33325c,suelo:0x202842,borde:0xf28af6,limites:[25,16,30,17],meta:30,nodos:[[-35,1,25],[-38,1,-28],[-18,1,-42],[8,1,-30],[3,2,-8],[34,3,-19],[48,1,10],[28,1,29],[-2,1,17]]},
 {id:'desierto',nombre:'Cañón Solar',tema:'Mesetas y desniveles',cielo:0xffbe85,suelo:0xb37b53,borde:0xffe098,limites:[22,32,17,27],meta:28,nodos:[[-42,1,18],[-36,2,-21],[-16,6,-38],[26,5,-47],[50,2,-25],[36,3,1],[49,3,27],[9,2,31],[-17,2,16]]},
 {id:'nieve',nombre:'Cumbre Polar',tema:'Hielo, auroras y curvas cerradas',cielo:0x92a8d1,suelo:0xc3dbeb,borde:0x9dffff,limites:[20,16,26,18],meta:36,nodos:[[-34,1,30],[-43,2,-12],[-26,5,-40],[-2,6,-31],[-8,4,-5],[18,2,-7],[34,4,-38],[50,3,-13],[41,2,23],[10,1,38]]},
]
export const VUELTAS_TURBO=2
export const ORDENES_TURBO={ritmo:'Mantener ritmo',curva:'Cuidar curva',turbo:'Usar turbo'}
export const sectorTurbo=(distancia,largo)=>Math.min(3,Math.floor((distancia%largo)/largo*4))
export const iniciarCarrera=()=>({distancia:0,tiempo:0,velocidad:0,carril:0,energia:100,derrape:false,fin:false})
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x))
export function avanzarTurbo(s,{dt,largo,pista,modo,ordenes,controles}){
 if(s.fin||dt<=0||largo<=0)return s
 const sector=sectorTurbo(s.distancia,largo),limite=pista.limites[sector]
 const orden=modo==='programa'?ordenes[sector]:null
 const freno=modo==='manual'&&controles.freno
 const acel=modo==='programa'||controles.acel
 const turbo=!freno&&(orden==='turbo'||(modo==='manual'&&controles.turbo))&&s.energia>1
 const objetivo=orden==='curva'?limite-1:turbo?38:28
 let velocidad=s.velocidad
 if(freno)velocidad-=22*dt
 else if(acel)velocidad+=clamp(objetivo-velocidad,-14*dt,(turbo?16:10)*dt)
 else velocidad-=6*dt
 let carril=clamp(s.carril+(modo==='manual'?(Number(!!controles.der)-Number(!!controles.izq))*3.8*dt:-s.carril*dt),-4.1,4.1)
 const derrape=velocidad>limite+3||(s.derrape&&velocidad>limite-2)
 if(derrape){velocidad-=27*dt;carril=clamp(carril+(sector%2?-1:1)*dt*.85,-4.1,4.1)}
 if(Math.abs(carril)>3.15)velocidad-=10*dt
 velocidad=clamp(velocidad,0,38)
 const energia=clamp(s.energia+(turbo?-30:orden==='curva'||freno?13:6)*dt,0,100)
 const distancia=Math.min(largo*VUELTAS_TURBO,s.distancia+velocidad*dt)
 return {distancia,tiempo:s.tiempo+dt,velocidad,carril,energia,derrape,fin:distancia>=largo*VUELTAS_TURBO}
}
