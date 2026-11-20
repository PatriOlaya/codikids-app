import { useEffect, useRef, useState } from 'react'
const MAPS=[
 ['........................','........................','...........C............','.......####.........C....','..C...............####..','.......C................','...####.................','.....................F..','########################'],
 ['........................','...........C............','....C.....####..........','...####...........C.....','.................####...','..C.........C...........','..####......####.....F..','........................','########################'],
 ['........................','......C...........C.....','....####.........####...','...........C............','..........####..........','..C..............C......','..####..........####.F..','........................','########################']
]
export default function ExploradoresPlataformas({onCerrar}){
 const canvas=useRef(null),keys=useRef({}),state=useRef(null)
 const [etapa,setEtapa]=useState(0),[monedas,setMonedas]=useState(0),[vidas,setVidas]=useState(3),[terminado,setTerminado]=useState(false)
 useEffect(()=>{
  const mapa=MAPS[etapa].map(s=>s.split(''));const tile=32
  const p={x:40,y:180,vx:0,vy:0,ground:false};let collected=0,dead=false,raf=0
  const down=e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','a','d','w'].includes(e.key))e.preventDefault();keys.current[e.key]=true}
  const up=e=>{keys.current[e.key]=false}
  window.addEventListener('keydown',down);window.addEventListener('keyup',up)
  const ctx=canvas.current?.getContext('2d')
  function frame(){
   if(!ctx)return
   const width=768,height=288;ctx.clearRect(0,0,width,height)
   ctx.fillStyle='#94d7ff';ctx.fillRect(0,0,width,height)
   ctx.fillStyle='#b4e9b0';ctx.fillRect(0,250,width,38)
   const k=keys.current;p.vx=(k.ArrowRight||k.d?3:0)-(k.ArrowLeft||k.a?3:0)
   if((k.ArrowUp||k.w||k[' '])&&p.ground){p.vy=-11;p.ground=false}
   p.vy=Math.min(p.vy+.55,12)
   p.x=Math.max(0,Math.min(width-25,p.x+p.vx))
   const collide=(x,y)=>{const col=Math.floor(x/tile),row=Math.floor(y/tile);return mapa[row]?.[col]==='#'}
   const oldY=p.y;p.y+=p.vy;p.ground=false
   if(p.vy>=0&&(collide(p.x+3,p.y+27)||collide(p.x+21,p.y+27))){p.y=Math.floor((p.y+27)/tile)*tile-27;p.vy=0;p.ground=true}
   if(p.vy<0&&(collide(p.x+3,p.y)||collide(p.x+21,p.y))){p.y=Math.floor(p.y/tile+1)*tile;p.vy=0}
   if(p.y>height+20&&!dead){dead=true;setVidas(v=>{if(v<=1){setTerminado(true);return 0}return v-1});setTimeout(()=>{p.x=40;p.y=180;p.vy=0;dead=false},400)}
   for(let y=0;y<mapa.length;y++)for(let x=0;x<mapa[y].length;x++){
    const t=mapa[y][x],px=x*tile,py=y*tile
    if(t==='#'){ctx.fillStyle='#4b9b56';ctx.fillRect(px,py,32,32);ctx.fillStyle='#a6dc70';ctx.fillRect(px,py,32,6)}
    if(t==='C'){ctx.fillStyle='#ffd13b';ctx.beginPath();ctx.arc(px+16,py+16,9,0,Math.PI*2);ctx.fill();if(Math.abs(p.x+12-px-16)<20&&Math.abs(p.y+13-py-16)<23){mapa[y][x]='.';collected++;setMonedas(n=>n+1)}}
    if(t==='F'){ctx.fillStyle='#f25d83';ctx.fillRect(px+12,py-5,4,37);ctx.fillStyle='#fff';ctx.fillRect(px+16,py-5,18,13);if(Math.abs(p.x-px)<28&&Math.abs(p.y-py)<42){mapa[y][x]='.';if(etapa===2)setTerminado(true);else setEtapa(e=>e+1)}}
   }
   ctx.fillStyle='#e95768';ctx.fillRect(p.x,p.y,24,27);ctx.fillStyle='#fff';ctx.fillRect(p.x+14,p.y+6,6,6)
   raf=requestAnimationFrame(frame)
  }
  raf=requestAnimationFrame(frame)
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);keys.current={}}
 },[etapa])
 const control=(key,value)=>{keys.current[key]=value}
 return <div className="game-overlay" style={{overflow:'auto',padding:16,color:'white',textAlign:'center'}}>
 <div style={{maxWidth:800,margin:'auto'}}><h2>🍄 Aventura del Bosque · Etapa {etapa+1}/3</h2><p>🪙 {monedas} monedas · ❤️ {vidas} vidas</p>
 {terminado?<div><h2>{vidas?'🏆 ¡Aventura completada!':'Inténtalo de nuevo'}</h2><button onClick={()=>{setEtapa(0);setVidas(3);setMonedas(0);setTerminado(false)}}>Volver a jugar</button></div>:<canvas ref={canvas} width={768} height={288} style={{width:'100%',borderRadius:14,imageRendering:'pixelated',background:'#94d7ff'}}/>}
 <p>Usa ← → y ↑ o los botones para moverte y saltar. Llega a la bandera.</p>
 <div style={{display:'flex',justifyContent:'center',gap:16}}>{[['←','ArrowLeft'],['↑','ArrowUp'],['→','ArrowRight']].map(([label,key])=><button key={key} style={{padding:'15px 22px',fontSize:22,touchAction:'none'}} onPointerDown={()=>control(key,true)} onPointerUp={()=>control(key,false)} onPointerLeave={()=>control(key,false)}>{label}</button>)}</div>
 <button onClick={onCerrar} style={{marginTop:16}}>Salir del juego</button></div></div>
}