import {supabase} from './supabase'
export async function registrarActividad(estudianteId,juego,evento,duracionSegundos=null){
 if(!estudianteId||!['turbo','nucita','islas','robot','circuito','espacio'].includes(juego)||!['abrir','cerrar'].includes(evento))return
 const row={estudiante_id:estudianteId,juego,evento}
 if(evento==='cerrar')row.duracion_segundos=Math.max(0,Math.min(14400,Math.round(duracionSegundos||0)))
 const {error}=await supabase.from('actividad_juegos').insert(row)
 if(error)console.warn('No se pudo registrar actividad:',error.message)
}
