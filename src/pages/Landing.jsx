import { useEffect, useRef } from 'react'
import ChatCody from '../components/ChatCody'

export default function Landing() {
  const wa = 'https://wa.me/573193579832?text=Hola%21+Me+interesa+inscribir+a+mi+hijo+en+CodiKids+%F0%9F%9A%80'

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: '#0f0829', color: '#fff', overflowX: 'hidden' }}>
      <Stars />

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,8,41,.92)', borderBottom: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(12px)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#534AB7,#5DCAA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🚀</div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>CodiKids</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/entrar" style={{ background: 'rgba(127,119,221,.15)', color: '#7F77DD', border: '1px solid rgba(127,119,221,.35)', borderRadius: 99, padding: '.5rem 1.2rem', fontSize: '.85rem', fontWeight: 700, fontFamily: 'Nunito,sans-serif', cursor: 'pointer', textDecoration: 'none' }}>🚀 Acceso estudiantes</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(93,202,165,.15)', border: '1px solid rgba(93,202,165,.3)', borderRadius: 99, padding: '.4rem 1.2rem', fontSize: '.82rem', color: '#5DCAA5', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: 1 }}>
          ACADEMIA VIRTUAL · COLOMBIA · 8 A 12 AÑOS
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: 700 }}>
          Tu hijo no solo<br/>
          <span style={{ color: '#5DCAA5' }}>usará tecnología.</span><br/>
          Aprenderá a <span style={{ color: '#7F77DD' }}>crearla.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,.6)', maxWidth: 520, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          En CodiKids los niños crean sus propios videojuegos con Scratch en clases en vivo online, guiados por una docente certificada. Cada misión hace crecer su planeta virtual.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={wa} target="_blank" rel="noreferrer" style={{ background: '#534AB7', color: '#fff', borderRadius: 14, padding: '1rem 2rem', fontSize: '1rem', fontWeight: 800, fontFamily: 'Nunito,sans-serif', textDecoration: 'none', display: 'inline-block' }}>
            ¡Quiero inscribir a mi hijo! 🚀
          </a>
          <a href="#como-funciona" style={{ background: 'rgba(255,255,255,.07)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', borderRadius: 14, padding: '1rem 2rem', fontSize: '1rem', fontWeight: 700, fontFamily: 'Nunito,sans-serif', textDecoration: 'none', display: 'inline-block' }}>
            Ver cómo funciona
          </a>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['8-12','años'],['Online','clases en vivo'],['Colombia','cobertura'],['Nivel 2','abierto']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#7F77DD' }}>{v}</div>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '5rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: '.5rem' }}>METODOLOGÍA</div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700 }}>Así funciona CodiKids</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem' }}>
          {[
            ['🌍','Laboratorio propio','Cada niño tiene su planeta virtual que crece con cada misión completada'],
            ['🎮','Crea videojuegos reales','Con Scratch construyen juegos reales que pueden compartir con su familia'],
            ['✅','La profe aprueba','Nadie avanza sin demostrar que hizo el trabajo. No hay atajos.'],
            ['👨‍👩‍👦','Padres siempre informados','Los papás ven el progreso en tiempo real sin necesidad de crear cuenta'],
          ].map(([ico,t,s]) => (
            <div key={t} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 18, padding: '1.75rem 1.5rem' }}>
              <div style={{ fontSize: 36, marginBottom: '1rem' }}>{ico}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '.5rem' }}>{t}</div>
              <div style={{ fontSize: '.87rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EL PLANETA */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(83,74,183,.08)', borderTop: '1px solid rgba(83,74,183,.15)', borderBottom: '1px solid rgba(83,74,183,.15)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: '.5rem' }}>EL LABORATORIO</div>
            <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 700, marginBottom: '1rem' }}>Su planeta crece con cada logro</h2>
            <p style={{ color: 'rgba(255,255,255,.55)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Cada misión completada agrega un elemento nuevo al planeta de tu hijo. Primero los continentes, luego el océano, los árboles, la ciudad, las luces, la luna y finalmente las estrellas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {['🌍 Misión 1 → El continente aparece','🌊 Misión 2 → El gran océano','🌳 Misión 3 → Vida en el planeta','🏙 Misión 4 → La gran ciudad','⚡ Misión 5 → Energía infinita','🌙 Misión 6 → La luna propia','⭐ Misiones 7 y 8 → Estrella y corona de maestro'].map(m => (
                <div key={m} style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.65)', padding: '.4rem 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>{m}</div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PlanetaDemo />
          </div>
        </div>
      </section>

      {/* NIVELES */}
      <section id="niveles" style={{ padding: '5rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: '.5rem' }}>RUTA DE APRENDIZAJE</div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700 }}>De inventor a creador</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            ['1','Scratch Exploradores','Descubrir la programación con juegos simples','#534AB7',true],
            ['2','Scratch Ninja','Crear videojuegos para móviles','#1D9E75',true],
            ['3','Scratch Maestro','Diseñar videojuegos completos','#BA7517',false],
            ['4','Python','Programación de texto real','#185FA5',false],
            ['5','Inteligencia Artificial','Crear con IA','#993556',false],
            ['6','Robótica','Programar el mundo físico','#A32D2D',false],
          ].map(([n,t,s,col,abierto]) => (
            <div key={n} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', background: abierto ? `${col}18` : 'rgba(255,255,255,.03)', border: `1px solid ${abierto ? col+'40' : 'rgba(255,255,255,.07)'}`, borderRadius: 14, padding: '1.25rem 1.5rem', opacity: abierto ? 1 : .55 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>{n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{t}</div>
                <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{s}</div>
              </div>
              {abierto && <div style={{ background: col, color: '#fff', borderRadius: 99, padding: '.3rem .9rem', fontSize: '.75rem', fontWeight: 800, flexShrink: 0, whiteSpace: 'nowrap' }}>Inscripción abierta</div>}
            </div>
          ))}
        </div>
      </section>

      {/* PARA PADRES */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(29,158,117,.06)', borderTop: '1px solid rgba(29,158,117,.12)', borderBottom: '1px solid rgba(29,158,117,.12)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: '.5rem' }}>PARA LOS PAPÁS</div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: '1rem' }}>Tranquilidad total para la familia</h2>
          <p style={{ color: 'rgba(255,255,255,.55)', marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>Recibes un link para ver el progreso de tu hijo sin crear cuenta. Sin contraseñas, sin complicaciones.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
            {[
              ['📱','Sin crear cuenta','Solo abre el link que te mandamos'],
              ['🌍','Ve el planeta crecer','Cada misión aprobada en tiempo real'],
              ['🎮','Juega sus inventos','Los juegos que crea tu hijo'],
              ['🔒','Entorno 100% seguro','Sin chats entre niños, sin contenido inapropiado'],
            ].map(([ico,t,s]) => (
              <div key={t} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(29,158,117,.2)', borderRadius: 16, padding: '1.5rem' }}>
                <div style={{ fontSize: 32, marginBottom: '.75rem' }}>{ico}</div>
                <div style={{ fontWeight: 800, marginBottom: '.4rem' }}>{t}</div>
                <div style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.5)' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT CODY */}
      <ChatCody />

      {/* FORMULARIO / CTA */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: '.5rem' }}>INSCRIPCIONES ABIERTAS</div>
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, marginBottom: '1rem' }}>¿Listo para que tu hijo cree tecnología?</h2>
        <p style={{ color: 'rgba(255,255,255,.55)', marginBottom: '2.5rem', lineHeight: 1.7 }}>Cupos limitados para grupos pequeños y personalizados. Escríbenos y te contamos todo.</p>

        <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem' }}>
          <FormInscripcion wa={wa} />
        </div>

        <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.3)' }}>También puedes escribirnos directamente al <span style={{ color: '#5DCAA5' }}>+57 319 357 9832</span></p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem', marginBottom: '1rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#534AB7,#5DCAA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🚀</div>
          <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700 }}>CodiKids</span>
        </div>
        <a href={wa} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: '#534AB7', color: '#fff', borderRadius: 14, padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 800, fontFamily: 'Nunito,sans-serif', textDecoration: 'none', marginBottom: '1.5rem' }}>
          ¡Inscribir a mi hijo! 🚀
        </a>
        <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.3)', lineHeight: 1.8 }}>
          Academia virtual de programación para niños · Colombia<br/>
          codikids.cercia.co · +57 319 357 9832
        </p>
      </footer>
    </div>
  )
}

function FormInscripcion({ wa }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const nombre = e.target.nombre.value
    const edad   = e.target.edad.value
    const msg = `Hola! Me interesa inscribir a mi hijo en CodiKids 🚀%0A%0ANombre del niño: ${encodeURIComponent(nombre)}%0AEdad: ${edad} años%0A%0A¿Me pueden dar más información?`
    window.open(`https://wa.me/573193579832?text=${msg}`, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'left' }}>
        <label style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: '.4rem' }}>Nombre del niño o niña</label>
        <input name="nombre" type="text" placeholder="Ejemplo: Jero" required style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', fontFamily: 'Nunito,sans-serif', fontSize: '1rem', padding: '.75rem 1rem', outline: 'none' }} />
      </div>
      <div style={{ textAlign: 'left' }}>
        <label style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: '.4rem' }}>Edad</label>
        <select name="edad" required style={{ width: '100%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 10, color: '#fff', fontFamily: 'Nunito,sans-serif', fontSize: '1rem', padding: '.75rem 1rem', outline: 'none' }}>
          <option value="">Selecciona la edad</option>
          {[8,9,10,11,12].map(a => <option key={a} value={a}>{a} años</option>)}
        </select>
      </div>
      <button type="submit" style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: '1rem', fontWeight: 800, fontFamily: 'Nunito,sans-serif', cursor: 'pointer', marginTop: '.5rem' }}>
        ¡Quiero inscribirme por WhatsApp! 💬
      </button>
    </form>
  )
}

function PlanetaDemo() {
  return (
    <svg width="220" height="220" viewBox="0 0 200 200" style={{ animation: 'flotar 5s ease-in-out infinite', filter: 'drop-shadow(0 0 30px rgba(83,74,183,.4))' }}>
      <defs>
        <radialGradient id="lpg" cx="40%" cy="35%" r="58%">
          <stop offset="0%" stopColor="#85B7EB"/>
          <stop offset="100%" stopColor="#0C447C"/>
        </radialGradient>
        <clipPath id="lpc"><circle cx="100" cy="100" r="75"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="80" fill="rgba(93,202,165,.15)"/>
      <circle cx="100" cy="100" r="75" fill="url(#lpg)"/>
      <g clipPath="url(#lpc)">
        <ellipse cx="85" cy="95" rx="48" ry="36" fill="#1D9E75"/>
        <ellipse cx="138" cy="118" rx="32" ry="24" fill="#0F6E56"/>
        <ellipse cx="65" cy="125" rx="22" ry="16" fill="#5DCAA5"/>
        <polygon points="82,60 90,78 74,78" fill="#3B6D11"/>
        <rect x="85" y="78" width="3" height="8" fill="#633806"/>
        <polygon points="96,54 106,76 86,76" fill="#639922"/>
        <rect x="94" y="76" width="4" height="9" fill="#633806"/>
        <rect x="128" y="86" width="9" height="18" fill="#B4B2A9" rx="1"/>
        <rect x="139" y="92" width="7" height="12" fill="#D3D1C7" rx="1"/>
        <circle cx="90" cy="55" r="5" fill="#EF9F27">
          <animate attributeName="opacity" values=".5;1;.5" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="148" cy="138" r="4" fill="#FAC775">
          <animate attributeName="opacity" values=".4;.9;.4" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
      <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
      <circle cx="152" cy="42" r="14" fill="#D3D1C7">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="100" r="94" fill="none" stroke="#7F77DD" strokeWidth="2" strokeDasharray="6 5" opacity=".5">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="28s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

function Stars() {
  const stars = Array.from({length:40},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*2+.5,delay:Math.random()*5}))
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
      {stars.map(s=><div key={s.id} style={{position:'absolute',left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:'50%',background:'#fff',animation:`twinkle ${2+s.delay}s ease-in-out infinite`,animationDelay:`${s.delay}s`}}/>)}
    </div>
  )
}
