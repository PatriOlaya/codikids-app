import { useState, useRef, useEffect } from 'react'

const WA = 'https://wa.me/573193579832?text=Hola+Patricia%21+Me+interesa+inscribir+a+mi+hijo+en+CodiKids+%F0%9F%9A%80'

// ═══════════════════════════════════════════════
// BASE DE CONOCIMIENTO — todas las preguntas
// ═══════════════════════════════════════════════
const FAQ = [
  // ── QUÉ ES CODIKIDS
  {
    claves: ['qué es','que es','codikids','de qué','de que','trata','cuéntame','cuentame','información','informacion'],
    respuesta: '¡CodiKids es una academia virtual de programación para niños de 8 a 12 años! 🚀\n\nAquí los niños no solo aprenden tecnología — aprenden a CREARLA. Construyen sus propios videojuegos con Scratch en clases en vivo online, guiados por una profe certificada.'
  },
  // ── EDADES
  {
    claves: ['edad','edades','años','cuantos años','cuántos años','pequeño','grande','hijo tiene','niña tiene'],
    respuesta: 'CodiKids es para niños y niñas de 8 a 12 años 🎯\n\nSi tu hijo está en ese rango, ¡puede inscribirse! Si tiene menos de 8 o más de 12, escríbele a Patricia por WhatsApp para evaluar su caso.'
  },
  // ── PRECIO / COSTO
  {
    claves: ['precio','costo','cuánto','cuanto','vale','cobran','mensualidad','pago','tarifa','cuesta'],
    respuesta: 'Los precios mensuales son:\n\n💜 Nivel 1 — Scratch Exploradores: $190.000 COP\n🟢 Nivel 2 — Scratch Ninja: $240.000 COP\n\nEl pago es mensual. Para formas de pago escríbele a Patricia por WhatsApp 💬'
  },
  // ── HORARIOS
  {
    claves: ['horario','horarios','hora','cuando','cuándo','qué días','que dias','días','dias','disponible','disponibilidad'],
    respuesta: 'Las clases se dictan de lunes a viernes ⏰\n\nLos horarios se coordinan según la disponibilidad de tu hijo y la agenda de la profe. La clase dura 45 minutos.\n\nEscríbele a Patricia para ver qué horarios hay disponibles 👇'
  },
  // ── DURACIÓN DE CLASE
  {
    claves: ['duración','duracion','dura','tiempo','minutos','larga','cuánto tiempo','cuanto tiempo'],
    respuesta: 'Cada clase dura 45 minutos ⏱️\n\nSon clases en vivo por Google Meet, personalizadas para cada estudiante.'
  },
  // ── CÓMO SON LAS CLASES
  {
    claves: ['cómo','como','funciona','clase','clases','metodología','metodologia','dinámica','dinamica','virtual','online','en vivo'],
    respuesta: 'Las clases son en vivo por Google Meet, de lunes a viernes, 45 minutos cada una 📹\n\nSon PERSONALIZADAS — no hay grupos, es solo tu hijo con la profe. Cada niño avanza a su ritmo.\n\nEl método es por misiones: el niño crea su videojuego, la profe lo revisa y aprueba, y el planeta del niño crece con cada logro 🌍'
  },
  // ── PLATAFORMA / HERRAMIENTA
  {
    claves: ['scratch','plataforma','herramienta','programa','software','app','aplicación','aplicacion'],
    respuesta: 'Usamos Scratch, la plataforma de programación visual de MIT, diseñada especialmente para niños 🎮\n\nPero la experiencia ocurre en CodiKids — cada niño tiene su laboratorio virtual con un planeta que crece con cada misión. Scratch es donde construyen, CodiKids es donde viven la aventura.'
  },
  // ── EL PLANETA / LABORATORIO
  {
    claves: ['planeta','laboratorio','mundo','crece','gamificación','gamificacion','juego','puntos','xp','misión','mision','misiones'],
    respuesta: 'Cada niño tiene su propio laboratorio con un planeta virtual 🌍\n\nCon cada misión completada, el planeta crece — aparecen continentes, océanos, árboles, ciudades, la luna y más.\n\nAdemás ganan XP (puntos de experiencia) y pueden crear su propio avatar personalizado.'
  },
  // ── AVATAR
  {
    claves: ['avatar','personaje','diseño','personalizar','personalización','personalizacion'],
    respuesta: 'Cada estudiante crea su propio inventor personalizado 🎨\n\nPuede elegir:\n- Niño o niña\n- Humano, robot o cyborg\n- Color de piel, cabello y estilo\n- Traje y accesorios\n\n¡Cada inventor es único!'
  },
  // ── NIVELES
  {
    claves: ['nivel','niveles','ruta','aprendizaje','programa','currículo','curriculo','materias'],
    respuesta: 'CodiKids tiene 6 niveles:\n\n🟣 Nivel 1 — Scratch Exploradores (abierto)\n🟢 Nivel 2 — Scratch Ninja (abierto)\n⏳ Nivel 3 — Scratch Maestro\n⏳ Nivel 4 — Python\n⏳ Nivel 5 — Inteligencia Artificial\n⏳ Nivel 6 — Robótica\n\nLos niveles 1 y 2 tienen inscripción abierta ahora.'
  },
  // ── CERTIFICADO
  {
    claves: ['certificado','diploma','título','titulo','constancia','certificación','certificacion'],
    respuesta: '¡Sí! Al completar cada nivel, el estudiante recibe su certificado de CodiKids 🏆\n\nEs un diploma digital personalizado que reconoce su logro como inventor.'
  },
  // ── SEGURIDAD
  {
    claves: ['seguro','seguridad','valores','cristiano','contenido','inapropiado','chat','privado','niños','niñas'],
    respuesta: 'CodiKids es un entorno 100% seguro 🔒\n\n✅ Sin chats entre niños\n✅ Sin contenido inapropiado\n✅ Sin violencia ni terror\n✅ Con valores familiares\n\nLos papás pueden ver todo el progreso en tiempo real.'
  },
  // ── PROGRESO / SEGUIMIENTO PARA PADRES
  {
    claves: ['progreso','seguimiento','padre','papá','papas','mamá','mamas','padres','ver','reportes','informe'],
    respuesta: 'Los papás tienen su propia vista de seguimiento 👨‍👩‍👦\n\nReciben un link directo (sin crear cuenta) donde pueden ver:\n🌍 El planeta del niño creciendo\n🏆 Las misiones completadas\n🎮 Los inventos creados\n⚡ Los XP ganados\n\n¡Todo en tiempo real!'
  },
  // ── APROBACIÓN DE MISIONES
  {
    claves: ['profe','aprueba','revisa','aprobación','aprobacion','califica','evaluación','evaluacion','nota'],
    respuesta: 'La profe Patricia revisa cada trabajo antes de aprobar una misión ✅\n\nNadie avanza sin demostrar que hizo el trabajo. No hay atajos — solo inventores reales.\n\nCuando el niño sube su proyecto de Scratch, Patricia lo revisa y da el visto bueno. Solo entonces el planeta crece y llegan los XP.'
  },
  // ── QUIÉN ES LA PROFE
  {
    claves: ['profe','profesora','patricia','docente','quien','quién','enseña','instructor'],
    respuesta: 'La profe es Patricia Rodríguez, fundadora de CodiKids 👩‍💻\n\nEs administradora financiera, desarrolladora de software y apasionada por la educación tecnológica infantil. Cada clase es personalizada y diseñada para que tu hijo avance a su propio ritmo.'
  },
  {
    claves: ['computador','computadora','tablet','equipo','material','necesita','requisito','dispositivo','táctil','tactil'],
    respuesta: 'Para las clases necesitas:\n\n💻 Computador con internet estable\n📹 Cámara y micrófono (para Google Meet)\n🌐 Conexión a internet estable\n\nDesde el Nivel 2 también necesitas acceso a una tablet o dispositivo táctil para probar los videojuegos que van creando 🎮\n\nScratch funciona directo en el navegador, sin instalar nada.'
  },
  // ── SEGUIMIENTO / PROGRESO PARA PADRES
  {
    claves: ['progreso','seguimiento','padre','papá','papas','mamá','mamas','padres','ver','reportes','informe','cómo veo','como veo','link','enlace','avances','monitorear','monitoreo'],
    respuesta: 'Al inscribir a tu hijo recibes un enlace personalizado 🔗\n\nCon ese link puedes ver en tiempo real:\n🌍 El planeta de tu hijo creciendo\n🏆 Las misiones que ha completado\n🎮 Los videojuegos que ha creado\n⚡ Los XP ganados\n\n¡Sin necesidad de crear cuenta ni contraseña! Solo abres el link y ves todo.'
  },  {
    claves: ['inscribir','inscripción','inscripcion','inscribirse','registro','registrar','empezar','empezamos','cómo entro','como entro','cupo','cupos'],
    respuesta: '¡Me alegra que quieras inscribir a tu hijo! 🚀\n\nEl proceso es muy sencillo:\n1️⃣ Escríbele a Patricia por WhatsApp\n2️⃣ Cuéntale el nombre y edad del niño\n3️⃣ Coordinan el horario juntos\n4️⃣ ¡Arrancan las clases!\n\nLos cupos son limitados — ¡te recomiendo escribir pronto! 👇',
    whatsapp: true
  },
  // ── PRUEBA / CLASE DE PRUEBA
  {
    claves: ['prueba','gratis','gratuita','primera clase','demo','trial','probar'],
    respuesta: 'Para conocer más sobre las clases de prueba o demos, escríbele directamente a Patricia por WhatsApp 💬\n\nElla te puede contar cómo funciona el proceso de inicio.',
    whatsapp: true
  },
  // ── COLOMBIA / UBICACIÓN
  {
    claves: ['colombia','ciudad','donde','dónde','presencial','país','pais'],
    respuesta: 'CodiKids es 100% online 🌐\n\nLas clases son por Google Meet así que puedes estar en cualquier ciudad de Colombia o del mundo y acceder sin problema.'
  },
  // ── FORMAS DE PAGO
  {
    claves: ['pagar','pago','transferencia','nequi','daviplata','breve','efectivo','consignación','consignacion','forma de pago','cómo pago','como pago'],
    respuesta: 'Los métodos de pago disponibles son:\n\n💜 Nequi\n💚 Daviplata\n🔵 Breve\n\n¡Fácil y sin complicaciones! Para más detalles escríbele a Patricia 👇',
    whatsapp: true
  },
  // ── RESULTADOS / QUÉ APRENDE
  {
    claves: ['aprende','aprenderá','aprende','resultado','resultado','logra','logros','beneficio','beneficios','sirve'],
    respuesta: 'Al terminar CodiKids tu hijo habrá:\n\n🎮 Creado sus propios videojuegos reales\n💻 Aprendido programación con Scratch\n🧠 Desarrollado pensamiento lógico y creativo\n🏆 Ganado un certificado oficial\n🌍 Construido su planeta virtual de logros\n\nY lo más importante: sabrá que PUEDE crear tecnología, no solo usarla.'
  },
  // ── DIFERENCIA CON OTROS
  {
    claves: ['diferencia','diferente','mejor','otro','otros','competencia','único','unico','especial'],
    respuesta: 'Lo que hace a CodiKids diferente:\n\n🌍 Planeta virtual que crece con cada logro\n🤖 Avatar personalizado único para cada niño\n✅ La profe aprueba cada trabajo — no hay atajos\n👨‍👩‍👦 Padres informados en tiempo real sin crear cuenta\n🎨 Cada proyecto es creativo y único\n👤 Clases 100% personalizadas, no grupos\n\n¡No enseñamos a usar tecnología, enseñamos a crearla!'
  },
]

const RESPUESTA_DEFAULT = 'Mmm, no tengo esa información exacta 🤔\n\nPero Patricia puede responderte al momento por WhatsApp. ¡Escríbele!'

function buscarRespuesta(pregunta) {
  const p = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  for (const item of FAQ) {
    if (item.claves.some(c => p.includes(c.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))) {
      return item
    }
  }
  return { respuesta: RESPUESTA_DEFAULT, whatsapp: true }
}

const SUGERENCIAS = [
  '¿Qué es CodiKids?',
  '¿Cuánto cuesta?',
  '¿Qué edades aceptan?',
  '¿Cómo son las clases?',
  'Quiero inscribir a mi hijo',
  '¿Es seguro para niños?',
]

export default function ChatCody() {
  const [mensajes, setMensajes] = useState([{
    rol: 'bot',
    texto: '¡Hola! Soy Cody, el asistente de CodiKids 🚀\n\nPuedo contarte sobre precios, horarios, niveles y cómo funciona la academia. ¿En qué te puedo ayudar?',
    whatsapp: false
  }])
  const [input, setInput]           = useState('')
  const [sugsVistas, setSugsVistas] = useState(false)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [mensajes])

  function enviar(texto) {
    const msg = (texto || input).trim()
    if (!msg) return
    setInput('')
    setSugsVistas(true)

    setMensajes(prev => [...prev, { rol: 'user', texto: msg }])

    setTimeout(() => {
      const resultado = buscarRespuesta(msg)
      setMensajes(prev => [...prev, { rol: 'bot', texto: resultado.respuesta, whatsapp: !!resultado.whatsapp }])
    }, 600)
  }

  return (
    <section style={{ padding: '4rem 1.5rem', background: 'rgba(83,74,183,.06)', borderTop: '1px solid rgba(83,74,183,.12)', borderBottom: '1px solid rgba(83,74,183,.12)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.4)', letterSpacing: 2, marginBottom: '.5rem' }}>ASISTENTE VIRTUAL</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, marginBottom: '.5rem' }}>
            ¿Tienes preguntas? Pregúntale a Cody 🤖
          </h2>
          <p style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.5)' }}>Responde al instante sobre precios, horarios y niveles.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 20, overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ background: 'rgba(83,74,183,.2)', borderBottom: '1px solid rgba(255,255,255,.08)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#534AB7,#5DCAA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: '1rem' }}>Cody</div>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)' }}>Asistente de CodiKids</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5DCAA5' }}></div>
              <span style={{ fontSize: '.75rem', color: '#5DCAA5' }}>En línea</span>
            </div>
          </div>

          {/* Mensajes */}
          <div ref={msgsRef} style={{ height: 340, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mensajes.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: m.rol === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexDirection: m.rol === 'user' ? 'row-reverse' : 'row' }}>
                  {m.rol === 'bot' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#534AB7,#5DCAA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                  )}
                  <div style={{
                    padding: '10px 14px', fontSize: '.85rem', lineHeight: 1.65, whiteSpace: 'pre-wrap',
                    background: m.rol === 'user' ? '#534AB7' : 'rgba(255,255,255,.08)',
                    border: m.rol === 'user' ? 'none' : '1px solid rgba(255,255,255,.1)',
                    borderRadius: 16,
                    borderBottomLeftRadius: m.rol === 'bot' ? 4 : 16,
                    borderBottomRightRadius: m.rol === 'user' ? 4 : 16,
                  }}>{m.texto}</div>
                </div>
                {m.whatsapp && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 36 }}>
                    <a href={WA} target="_blank" rel="noreferrer" style={{ background: '#1D9E75', color: '#fff', borderRadius: 99, padding: '8px 18px', fontSize: '.8rem', fontWeight: 800, fontFamily: 'Nunito,sans-serif', textDecoration: 'none', display: 'inline-block' }}>
                      💬 Escribir a Patricia
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sugerencias */}
          {!sugsVistas && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 1rem .75rem' }}>
              {SUGERENCIAS.map(s => (
                <button key={s} onClick={() => enviar(s)} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 99, padding: '5px 12px', fontSize: '.78rem', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviar()}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 99, color: '#fff', fontFamily: 'Nunito,sans-serif', fontSize: '.88rem', padding: '10px 16px', outline: 'none' }}
            />
            <button onClick={() => enviar()} style={{ width: 40, height: 40, borderRadius: '50%', background: '#534AB7', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>➤</button>
          </div>

        </div>
      </div>
    </section>
  )
}
