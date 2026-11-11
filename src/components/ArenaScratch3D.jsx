import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { ARENAS, plataformasPara, preguntaPara, premiar, chocaConBlanco } from '../games/arena'
const COLORES=[{nombre:'Explorador turquesa',color:0x37bdb1},{nombre:'Inventora violeta',color:0x9471df},{nombre:'Piloto naranja',color:0xf69b48}]
const inicial=()=>({puntos:0,vidas:5,aciertos:0})
export default function ArenaScratch3D({estudianteId,onCerrar}){
 const key=`codikids-arena3d-v1-${estudianteId}`
 const [mira,setMira]=useState(false)
 const [records,setRecords]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))||{}}catch{return {}}})
 const [ronda,setRonda]=useState(0),[avatar,setAvatar]=useState(0),[hud,setHud]=useState(inicial),[pregunta,setPregunta]=useState(null),[respuesta,setRespuesta]=useState(null),[pausa,setPausa]=useState(false),[error,setError]=useState(''),[aviso,setAviso]=useState('Salta a la siguiente isla, acércate al blanco y pulsa Apuntar.'),[final,setFinal]=useState(false),[sesion,setSesion]=useState(0)
 const host=useRef(null),engine=useRef(null),keys=useRef({}),blocked=useRef(false),aiming=useRef(false),callbacks=useRef({})
 callbacks.current={quiz(q){aiming.current=false;setMira(false);setPregunta(q);setRespuesta(null)},hud:setHud,aviso:setAviso}
 useEffect(()=>{blocked.current=pausa||!!pregunta||final},[pausa,pregunta,final])
 useEffect(()=>{
  const mount=host.current;if(!mount)return
  let renderer,raf,quizTimer,disposed=false;const theme=ARENAS[ronda]
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'})}catch{setError('Este dispositivo no pudo iniciar los gráficos 3D. Prueba Chrome o Edge con aceleración gráfica activada.');return}
  setError('');renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement)
  const scene=new THREE.Scene();scene.background=new THREE.Color(theme.cielo);scene.fog=new THREE.Fog(theme.cielo,22,65)
  const camera=new THREE.PerspectiveCamera(55,1,.1,130);camera.position.set(0,7,10)
  scene.add(new THREE.HemisphereLight(0xeef8ff,0x758299,2.3));const sun=new THREE.DirectionalLight(0xfff2d6,3);sun.position.set(8,18,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-45;sun.shadow.camera.far=80;scene.add(sun)
  const materials=[],geometries=[]
  function mat(color,extra={}){const m=new THREE.MeshStandardMaterial({color,roughness:.72,...extra});materials.push(m);return m}
  function box(w,h,d,material,x,y,z,parent=scene,rounded=false){const geo=rounded?new RoundedBoxGeometry(w,h,d,2,.07):new THREE.BoxGeometry(w,h,d);geometries.push(geo);const mesh=new THREE.Mesh(geo,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
  const rock=mat(0x6f7f9c),grass=mat(theme.color),white=mat(0xf2f4f4),navy=mat(0x213653),shirt=mat(COLORES[avatar].color),gold=mat(0xffd075,{metalness:.3,roughness:.3})
  const platforms=plataformasPara(ronda)
  platforms.forEach((p,i)=>{box(p.w,1.5,p.d,rock,p.x,p.y-.75,p.z);box(p.w+.05,.18,p.d+.05,grass,p.x,p.y+.03,p.z);if(i>0){box(.14,1.8,.14,gold,p.x-p.w/2+.2,p.y+.9,p.z-.9);box(.9,.5,.08,white,p.x-p.w/2+.55,p.y+1.5,p.z-.9)}})
  // Arquitectura flotante al fondo, lejos del recorrido.
  const deco=mat(0xcad9e8)
  for(let i=0;i<18;i++){const side=i%2?1:-1;box(3,3+i%5*2,3,deco,side*(11+i%3*4),-4,-i*5);box(3.1,.3,3.1,grass,side*(11+i%3*4),-2.4+(i%5),-i*5)}
  const player=new THREE.Group();scene.add(player)
  const visor=mat(0x0e2740,{metalness:.4,roughness:.25}), glow=mat(0x69fff3,{emissive:0x2de6d4,emissiveIntensity:1.4})
  const rounded=(w,h,d,m,x,y,z,parent=player)=>box(w,h,d,m,x,y,z,parent,true)
  rounded(.78,.75,.53,shirt,0,1.17,0)
  rounded(.48,.38,.16,white,0,1.21,.29)
  rounded(.27,.08,.04,glow,0,1.24,.39)
  rounded(.73,.59,.61,white,0,1.91,0)
  rounded(.59,.31,.13,visor,0,1.92,-.28)
  for(const x of [-.14,.14])rounded(.075,.09,.03,glow,x,1.95,-.35)
  rounded(.12,.2,.12,navy,.23,2.25,0);rounded(.13,.13,.13,glow,.23,2.4,0)
  const arms=[],legs=[]
  for(const side of [-1,1]){
   const arm=new THREE.Group();arm.position.set(side*.48,1.45,0);player.add(arm);arms.push(arm)
   rounded(.26,.59,.29,shirt,0,-.23,0,arm);rounded(.24,.19,.24,white,0,-.56,0,arm)
   const leg=new THREE.Group();leg.position.set(side*.2,.82,0);player.add(leg);legs.push(leg)
   rounded(.28,.57,.31,navy,0,-.29,0,leg);rounded(.33,.21,.48,white,0,-.67,-.06,leg)
  }
  // Lector de energía: una tableta con pantalla y sensor, sin silueta de arma.
  const scanner=new THREE.Group();scanner.position.set(.51,.89,-.28);player.add(scanner)
  rounded(.38,.37,.16,shirt,0,0,0,scanner)
  rounded(.29,.24,.05,visor,0,0,.09,scanner)
  rounded(.20,.06,.05,glow,0,.02,.12,scanner)
  rounded(.22,.09,.06,glow,0,.13,-.1,scanner)
  const target=new THREE.Group();scene.add(target)
  const targetMaterial=mat(0xff6b86,{emissive:0x661a36,emissiveIntensity:.25})
  for(const [radius,color]of [[.7,targetMaterial],[.47,white],[.24,gold]]){const geo=new THREE.CylinderGeometry(radius,radius,.09,40);geometries.push(geo);const m=new THREE.Mesh(geo,color);m.rotation.x=Math.PI/2;m.position.z=radius===.7?0:radius===.47?.06:.12;target.add(m)}
  const pedestal=new THREE.Group();scene.add(pedestal)
  rounded(1.34,.22,1.05,navy,0,.12,0,pedestal)
  rounded(.29,2.3,.29,navy,0,1.22,0,pedestal)
  rounded(.11,1.8,.05,glow,0,1.2,.16,pedestal)
  const shieldGeo=new THREE.SphereGeometry(.86,20,16);geometries.push(shieldGeo);const shieldMat=mat(0x67d8ff,{transparent:true,opacity:.32,metalness:.4});const shield=new THREE.Mesh(shieldGeo,shieldMat);target.add(shield)
  const checkpoint=new THREE.Vector3(0,.13,0), pos=new THREE.Vector3(0,.13,0);let vy=0,onGround=true,jumpHeld=false,time=0,last=0,questionCount=0,targetOpen=true,stage=inicial()
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let yaw=0,pitch=0,drag=null;const focus=new THREE.Vector3(),desired=new THREE.Vector3()
  function resetPosition(){pos.copy(checkpoint);vy=0;onGround=true}
  function updateTarget(){const p=platforms[Math.min(stage.aciertos+1,8)];target.position.set(p.x,p.y+2.6,p.z-.6);pedestal.position.set(p.x,p.y,p.z-.6)}
  updateTarget();setHud(stage);setFinal(false);blocked.current=false
  engine.current={respond(correct){stage=premiar(stage,correct);if(correct){const p=platforms[Math.min(stage.aciertos,8)];checkpoint.set(p.x,p.y+.14,p.z+.8);updateTarget()}callbacks.current.hud({...stage});return {...stage}},reset:resetPosition,aim(active){
   aiming.current=active;camera.fov=active?47:55;camera.updateProjectionMatrix()
   if(active){const d=target.position.clone().sub(pos).sub(new THREE.Vector3(0,1.86,0));yaw=Math.atan2(d.x,-d.z);pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));keys.current={}}
  },scan:()=>shoot()}
  function enfocar(){
   camera.position.set(pos.x,pos.y+1.86,pos.z)
   focus.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)).add(camera.position)
   camera.lookAt(focus)
  }
  function shoot(){
   if(blocked.current||disposed)return
   if(!aiming.current){callbacks.current.aviso('Activa Apuntar para ver la retícula del lector.');return}
   pointer.set(0,0);enfocar();camera.updateMatrixWorld();target.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera)
   if(!raycaster.intersectObjects(target.children.filter(m=>m!==shield),false).length){callbacks.current.aviso('Apunta al círculo del blanco.');return}
   if(pos.distanceTo(target.position)>8){callbacks.current.aviso('Está lejos. Avanza saltando hasta la siguiente isla.');return}
   if(!targetOpen){callbacks.current.aviso('El escudo está cerrado. Espera hasta que se apague.');return}
   blocked.current=true;questionCount++
   const beamGeo=new THREE.BufferGeometry().setFromPoints([pos.clone().add(new THREE.Vector3(.5,1.2,0)),target.position.clone()]);geometries.push(beamGeo)
   const beamMat=new THREE.LineBasicMaterial({color:0xffed97});materials.push(beamMat);const beam=new THREE.Line(beamGeo,beamMat);scene.add(beam)
   quizTimer=setTimeout(()=>{if(disposed)return;scene.remove(beam);callbacks.current.quiz(preguntaPara(questionCount-1,ronda))},180)
   callbacks.current.aviso('¡Blanco alcanzado! Responde la pregunta de Scratch.')
  }
  const canvas=renderer.domElement
  const pointerDown=e=>{if(!aiming.current||blocked.current||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)}
  const pointerMove=e=>{if(!drag||drag.id!==e.pointerId||!aiming.current)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(dx||dy){drag.moved=true;yaw+=dx*.004;pitch=THREE.MathUtils.clamp(pitch-dy*.004,-1.15,1.15)}drag.x=e.clientX;drag.y=e.clientY}
  const pointerUp=e=>{if(drag?.id!==e.pointerId)return;const click=!drag.moved;drag=null;if(click)shoot()}
  const pointerCancel=()=>{drag=null}
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerCancel)

  const down=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){if(!blocked.current){e.preventDefault();if(aiming.current&&e.code==='Space'&&!e.repeat)shoot();else keys.current[e.code]=true}}}
  const up=e=>{keys.current[e.code]=false};const blur=()=>{keys.current={}}
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur)
  function resize(){const width=mount.clientWidth||800,height=mount.clientHeight||460;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()}
  const observer=new ResizeObserver(resize);observer.observe(mount);resize()
  function loop(stamp){if(disposed)return;raf=requestAnimationFrame(loop);const dt=Math.min(.033,(stamp-(last||stamp))/1000);last=stamp
   if(!blocked.current){time+=dt;const k=keys.current;const dx=Number(!!(k.ArrowRight||k.KeyD||k.right))-Number(!!(k.ArrowLeft||k.KeyA||k.left)),dz=Number(!!(k.ArrowDown||k.KeyS||k.back))-Number(!!(k.ArrowUp||k.KeyW||k.forward));const len=Math.hypot(dx,dz)||1
    if(aiming.current){yaw+=dx*dt*1.4;pitch=THREE.MathUtils.clamp(pitch-dz*dt*1.4,-1.15,1.15)}
    else{
     const x=THREE.MathUtils.clamp(pos.x+dx/len*4.4*dt,-8,8),z=Math.min(3,pos.z+dz/len*4.4*dt)
     const center={x:pedestal.position.x,y:pedestal.position.y+2.6,z:pedestal.position.z}
     const blockedBy=(nx,nz)=>[center,target.position].some(t=>chocaConBlanco(nx,pos.y,nz,t)&&Math.hypot(nx-t.x,nz-t.z)<Math.hypot(pos.x-t.x,pos.z-t.z))
     const collision=blockedBy(x,pos.z)||blockedBy(pos.x,z)
     if(!blockedBy(x,pos.z))pos.x=x
     if(!blockedBy(pos.x,z))pos.z=z
     if(collision)callbacks.current.aviso('Estás frente al blanco. Pulsa Apuntar y luego Escanear.')
    }
    const jumping=!aiming.current&&!!(k.Space||k.jump);if(jumping&&!jumpHeld&&onGround){vy=8.5;onGround=false}jumpHeld=jumping;const oldY=pos.y;vy-=22*dt;pos.y+=vy*dt;onGround=false
    for(const p of platforms){const top=p.y+.14;if(vy<=0&&oldY>=top-.04&&pos.y<=top&&Math.abs(pos.x-p.x)<p.w/2+.1&&Math.abs(pos.z-p.z)<p.d/2+.1){pos.y=top;vy=0;onGround=true;break}}
    if(pos.y < -6){stage={...stage,vidas:Math.max(0,stage.vidas-1)};resetPosition();callbacks.current.hud({...stage});callbacks.current.aviso('Caíste. Vuelve a intentarlo desde tu última isla conquistada.');if(!stage.vidas){blocked.current=true;callbacks.current.quiz({fin:true})}}
    if(!aiming.current&&(dx||dz))player.rotation.y=Math.atan2(-dx,-dz);const walking=!aiming.current&&onGround&&(dx||dz);legs.forEach((m,i)=>{m.rotation.x=walking?Math.sin(time*12+i*Math.PI)*.5:0});arms.forEach((m,i)=>{m.rotation.x=walking?-Math.sin(time*12+i*Math.PI)*.3:0})
    updateTarget();if(ronda===1||ronda===3)target.position.x+=Math.sin(time*1.8)*1.1
    targetOpen=ronda<2||time%4<2.3;shield.visible=!targetOpen
   }
   player.position.copy(pos)
   player.visible=!aiming.current
   if(!aiming.current&&camera.fov!==55){camera.fov=55;camera.updateProjectionMatrix()}
   if(aiming.current){enfocar()}else{
    desired.set(pos.x*.35,pos.y+7.2,pos.z+10)
    if(camera.position.distanceTo(desired)>7)camera.position.copy(desired)
    else camera.position.lerp(desired,1-Math.exp(-dt*5))
    camera.lookAt(pos.x*.3,Math.max(.8,pos.y+1),pos.z-3.3)
   }
   renderer.render(scene,camera)
  }
  raf=requestAnimationFrame(loop)
  return()=>{disposed=true;clearTimeout(quizTimer);cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerCancel);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);keys.current={};materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());renderer.dispose();renderer.domElement.remove();engine.current=null}
 },[ronda,avatar,sesion])
 function responder(i){if(respuesta!==null)return;const correct=pregunta.opciones[i].correcta;setRespuesta(i);const state=engine.current.respond(correct);if(correct&&state.aciertos>=ARENAS[ronda].objetivo){const next={...records,[ronda]:Math.max(records[ronda]||0,state.puntos)};setRecords(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}}}
 function continuar(){const win=hud.aciertos>=ARENAS[ronda].objetivo;if(win||hud.vidas<=0)setFinal(true);setPregunta(null);setRespuesta(null);keys.current={}}
 function cambiarMira(){if(!engine.current||pregunta||final||pausa)return;const next=!mira;engine.current.aim(next);setMira(next);setAviso(next?'Centra el blanco en la retícula y pulsa Escanear.':'Avanza y salta para acercarte al siguiente blanco.') }
 function reiniciar(i=ronda){aiming.current=false;setMira(false);setRonda(i);setSesion(n=>n+1);setPregunta(null);setRespuesta(null);setFinal(false);setPausa(false);setAviso(ARENAS[i].descripcion)}
 const control=(code,label)=><button type="button" aria-label={label} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current[code]=true}} onPointerUp={()=>{keys.current[code]=false}} onPointerCancel={()=>{keys.current[code]=false}}>{label}</button>
 return <div className="game-overlay arena-overlay"><div className="game-shell"><header className="game-header"><div><small>PLATAFORMAS 3D + PROGRAMACIÓN</small><h2>🎯 Islas del Código</h2></div><button className="btn-ghost" onClick={onCerrar}>Cerrar ✕</button></header><nav className="game-tabs" aria-label="Arenas">{ARENAS.map((a,i)=><button key={a.nombre} disabled={i>0&&records[i-1]===undefined} aria-current={ronda===i?'step':undefined} onClick={()=>reiniciar(i)}>{records[i]?'✓':i+1} {a.nombre}</button>)}</nav>
 <div className="arena-hud"><strong>{ARENAS[ronda].nombre}</strong><span>♥ {hud.vidas}/5</span><span>★ {hud.puntos}</span><span>🎯 {hud.aciertos}/{ARENAS[ronda].objetivo}</span><button onClick={()=>setPausa(p=>!p)}>{pausa?'▶ Seguir':'⏸ Pausa'}</button></div>
 <div className="arena-stage"><div ref={host} className="arena-canvas" aria-label="Arena tridimensional de plataformas; acércate al blanco y usa el lector de energía"/>{mira&&!pregunta&&!final&&!pausa&&<div className="arena-scan-view" aria-hidden="true"><span className="arena-scan-reticle"/><span className="arena-scan-screen">LECTOR DE ENERGÍA</span></div>}{error&&<div className="arena-modal"><p>{error}</p></div>}{pausa&&!pregunta&&!final&&<div className="arena-modal"><h2>En pausa</h2><button className="btn-primary" onClick={()=>setPausa(false)}>Continuar</button></div>}
 {pregunta&&<div className="arena-modal"><section className="arena-question" role="dialog" aria-modal="true" aria-label="Pregunta de Scratch">{pregunta.fin?<><h2>Sin vidas</h2><p>Puedes volver a intentarlo desde el inicio de esta arena.</p><button className="btn-primary" onClick={()=>reiniciar()}>Intentar otra vez</button></>:<><small>BLANCO ALCANZADO · PIENSA Y RESPONDE</small><h3>{pregunta.texto}</h3>{pregunta.opciones.map((o,i)=><button key={o.texto} disabled={respuesta!==null} onClick={()=>responder(i)} style={{borderColor:respuesta!==null&&o.correcta?'#6ff4bf':respuesta===i?'#ff8798':undefined}}>{o.texto}</button>)}{respuesta!==null&&<><p role="status">{pregunta.opciones[respuesta].correcta?'✓ +100 puntos y recuperas una vida.':'Aún no. Pierdes una vida; puedes seguir practicando.'} {pregunta.explicacion}</p><button className="btn-primary" onClick={continuar}>Continuar →</button></>}</>}</section></div>}
 {final&&<div className="arena-modal"><section className="arena-question"><h2>{hud.vidas>0?'¡Arena conquistada!':'¡Vamos de nuevo!'}</h2><p>{hud.puntos} puntos · {hud.aciertos} preguntas resueltas</p><button onClick={()=>reiniciar()}>Repetir arena</button>{hud.vidas>0&&ronda<3&&<button onClick={()=>reiniciar(ronda+1)}>Siguiente arena →</button>}</section></div>}</div>
 <div className="arena-controls"><div>{control('left','←')}{control('forward','↑')}{control('back','↓')}{control('right','→')}</div><div>{!mira&&control('jump','Saltar')}<button type="button" aria-pressed={mira} onClick={cambiarMira} disabled={!!error}>{mira?'Salir de mira':'Apuntar'}</button>{mira&&<button type="button" onClick={()=>engine.current?.scan()}>Escanear</button>}</div></div><p className="game-feedback" role="status">{aviso}</p><p className="game-muted">Usa flechas o WASD para caminar y espacio para saltar. Pulsa Apuntar para mirar desde el robot. Ajusta la retícula arrastrando sobre la pantalla o con las flechas. Pulsa Escanear o espacio cuando el blanco esté centrado. Acierto: +100 puntos y +1 vida; error o caída: −1 vida. La siguiente arena se abre al completar las preguntas.</p><label className="game-muted">Personaje (cambiarlo reinicia esta arena): <select value={avatar} onChange={e=>{aiming.current=false;setMira(false);setPregunta(null);setFinal(false);setPausa(false);setAvatar(Number(e.target.value))}}>{COLORES.map((c,i)=><option key={c.nombre} value={i}>{c.nombre}</option>)}</select></label><p className="game-muted">Récords por usuario en este navegador. Los puntos de esta arena son independientes de tus XP y certificados.</p>
 </div></div>
}
