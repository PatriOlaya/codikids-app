const NIVELES = {
  1: { nombre: 'Scratch Exploradores', descripcion: 'Ha completado exitosamente el Nivel 1 de programación creativa, dominando los fundamentos de la programación con Scratch y creando sus primeros videojuegos.' },
  2: { nombre: 'Scratch Ninja', descripcion: 'Ha completado exitosamente el Nivel 2 de programación creativa, creando videojuegos para dispositivos móviles y dominando técnicas avanzadas de Scratch.' },
  3: { nombre: 'Scratch Maestro', descripcion: 'Ha completado exitosamente el Nivel 3 de programación creativa, diseñando videojuegos completos con múltiples niveles y mecánicas complejas.' },
  4: { nombre: 'Python Inventor', descripcion: 'Ha completado exitosamente el Nivel 4, dominando los fundamentos de Python y creando programas reales con código de texto.' },
}

export default function Certificado({ nombre, nivel = 2, fecha, onCerrar }) {
  const nivelInfo = NIVELES[nivel] || NIVELES[2]

  function imprimir() { window.print() }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Space+Grotesk:wght@500;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        @media print {
          body * { visibility: hidden !important; }
          #cert-print, #cert-print * { visibility: visible !important; }
          #cert-print { position: fixed !important; inset: 0 !important; margin: 0 !important; border-radius: 0 !important; }
          #cert-btn-area { display: none !important; }
        }
      `}</style>

      {/* Botones */}
      <div id="cert-btn-area" style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'1rem 1.5rem 0', background:'#fff' }}>
        <button onClick={onCerrar} style={{ padding:'.5rem 1rem', border:'1px solid #ddd', borderRadius:8, background:'#fff', cursor:'pointer', fontSize:14 }}>✕ Cerrar</button>
        <button onClick={imprimir} style={{ padding:'.5rem 1.5rem', border:'none', borderRadius:8, background:'#534AB7', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:700 }}>🖨 Imprimir / Guardar PDF</button>
      </div>

      {/* Certificado */}
      <div id="cert-print" style={{
        width: '100%', aspectRatio: '1.414 / 1',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Nunito', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 4rem',
        boxSizing: 'border-box',
      }}>

        {/* Fondo decorativo */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #f8f7ff 0%, #fff 50%, #f0fdf8 100%)' }} />

        {/* Bordes decorativos */}
        <div style={{ position:'absolute', inset:16, border:'2px solid #534AB7', borderRadius:8, opacity:.15 }} />
        <div style={{ position:'absolute', inset:20, border:'1px solid #1D9E75', borderRadius:6, opacity:.1 }} />

        {/* Estrellas decorativas */}
        {[[60,60,'#534AB7'],[60,90,'#1D9E75'],[90,60,'#EF9F27'],[90,90,'#534AB7'],
          [100,50,'#1D9E75'],[50,100,'#EF9F27']].map(([l,t,c],i) => (
          <div key={i} style={{ position:'absolute', left:`${l}%`, top:`${t}%`, width:6, height:6, borderRadius:'50%', background:c, opacity:.3 }} />
        ))}

        {/* Contenido */}
        <div style={{ position:'relative', zIndex:1, textAlign:'center', width:'100%' }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:'1.5rem' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#534AB7,#1D9E75)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🚀</div>
            <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:22, color:'#534AB7' }}>CodiKids</div>
          </div>

          {/* Título */}
          <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:11, fontWeight:700, letterSpacing:4, color:'#1D9E75', textTransform:'uppercase', marginBottom:'.75rem' }}>
            Certificado de Logro
          </div>

          <div style={{ width:60, height:2, background:'linear-gradient(90deg,#534AB7,#1D9E75)', margin:'0 auto 1.5rem', borderRadius:99 }} />

          {/* Texto principal */}
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:13, color:'#666', marginBottom:'.5rem', fontStyle:'italic' }}>
            Se certifica que
          </div>

          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:42, fontWeight:700, color:'#1a0f3c', lineHeight:1.1, marginBottom:'1rem' }}>
            {nombre}
          </div>

          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:13, color:'#666', marginBottom:'.5rem', fontStyle:'italic' }}>
            ha completado el
          </div>

          <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:22, fontWeight:700, color:'#534AB7', marginBottom:'.75rem' }}>
            Nivel {nivel} — {nivelInfo.nombre}
          </div>

          <div style={{ fontSize:12, color:'#888', maxWidth:480, margin:'0 auto 2rem', lineHeight:1.7 }}>
            {nivelInfo.descripcion}
          </div>

          {/* Medalla */}
          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#EF9F27,#BA7517)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 2rem', boxShadow:'0 4px 16px rgba(186,117,23,.3)' }}>
            🏆
          </div>

          {/* Fecha y firma */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #eee' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:13, color:'#1a0f3c', fontWeight:700, marginBottom:4 }}>{fecha}</div>
              <div style={{ fontSize:11, color:'#aaa' }}>Fecha de certificación</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:'#534AB7', fontStyle:'italic', borderBottom:'1px solid #534AB7', paddingBottom:4, marginBottom:4 }}>Patricia Rodríguez</div>
              <div style={{ fontSize:11, color:'#aaa' }}>Directora CodiKids</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:24, marginBottom:4 }}>🌍</div>
              <div style={{ fontSize:11, color:'#aaa' }}>codikids-app.vercel.app</div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
