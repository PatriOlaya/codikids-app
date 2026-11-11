import * as THREE from 'three'

// Siluetas distintas, situadas fuera del espacio de salto.
export function decorarArena({scene,ronda,platforms,mat,box,geometries,materials,textures}){
 const colores=[
  [0x296c56,0x79c97d,0xf6b7a2],
  [0x554a87,0x8b71e3,0xc9b6ff],
  [0x243d5b,0x548bac,0xffc26d],
  [0x24476a,0x55accb,0x9dffee],
 ][ronda]
 const oscuro=mat(colores[0]), medio=mat(colores[1]), luz=mat(colores[2],{emissive:colores[2],emissiveIntensity:.32})
 const geo=(g)=>{geometries.push(g);return g}
 const cristal=geo(new THREE.OctahedronGeometry(1))
 const copa=geo(new THREE.IcosahedronGeometry(1,1))
 const tronco=geo(new THREE.CylinderGeometry(.09,.16,1,7))
 const nube=geo(new THREE.SphereGeometry(1,10,8))
 const nubeMaterial=mat(0xf4f6ff)
 const mesh=(g,m,x,y,z,sx=1,sy=1,sz=1)=>{
  const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);scene.add(o);return o
 }
 const dibujaArbol=(x,y,z,s)=>{
  mesh(tronco,oscuro,x,y+.65*s,z,s,1.3*s,s)
  mesh(copa,medio,x,y+1.65*s,z,.78*s,.92*s,.8*s)
  mesh(copa,luz,x+.39*s,y+1.78*s,z,.39*s,.44*s,.39*s)
 }
 platforms.forEach((p,i)=>{
  // Camino luminoso en el borde de llegada de cada plataforma.
  box(Math.min(1.6,p.w*.55),.055,.13,luz,p.x,p.y+.15,p.z+p.d/2-.22)
  box(.13,.055,Math.min(1.45,p.d*.45),medio,p.x-p.w/2+.14,p.y+.15,p.z)
  const x=p.x+(i%2?1:-1)*(p.w/2+.15),z=p.z-1
  if(ronda===0)dibujaArbol(x,p.y-.6,z,.58)
  if(ronda===1){const c=mesh(cristal,luz,x,p.y+.3,z,.38,1.15,.37);c.rotation.z=(i%2?1:-1)*.24}
  if(ronda>=2){box(.22,1.4,.22,oscuro,x,p.y+.46,z);box(.37,.24,.37,luz,x,p.y+1.2,z)}
 })
 for(let i=0;i<12;i++){
  const side=i%2?1:-1,x=side*(9+i%3*3),z=-i*5.1,y=-2.8-(i%3)*.6
  mesh(nube,nubeMaterial,x*1.7,y-2,z-3,3.8,.55,2.1)
  if(ronda===0){
   mesh(cristal,oscuro,x,y-.8,z,2.65,1.8,2.45)
   mesh(copa,medio,x,y,z,2.5,.48,2.35)
   dibujaArbol(x-.55,y+.15,z,.95)
  }else if(ronda===1){
   mesh(cristal,oscuro,x,y,z,2,2.7,1.7)
   const c=mesh(cristal,luz,x+.6,y+2,z,.7,2.7,.74);c.rotation.z=side*.25
  }else if(ronda===2){
   const h=3+i%4*1.9
   box(2.3,h,2.2,oscuro,x,y+h/2-1,z)
   for(let row=0;row<4;row++)box(1.55,.16,.04,luz,x,y+row*.63,z+1.11)
   box(2.5,.15,2.4,medio,x,y+h-1,z)
  }else{
   const torus=geo(new THREE.TorusGeometry(1.4,.09,8,24))
   const ring=mesh(torus,luz,x,y+3,z);ring.rotation.y=side*.5
   mesh(cristal,medio,x,y+3,z,.52,1.2,.52)
  }
 }
 const sign=document.createElement('canvas');sign.width=256;sign.height=96
 const c=sign.getContext('2d');c.fillStyle='#142b42';c.fillRect(0,0,256,96);c.strokeStyle='#96f9da';c.lineWidth=5;c.strokeRect(4,4,248,88);c.fillStyle='#f5fffa';c.font='bold 34px system-ui';c.textAlign='center';c.fillText('SIGUIENTE',128,60)
 const tex=new THREE.CanvasTexture(sign);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex)
 const material=new THREE.SpriteMaterial({map:tex,depthTest:true});materials.push(material)
 const beacon=new THREE.Sprite(material);beacon.scale.set(1.9,.71,1);scene.add(beacon)
 return beacon
}
