export const PISTAS = {
 huellas: { icono:'🐾', nombre:'Huellas con polen', texto:'Las huellas brillantes van del bosque al parque. Alguien pasó por aquí con flores.' },
 hoja: { icono:'🍃', nombre:'Nota de Pío', texto:'«Busca a Pío en el parque. Para llamarlo, envíale el mensaje buscar_a_pio».' },
 cinta: { icono:'🎀', nombre:'Cinta del farol', texto:'Pío encontró el farol junto a la fuente. Su cinta se soltó con el viento: nadie lo robó.' },
}
export const BLOQUES = {
 evento:{texto:'Al hacer clic en la bandera verde',tipo:'evento'},
 disfraz:{texto:'Cambiar disfraz a exploradora',tipo:'apariencia'},
 mensaje:{texto:'Enviar «camino_listo»',tipo:'evento'},
 llamar:{texto:'Enviar «buscar_a_pio»',tipo:'evento'},
 saludar:{texto:'Enviar «hola_parque»',tipo:'evento'},
 moneda:{texto:'Si tienes la cinta del farol…',tipo:'control'},
 luz:{texto:'…encender el farol',tipo:'apariencia'},
 tocar:{texto:'Si tocas una flor…',tipo:'control'},
}
export const RETOS = {
 camino:{titulo:'Programa la salida',pista:'Primero inicia la escena, luego ponte el disfraz de exploradora y, al final, anuncia que el camino está listo.',disponibles:['mensaje','evento','disfraz'],solucion:['evento','disfraz','mensaje']},
 pio:{titulo:'Llama a Pío',pista:'Lee la nota del bosque. El mensaje que envíes debe coincidir con el que Pío está esperando.',disponibles:['saludar','llamar'],solucion:['llamar']},
 farol:{titulo:'Enciende el farol',pista:'Comprueba primero que tienes la cinta. Dentro de esa condición coloca la acción que enciende el farol.',disponibles:['luz','tocar','moneda'],solucion:['moneda','luz']},
}
export function evaluarPrograma(reto,programa){
 const solucion=RETOS[reto]?.solucion
 return !!solucion && solucion.length===programa.length && solucion.every((b,i)=>b===programa[i])
}
export const nuevaAventura=()=>({pistas:[],camino:false,pio:false,farol:false,final:null})
export function desbloqueado(reto,s){
 if(reto==='camino')return s.pistas.includes('huellas')&&s.pistas.includes('hoja')
 if(reto==='pio')return s.camino
 return reto==='farol'&&s.pio&&s.pistas.includes('cinta')
}
