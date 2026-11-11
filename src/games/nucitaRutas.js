export const RUTAS = {
 fiesta:{
  nombre:'La plaza de los faroles', personaje:'Mila, la ardilla',
  inicio:'Una ráfaga desordenó la plaza. Mila encontró tres soportes vacíos. ¡Pon exactamente un banderín en cada uno!',
  siguiente:'Los banderines ya están puestos. Programa el aviso de inauguración para que solo suene cuando los tres estén listos.',
  decide:'Mila tiene dos ideas para celebrar. ¿Qué harán los vecinos con el farol?',
  finales:[
   {id:'teatro',nombre:'Teatro de sombras',texto:'Mila puso figuras frente al farol. Nucita y Pío contaron la historia de la luz con sombras que bailaban.',icono:'🎭'},
   {id:'coro',nombre:'Concierto de luciérnagas',texto:'Pío cantó mientras las luciérnagas iluminaban el ritmo. Los vecinos aprendieron a seguir el compás.',icono:'🎵'},
  ],
  retos:[
   {titulo:'Repite para decorar',campos:[{id:'repetir',texto:'Repetir',opciones:[1,2,3,4]},{id:'sumar',texto:'Cambiar Banderines por',opciones:[1,2,3]}],pista:'Banderines comienza en 0. Cuenta cuántos se añaden en cada repetición.'},
   {titulo:'Anuncia la inauguración',campos:[{id:'condicion',texto:'Si…',opciones:['Banderines = 3','Banderines = 0']},{id:'mensaje',texto:'Enviar',opciones:['fiesta_lista','guardar_farol']}],pista:'Ya colocaste tres banderines. Mila escucha el mensaje fiesta_lista.'},
  ],
 },
 sendero:{
  nombre:'El puente de la niebla', personaje:'Bruno, el castor',
  inicio:'La niebla tapa el puente y Bruno tiene cuatro reflectores. Colócalos en parejas para marcar el camino.',
  siguiente:'Los cuatro reflectores están puestos. Bruno bajará la barrera cuando el sensor detecte la luz, si recibe el mensaje correcto.',
  decide:'El puente ya está abierto. ¿Adónde debería llevar Nucita la luz ahora?',
  finales:[
   {id:'regreso',nombre:'Camino a casa',texto:'Nucita acompañó a los vecinos hasta sus casas. Los cuatro reflectores les mostraron por dónde cruzar.',icono:'🏡'},
   {id:'refugio',nombre:'Refugio del río',texto:'Nucita y Bruno llevaron el farol al refugio de animales para que todos pudieran encontrarlo entre la niebla.',icono:'🦫'},
  ],
  retos:[
   {titulo:'Coloca los reflectores',campos:[{id:'repetir',texto:'Repetir',opciones:[1,2,3,4]},{id:'sumar',texto:'Cambiar Reflectores por',opciones:[1,2,3]}],pista:'Bruno pide cuatro reflectores, colocados de dos en dos.'},
   {titulo:'Abre el puente con el sensor',campos:[{id:'condicion',texto:'Si el sensor detecta…',opciones:['luz','oscuridad']},{id:'mensaje',texto:'Enviar',opciones:['abrir_puente','cerrar_puente']}],pista:'Con los reflectores encendidos, el sensor detecta luz. Envía el mensaje que baja la barrera.'},
  ],
 },
}

export function ejecutarRuta(ruta, etapa, bloques){
 if(!RUTAS[ruta]||![0,1].includes(etapa))return {ok:false}
 if(etapa===0){
  const repetir=Number(bloques.repetir),sumar=Number(bloques.sumar)
  if(![1,2,3,4].includes(repetir)||![1,2,3].includes(sumar))return {ok:false}
  const total=repetir*sumar
  const esFiesta=ruta==='fiesta',meta=esFiesta?3:4
  const ok=total===meta&&(esFiesta||sumar===2)
  return {ok,total,nota:ok?'¡El bucle colocó todos los objetos!':`Tu programa colocó ${total}. ${esFiesta?'Necesitas exactamente tres.':'Necesitas cuatro, de dos en dos.'}`}
 }
 const ok=ruta==='fiesta' ? bloques.condicion==='Banderines = 3'&&bloques.mensaje==='fiesta_lista' : bloques.condicion==='luz'&&bloques.mensaje==='abrir_puente'
 return {ok,nota:ok?(ruta==='fiesta'?'¡Mila recibió el aviso y se encendió la plaza!':'¡Bruno recibió el mensaje y bajó la barrera!'):'El escenario sigue igual. Revisa la condición y el mensaje que escucha tu personaje.'}
}
