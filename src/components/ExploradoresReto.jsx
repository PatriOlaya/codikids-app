import { useState } from 'react'
const preguntas=[
 {q:'¿Qué número continúa? 2, 4, 8, 16, ...',op:['18','24','32'],ok:2},
 {q:'Un robot avanza 3 pasos, retrocede 1 y avanza 4. ¿Cuántos pasos avanzó en total?',op:['6','7','8'],ok:0},
 {q:'¿Qué instrucción se repite para dibujar un cuadrado?',op:['Mover y girar 90° cuatro veces','Girar 45° dos veces','Mover una sola vez'],ok:0},
 {q:'¿Qué patrón continúa? 🔴 🔵 🔵 🔴 🔵 🔵 ...',op:['🔵','🔴','🟢'],ok:1},
 {q:'Tienes 3 vidas y pierdes 2, luego ganas 4. ¿Cuántas tienes?',op:['4','5','6'],ok:1},
 {q:'¿Qué condición hace saltar al personaje solo al pulsar espacio?',op:['Por siempre','Si tecla espacio presionada','Esperar 1 segundo'],ok:1},
 {q:'¿Cuánto es 7 × 6?',op:['42','36','48'],ok:0},
 {q:'Un bucle repite 5 veces una acción que suma 3 puntos. ¿Cuántos puntos da?',op:['8','15','53'],ok:1},
]
export default function ExploradoresReto({onCerrar}){
 const [i,setI]=useState(0),[puntos,setPuntos]=useState(0),[respuesta,setRespuesta]=useState(null)
 const terminado=i>=preguntas.length
 function siguiente(){setPuntos(n=>n+(respuesta===preguntas[i].ok?1:0));setRespuesta(null);setI(n=>n+1)}
 return <div className="game-overlay" style={{overflow:'auto',padding:20,color:'#fff',textAlign:'center'}}><div className="card" style={{maxWidth:560,margin:'auto',padding:28}}>
 <h2>🏆 Desafío Maestro Explorador</h2><p>Reto avanzado de lógica y programación · {Math.min(i+1,preguntas.length)}/{preguntas.length}</p>
 {terminado?<><h3>Resultado: {puntos}/{preguntas.length}</h3><p>{puntos>=6?'¡Excelente! Superaste el desafío.':'Sigue practicando. ¡Puedes intentarlo de nuevo!'}</p><button onClick={()=>{setI(0);setPuntos(0);setRespuesta(null)}}>Repetir desafío</button></>:<><h3 style={{margin:'22px 0'}}>{preguntas[i].q}</h3><div style={{display:'grid',gap:12}}>{preguntas[i].op.map((o,j)=><button key={j} onClick={()=>setRespuesta(j)} style={{padding:14,borderRadius:12,background:respuesta===j?'#387e91':'#32275b',color:'white',border:'1px solid #9a8ce2'}}>{o}</button>)}</div><button disabled={respuesta===null} onClick={siguiente} style={{marginTop:20,padding:12}}>Confirmar respuesta</button></>}
 <div><button onClick={onCerrar} style={{marginTop:20}}>Cerrar</button></div></div></div>
}