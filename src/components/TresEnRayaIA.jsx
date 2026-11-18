import {useState} from 'react'
const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
function resultado(b){for(const [a,c,d] of WINS)if(b[a]&&b[a]===b[c]&&b[a]===b[d])return b[a];return b.every(Boolean)?'empate':null}
function minimax(b,turn,depth=0){const end=resultado(b);if(end)return {score:end==='O'?10-depth:end==='X'?depth-10:0};let best={score:turn==='O'?-Infinity:Infinity};for(let i=0;i<9;i++){if(b[i])continue;const next=[...b];next[i]=turn;const v=minimax(next,turn==='O'?'X':'O',depth+1).score;if((turn==='O'&&v>best.score)||(turn==='X'&&v<best.score))best={score:v,index:i}}return best}
export default function TresEnRayaIA({onCerrar}){
 const [nivel,setNivel]=useState('medio'),[board,setBoard]=useState(Array(9).fill(null)),[score,setScore]=useState({jugador:0,maquina:0,empates:0}),[ronda,setRonda]=useState(1)
 const fin=resultado(board)
 function jugar(i){if(board[i]||fin)return;const b=[...board];b[i]='X';if(!resultado(b)){let opciones=b.map((v,j)=>v?null:j).filter(v=>v!==null);let move;if(nivel==='facil')move=opciones[Math.floor(Math.random()*opciones.length)];else if(nivel==='medio'&&Math.random()<.4)move=opciones[Math.floor(Math.random()*opciones.length)];else move=minimax(b,'O').index;if(move!==undefined)b[move]='O'}setBoard(b);const end=resultado(b);if(end)setScore(s=>({...s,[end==='X'?'jugador':end==='O'?'maquina':'empates']:s[end==='X'?'jugador':end==='O'?'maquina':'empates']+1}))}
 function reiniciar(){setBoard(Array(9).fill(null));setRonda(v=>v+1)}
 return <div className="game-overlay" style={{position:'fixed',inset:0,zIndex:300,background:'radial-gradient(circle at top,#3a2476,#0c1026)',overflowY:'auto',padding:24,color:'#fff'}}><div style={{maxWidth:640,margin:'auto',textAlign:'center'}}>
 <button onClick={onCerrar} style={{float:'right'}}>✕ Salir</button><h1>🧠 Tres en raya: desafío IA</h1><p>Tu símbolo es ❌. La máquina juega con ⭕. ¡Intenta vencerla!</p>
 <label>Dificultad <select value={nivel} onChange={e=>{setNivel(e.target.value);setBoard(Array(9).fill(null))}}><option value="facil">Explorador</option><option value="medio">Ninja</option><option value="dificil">Maestro (imbatible)</option></select></label>
 <p style={{fontSize:20}}>🏆 Tú {score.jugador} — Máquina {score.maquina} · Empates {score.empates}</p><p>Ronda {ronda}</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,maxWidth:370,margin:'20px auto'}}>{board.map((v,i)=><button key={i} onClick={()=>jugar(i)} disabled={Boolean(v)||Boolean(fin)} aria-label={'Casilla '+(i+1)} style={{aspectRatio:'1',fontSize:'clamp(32px,7vw,60px)',background:'linear-gradient(135deg,#473b83,#283e71)',border:'2px solid #9debd9',borderRadius:18,color:'#fff',cursor:'pointer'}}>{v==='X'?'❌':v==='O'?'⭕':'·'}</button>)}</div>
 <h2 role="status">{fin===null?'Tu turno':fin==='X'?'🎉 ¡Ganaste!':fin==='O'?'🤖 La máquina ganó':'🤝 ¡Empate!'}</h2><button className="btn-primary" onClick={reiniciar}>🔁 Nueva partida</button>
 </div></div>
}
