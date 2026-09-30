import { useId } from 'react'

const NIVELES = {
  1: { nombre:'Scratch Exploradores', lineas:['Por completar el primer nivel de programación creativa con Scratch,','explorando ideas, resolviendo retos y creando sus primeros videojuegos.'], lema:'La aventura de crear apenas comienza.' },
  2: { nombre:'Scratch Ninja', lineas:['Por completar el segundo nivel de programación creativa con Scratch,','desarrollando videojuegos interactivos y controles para dispositivos móviles.'], lema:'Cada idea puede convertirse en un gran juego.' },
  3: { nombre:'Scratch Maestro', lineas:['Por completar el tercer nivel de programación creativa,','construyendo un videojuego de plataformas con sus propias mecánicas.'], lema:'Tu imaginación es el comienzo de lo extraordinario.' },
  4: { nombre:'Python Inventor', lineas:['Por completar el cuarto nivel de programación,','aprendiendo los fundamentos de Python y creando programas con código.'], lema:'El futuro también se escribe con tus ideas.' },
}

function Estrella({ x, y, size = 8, color = '#c6a05b' }) {
  return <path d={`M${x} ${y-size} L${x+size*.28} ${y-size*.28} L${x+size} ${y} L${x+size*.28} ${y+size*.28} L${x} ${y+size} L${x-size*.28} ${y+size*.28} L${x-size} ${y} L${x-size*.28} ${y-size*.28} Z`} fill={color} />
}

export default function Certificado({ nombre, nivel = 2, fecha, onCerrar }) {
  const info = NIVELES[nivel] || NIVELES[2]
  const uid = useId().replace(/:/g, '')
  const safeName = nombre?.trim() || 'Estudiante CODIKIDS'
  const nameSize = safeName.length > 45 ? 35 : safeName.length > 32 ? 43 : 55
  async function imprimir() {
    if (document.fonts?.ready) await document.fonts.ready
    window.print()
  }
  return <>
    <style>{`
      .cert-toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; padding:16px 22px; background:#101e36; color:#fff; font-family:Arial,sans-serif; }
      .cert-toolbar p { margin:0; font-size:13px; color:#dae1ee; }
      .cert-toolbar button { padding:10px 16px; border-radius:9px; border:1px solid #526078; cursor:pointer; font-weight:700; font-size:13px; }
      .cert-sheet { display:block; width:100%; height:auto; background:#fbf8f0; }
      @media print {
        @page { size:A4 landscape; margin:0; }
        html, body { margin:0 !important; padding:0 !important; width:297mm !important; height:210mm !important; background:white !important; }
        body * { visibility:hidden !important; }
        #cert-print, #cert-print * { visibility:visible !important; }
        #cert-print { position:fixed !important; top:0 !important; left:0 !important; width:297mm !important; height:210mm !important; margin:0 !important; border:0 !important; border-radius:0 !important; overflow:hidden !important; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
        .cert-toolbar { display:none !important; }
      }
    `}</style>
    <div className="cert-toolbar">
      <p>Certificado de {safeName} · Para el PDF: orientación horizontal, sin encabezados ni pies.</p>
      <div style={{display:'flex',gap:8}}>
        <button type="button" onClick={onCerrar} style={{background:'transparent',color:'#fff'}}>Cerrar</button>
        <button type="button" onClick={imprimir} style={{background:'#e9ce92',color:'#15233a',borderColor:'#e9ce92'}}>Imprimir / Guardar PDF</button>
      </div>
    </div>
    <svg id="cert-print" className="cert-sheet" viewBox="0 0 1123 794" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{`Certificado de logro de ${safeName} — Nivel ${nivel}, ${info.nombre}`}</title>
      <desc id={`${uid}-desc`}>{info.lineas.join(' ')} Fecha: {fecha}. Patricia Olaya, directora de CODIKIDS.</desc>
      <defs>
        <linearGradient id={`${uid}-navy`} x2="1" y2="1"><stop stopColor="#111d36"/><stop offset="1" stopColor="#243c62"/></linearGradient>
        <linearGradient id={`${uid}-gold`} x2="1" y2="1"><stop stopColor="#9d7136"/><stop offset=".48" stopColor="#f3dfae"/><stop offset="1" stopColor="#b38643"/></linearGradient>
        <radialGradient id={`${uid}-paper`}><stop stopColor="#fffdf7"/><stop offset="1" stopColor="#f4eddf"/></radialGradient>
        <pattern id={`${uid}-dots`} width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#b99a63" opacity=".12"/></pattern>
      </defs>
      <rect width="1123" height="794" fill={`url(#${uid}-paper)`}/>
      <rect width="1123" height="794" fill={`url(#${uid}-dots)`}/>
      <path d="M0 0H320L0 320Z M1123 794H858L1123 529Z" fill={`url(#${uid}-navy)`}/>
      <path d="M0 267L267 0H282L0 282Z M1123 550L879 794H865L1123 536Z" fill={`url(#${uid}-gold)`}/>
      <rect x="35" y="35" width="1053" height="724" fill="none" stroke="#c09b58" strokeWidth="1.5"/>
      <rect x="45" y="45" width="1033" height="704" fill="none" stroke="#c09b58" strokeOpacity=".4" strokeWidth=".6"/>
      <g fill="none" stroke="#ecd69e" strokeOpacity=".4">
        <circle cx="85" cy="88" r="65"/><ellipse cx="85" cy="88" rx="88" ry="24" transform="rotate(-35 85 88)"/>
        <path d="M953 697l35-30 32 19 29-48"/><circle cx="953" cy="697" r="4"/><circle cx="988" cy="667" r="4"/><circle cx="1020" cy="686" r="4"/>
      </g>
      <Estrella x={199} y={76} size={10} color="#ebd397"/><Estrella x={68} y={188} size={6} color="#ebd397"/>
      <Estrella x={1047} y={723} size={9} color="#ebd397"/><Estrella x={990} y={743} size={5} color="#ebd397"/>
      <Estrella x={312} y={183} size={6}/><Estrella x={811} y={183} size={6}/>
      <g fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle">
        <g transform="translate(426 91)">
          <circle cx="0" cy="0" r="23" fill="#172941"/>
          <path d="M-4 7C-9-6-1-15 11-16C12-4 6 5-4 7Z" fill="#e8cd8e"/><circle cx="4" cy="-7" r="3" fill="#172941"/>
          <path d="M-6-1L-13 2-12 9-3 5M3 5L0 14-7 14-3 6" fill="#69b9a9"/><path d="M-8 10l-5 7 7-4" stroke="#e8cd8e" fill="none"/>
        </g>
        <text x="583" y="100" fontSize="31" fontWeight="800" letterSpacing="4" fill="#182941">CODIKIDS</text>
        <text x="561.5" y="136" fontSize="10" letterSpacing="4" fill="#736b60">ACADEMIA DE PROGRAMACIÓN CREATIVA</text>
        <text x="561.5" y="213" fontSize="50" fontFamily="Georgia, 'Times New Roman', serif" fill="#172941">Certificado de logro</text>
        <path d="M438 235H521 M602 235H685" stroke="#bf9956"/>
        <Estrella x={561.5} y={235} size={7}/>
        <text x="561.5" y="279" fontSize="13" letterSpacing="3" fill="#827563">OTORGADO A</text>
        <text x="561.5" y="349" fontSize={nameSize} fontFamily="Georgia, 'Times New Roman', serif" fontWeight="bold" fill="#172941" {...(safeName.length>55?{textLength:850,lengthAdjust:'spacingAndGlyphs'}:{})}>{safeName}</text>
        <path d="M319 375Q561 388 804 375" fill="none" stroke="#c5a15f" strokeWidth="1.3"/>
        <rect x="343" y="398" width="437" height="44" rx="22" fill="#172941"/>
        <text x="561.5" y="426" fontSize="19" fontWeight="700" fill="#f0d9a2">Nivel {nivel} · {info.nombre}</text>
        {info.lineas.map((line,i)=><text key={line} x="561.5" y={478+i*25} fontSize="16" fill="#5d6269">{line}</text>)}
        <text x="561.5" y="548" fontSize="15" fontStyle="italic" fontFamily="Georgia, 'Times New Roman', serif" fill="#96733d">{info.lema}</text>
        <text x="265" y="651" fontSize="17" fill="#25364a">{fecha}</text>
        <path d="M165 665H365" stroke="#b7a586"/>
        <text x="265" y="686" fontSize="10" letterSpacing="2" fill="#7c766c">FECHA DE CERTIFICACIÓN</text>
        <text x="856" y="649" fontSize="28" fontStyle="italic" fontFamily="Georgia, 'Times New Roman', serif" fill="#243956">Patricia Olaya</text>
        <path d="M750 665H962" stroke="#b7a586"/>
        <text x="856" y="686" fontSize="10" letterSpacing="2" fill="#7c766c">DIRECTORA · CODIKIDS</text>
        <text x="561.5" y="735" fontSize="10" letterSpacing="2" fill="#7e766a">CREAR · EXPLORAR · TRANSFORMAR</text>
      </g>
      <g transform="translate(561.5 636)">
        <path d="M-28 23L-37 75-13 63 0 79 12 30M28 23L37 75 13 63 0 79-12 30" fill="#233d5e"/>
        <circle r="49" fill={`url(#${uid}-gold)`}/><circle r="40" fill="#fbf4df" stroke="#b68b49"/>
        <circle r="34" fill="none" stroke="#cfb179" strokeDasharray="1 4"/>
        <path d="M0-25L7-9 25-7 12 6 15 24 0 15-15 24-12 6-25-7-7-9Z" fill={`url(#${uid}-gold)`}/>
        <text y="6" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="bold" fill="#172941">{nivel}</text>
      </g>
    </svg>
  </>
}
