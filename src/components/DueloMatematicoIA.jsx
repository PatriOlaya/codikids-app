import {useEffect,useRef,useState} from 'react'
function pregunta(nivel){const max=nivel==='facil'?12:nivel==='medio'?30:70;const a=1+Math.floor(Math.random()*max),b=1+Math.floor(Math.random()*max);const tipo=nivel==='dificil'?Math.floor(Math.random()*3):Math.floor(Math.random()*2);if(tipo===2){const x=2+Math.floor(Math.random()*10),y=2+Math.floor(Math.random()*10);return {texto:x+' × '+y,valor:x*y}}if(tipo===1){return {texto:a+' − '+Math.min(a,b),valor:a-Math.min(a,b)}}return {texto:a+' + '+b,valor:a+b}}
export default function DueloMatematicoIA({onCerrar}){
 const [nivel,setNivel]=useState('medio'),[inicio,setInicio]=useState(false),[ronda,setRonda]=useState(0),[p,setP]=useState(()=>pregunta('medio')),[respuesta,setRespuesta]=useState(''),[puntos,setPuntos]=useState([0,0]),[segundos,setSegundos]=useState(0),[mensaje,setMensaje]=useState(''),[terminado,setTerminado]=useState(false)
 const rondaRef=useRef(0),timer=useRef(null),deadline=useRef(0),done=useRef(false)
 const tiempo=nivel==='facil'?14:nivel==='medio'?10:7
 function resolver(correcta,agotado=false){if(done.current)return;done.current=true;clearInterval(timer.current);const maquinaTiempo=nivel==='facil'?7:nivel==='medio'?5:3;const gana=correcta&&segundos>0&&segundos>=maquinaTiempo;setPuntos(s=>[s[0]+(gana?1:0),s[1]+(gana?0:1)]);setMensaje(gana?'⭐ ¡Punto para ti!':agotado?'⏳ Se acabó el tiempo. Punto para la máquina.':'🤖 Punto para la máquina. Respuesta: '+p.valor);if(ronda>=10)setTerminado(true)}
 useEffect(()=>{if(!inicio||terminado||done.current)return;timer.current=setInterval(()=>{const left=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setSegundos(left);if(left<=0){clearInterval(timer.current);if(!done.current){done.current=true;setPuntos(s=>[s[0],s[1]+1]);setMensaje('⏳ Tiempo agotado. La máquina gana el punto.');if(rondaRef.current>=10)setTerminado(true)}}},200);return()=>clearInterval(timer.current)},[inicio,ronda,terminado])
 function siguiente(){clearInterval(timer.current);done.current=false;const r=ronda+1;rondaRef.current=r;setRonda(r);setP(pregunta(nivel));setRespuesta('');setMensaje('');setSegundos(tiempo);deadline.current=Date.now()+tiempo*1000;setInicio(true)}
 function comenzar(){setPuntos([0,0]);setRonda(0);setTerminado(false);setInicio(false);setMensaje('');done.current=true}
 function enviar(e){e.preventDefault();if(!inicio||done.current)return;resolver(Number(respuesta)===p.valor)}
 return <div className="game-overlay" style={{position:'fixed',inset:0,zIndex:300,background:'radial-gradient(circle at top,#16485c,#14112f)',color:'white',overflowY:'auto',padding:24}}><div style={{maxWidth:650,margin:'auto',textAlign:'center'}}>
 <button onClick={onCerrar} style={{float:'right'}}>✕ Salir</button><h1>⚡ Duelo Matemático</h1><p>Resuelve antes que la máquina. Son 10 rondas.</p>
 <label>Dificultad <select disabled={inicio&&!terminado} value={nivel} onChange={e=>setNivel(e.target.value)}><option value="facil">Explorador</option><option value="medio">Ninja</option><option value="dificil">Maestro</option></select></label>
 <h2>🧒 {puntos[0]} — {puntos[1]} 🤖</h2>
 {!inicio?<button className="btn-primary" onClick={siguiente}>▶ Comenzar</button>:<><p>Ronda {ronda} de 10 · ⏱ {segundos} segundos</p><div style={{fontSize:58,fontWeight:900,margin:'28px 0',color:'#ffe49d'}}>{p.texto} = ?</div>
 {!done.current&&<form onSubmit={enviar}><input type="number" aria-label="Tu respuesta" value={respuesta} onChange={e=>setRespuesta(e.target.value)} required style={{width:150,fontSize:28,textAlign:'center',padding:10}}/><button className="btn-primary" type="submit">Responder</button></form>}
 <h2 role="status">{mensaje}</h2>{done.current&&(terminado?<><h2>{puntos[0]>puntos[1]?'🏆 ¡Ganaste el duelo!':puntos[0]===puntos[1]?'🤝 ¡Empate!':'🤖 Ganó la máquina. ¡Inténtalo otra vez!'}</h2><button className="btn-primary" onClick={comenzar}>Reiniciar duelo</button></>:<button className="btn-primary" onClick={siguiente}>Siguiente ronda →</button>)}</>}
 </div></div>
}
