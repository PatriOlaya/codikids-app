import * as T from 'three'

export function montarCircuito(host,pista,color){
 const scene=new T.Scene();scene.background=new T.Color(pista.cielo);scene.fog=new T.Fog(pista.cielo,68,155)
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement)
 const camera=new T.PerspectiveCamera(60,1,.15,210)
 scene.add(new T.HemisphereLight(0xfff6ed,0x63758d,2.5))
 const sol=new T.DirectionalLight(0xfff2d8,2.35);sol.position.set(25,42,10);scene.add(sol)
 const curva=new T.CatmullRomCurve3(pista.nodos.map(n=>new T.Vector3(...n)),true,'centripetal');curva.arcLengthDivisions=600;curva.updateArcLengths()
 const largo=curva.getLength(),geos=[],mats=[]
 const mat=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.67,...extra});mats.push(m);return m}
 const geo=g=>{geos.push(g);return g}
 const cubo=geo(new T.BoxGeometry(1,1,1))
 const esfera=geo(new T.IcosahedronGeometry(1,0))
 const carretera=mat(0x333747),linea=mat(0xf4f4e7),acento=mat(pista.borde,{emissive:pista.borde,emissiveIntensity:.32}),suelo=mat(pista.suelo)
 const chasis=mat(color,{metalness:.25,roughness:.38}),vidrio=mat(0x30445c,{metalness:.38,roughness:.2}),goma=mat(0x171923),luz=mat(0xffc976,{emissive:0xffa955,emissiveIntensity:1})
 function mesh(g,m,x,y,z,sx,sy,sz,parent=scene){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o}
 const box=(m,x,y,z,sx,sy,sz,parent)=>mesh(cubo,m,x,y,z,sx,sy,sz,parent)
 box(suelo,0,-.85,0,250,1,250)
 const normal=new T.Vector3()
 function tira(m,izq,der,alto){
  const verts=[],indices=[]
  for(let i=0;i<=320;i++){
   const t=i/320,p=curva.getPointAt(t),d=curva.getTangentAt(t);normal.set(-d.z,0,d.x).normalize()
   for(const off of [izq,der])verts.push(p.x+normal.x*off,p.y+alto,p.z+normal.z*off)
   if(i){const n=i*2;indices.push(n-2,n,n-1,n-1,n,n+1)}
  }
  const g=geo(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();m.side=T.DoubleSide;scene.add(new T.Mesh(g,m))
 }
 tira(carretera,-4.35,4.35,.01);tira(acento,-4.35,-4.08,.035);tira(acento,4.08,4.35,.035)
 for(let i=0;i<88;i++){const p=curva.getPointAt(i/88),d=curva.getTangentAt(i/88);const marca=box(linea,p.x,p.y+.04,p.z,.13,.025,1.05);marca.rotation.y=Math.atan2(d.x,d.z)}
 const salida=curva.getPointAt(0),dir=curva.getTangentAt(0),arco=new T.Group();arco.position.copy(salida);arco.rotation.y=Math.atan2(dir.x,dir.z);scene.add(arco)
 box(acento,-4.65,1.75,0,.24,3.5,.24,arco);box(acento,4.65,1.75,0,.24,3.5,.24,arco);box(acento,0,3.55,0,9.5,.32,.25,arco)
 for(let i=0;i<10;i++)box(i%2?linea:vidrio,-3.87+i*.86,.05,0,.86,.045,.55,arco)
 const decor=mat({costa:0x37885c,ciudad:0x41507c,desierto:0xa75340,nieve:0x5f879c}[pista.id])
 const puntos=curva.getSpacedPoints(120)
 for(let i=0;i<54;i++){
  const x=Math.sin(i*2.399)* (24+i%8*7),z=Math.cos(i*2.399)*(28+i%7*8)
  if(puntos.some(p=>Math.hypot(x-p.x,z-p.z)<7))continue
  if(pista.id==='ciudad'){const h=4+i%7*2;box(decor,x,h*.5-.25,z,3.2,h,3.8);for(let j=1;j<h;j+=2)box(acento,x,j,z+1.91,2.3,.18,.03)}
  else if(pista.id==='costa'){box(vidrio,x,1.5,z,.28,3.4,.28);mesh(esfera,decor,x,3.6,z,2.2,.74,1.8)}
  else{const h=2+i%5;mesh(esfera,decor,x,h*.5,z,3,h,2.5);if(pista.id==='nieve')mesh(esfera,linea,x,h*.95,z,1.8,h*.5,1.5)}
 }
 const coche=new T.Group();scene.add(coche)
 box(chasis,0,.55,0,1.7,.54,3.15,coche);box(chasis,0,.83,.7,1.57,.26,1.48,coche);box(vidrio,0,1.03,-.31,1.27,.59,1.32,coche)
 box(chasis,0,1.35,-.36,1.32,.13,1.23,coche);box(linea,0,.85,1.05,.19,.02,.9,coche)
 for(const lado of [-1,1]){for(const eje of [-1,1])box(goma,lado*.86,.38,eje*1.05,.37,.66,.62,coche);box(luz,lado*.57,.6,1.58,.38,.15,.07,coche)}
 const objetivo=new T.Vector3(),posCam=new T.Vector3(),p=new T.Vector3(),d=new T.Vector3()
 const resize=()=>{const w=host.clientWidth||720,h=host.clientHeight||420;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
 const ro=new ResizeObserver(resize);ro.observe(host);resize()
 function pintar(s,vista){
  const t=(s.distancia%largo)/largo;curva.getPointAt(t,p);curva.getTangentAt(t,d);normal.set(-d.z,0,d.x).normalize();p.addScaledVector(normal,s.carril)
  coche.position.copy(p);coche.rotation.y=Math.atan2(d.x,d.z);coche.rotation.z=s.derrape?.12:0;coche.visible=vista!=='cabina'
  if(vista==='mapa'){camera.position.set(4,Math.max(106,100/camera.aspect),-5);camera.up.set(0,0,-1);objetivo.set(4,0,-5);scene.fog.near=130;scene.fog.far=230}
  else{scene.fog.near=68;scene.fog.far=155;camera.up.set(0,1,0);posCam.copy(p).addScaledVector(d,vista==='cabina'?1.05:-7.5);posCam.y+=vista==='cabina'?1.36:4.5;camera.position.copy(posCam);objetivo.copy(p).addScaledVector(d,12);objetivo.y+=vista==='cabina'?1.2:.3}
  camera.lookAt(objetivo);renderer.render(scene,camera)
 }
 return {largo,pintar,cerrar(){ro.disconnect();geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove()}}
}
