// Planeta que crece visualmente con cada misión completada
// Los elementos aparecen según cuántas misiones están completadas

const ELEMENTOS = [
  // mision 1: primer continente
  <ellipse key="c1" cx="310" cy="170" rx="55" ry="42" fill="#1D9E75" />,
  // mision 2: segundo continente + oceano más vivo
  <ellipse key="c2" cx="388" cy="208" rx="38" ry="30" fill="#0F6E56" />,
  // mision 3: arboles / vegetacion
  <>
    <ellipse key="c3" cx="278" cy="218" rx="26" ry="18" fill="#5DCAA5" />
    <polygon key="t1" points="308,136 316,155 300,155" fill="#3B6D11" />
    <rect key="tr1" x="311" y="155" width="3" height="7" fill="#633806" />
    <polygon key="t2" points="323,130 332,152 314,152" fill="#639922" />
    <rect key="tr2" x="319" y="152" width="4" height="8" fill="#633806" />
  </>,
  // mision 4: ciudad
  <>
    <rect key="b1" x="374" y="186" width="9" height="16" fill="#B4B2A9" rx="1" />
    <rect key="b2" x="385" y="192" width="7" height="10" fill="#D3D1C7" rx="1" />
    <rect key="b3" x="394" y="184" width="8" height="18" fill="#888780" rx="1" />
    <rect key="bw" x="375" y="182" width="7" height="4" fill="#378ADD" rx="1" />
  </>,
  // mision 5: energia / luces
  <>
    <circle key="e1" cx="330" cy="145" r="5" fill="#EF9F27" opacity=".85">
      <animate attributeName="opacity" values=".5;1;.5" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <circle key="e2" cx="360" cy="230" r="3.5" fill="#FAC775" opacity=".8">
      <animate attributeName="opacity" values=".4;.9;.4" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle key="e3" cx="290" cy="200" r="4" fill="#EF9F27" opacity=".75">
      <animate attributeName="opacity" values=".6;1;.6" dur="1.8s" repeatCount="indefinite" />
    </circle>
  </>,
  // mision 6: luna
  <circle key="luna" cx="430" cy="120" r="18" fill="#D3D1C7">
    <animateTransform attributeName="transform" type="rotate"
      from="0 340 185" to="360 340 185" dur="20s" repeatCount="indefinite" />
  </circle>,
  // mision 7: portal (anillo exterior)
  <circle key="anillo" cx="340" cy="185" r="148" fill="none" stroke="#7F77DD" strokeWidth="3" strokeDasharray="8 6" opacity=".6">
    <animateTransform attributeName="transform" type="rotate"
      from="0 340 185" to="360 340 185" dur="30s" repeatCount="indefinite" />
  </circle>,
  // mision 8: estrella / corona
  <>
    {[0,45,90,135,180,225,270,315].map((ang, i) => {
      const rad = (ang * Math.PI) / 180
      const x = 340 + Math.cos(rad) * 160
      const y = 185 + Math.sin(rad) * 160
      return <circle key={`s${i}`} cx={x} cy={y} r="3" fill="#FAC775">
        <animate attributeName="opacity" values=".3;1;.3" dur={`${1.5 + i * .2}s`} repeatCount="indefinite" />
      </circle>
    })}
  </>
]

export default function Planeta({ misionesCompletadas = 0, totalMisiones = 8 }) {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 400"
      role="img"
      aria-label={`Planeta CodiKids con ${misionesCompletadas} de ${totalMisiones} misiones completadas`}
      style={{ filter: 'drop-shadow(0 0 40px rgba(83,74,183,.3))' }}
    >
      <defs>
        <radialGradient id="grad-oceano" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#85B7EB" />
          <stop offset="100%" stopColor="#0C447C" />
        </radialGradient>
        <radialGradient id="grad-atm" cx="50%" cy="50%" r="55%">
          <stop offset="85%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(93,202,165,.18)" />
        </radialGradient>
        <clipPath id="clip-p">
          <circle cx="340" cy="185" r="118" />
        </clipPath>
      </defs>

      {/* Atmosfera */}
      <circle cx="340" cy="185" r="135" fill="url(#grad-atm)" />

      {/* Sombra base */}
      <circle cx="346" cy="192" r="118" fill="rgba(0,0,0,.25)" />

      {/* Océano */}
      <circle cx="340" cy="185" r="118" fill="url(#grad-oceano)" />

      {/* Elementos del planeta según misiones completadas */}
      <g clipPath="url(#clip-p)">
        {ELEMENTOS.slice(0, misionesCompletadas).map((el, i) => (
          <g key={i} style={{
            animation: 'aparecer .5s ease both',
            animationDelay: `${i * .05}s`
          }}>
            {el}
          </g>
        ))}
      </g>

      {/* Borde del planeta */}
      <circle cx="340" cy="185" r="118" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />

      {/* Brillo superior izquierdo */}
      <ellipse cx="295" cy="148" rx="28" ry="16"
        fill="white" opacity=".08"
        transform="rotate(-30 295 148)" />

      {/* Anillo exterior (mision 7+) — ya está en ELEMENTOS[6] */}
    </svg>
  )
}
