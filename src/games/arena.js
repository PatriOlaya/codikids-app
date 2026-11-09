export const ARENAS = [
 {nombre:'Jardín flotante',color:0x50cbb0,cielo:0xc0dff4,objetivo:3,descripcion:'Cruza islas, salta los huecos y acierta tres blancos.'},
 {nombre:'Cañón de cristal',color:0xa690ed,cielo:0xc7c1eb,objetivo:4,descripcion:'Plataformas más estrechas y blancos que se mueven.'},
 {nombre:'Ciudad del pulso',color:0xf4b864,cielo:0x8ca4c9,objetivo:5,descripcion:'Los blancos se protegen con escudos intermitentes. Espera la apertura.'},
 {nombre:'Reactor celeste',color:0x62cce7,cielo:0x92bbd8,objetivo:6,descripcion:'Combina plataformas estrechas, blancos móviles y escudos.'},
]
// El primer elemento de cada pregunta es la respuesta correcta; se mezcla al presentarla.
export const PREGUNTAS = [
 ['¿Qué bloque inicia un programa con la bandera verde?','Al hacer clic en la bandera verde','Por siempre','Esperar 1 segundo','La bandera verde activa los programas conectados a ese evento.'],
 ['¿Qué bloque mueve un personaje hacia delante?','Mover 10 pasos','Decir Hola','Cambiar disfraz','Mover pasos cambia la posición en la dirección del personaje.'],
 ['¿Qué coordenada cambia al moverse a la derecha?','x','y','volumen','La coordenada x controla el movimiento horizontal.'],
 ['¿Qué coordenada cambia al subir?','y','x','tamaño','La coordenada y controla el movimiento vertical.'],
 ['¿Para qué sirve una variable Puntos?','Guardar y cambiar la puntuación','Dibujar el fondo','Crear un sonido','Una variable guarda un valor que el programa puede consultar y cambiar.'],
 ['¿Qué hace repetir 5 con mover 10 pasos dentro?','Mueve un total de 50 pasos','Mueve 5 pasos','Mueve 10 pasos una vez','Repite la acción cinco veces: 5 × 10 = 50.'],
 ['¿Qué hace el bloque por siempre?','Repite sus instrucciones hasta detener el programa','Ejecuta una sola vez','Elimina el personaje','Por siempre mantiene ejecutándose las instrucciones que contiene.'],
 ['¿Cómo compruebas si el personaje toca una moneda?','Con el sensor tocando Moneda','Con decir Moneda','Con cambiar fondo','El sensor tocando detecta el contacto con el objeto elegido.'],
 ['Si Vidas vale 3, ¿cuánto queda al cambiar Vidas por −1?','2','4','−1','Cambiar por −1 resta una unidad al valor actual.'],
 ['¿Cómo avisas a varios personajes que empezó el juego?','Enviar un mensaje','Cambiar el nombre de un sprite','Borrar el fondo','Enviar un mensaje activa los programas que reciben ese mensaje.'],
 ['¿Qué bloque permite elegir entre dos caminos?','Si… entonces… si no','Esperar','Mover','Si… si no ejecuta una alternativa según una condición.'],
 ['¿Qué hace esperar 1 segundo?','Pausa ese programa durante un segundo','Detiene todos los programas','Cierra Scratch','Esperar hace una pausa en la secuencia donde se utiliza.'],
 ['¿Cómo reinicias la puntuación al comenzar?','Fijar Puntos a 0','Cambiar Puntos por 0','Mostrar variable Puntos','Fijar reemplaza el valor. Cambiar por 0 conserva el valor anterior.'],
 ['¿Qué hace siguiente disfraz?','Cambia la apariencia al siguiente disfraz','Mueve el personaje','Crea un nuevo personaje','Los disfraces son distintas apariencias del mismo sprite.'],
 ['¿Qué sensor detecta el botón del ratón?','¿Ratón presionado?','¿Tocando borde?','Posición x','El sensor ratón presionado comprueba si se mantiene pulsado.'],
 ['¿Qué bloque obtiene un número aleatorio?','Número al azar entre 1 y 10','Fijar x a 1','Decir 10','Número al azar selecciona un valor dentro del intervalo indicado.'],
 ['¿Qué pasa con si Puntos > 10 cuando Puntos vale 10?','No se ejecuta su interior','Se ejecuta siempre','Puntos cambia a 11','Mayor que no incluye el mismo valor: 10 no es mayor que 10.'],
 ['¿Para qué sirve crear un clon de mí mismo?','Crear una copia del personaje durante el juego','Duplicar todo el proyecto','Cambiar el fondo','Los clones permiten crear copias que pueden ejecutar sus propios programas.'],
 ['¿Qué bloque evita que un sprite atraviese el borde al caminar?','Si toca un borde, rebotar','Cambiar color','Enviar mensaje','Rebotar cambia la dirección al tocar el borde.'],
 ['¿Qué hace ir a x:0 y:0?','Coloca el sprite en el centro del escenario','Lo lleva arriba a la derecha','Lo esconde','El origen de las coordenadas del escenario está en su centro.'],
 ['¿Cómo consigues que una condición se revise continuamente?','Poner si… entonces dentro de por siempre','Usar decir','Cambiar el fondo una vez','El bucle vuelve a comprobar la condición en cada repetición.'],
 ['Si repites 4 veces girar 90 grados, ¿qué ocurre?','Completa una vuelta','Da media vuelta','Gira 90 grados en total','4 × 90 = 360 grados: una vuelta completa.'],
 ['¿Qué hace detener todos?','Detiene los programas del proyecto','Borra todos los sprites','Guarda automáticamente','Detener todos para los programas que están ejecutándose.'],
 ['¿Cuál es una buena forma de buscar un error?','Probar una parte y observar sus variables','Borrar todo el proyecto','Añadir bloques al azar','Las pruebas pequeñas ayudan a descubrir dónde cambia el comportamiento esperado.'],
]
export function preguntaPara(indice, ronda){const q=PREGUNTAS[(ronda*6+indice)%PREGUNTAS.length];const opciones=q.slice(1,4).map((texto,i)=>({texto,correcta:i===0}));const shift=(indice+ronda)%3;return {texto:q[0],explicacion:q[4],opciones:[...opciones.slice(shift),...opciones.slice(0,shift)]}}
export function premiar(estado,correcta){return correcta?{...estado,puntos:estado.puntos+100,vidas:Math.min(5,estado.vidas+1),aciertos:estado.aciertos+1}:{...estado,vidas:Math.max(0,estado.vidas-1)}}
export function plataformasPara(ronda){return Array.from({length:9},(_,i)=>({x:i===0?0:(i%2?1:-1)*(ronda>=1?2:1.5),z:-i*5.1,y:i===0?0:(i%3)*.35,w:i===0?7:ronda>=1?3.5:4.5,d:i===0?6:3.8}))}
