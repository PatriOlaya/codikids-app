// Insignias de CodiKids
// Mezcla: misiones completadas + habilidades especiales desbloqueadas

export const INSIGNIAS_MISIONES = [
  { id:'m1', emoji:'🌍', nombre:'Explorador del Mundo',    desc:'Completaste la Misión 1',          color:'#1D9E75' },
  { id:'m2', emoji:'🌊', nombre:'Señor del Océano',        desc:'Completaste la Misión 2',          color:'#185FA5' },
  { id:'m3', emoji:'🌳', nombre:'Guardián de la Vida',     desc:'Completaste la Misión 3',          color:'#3B6D11' },
  { id:'m4', emoji:'🏙', nombre:'Constructor de Ciudades', desc:'Completaste la Misión 4',          color:'#888780' },
  { id:'m5', emoji:'⚡', nombre:'Maestro de la Energía',   desc:'Completaste la Misión 5',          color:'#EF9F27' },
  { id:'m6', emoji:'🌙', nombre:'Viajero Lunar',           desc:'Completaste la Misión 6',          color:'#AFA9EC' },
  { id:'m7', emoji:'🌀', nombre:'Señor del Portal',        desc:'Completaste la Misión 7',          color:'#7F77DD' },
  { id:'m8', emoji:'⭐', nombre:'Scratch Ninja',           desc:'¡Completaste las 8 misiones!',     color:'#BA7517' },
]

export const INSIGNIAS_HABILIDADES = [
  { id:'h1', emoji:'🔁', nombre:'Maestro de Bucles',       desc:'Usaste por primera vez el bloque "por siempre"',  color:'#534AB7' },
  { id:'h2', emoji:'📦', nombre:'Rey de Variables',        desc:'Creaste tu primera variable',                     color:'#1D9E75' },
  { id:'h3', emoji:'👾', nombre:'Inventor de Clones',      desc:'Programaste tu primer clon',                      color:'#D4537E' },
  { id:'h4', emoji:'📨', nombre:'Mago de Eventos',         desc:'Enviaste y recibiste tu primer mensaje',           color:'#378ADD' },
  { id:'h5', emoji:'🎮', nombre:'Constructor de Mundos',   desc:'Creaste tu primer videojuego completo',           color:'#EF9F27' },
  { id:'h6', emoji:'🔊', nombre:'DJ del Código',           desc:'Agregaste sonido a tu juego',                     color:'#D85A30' },
  { id:'h7', emoji:'🏆', nombre:'Campeón de Puntos',       desc:'Tu juego tiene sistema de puntuación',            color:'#BA7517' },
  { id:'h8', emoji:'🛡', nombre:'Guardián de Vidas',       desc:'Tu juego tiene sistema de vidas',                 color:'#185FA5' },
]

function Insignia({ insignia, desbloqueada, tooltip }) {
  return (
    <div title={tooltip || insignia.desc} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem',
      opacity: desbloqueada ? 1 : .3,
      filter: desbloqueada ? 'none' : 'grayscale(1)',
      transition: 'all .3s'
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: desbloqueada ? `${insignia.color}25` : 'rgba(255,255,255,.06)',
        border: `2px solid ${desbloqueada ? insignia.color : 'rgba(255,255,255,.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
        boxShadow: desbloqueada ? `0 0 16px ${insignia.color}40` : 'none',
        position: 'relative'
      }}>
        {insignia.emoji}
        {desbloqueada && (
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 18, height: 18, borderRadius: '50%',
            background: insignia.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10
          }}>✓</div>
        )}
        {!desbloqueada && (
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 18, height: 18, borderRadius: '50%',
            background: 'rgba(255,255,255,.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10
          }}>🔒</div>
        )}
      </div>
      <div style={{
        fontSize: '.68rem', fontWeight: 700, textAlign: 'center',
        color: desbloqueada ? '#fff' : 'rgba(255,255,255,.35)',
        lineHeight: 1.3, maxWidth: 70
      }}>{insignia.nombre}</div>
    </div>
  )
}

function habDesbloq(misionesCompletadas) {
  return Math.max(0, Math.min(misionesCompletadas - 2, INSIGNIAS_HABILIDADES.length))
}

export default function Insignias({ misionesCompletadas = 0, habilidades = [] }) {
  const totalHab = habDesbloq(misionesCompletadas)
  const totalDesbloqueadas =
    INSIGNIAS_MISIONES.filter((_,i) => i < misionesCompletadas).length + totalHab

  return (
    <div className="card">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'1rem' }}>
          Mis Insignias 🏅
        </h2>
        <div style={{ fontSize:'.8rem', color:'rgba(255,255,255,.45)' }}>
          {totalDesbloqueadas} / {INSIGNIAS_MISIONES.length + INSIGNIAS_HABILIDADES.length}
        </div>
      </div>

      {/* Insignias de misiones */}
      <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', letterSpacing:2, marginBottom:'.75rem' }}>
        MISIONES
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
        {INSIGNIAS_MISIONES.map((ins, i) => (
          <Insignia key={ins.id} insignia={ins} desbloqueada={i < misionesCompletadas} />
        ))}
      </div>

      {/* Insignias de habilidades */}
      <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.4)', letterSpacing:2, marginBottom:'.75rem' }}>
        HABILIDADES ESPECIALES
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
        {INSIGNIAS_HABILIDADES.map((ins, i) => (
          <Insignia key={ins.id} insignia={ins} desbloqueada={i < totalHab}
            tooltip={i >= totalHab ? `Se desbloquea en la misión ${i + 3}` : null} />
        ))}
      </div>

      {totalDesbloqueadas === 0 && (
        <div style={{ textAlign:'center', color:'rgba(255,255,255,.35)', fontSize:'.85rem', padding:'1rem 0' }}>
          Completa misiones para desbloquear insignias 🔓
        </div>
      )}
    </div>
  )
}
