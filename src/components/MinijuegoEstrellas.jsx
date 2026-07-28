import { useEffect, useRef, useState } from 'react'

const STAR_COLORS = ['#EF9F27','#5DCAA5','#7F77DD','#D4537E','#378ADD','#FAC775']

export default function MinijuegoEstrellas({ onCerrar }) {
  const cvRef   = useRef(null)
  const stateRef = useRef({
    running:false, player:null, objects:[], particles:[],
    bgStars:[], score:0, lives:3, timer:30, level:1,
    frame:0, spawnCount:0, keys:{left:false,right:false},
    raf:null, timerInt:null, spawnT:null
  })
  const [fase, setFase] = useState('inicio') // inicio | jugando | fin
  const [finalScore, setFinalScore] = useState(0)
  const [finalLevel, setFinalLevel] = useState(1)
  const [hud, setHud] = useState({score:0, lives:3, timer:30, level:1})
  const [floats, setFloats] = useState([])
  const floatId = useRef(0)

  function showFloat(x, y, text, color) {
    const id = floatId.current++
    setFloats(prev => [...prev, {id, x, y, text, color}])
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 900)
  }

  function updateHud() {
    const s = stateRef.current
    setHud({score:s.score, lives:s.lives, timer:s.timer, level:s.level})
  }

  function makeBgStars(W, H) {
    return Array.from({length:55}, () => ({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.4+.3, op:Math.random()*.5+.1
    }))
  }

  function startGame() {
    const cv = cvRef.current
    if (!cv) return
    const W = cv.width, H = cv.height
    const s = stateRef.current
    s.player = {x:W/2, y:H-48, speed:5.5}
    s.objects=[]; s.particles=[]
    s.score=0; s.lives=3; s.timer=30; s.level=1; s.spawnCount=0
    s.bgStars = makeBgStars(W, H)
    s.running = true
    setFase('jugando')
    updateHud()
    scheduleSpawn()
    if(s.raf) cancelAnimationFrame(s.raf)
    if(s.timerInt) clearInterval(s.timerInt)
    s.timerInt = setInterval(() => {
      if(!s.running) return
      s.timer--
      if(s.timer<=0){ s.timer=30; s.level++ }
      updateHud()
    }, 1000)
    loop()
  }

  function scheduleSpawn() {
    const s = stateRef.current
    if(!s.running) return
    const delay = Math.max(350, 1200 - s.level*60 + Math.random()*350)
    s.spawnT = setTimeout(() => { spawnObject(); scheduleSpawn() }, delay)
  }

  function spawnObject() {
    const s = stateRef.current
    const cv = cvRef.current
    if(!s.running || !cv) return
    const W = cv.width
    s.spawnCount++
    let type = 'star'
    if(s.spawnCount % 8 === 0) type = 'supernova'
    else if(s.spawnCount % 3 === 0) type = 'asteroid'
    s.objects.push({
      x: 24+Math.random()*(W-48), y:-20,
      r: type==='supernova'?16:type==='asteroid'?13+Math.random()*6:11+Math.random()*6,
      speed: type==='asteroid'?2+s.level*.5+Math.random():1.4+s.level*.35+Math.random()*1.2,
      color: type==='supernova'?'#FFD700':type==='asteroid'?'#8B2500':STAR_COLORS[Math.floor(Math.random()*STAR_COLORS.length)],
      type, rot:0, rotS:(Math.random()-.5)*(type==='asteroid'?.12:.07)
    })
  }

  function addParticles(x, y, color, n=10) {
    const s = stateRef.current
    for(let i=0;i<n;i++) s.particles.push({
      x, y, vx:(Math.random()-.5)*(n>12?9:6),
      vy:-Math.random()*(n>12?7:5)-2,
      life:1, color, r:3+Math.random()*4
    })
  }

  function drawStar5(ctx, x, y, r, rot, color) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot)
    ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=10
    ctx.beginPath()
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5-Math.PI/2, a2=a+Math.PI/5
      ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)
      ctx.lineTo(Math.cos(a2)*r*.42,Math.sin(a2)*r*.42)
    }
    ctx.closePath(); ctx.fill(); ctx.restore()
  }

  function drawSupernova(ctx, x, y, r, rot, frame) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot+frame*.04)
    const g=ctx.createRadialGradient(0,0,r*.5,0,0,r*2.2)
    g.addColorStop(0,'rgba(255,220,0,.4)'); g.addColorStop(1,'rgba(255,220,0,0)')
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,r*2.2,0,Math.PI*2); ctx.fill()
    ctx.fillStyle='#FFD700'; ctx.shadowColor='#FFD700'; ctx.shadowBlur=20
    ctx.beginPath()
    for(let i=0;i<8;i++){
      const a=i*Math.PI*2/8-Math.PI/8, a2=a+Math.PI/8
      ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)
      ctx.lineTo(Math.cos(a2)*r*.45,Math.sin(a2)*r*.45)
    }
    ctx.closePath(); ctx.fill()
    ctx.fillStyle='#fff'; ctx.shadowBlur=8
    ctx.beginPath(); ctx.arc(0,0,r*.3,0,Math.PI*2); ctx.fill()
    ctx.restore()
  }

  function drawAsteroid(ctx, x, y, r, rot) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot)
    ctx.fillStyle='#6B3A2A'; ctx.shadowColor='#E85D4A'; ctx.shadowBlur=6
    ctx.beginPath()
    for(let i=0;i<8;i++){
      const a=i*Math.PI*2/8, rr=r*(0.7+Math.sin(i*3.7)*0.3)
      i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)
    }
    ctx.closePath(); ctx.fill()
    ctx.fillStyle='#4A2010'
    ctx.beginPath(); ctx.arc(-r*.25,-r*.2,r*.2,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(r*.2,r*.1,r*.15,0,Math.PI*2); ctx.fill()
    ctx.strokeStyle='#E85D4A'; ctx.lineWidth=1.5; ctx.shadowBlur=8
    ctx.beginPath()
    for(let i=0;i<8;i++){
      const a=i*Math.PI*2/8, rr=r*(0.7+Math.sin(i*3.7)*0.3)
      i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)
    }
    ctx.closePath(); ctx.stroke()
    ctx.restore()
  }

  function drawPlayer(ctx, x, y) {
    ctx.save(); ctx.translate(x,y)
    ctx.fillStyle='#EF9F27'
    ctx.beginPath(); ctx.moveTo(-8,22); ctx.lineTo(0,38+Math.random()*7); ctx.lineTo(8,22); ctx.fill()
    ctx.fillStyle='#FAC775'
    ctx.beginPath(); ctx.moveTo(-4,22); ctx.lineTo(0,30+Math.random()*4); ctx.lineTo(4,22); ctx.fill()
    ctx.fillStyle='#1D9E75'
    ctx.beginPath(); ctx.moveTo(-17,6); ctx.lineTo(-30,22); ctx.lineTo(-13,16); ctx.fill()
    ctx.beginPath(); ctx.moveTo(17,6); ctx.lineTo(30,22); ctx.lineTo(13,16); ctx.fill()
    ctx.fillStyle='#534AB7'; ctx.shadowColor='#7F77DD'; ctx.shadowBlur=8
    ctx.beginPath(); ctx.ellipse(0,0,17,26,0,0,Math.PI*2); ctx.fill()
    ctx.fillStyle='#7F77DD'
    ctx.beginPath(); ctx.ellipse(0,-8,10,14,0,0,Math.PI*2); ctx.fill()
    ctx.fillStyle='#5DCAA5'; ctx.shadowColor='#5DCAA5'; ctx.shadowBlur=6
    ctx.beginPath(); ctx.arc(0,-6,7,0,Math.PI*2); ctx.fill()
    ctx.fillStyle='rgba(255,255,255,.75)'; ctx.shadowBlur=0
    ctx.beginPath(); ctx.arc(-2,-8,3,0,Math.PI*2); ctx.fill()
    ctx.restore()
  }

  function loop() {
    const cv = cvRef.current
    const s  = stateRef.current
    if(!s.running || !cv){s.raf=null;return}
    const ctx = cv.getContext('2d')
    const W=cv.width, H=cv.height
    s.frame++

    ctx.fillStyle='#0a0520'; ctx.fillRect(0,0,W,H)
    s.bgStars.forEach(st=>{
      ctx.fillStyle=`rgba(255,255,255,${st.op})`
      ctx.beginPath(); ctx.arc(st.x,st.y,st.r,0,Math.PI*2); ctx.fill()
    })

    if(s.keys.left)  s.player.x=Math.max(22,s.player.x-s.player.speed)
    if(s.keys.right) s.player.x=Math.min(W-22,s.player.x+s.player.speed)
    drawPlayer(ctx,s.player.x,s.player.y)

    for(let i=s.objects.length-1;i>=0;i--){
      const o=s.objects[i]
      o.y+=o.speed; o.rot+=o.rotS
      if(o.type==='supernova') drawSupernova(ctx,o.x,o.y,o.r,o.rot,s.frame)
      else if(o.type==='asteroid') drawAsteroid(ctx,o.x,o.y,o.r,o.rot)
      else drawStar5(ctx,o.x,o.y,o.r,o.rot,o.color)

      const dx=o.x-s.player.x, dy=o.y-s.player.y
      const hitR=o.type==='supernova'?o.r+22:o.r+18
      if(Math.sqrt(dx*dx+dy*dy)<hitR){
        if(o.type==='star'){ addParticles(o.x,o.y,o.color,10); s.score++; showFloat(o.x,o.y-10,'+1 ⭐','#EF9F27') }
        else if(o.type==='supernova'){ addParticles(o.x,o.y,'#FFD700',22); s.score+=5; showFloat(o.x,o.y-10,'+5 ✨','#FFD700') }
        else if(o.type==='asteroid'){ addParticles(o.x,o.y,'#E85D4A',14); s.score=Math.max(0,s.score-2); showFloat(o.x,o.y-10,'-2 ☄️','#E85D4A') }
        updateHud()
        s.objects.splice(i,1); continue
      }
      if(o.y>H+24){
        s.objects.splice(i,1)
        if(o.type!=='asteroid'){ s.lives--; updateHud(); if(s.lives<=0){endGame();return} }
      }
    }

    for(let i=s.particles.length-1;i>=0;i--){
      const p=s.particles[i]
      p.x+=p.vx; p.y+=p.vy; p.vy+=.18; p.life-=.04
      if(p.life<=0){s.particles.splice(i,1);continue}
      ctx.save(); ctx.globalAlpha=p.life
      ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=5
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2); ctx.fill()
      ctx.restore()
    }

    ctx.fillStyle='rgba(127,119,221,.7)'; ctx.font='bold 12px Nunito'; ctx.shadowBlur=0
    ctx.fillText('NIVEL '+s.level,8,18)
    s.raf=requestAnimationFrame(loop)
  }

  function endGame() {
    const s = stateRef.current
    s.running=false
    clearInterval(s.timerInt); clearTimeout(s.spawnT)
    setFinalScore(s.score); setFinalLevel(s.level)
    setFase('fin')
  }

  useEffect(() => {
    const onKey = (e) => {
      const s = stateRef.current
      if(e.type==='keydown'){
        if(e.key==='ArrowLeft'){s.keys.left=true;e.preventDefault()}
        if(e.key==='ArrowRight'){s.keys.right=true;e.preventDefault()}
      } else {
        if(e.key==='ArrowLeft') s.keys.left=false
        if(e.key==='ArrowRight') s.keys.right=false
      }
    }
    window.addEventListener('keydown',onKey)
    window.addEventListener('keyup',onKey)
    return () => {
      window.removeEventListener('keydown',onKey)
      window.removeEventListener('keyup',onKey)
      const s = stateRef.current
      s.running=false
      if(s.raf) cancelAnimationFrame(s.raf)
      clearInterval(s.timerInt); clearTimeout(s.spawnT)
    }
  }, [])

  const pressBtn = (dir, val) => { stateRef.current.keys[dir]=val }

  const emoji = finalScore>=30?'🏆':finalScore>=15?'⭐':'🚀'
  const msg   = finalScore>=30?'¡Maestro Inventor!':finalScore>=15?'¡Gran trabajo!':'¡Sigue practicando!'

  return (
    <div style={{ background:'rgba(10,5,32,.95)', borderRadius:20, overflow:'hidden', width:'100%', maxWidth:440, margin:'0 auto', fontFamily:'var(--font-body)' }}>

      {/* Header HUD */}
      <div style={{ background:'rgba(83,74,183,.25)', borderBottom:'1px solid rgba(127,119,221,.3)', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff' }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'14px' }}>🎮 Reto del Inventor</div>
        <div style={{ display:'flex', gap:14, fontSize:13, fontWeight:700 }}>
          <span>⭐ {hud.score}</span>
          <span>{'❤️'.repeat(Math.max(0,hud.lives))}</span>
          <span>⏱ {hud.timer}s</span>
        </div>
        <button onClick={onCerrar} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.5)', fontSize:18, cursor:'pointer' }}>✕</button>
      </div>

      {/* Canvas */}
      <div style={{ position:'relative', background:'#0a0520' }}>
        <canvas ref={cvRef} width={420} height={320} style={{ width:'100%', display:'block' }} />

        {/* Floats */}
        {floats.map(f => (
          <div key={f.id} style={{ position:'absolute', left:f.x, top:f.y, color:f.color, fontWeight:800, fontSize:16, pointerEvents:'none', transform:'translateX(-50%)', animation:'floatUp .8s ease forwards', whiteSpace:'nowrap' }}>
            {f.text}
          </div>
        ))}

        {/* Overlay inicio */}
        {fase==='inicio' && (
          <div style={{ position:'absolute', inset:0, background:'rgba(10,5,32,.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, color:'#fff', textAlign:'center', padding:'2rem' }}>
            <div style={{ fontSize:52 }}>🚀</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>Reto del Inventor</div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', fontSize:12, color:'rgba(255,255,255,.6)' }}>
              <span>⭐ +1 punto</span>
              <span style={{ color:'#FFD700' }}>✨ Supernova +5</span>
              <span style={{ color:'#E85D4A' }}>☄️ Asteroide -2</span>
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', lineHeight:1.7 }}>
              Mueve tu nave y atrapa las estrellas<br/>¡Evita los asteroides!
            </div>
            <button onClick={startGame} style={{ background:'#534AB7', border:'none', borderRadius:12, color:'#fff', fontFamily:'var(--font-body)', fontWeight:800, fontSize:15, padding:'12px 28px', cursor:'pointer', marginTop:4 }}>
              ¡Jugar ahora!
            </button>
          </div>
        )}

        {/* Overlay fin */}
        {fase==='fin' && (
          <div style={{ position:'absolute', inset:0, background:'rgba(10,5,32,.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, color:'#fff', textAlign:'center', padding:'2rem' }}>
            <div style={{ fontSize:56 }}>{emoji}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>{msg}</div>
            <div style={{ fontSize:30, fontWeight:800, color:'#EF9F27' }}>⭐ {finalScore} puntos</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.5)' }}>Nivel alcanzado: {finalLevel}</div>
            <button onClick={startGame} style={{ background:'#534AB7', border:'none', borderRadius:12, color:'#fff', fontFamily:'var(--font-body)', fontWeight:800, fontSize:15, padding:'12px 28px', cursor:'pointer' }}>
              Jugar de nuevo 🚀
            </button>
          </div>
        )}
      </div>

      {/* Controles */}
      <div style={{ background:'rgba(255,255,255,.04)', borderTop:'1px solid rgba(255,255,255,.07)', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button
          onPointerDown={()=>pressBtn('left',true)}
          onPointerUp={()=>pressBtn('left',false)}
          onPointerLeave={()=>pressBtn('left',false)}
          style={{ width:64,height:64,borderRadius:'50%',border:'none',background:'#534AB7',color:'#fff',fontSize:28,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none',WebkitTapHighlightColor:'transparent' }}>◀</button>
        <div style={{ textAlign:'center', color:'rgba(255,255,255,.5)', fontSize:11 }}>
          NIVEL<div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'#7F77DD' }}>{hud.level}</div>
        </div>
        <button
          onPointerDown={()=>pressBtn('right',true)}
          onPointerUp={()=>pressBtn('right',false)}
          onPointerLeave={()=>pressBtn('right',false)}
          style={{ width:64,height:64,borderRadius:'50%',border:'none',background:'#534AB7',color:'#fff',fontSize:28,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',touchAction:'none',WebkitTapHighlightColor:'transparent' }}>▶</button>
      </div>

      <style>{`@keyframes floatUp{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(-50px)}}`}</style>
    </div>
  )
}
