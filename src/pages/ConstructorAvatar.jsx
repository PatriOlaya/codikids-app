import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'

// ── Adventurer (Humano)
const PIELES = ['ffd5b0','f5cfa0','edb98a','d08b5b','a05c35','5c3010']
const CABELLOS_CORTOS = ['short01','short02','short03','short04','short05','short06','short07','short08','short09','short10']
const CABELLOS_LARGOS = ['long01','long02','long03','long04','long05','long06','long07','long08','long09','long10']
const COLORES_CAB = ['2c1810','8b4513','daa520','c0c0c0','7f77dd','5dcaa5','e85d4a','d4537e']
const BG_HUMANO   = ['b39ddb','f48fb1','80cbc4','90caf9','ffcc80','a5d6a7','ce93d8','f0e6aa']
const OJOS_H      = ['variant01','variant02','variant03','variant04','variant05','variant06','variant07','variant08','variant09','variant10']
const BOCAS_H     = ['variant01','variant02','variant03','variant04','variant05','variant06','variant07','variant08','variant09','variant10']
const GAFAS       = ['','variant01','variant02','variant03','variant04','variant05']
const FEATURES    = [
  { label:'Ninguno',  val:'' },
  { label:'Manchita', val:'birthmark' },
  { label:'Pecas',    val:'freckles' },
  { label:'Rubor',    val:'blush' },
  { label:'Bigote',   val:'mustache' },
]

// ── Bottts (Robot)
const COLORES_ROBOT = ['6eecdb','ef9f27','d4537e','378add','5dcaa5','ee6055','c8c6be','a78bfa']
const BG_ROBOT      = ['534ab7','1a0f3c','185fa5','1d9e75','d85a30','ba7517','2c2c2a','993556']
const OJOS_R        = ['bulging','dizzy','eva','frame1','frame2','glow']
const CARAS_R       = ['round01','round02','square01','square02','square03','square04']
const BOCAS_R       = ['bite','diagram','grill01','grill02','grill03','smile01']
const TOPS_R        = ['antenna','antennaCrooked','bulb01','glowingBulb01','glowingBulb02','horns','lights','radar','spring']
const LADOS_R       = ['antenna01','antenna02','cables01','cables02','round','square']
const TEXTURAS_R    = [
  { label:'Ninguna',   val:'' },
  { label:'Circuitos', val:'circuits' },
  { label:'Camuflaje', val:'camo01' },
  { label:'Puntos',    val:'dots' },
  { label:'Sucio',     val:'dirty01' },
]

export default function ConstructorAvatar({ user, onVolver, onGuardado }) {
  const [config, setConfig] = useState({
    tipo:'humano', seed:'Inventor',
    // Humano
    backgroundColor:'b39ddb', skinColor:'f5cfa0',
    hair:'short01', hairColor:'2c1810',
    eyes:'variant01', eyebrows:'variant01', mouth:'variant01',
    glasses:'', features:'',
    // Robot
    bgRobot:'534ab7', baseColor:'6eecdb',
    robotEyes:'eva', robotFace:'round01', robotMouth:'smile01',
    robotTop:'antennaCrooked', robotSides:'antenna01', robotTexture:'',
  })
  const [saving,  setSaving]  = useState(false)
  const [cabTipo, setCabTipo] = useState('corto')
  const [tab,     setTab]     = useState('apariencia')

  useEffect(() => {
    supabase.from('estudiantes').select('nombre, avatar_config').eq('id', user.id).single()
      .then(({ data }) => {
        if (data?.avatar_config && Object.keys(data.avatar_config).length > 0)
          setConfig(prev => ({ ...prev, ...data.avatar_config }))
        if (data?.nombre) setConfig(prev => ({ ...prev, seed: data.nombre }))
      })
  }, [user])

  const set = (k, v) => setConfig(prev => ({ ...prev, [k]: v }))

  async function guardar() {
    setSaving(true)
    const { data, error } = await supabase
      .from('estudiantes')
      .update({ avatar_config: config })
      .eq('id', user.id)
      .select('avatar_config')
      .single()

    setSaving(false)

    if (error) {
      alert('Error al guardar: ' + error.message)
      return
    }

    // Esperar confirmación y volver al lab
    await new Promise(r => setTimeout(r, 300))
    onGuardado && onGuardado(config)
  }

  const esRobot = config.tipo === 'robot'

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at 30% 20%, #2d1b6b 0%, #1a0f3c 50%, #0a0520 100%)', fontFamily:'var(--font-body)', padding:'1.5rem 1rem' }}>
      <Stars />
      <div style={{ maxWidth:740, margin:'0 auto', position:'relative', zIndex:1 }}>

        <header style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
          <button className="btn-ghost" onClick={onVolver} style={{ padding:'.5rem 1rem', fontSize:'.85rem' }}>← Volver</button>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem' }}>Mi Inventor 🎨</div>
        </header>

        <div style={{ display:'grid', gridTemplateColumns:'190px 1fr', gap:'1.5rem' }}>

          {/* Preview */}
          <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', padding:'1.5rem' }}>
            <div style={{ animation:'flotar 4s ease-in-out infinite' }}>
              <Avatar config={config} size={150} />
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'.95rem', textAlign:'center', color:'rgba(255,255,255,.8)' }}>
              {config.seed}
            </div>
            <button className="btn-primary" style={{ width:'100%', opacity: saving?.7:1 }} onClick={guardar} disabled={saving}>
              {saving ? 'Guardando...' : '¡Guardar! 💾'}
            </button>
          </div>

          {/* Panel */}
          <div className="card" style={{ padding:'1rem' }}>

            {/* Tipo humano / robot */}
            <div style={{ display:'flex', gap:8, marginBottom:'1rem' }}>
              {[['humano','🧑 Humano'],['robot','🤖 Robot']].map(([t,l]) => (
                <button key={t} onClick={() => { set('tipo',t); setTab('apariencia') }}
                  style={{ flex:1, padding:'.6rem', borderRadius:10, fontSize:'.9rem', fontWeight:700,
                    border:`1.5px solid ${config.tipo===t?'rgba(127,119,221,.6)':'rgba(255,255,255,.12)'}`,
                    background: config.tipo===t?'rgba(127,119,221,.2)':'transparent',
                    color: config.tipo===t?'#fff':'rgba(255,255,255,.55)',
                    fontFamily:'var(--font-body)', cursor:'pointer'
                  }}>{l}</button>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:6, marginBottom:'1rem', flexWrap:'wrap' }}>
              {(esRobot
                ? [['apariencia','🎨 Color'],['cara','👁 Cara'],['piezas','🔧 Piezas']]
                : [['apariencia','🎨 Piel'],['cabello','💇 Cabello'],['cara','😊 Cara'],['extras','✨ Extras']]
              ).map(([id,label]) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{ padding:'.4rem .9rem', borderRadius:99, fontSize:'.8rem', fontWeight:700,
                    border:`1px solid ${tab===id?'rgba(127,119,221,.5)':'rgba(255,255,255,.12)'}`,
                    background: tab===id?'rgba(127,119,221,.2)':'transparent',
                    color: tab===id?'#fff':'rgba(255,255,255,.55)',
                    fontFamily:'var(--font-body)', cursor:'pointer'
                  }}>{label}</button>
              ))}
            </div>

            {/* ═══ HUMANO ═══ */}
            {!esRobot && (
              <>
                {tab==='apariencia' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Color de piel">
                      <Colores vals={PIELES} activo={config.skinColor} onClick={v=>set('skinColor',v)} />
                    </Sec>
                    <Sec titulo="Color de fondo">
                      <Colores vals={BG_HUMANO} activo={config.backgroundColor} onClick={v=>set('backgroundColor',v)} />
                    </Sec>
                  </div>
                )}
                {tab==='cabello' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Color de cabello">
                      <Colores vals={COLORES_CAB} activo={config.hairColor} onClick={v=>set('hairColor',v)} />
                    </Sec>
                    <Sec titulo="Estilo de cabello">
                      <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                        {['corto','largo'].map(t=>(
                          <button key={t} onClick={()=>{setCabTipo(t);set('hair',t==='corto'?'short01':'long01')}}
                            style={{ padding:'4px 12px', borderRadius:99, fontSize:'.8rem', fontWeight:700,
                              border:`1px solid ${cabTipo===t?'rgba(127,119,221,.5)':'rgba(255,255,255,.12)'}`,
                              background:cabTipo===t?'rgba(127,119,221,.2)':'transparent',
                              color:cabTipo===t?'#fff':'rgba(255,255,255,.55)',
                              fontFamily:'var(--font-body)', cursor:'pointer'
                            }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
                        ))}
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                        {(cabTipo==='corto'?CABELLOS_CORTOS:CABELLOS_LARGOS).map((h,i)=>(
                          <MiniCard key={h} activo={config.hair===h} onClick={()=>set('hair',h)} label={i+1}>
                            <Avatar config={{...config,hair:h}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                  </div>
                )}
                {tab==='cara' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Ojos">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                        {OJOS_H.map((o,i)=>(
                          <MiniCard key={o} activo={config.eyes===o} onClick={()=>set('eyes',o)} label={i+1}>
                            <Avatar config={{...config,eyes:o}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                    <Sec titulo="Boca">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                        {BOCAS_H.map((m,i)=>(
                          <MiniCard key={m} activo={config.mouth===m} onClick={()=>set('mouth',m)} label={i+1}>
                            <Avatar config={{...config,mouth:m}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                  </div>
                )}
                {tab==='extras' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Gafas">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                        {GAFAS.map((g,i)=>(
                          <MiniCard key={i} activo={config.glasses===g} onClick={()=>set('glasses',g)} label={g?`Tipo ${i}`:'Sin gafas'}>
                            <Avatar config={{...config,glasses:g,glassesProbability:g?100:0}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                    <Sec titulo="Detalles del rostro">
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {FEATURES.map(f=>(
                          <Btn key={f.val} activo={config.features===f.val} onClick={()=>set('features',f.val)}>{f.label}</Btn>
                        ))}
                      </div>
                    </Sec>
                  </div>
                )}
              </>
            )}

            {/* ═══ ROBOT ═══ */}
            {esRobot && (
              <>
                {tab==='apariencia' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Color del robot">
                      <Colores vals={COLORES_ROBOT} activo={config.baseColor} onClick={v=>set('baseColor',v)} />
                    </Sec>
                    <Sec titulo="Color de fondo">
                      <Colores vals={BG_ROBOT} activo={config.bgRobot} onClick={v=>set('bgRobot',v)} />
                    </Sec>
                    <Sec titulo="Textura">
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {TEXTURAS_R.map(t=>(
                          <Btn key={t.val} activo={config.robotTexture===t.val} onClick={()=>set('robotTexture',t.val)}>{t.label}</Btn>
                        ))}
                      </div>
                    </Sec>
                  </div>
                )}
                {tab==='cara' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Cara">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                        {CARAS_R.map((f,i)=>(
                          <MiniCard key={f} activo={config.robotFace===f} onClick={()=>set('robotFace',f)} label={`Cara ${i+1}`}>
                            <Avatar config={{...config,robotFace:f}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                    <Sec titulo="Ojos">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                        {OJOS_R.map((o,i)=>(
                          <MiniCard key={o} activo={config.robotEyes===o} onClick={()=>set('robotEyes',o)} label={`Ojos ${i+1}`}>
                            <Avatar config={{...config,robotEyes:o}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                    <Sec titulo="Boca">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                        {BOCAS_R.map((m,i)=>(
                          <MiniCard key={m} activo={config.robotMouth===m} onClick={()=>set('robotMouth',m)} label={`Boca ${i+1}`}>
                            <Avatar config={{...config,robotMouth:m}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                  </div>
                )}
                {tab==='piezas' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                    <Sec titulo="Parte de arriba">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                        {TOPS_R.map((t,i)=>(
                          <MiniCard key={t} activo={config.robotTop===t} onClick={()=>set('robotTop',t)} label={`Top ${i+1}`}>
                            <Avatar config={{...config,robotTop:t}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                    <Sec titulo="Accesorios laterales">
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                        {LADOS_R.map((s,i)=>(
                          <MiniCard key={s} activo={config.robotSides===s} onClick={()=>set('robotSides',s)} label={`Lado ${i+1}`}>
                            <Avatar config={{...config,robotSides:s}} size={44}/>
                          </MiniCard>
                        ))}
                      </div>
                    </Sec>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Subcomponentes
function Sec({ titulo, children }) {
  return (
    <div>
      <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', letterSpacing:2, marginBottom:'.5rem' }}>{titulo.toUpperCase()}</div>
      {children}
    </div>
  )
}

function Colores({ vals, activo, onClick }) {
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
      {vals.map(v => (
        <div key={v} onClick={() => onClick(v)}
          style={{ width:30, height:30, borderRadius:'50%', background:`#${v}`, cursor:'pointer',
            border: activo===v?'3px solid #fff':'2px solid transparent',
            boxShadow: activo===v?'0 0 0 1px rgba(255,255,255,.4)':'none',
            transition:'transform .12s'
          }}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.18)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}/>
      ))}
    </div>
  )
}

function MiniCard({ activo, onClick, label, children }) {
  return (
    <div onClick={onClick}
      style={{ padding:'6px 4px', borderRadius:8, textAlign:'center', cursor:'pointer',
        background: activo?'rgba(127,119,221,.25)':'rgba(255,255,255,.05)',
        border:`1px solid ${activo?'rgba(127,119,221,.55)':'rgba(255,255,255,.1)'}`,
        transition:'all .12s'
      }}>
      {children}
      <div style={{ marginTop:3, fontSize:'.68rem', color:'rgba(255,255,255,.6)' }}>{label}</div>
    </div>
  )
}

function Btn({ activo, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ padding:'5px 12px', borderRadius:99, fontSize:'.8rem', fontWeight:700,
        border:`1px solid ${activo?'rgba(127,119,221,.55)':'rgba(255,255,255,.12)'}`,
        background: activo?'rgba(127,119,221,.2)':'rgba(255,255,255,.05)',
        color: activo?'#fff':'rgba(255,255,255,.65)',
        fontFamily:'var(--font-body)', cursor:'pointer'
      }}>{children}</button>
  )
}

function Stars() {
  const stars = Array.from({length:18},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*1.4+.7,delay:Math.random()*4}))
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
      {stars.map(s=><div key={s.id} style={{position:'absolute',left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:'50%',background:'#fff',animation:`twinkle ${2+s.delay}s ease-in-out infinite`,animationDelay:`${s.delay}s`}}/>)}
    </div>
  )
}
