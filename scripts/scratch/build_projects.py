"""Build three editable Scratch 3 projects; no custom extensions or JavaScript gameplay."""
import hashlib, html, io, json, math, struct, wave, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/scratch'
class Ref:
 def __init__(self,id,boolean=False): self.id=id;self.boolean=boolean
class Var:
 def __init__(self,name,id=None): self.name=name;self.id=id or 'v_'+name
class Project:
 def __init__(self,title):
  self.title=title;self.monitors=[];self.targets=[];self.assets={};self.broadcasts={};self.vars={};self.stage=self.sprite('Stage',True)
 def sprite(self,name,stage=False):
  t=Sprite(self,name,stage);self.targets.append(t);return t
 def var(self,name,value=0):
  self.vars[name]=Var(name);self.stage.data['variables']['v_'+name]=[name,value];return self.vars[name]
 def msg(self,name):self.broadcasts[name]=name;return name
 def svg(self,name,body,w=480,h=360):
  raw=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'.encode();md5=hashlib.md5(raw).hexdigest();self.assets[md5+'.svg']=raw
  return {'name':name,'assetId':md5,'dataFormat':'svg','md5ext':md5+'.svg','bitmapResolution':1,'rotationCenterX':w/2,'rotationCenterY':h/2}
 def save(self,filename):
  self.stage.data['broadcasts']=self.broadcasts
  project={'targets':[t.data for t in self.targets],'monitors':self.monitors,'extensions':[],'meta':{'semver':'3.0.0','vm':'5.0.300','agent':'CODIKIDS Scratch Studio'}}
  for i,t in enumerate(project['targets']):t['layerOrder']=i
  with zipfile.ZipFile(OUT/filename,'w',zipfile.ZIP_DEFLATED) as z:
   z.writestr('project.json',json.dumps(project,ensure_ascii=False))
   for name,raw in self.assets.items():z.writestr(name,raw)
  print(filename,len(self.targets),'sprites;',sum(len(t.data['blocks']) for t in self.targets),'blocks')
class Sprite:
 def __init__(self,p,name,stage=False):
  self.p=p;self.n=0;self.scripts=0
  self.data={'isStage':stage,'name':name,'variables':{},'lists':{},'broadcasts':{},'blocks':{},'comments':{},'currentCostume':0,'costumes':[],'sounds':[],'volume':65,'layerOrder':0}
  if stage:self.data.update(tempo=60,videoTransparency=50,videoState='off',textToSpeechLanguage=None)
  else:self.data.update(visible=True,x=0,y=0,size=100,direction=90,draggable=False,rotationStyle='don\'t rotate')
 def local(self,name,value=0):
  v=Var(name,self.data['name']+'_'+name);self.data['variables'][v.id]=[name,value];return v
 def input(self,v,parent):
  if isinstance(v,Ref):self.data['blocks'][v.id]['parent']=parent;return [2,v.id] if v.boolean else [3,v.id,[10,'']]
  if isinstance(v,Var):return [3,[12,v.name,v.id],[10,'']]
  if isinstance(v,(int,float)):return [1,[4,str(v)]]
  return [1,[10,str(v)]]
 def b(self,op,inputs=None,fields=None,boolean=False,shadow=False):
  self.n+=1;id='b'+str(self.n);data={'opcode':op,'next':None,'parent':None,'inputs':{},'fields':fields or {},'shadow':shadow,'topLevel':False};self.data['blocks'][id]=data
  data['inputs']={k:self.input(v,id) for k,v in (inputs or {}).items()};return Ref(id,boolean)
 def chain(self,blocks):
  blocks=[b for b in blocks if b is not None]
  for a,b in zip(blocks,blocks[1:]):self.data['blocks'][a.id]['next']=b.id;self.data['blocks'][b.id]['parent']=a.id
  return blocks[0] if blocks else None
 def script(self,hat,body):
  first=self.chain(body);data=self.data['blocks'][hat.id];data.update(topLevel=True,x=40+self.scripts*520,y=40);self.scripts+=1
  if first:data['next']=first.id;self.data['blocks'][first.id]['parent']=hat.id
 def flag(self,body):self.script(self.b('event_whenflagclicked'),body)
 def receive(self,msg,body):self.p.msg(msg);self.script(self.b('event_whenbroadcastreceived',fields={'BROADCAST_OPTION':[msg,msg]}),body)
 def click(self,body):self.script(self.b('event_whenthisspriteclicked'),body)
 def set(self,v,val):return self.b('data_setvariableto',{'VALUE':val},{'VARIABLE':[v.name,v.id]})
 def change(self,v,val):return self.b('data_changevariableby',{'VALUE':val},{'VARIABLE':[v.name,v.id]})
 def if_(self,cond,yes,no=None):
  inp={'CONDITION':cond,'SUBSTACK':self.chain(yes)}
  if no is not None:inp['SUBSTACK2']=self.chain(no)
  return self.b('control_if_else' if no is not None else 'control_if',inp)
 def forever(self,body):return self.b('control_forever',{'SUBSTACK':self.chain(body)})
 def repeat(self,n,body):return self.b('control_repeat',{'TIMES':n,'SUBSTACK':self.chain(body)})
 def wait(self,n):return self.b('control_wait',{'DURATION':n})
 def until(self,c):return self.b('control_wait_until',{'CONDITION':c})
 def op(self,op,a,b):return self.b('operator_'+op,{'OPERAND1':a,'OPERAND2':b} if op in ('and','or') else {'NUM1':a,'NUM2':b} if op in ('add','subtract','multiply','divide','mod') else {'OPERAND1':a,'OPERAND2':b},boolean=op in ('and','or','equals','lt','gt'))
 def eq(self,a,b):return self.op('equals',a,b)
 def gt(self,a,b):return self.op('gt',a,b)
 def lt(self,a,b):return self.op('lt',a,b)
 def and_(self,*cs):
  out=cs[0]
  for c in cs[1:]:out=self.op('and',out,c)
  return out
 def or_(self,*cs):
  out=cs[0]
  for c in cs[1:]:out=self.op('or',out,c)
  return out
 def not_(self,c):return self.b('operator_not',{'OPERAND':c},boolean=True)
 def rand(self,a,b):return self.b('operator_random',{'FROM':a,'TO':b})
 def key(self,key):return self.b('sensing_keypressed',{'KEY_OPTION':self.b('sensing_keyoptions',fields={'KEY_OPTION':[key,None]},shadow=True)},boolean=True)
 def touching(self,name):return self.b('sensing_touchingobject',{'TOUCHINGOBJECTMENU':self.b('sensing_touchingobjectmenu',fields={'TOUCHINGOBJECTMENU':[name,None]},shadow=True)},boolean=True)
 def emit(self,msg,wait=False):
  self.p.msg(msg);menu=self.b('event_broadcast_menu',fields={'BROADCAST_OPTION':[msg,msg]},shadow=True)
  return self.b('event_broadcastandwait' if wait else 'event_broadcast',{'BROADCAST_INPUT':menu})
 def show(self):return self.b('looks_show')
 def hide(self):return self.b('looks_hide')
 def xy(self,x,y):return self.b('motion_gotoxy',{'X':x,'Y':y})
 def x(self):return self.b('motion_xposition')
 def y(self):return self.b('motion_yposition')
 def dx(self,x):return self.b('motion_changexby',{'DX':x})
 def dy(self,y):return self.b('motion_changeyby',{'DY':y})
 def say(self,text,secs=None):return self.b('looks_sayforsecs',{'MESSAGE':text,'SECS':secs}) if secs is not None else self.b('looks_say',{'MESSAGE':text})
 def costume(self,name):return self.b('looks_switchcostumeto',{'COSTUME':name})
 def backdrop(self,name):return self.b('looks_switchbackdropto',{'BACKDROP':name})
 def size(self,n):return self.b('looks_setsizeto',{'SIZE':n})
 def effect(self,name,n):return self.b('looks_seteffectto',{'VALUE':n},{'EFFECT':[name,None]})
 def sound(self,freq=660):
  name='Campanilla'+str(freq);rate=22050;out=io.BytesIO()
  with wave.open(out,'wb') as w:
   w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(struct.pack('<h',int(10000*math.sin(2*math.pi*freq*i/rate)*math.exp(-i/(rate*.08)))) for i in range(int(rate*.25))))
  raw=out.getvalue();md5=hashlib.md5(raw).hexdigest();self.p.assets[md5+'.wav']=raw
  self.data['sounds'].append({'assetId':md5,'name':name,'dataFormat':'wav','format':'','rate':rate,'sampleCount':int(rate*.25),'md5ext':md5+'.wav'})
  return name
 def play(self,name):return self.b('sound_play',{'SOUND_MENU':self.b('sound_sounds_menu',fields={'SOUND_MENU':[name,None]},shadow=True)})
 def art(self,name,body,w=60,h=60):self.data['costumes'].append(self.p.svg(name,body,w,h))

def txt(x,y,text,size=16,color='#fff',anchor='middle'):
 return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="sans-serif" font-weight="bold" font-size="{size}" fill="{color}">{html.escape(text)}</text>'
def star(x,y,r=12,color='#ffe197'):
 pts=' '.join(f'{x+math.cos(i*math.pi/5-math.pi/2)*r*(.45 if i%2 else 1):.2f},{y+math.sin(i*math.pi/5-math.pi/2)*r*(.45 if i%2 else 1):.2f}' for i in range(10))
 return f'<polygon points="{pts}" fill="{color}"/>'
def spacebg(color,title,subtitle=''):
 return f'<rect width="480" height="360" fill="{color}"/>'+''.join(f'<circle cx="{(i*113+17)%480}" cy="{(i*61+13)%320}" r="{1+i%2}" fill="#e1dcff" opacity=".65"/>' for i in range(35))+f'<circle cx="410" cy="70" r="30" fill="#ffe7b3"/><path d="M0 300Q120 245 240 300T480 290V360H0Z" fill="#ffffff0c"/>'+txt(18,28,title,16,anchor='start')+txt(240,75,subtitle,11,'#c7ceee')
def button(p,name,label,x,y,w=150,color='#a6ecd6'):
 s=p.sprite(name);s.art(label,f'<rect x="2" y="2" width="{w-4}" height="40" rx="15" fill="{color}"/>'+txt(w/2,28,label,14,'#19344f'),w,44);s.data.update(x=x,y=y);return s

def endcard(p,state,title,subtitle):
 s=p.sprite(title);s.art(title,f'<rect x="0" y="0" width="400" height="190" rx="24" fill="#182745" stroke="#b9a7f0" stroke-width="3"/>'+star(200,40,22)+txt(200,95,title,25)+txt(200,130,subtitle,14,'#cfdaef')+txt(200,162,'Pulsa la bandera verde para volver a jugar',12,'#a8e9d9'),400,190)
 s.flag([s.hide(),s.forever([s.if_(s.eq(state,2 if 'gan' in title.lower() or 'portal' in title.lower() else 3),[s.show()],[s.hide()]),s.wait(.05)])]);return s

def controls(p,state,variables,labels):
 for i,(v,label) in enumerate(zip(variables,labels)):
  s=button(p,'Control '+str(i),label,-190+i*62,-151,54,'#c8bcf5')
  s.flag([s.forever([s.if_(s.eq(state,1),[s.show(),s.if_(s.and_(s.touching('_mouse_'),s.b('sensing_mousedown',boolean=True)),[s.set(v,1)],[s.set(v,0)])],[s.hide(),s.set(v,0)]),s.wait(.02)])])

def game1():
 p=Project('Aventura Estelar · Nivel 1');st=p.var('Estado');lv=p.var('Mundo',1);score=p.var('Estrellas');lives=p.var('Vidas',3);shield=p.var('Proteccion');dirs=[p.var(n) for n in ['Izquierda','Derecha','Arriba','Abajo']]
 for name,color in [('Jardin de cometas','#173e66'),('Caramelo cosmico','#582e69'),('Observatorio lunar','#181f52')]:p.stage.art(name,spacebg(color,name,'Flechas para pilotar · Reúne 6 estrellas por mundo'),480,360)
 s=p.stage
 s.flag([s.set(st,0),s.set(lv,1),s.set(score,0),s.set(lives,3),s.set(shield,0),s.backdrop('Jardin de cometas')])
 s.receive('comenzar',[s.set(st,1),s.emit('mundo'),s.forever([s.if_(s.eq(st,1),[s.if_(s.lt(lives,1),[s.set(st,3)]),s.if_(s.gt(score,5),[s.if_(s.lt(lv,3),[s.change(lv,1),s.set(score,0),s.emit('mundo')],[s.set(st,2)])])]),s.wait(.03)])])
 s.receive('mundo',[s.if_(s.eq(lv,1),[s.backdrop('Jardin de cometas')]),s.if_(s.eq(lv,2),[s.backdrop('Caramelo cosmico')]),s.if_(s.eq(lv,3),[s.backdrop('Observatorio lunar')])])
 title=p.sprite('Presentacion');title.art('Aventura Estelar',f'<rect width="410" height="205" rx="25" fill="#172844" stroke="#a9dfde" stroke-width="2"/>'+star(205,40,23)+txt(205,86,'AVENTURA ESTELAR',28)+txt(205,117,'Pilota, explora y ayuda a encender las estrellas.',13,'#d2d9f5')+txt(205,145,'Reúne 6 por mundo. Evita los meteoritos.',13,'#d2d9f5')+txt(205,175,'Un juego hecho con bloques de Scratch · CODIKIDS',11,'#9bead2'),410,205);title.data['y']=20
 title.flag([title.show()]);title.receive('comenzar',[title.hide()])
 b=button(p,'Jugar','¡COMENZAR!',0,-108,170);b.flag([b.show()]);b.click([b.if_(b.eq(st,0),[b.hide(),b.emit('comenzar')])])
 nave=p.sprite('Nave');nave.art('Menta','<path d="M3 26L19 15 45 25 19 35Z" fill="#a2f4dc"/><ellipse cx="23" cy="25" rx="10" ry="9" fill="#53749a"/><path d="M2 20L-1 25 3 31" stroke="#ffc76e" stroke-width="6"/><circle cx="25" cy="23" r="3" fill="#d6ffff"/>',50,50)
 nave.flag([nave.hide()]);nave.receive('mundo',[nave.xy(-160,0),nave.show()])
 nave.receive('comenzar',[nave.forever([nave.if_(nave.eq(st,1),[
  nave.if_(nave.or_(nave.key('left arrow'),nave.eq(dirs[0],1)),[nave.dx(-5)]),nave.if_(nave.or_(nave.key('right arrow'),nave.eq(dirs[1],1)),[nave.dx(5)]),nave.if_(nave.or_(nave.key('up arrow'),nave.eq(dirs[2],1)),[nave.dy(5)]),nave.if_(nave.or_(nave.key('down arrow'),nave.eq(dirs[3],1)),[nave.dy(-5)]),
  nave.if_(nave.gt(nave.x(),215),[nave.b('motion_setx',{'X':215})]),nave.if_(nave.lt(nave.x(),-215),[nave.b('motion_setx',{'X':-215})]),nave.if_(nave.gt(nave.y(),102),[nave.b('motion_sety',{'Y':102})]),nave.if_(nave.lt(nave.y(),-115),[nave.b('motion_sety',{'Y':-115})]),nave.effect('GHOST',nave.op('multiply',shield,55))],[nave.hide()]),nave.wait(.033)])])
 for i in range(3):
  g=p.sprite('Estrella '+str(i));g.art('Luz',star(20,20,17),40,40);tone=g.sound(660+i*110)
  g.flag([g.hide()]);g.receive('mundo',[g.xy(g.rand(-120,200),g.rand(-100,95)),g.show()])
  g.receive('comenzar',[g.forever([g.if_(g.eq(st,1),[g.if_(g.touching('Nave'),[g.change(score,1),g.play(tone),g.xy(g.rand(-120,200),g.rand(-100,95)),g.wait(.2)])],[g.hide()]),g.wait(.03)])])
 for i in range(2):
  e=p.sprite('Meteorito '+str(i));e.art('Roca','<path d="M7 5L26 1 38 16 35 30 19 39 3 27 0 13Z" fill="#c29dad" stroke="#efc5b8" stroke-width="2"/><circle cx="14" cy="15" r="5" fill="#8b738d"/><circle cx="27" cy="28" r="4" fill="#8b738d"/>',40,40)
  e.flag([e.hide()]);e.receive('mundo',[e.xy(225+i*120,e.rand(-100,90)),e.show()])
  e.receive('comenzar',[e.forever([e.if_(e.eq(st,1),[e.dx(e.op('subtract',-2,lv)),e.if_(e.lt(e.x(),-235),[e.xy(240,e.rand(-100,90))]),e.if_(e.and_(e.touching('Nave'),e.eq(shield,0)),[e.change(lives,-1),e.set(shield,1),e.xy(240,e.rand(-100,90)),e.wait(1.2),e.set(shield,0)])],[e.hide()]),e.wait(.033)])])
 controls(p,st,dirs,['◀','▶','▲','▼']);endcard(p,st,'¡Ganaste, explorador!','Encendiste los tres mundos de estrellas.');endcard(p,st,'¡Vuelve a intentarlo!','Cada viaje te ayuda a mejorar.');hud(p,lv,score,lives)
 p.save('Aventura_Estelar_Nivel_1.sb3')

def hud(p,lv,score,lives):
 p.stage.flag([p.stage.b('data_hidevariable',fields={'VARIABLE':[v.name,v.id]}) for v in [lv,score,lives]])
 p.stage.receive('comenzar',[p.stage.b('data_showvariable',fields={'VARIABLE':[v.name,v.id]}) for v in [lv,score,lives]])
 for v,x in [(lv,12),(score,165),(lives,335)]:
  p.monitors.append({'id':v.id,'mode':'default','opcode':'data_variable','params':{'VARIABLE':v.name},'spriteName':None,'value':0,'width':0,'height':0,'x':x,'y':32,'visible':False,'sliderMin':0,'sliderMax':100,'isDiscrete':True})

def game3():
 p=Project('Guardianes del Portal · Nivel 3');st=p.var('Estado');lv=p.var('Mundo',1);score=p.var('Cristales');lives=p.var('Vidas',5);key=p.var('PortalActivo');shield=p.var('Proteccion');vy=p.var('VelocidadY');jx=p.var('JugadorX');jy=p.var('JugadorY');old=p.var('PieAnterior');floor=p.var('SueloY',-999);jumps=p.var('Saltos');ready=p.var('SaltoListo',1);direction=p.var('DireccionTactil');tap=p.var('SaltoTactil')
 worlds=['Jardin suspendido','Nucleo de lava','Portal de medianoche']
 for name,color in zip(worlds,['#153f54','#4d233e','#191b4c']):p.stage.art(name,spacebg(color,name,'Flechas · Espacio: doble salto · 3 cristales + interruptor'),480,360)
 s=p.stage;s.flag([s.set(st,0),s.set(lv,1),s.set(score,0),s.set(lives,5),s.set(key,0),s.set(shield,0),s.set(direction,0),s.set(tap,0),s.backdrop(worlds[0])])
 s.receive('comenzar',[s.set(st,1),s.emit('mundo'),s.forever([s.if_(s.and_(s.eq(st,1),s.lt(lives,1)),[s.set(st,3)]),s.wait(.03)])])
 s.receive('mundo',[s.set(score,0),s.set(key,0),s.set(direction,0),*[s.if_(s.eq(lv,i+1),[s.backdrop(name)]) for i,name in enumerate(worlds)],s.emit('regreso')])
 title=p.sprite('Instrucciones');title.art('Guardianes',f'<rect width="410" height="220" rx="25" fill="#1b2447" stroke="#c5b8ff" stroke-width="2"/>'+txt(205,43,'GUARDIANES DEL PORTAL',24)+txt(205,77,'Tres mundos. Cinco vidas. Un gran desafío.',14,'#d4d9fb')+txt(205,108,'Reúne los 3 cristales y toca el interruptor.',13,'#c5f6e7')+txt(205,135,'Usa el doble salto para evitar la lava y los drones.',12)+txt(205,164,'Teclado: flechas + espacio (pulsa dos veces).',12)+txt(205,192,'Táctil: elige dirección, detente o pulsa saltar.',12),410,220);title.data['y']=13;title.flag([title.show()]);title.receive('comenzar',[title.hide()])
 b=button(p,'Jugar','ABRIR LA AVENTURA',0,-117,205);b.flag([b.show()]);b.click([b.if_(b.eq(st,0),[b.hide(),b.emit('comenzar')])])
 hero=p.sprite('Guardian');hero.art('Inventor','<rect x="2" y="2" width="24" height="28" rx="8" fill="#a8f5dc" stroke="#dcfff6" stroke-width="2"/><rect x="6" y="9" width="6" height="7" rx="2" fill="#24364c"/><rect x="18" y="9" width="6" height="7" rx="2" fill="#24364c"/><path d="M9 23h10" stroke="#456c80" stroke-width="3"/>',30,32);hero.flag([hero.hide()])
 hero.receive('regreso',[hero.xy(-213,-86),hero.set(vy,0),hero.set(jumps,0),hero.set(ready,1),hero.show()])
 hero.receive('comenzar',[hero.forever([hero.if_(hero.eq(st,1),[
  hero.if_(hero.or_(hero.key('left arrow'),hero.eq(direction,-1)),[hero.dx(-5)]),hero.if_(hero.or_(hero.key('right arrow'),hero.eq(direction,1)),[hero.dx(5)]),
  hero.if_(hero.not_(hero.or_(hero.key('space'),hero.eq(tap,1))),[hero.set(ready,1)]),
  hero.if_(hero.and_(hero.or_(hero.key('space'),hero.eq(tap,1)),hero.eq(ready,1),hero.lt(jumps,2)),[hero.set(vy,11),hero.change(jumps,1),hero.set(ready,0)]),
  hero.set(old,hero.op('subtract',hero.y(),16)),hero.change(vy,-.7),hero.dy(vy),hero.set(jx,hero.x()),hero.set(jy,hero.y()),hero.set(floor,-999),hero.emit('colision',True),
  hero.if_(hero.and_(hero.gt(floor,-900),hero.lt(vy,0)),[hero.b('motion_sety',{'Y':floor}),hero.set(vy,0),hero.set(jumps,0)]),
  hero.if_(hero.gt(hero.x(),225),[hero.b('motion_setx',{'X':225})]),hero.if_(hero.lt(hero.x(),-225),[hero.b('motion_setx',{'X':-225})]),
  hero.if_(hero.lt(hero.y(),-170),[hero.change(lives,-1),hero.emit('regreso')]),hero.effect('GHOST',hero.op('multiply',shield,55))],[hero.hide()]),hero.wait(.02)])])
 layouts=[[(0,-119,480),(-132,-57,104),(-6,0,94),(117,52,96),(204,-12,68)],[(0,-119,480),(-142,-55,86),(-32,12,82),(98,66,86),(207,3,66)],[(0,-119,480),(-138,-50,76),(-21,17,76),(112,73,78),(207,10,66)]]
 for i in range(5):
  plat=p.sprite('Plataforma '+str(i));width=plat.local('Ancho');dir_=plat.local('Sentido',1)
  for k in range(3):
   w=layouts[k][i][2];plat.art('Mundo '+str(k+1),f'<rect x="0" y="0" width="{w}" height="16" rx="5" fill="{["#4b9097","#925e78","#6c74ad"][k]}"/><rect x="0" y="0" width="{w}" height="5" rx="2" fill="#abf2d8"/>',w,16)
  plat.flag([plat.hide()]);plat.receive('mundo',[plat.show(),*[plat.if_(plat.eq(lv,k+1),[plat.xy(layouts[k][i][0],layouts[k][i][1]),plat.set(width,layouts[k][i][2]),plat.costume('Mundo '+str(k+1))]) for k in range(3)]])
  absx=plat.b('operator_mathop',{'NUM':plat.op('subtract',jx,plat.x())},{'OPERATOR':['abs',None]})
  plat.receive('colision',[plat.if_(plat.and_(plat.lt(vy,0),plat.not_(plat.lt(old,plat.op('add',plat.y(),8))),plat.not_(plat.gt(plat.op('subtract',jy,16),plat.op('add',plat.y(),8))),plat.lt(absx,plat.op('add',plat.op('divide',width,2),12))),[plat.set(floor,plat.op('add',plat.y(),24))])])
  if i==3:
   plat.receive('comenzar',[plat.forever([plat.if_(plat.eq(st,1),[plat.dx(dir_),plat.if_(plat.gt(plat.x(),142),[plat.set(dir_,-1)]),plat.if_(plat.lt(plat.x(),75),[plat.set(dir_,1)])]),plat.wait(.04)])])
 for i in range(3):
  g=p.sprite('Cristal '+str(i));g.art('Cristal','<path d="M15 1L28 15 15 30 1 15Z" fill="#aeeeff" stroke="#eeffff" stroke-width="2"/><path d="M15 1v29M1 15h27" stroke="#65c6d4"/>',30,32);got=g.local('Recogido');tone=g.sound(780+i*100)
  g.flag([g.hide()]);g.receive('mundo',[g.set(got,0),g.show(),*[g.if_(g.eq(lv,k+1),[g.xy(layouts[k][i+1][0],layouts[k][i+1][1]+42)]) for k in range(3)]])
  g.receive('comenzar',[g.forever([g.if_(g.eq(st,1),[g.if_(g.and_(g.eq(got,0),g.touching('Guardian')),[g.set(got,1),g.hide(),g.change(score,1),g.play(tone)])],[g.hide()]),g.wait(.03)])])
 sw=p.sprite('Interruptor');sw.art('Apagado','<rect x="1" y="1" width="30" height="30" rx="8" fill="#71699d" stroke="#c8c4ff" stroke-width="2"/>'+txt(16,23,'I',21),32,32);sw.art('Encendido','<rect x="1" y="1" width="30" height="30" rx="8" fill="#a4f5d5"/>'+txt(16,23,'I',21,'#22566a'),32,32);sw.flag([sw.hide()]);sw.receive('mundo',[sw.show(),sw.costume('Apagado'),sw.xy(-32,-89)])
 sw.receive('comenzar',[sw.forever([sw.if_(sw.eq(st,1),[sw.if_(sw.touching('Guardian'),[sw.set(key,1),sw.costume('Encendido')])],[sw.hide()]),sw.wait(.03)])])
 portal=p.sprite('Portal');portal.art('Portal','<ellipse cx="22" cy="30" rx="18" ry="27" fill="#7c76c44d" stroke="#b7edff" stroke-width="5"/><ellipse cx="22" cy="30" rx="10" ry="19" fill="none" stroke="#d2bcff" stroke-width="2"/>',44,60);portal.flag([portal.hide()]);portal.receive('mundo',[portal.show(),*[portal.if_(portal.eq(lv,k+1),[portal.xy(207,layouts[k][4][1]+39)]) for k in range(3)]])
 portal.receive('comenzar',[portal.forever([portal.if_(portal.eq(st,1),[portal.if_(portal.touching('Guardian'),[portal.if_(portal.and_(portal.eq(score,3),portal.eq(key,1)),[portal.if_(portal.lt(lv,3),[portal.change(lv,1),portal.emit('mundo'),portal.wait(.3)],[portal.set(st,2)])],[portal.say('Faltan cristales o el interruptor',1)])])],[portal.hide()]),portal.wait(.03)])])
 for name,kind in [('Lava',0),('Dron',1)]:
  e=p.sprite(name)
  if not kind:e.art(name,'<rect width="110" height="14" rx="5" fill="#ff825c"/>'+''.join(f'<path d="M{i*15} 14q-4-14 8-13 12 4 3 13" fill="#ffd07c"/>' for i in range(7)),110,14)
  else:e.art(name,'<ellipse cx="18" cy="17" rx="17" ry="12" fill="#f59cbb"/><path d="M6 6L2 0m28 6 4-6" stroke="#eac6fe" stroke-width="3"/><circle cx="12" cy="16" r="3" fill="#3c3256"/><circle cx="25" cy="16" r="3" fill="#3c3256"/>',36,32)
  e.flag([e.hide()]);e.receive('mundo',[e.show(),e.xy(35,-100) if not kind else e.xy(80,100)])
  damage=[e.change(lives,-1),e.set(shield,1),e.emit('regreso'),e.wait(1.2),e.set(shield,0)]
  e.receive('comenzar',[e.forever([e.if_(e.eq(st,1),([e.dx(-3),e.if_(e.lt(e.x(),-230),[e.xy(230,e.rand(-10,95))])] if kind else [])+[e.if_(e.and_(e.touching('Guardian'),e.eq(shield,0)),damage)],[e.hide()]),e.wait(.03)])])
 for i,(lab,d) in enumerate([('◀',-1),('■',0),('▶',1)]):
  b=button(p,'Direccion '+str(i),lab,-195+i*61,-151,52,'#c4bcf3');b.flag([b.forever([b.if_(b.eq(st,1),[b.show()],[b.hide()]),b.wait(.1)])]);b.click([b.set(direction,d)])
 b=button(p,'Saltar','SALTAR',178,-151,100,'#a6edd4');b.flag([b.hide()]);b.receive('comenzar',[b.show()]);b.click([b.if_(b.eq(st,1),[b.set(tap,1),b.wait(.12),b.set(tap,0)])])
 endcard(p,st,'¡Portal conquistado!','Dominaste los tres mundos de Scratch.');endcard(p,st,'¡Vuelve a intentarlo!','Practica el doble salto y activa el portal.');hud(p,lv,score,lives)
 p.save('Guardianes_del_Portal_Nivel_3.sb3')

def forestbg(title,lines,day=False,route=1,final=False):
 color='#8f8ac5' if day else '#25274f'
 body=f'<rect width="480" height="360" fill="{color}"/><circle cx="422" cy="54" r="25" fill="#ffe5b0"/>'
 body+=''.join(f'<circle cx="{(i*71+23)%480}" cy="{(i*37)%150}" r="1.5" fill="#ffeac0"/>' for i in range(20))
 body+='<path d="M0 255L82 98 187 230 310 88 480 250V360H0Z" fill="#66648d"/><path d="M0 286Q110 223 237 278T480 267V360H0Z" fill="#4e7b88"/><path d="M0 320Q120 263 280 318T480 296V360H0Z" fill="#325f71"/>'
 body+=f'<path d="M220 288Q300 308 265 326T365 360H450Q310 330 330 310T255 288Z" fill="{"#85c9df" if route==1 else "#d9b7aa"}"/>'
 for x in [20,76,448]:body+=f'<path d="M{x} 325v-100" stroke="#5e4b68" stroke-width="12"/><path d="M{x-26} 262l26-96 30 96z" fill="#609b94"/>'
 body+='<path d="M355 300V210M355 250l-30-27m30 17 25-32" stroke="#755976" stroke-width="17" stroke-linecap="round"/>'
 for i,(x,y) in enumerate([(330,203),(355,182),(379,206),(341,227),(374,230)]):body+=f'<circle cx="{x}" cy="{y}" r="23" fill="{["#f2b8d4","#b5e4ba","#f8dc8d"][i%3] if final else "#68768c"}"/>'
 body+='<rect x="14" y="12" width="452" height="114" rx="17" fill="#17253fe6"/>'+txt(240,39,title,21,'#ffebc7')
 for i,line in enumerate(lines):body+=txt(240,65+i*20,line,12,'#e3e1f3')
 return body

def story():
 p=Project('El bosque de los colores');cap=p.var('Capitulo');route=p.var('Camino',1);day=p.var('DeDia');friend=p.var('Companero',1);light=p.var('Luces');pairs=p.var('Parejas');first=p.var('Primera');second=p.var('Segunda');v1=p.var('ValorPrimera');v2=p.var('ValorSegunda');busy=p.var('Ocupado');step=p.var('Paso');mel=p.var('MelodiaCompleta');done=p.var('Listo');showmel=p.var('MelodiaVista')
 texts=[('EL BOSQUE DE LOS COLORES',['Una semilla de luz necesita un equipo valiente.','Elige tu compañero tocándolo y comienza el cuento.','Una aventura de decisiones y tres minijuegos.']),('Dos caminos, una aventura',['Luma y su amigo buscan tres regalos para el árbol:','luz, recuerdos y una melodía.','¿Por dónde quieres acompañarlos?']),('El regalo de la luz',['Las luciérnagas esperan tu invitación.','Toca las CINCO luces del paisaje.','Cada luz nos acerca al gran árbol.']),('El jardín de los recuerdos',['Un zorro mezcló sus tarjetas. Ayúdalo a recordar.','Toca dos tarjetas y encuentra las TRES parejas.','Si no coinciden, observa y vuelve a intentar.']),('La melodía del árbol',['Observa la secuencia y repite los CUATRO símbolos.','Pulsa VER MELODÍA todas las veces que necesites.','Flor, estrella, hoja… ¿cuál viene después?']),('LOS COLORES REGRESAN',['Las luces, los recuerdos y la melodía despertaron al árbol.','Luma sonríe: «Cuando ayudamos, todos podemos brillar».','¡Gracias por cuidar el bosque! · Powered by CODIKIDS'])]
 for c,(title,lines) in enumerate(texts):
  for r in [1,2]:
   for d in [0,1]:p.stage.art(f'{c}-{r}-{d}',forestbg(title,lines,bool(d),r,c==5),480,360)
 s=p.stage;s.flag([*[s.set(v,0) for v in [cap,day,light,pairs,first,second,v1,v2,busy,step,mel,done,showmel]],s.set(route,1),s.set(friend,1),s.emit('escena')])
 s.receive('escena',[*[s.if_(s.and_(s.eq(cap,c),s.eq(route,r),s.eq(day,d)),[s.backdrop(f'{c}-{r}-{d}')]) for c in range(6) for r in [1,2] for d in [0,1]],s.set(done,0),s.if_(s.eq(cap,2),[s.set(light,0)]),s.if_(s.eq(cap,3),[s.set(pairs,0),s.set(first,0),s.set(second,0),s.set(busy,0)]),s.if_(s.eq(cap,4),[s.set(step,0),s.set(mel,0),s.set(showmel,0),s.set(busy,0)])])
 # Day/night changes the backdrop without resetting minigames.
 s.receive('iluminacion',[*[s.if_(s.and_(s.eq(cap,c),s.eq(route,r),s.eq(day,d)),[s.backdrop(f'{c}-{r}-{d}')]) for c in range(6) for r in [1,2] for d in [0,1]]])
 s.flag([s.forever([s.if_(s.or_(s.and_(s.eq(cap,2),s.eq(light,5)),s.and_(s.eq(cap,3),s.eq(pairs,3)),s.and_(s.eq(cap,4),s.eq(mel,1))),[s.set(done,1)]),s.wait(.05)])])
 luma=p.sprite('Luma');luma.art('Guardiana','<path d="M21 61q20-22 40 0l10 28H12Z" fill="#c7b7ef"/><circle cx="41" cy="37" r="22" fill="#ffe1bf"/><path d="M19 37q-5-37 23-34 30-1 22 34L54 20Q37 39 19 37Z" fill="#574866"/><circle cx="33" cy="37" r="3" fill="#453956"/><circle cx="49" cy="37" r="3" fill="#453956"/><path d="M35 48q6 5 12-1" stroke="#b87d8e" stroke-width="2" fill="none"/><path d="M58 66l19-10" stroke="#ffe1bf" stroke-width="6"/><rect x="74" y="40" width="16" height="22" rx="5" fill="#ffe5a1"/>',96,96);luma.data.update(x=-94,y=-55,size=80)
 luma.flag([luma.show(),luma.forever([luma.repeat(12,[luma.dy(.25),luma.wait(.05)]),luma.repeat(12,[luma.dy(-.25),luma.wait(.05)])])])
 luma.receive('escena',[luma.say(''),luma.if_(luma.eq(cap,1),[luma.say('¡Tú eliges el camino!',2)]),luma.if_(luma.eq(cap,5),[luma.say('¡Somos guardianes de los colores!',3)])])
 amigo=p.sprite('Companero')
 for name,ears,color in [('Zorro','<path d="M10 24L4 1 28 17m21 0L70 1 65 28" fill="#e3a16e"/>','#e3a16e'),('Conejo','<ellipse cx="24" cy="13" rx="8" ry="24" fill="#fff1df"/><ellipse cx="52" cy="13" rx="8" ry="24" fill="#fff1df"/>','#fff1df'),('Panda','<circle cx="15" cy="24" r="11" fill="#3c435d"/><circle cx="59" cy="24" r="11" fill="#3c435d"/>','#e0f1ec')]:amigo.art(name,ears+f'<ellipse cx="38" cy="44" rx="31" ry="25" fill="{color}"/><circle cx="26" cy="40" r="4" fill="#3d3a4f"/><circle cx="50" cy="40" r="4" fill="#3d3a4f"/><path d="M33 51l5 5 5-5" fill="#87627a"/>',76,76)
 amigo.data.update(x=-170,y=-72,size=70);amigo.flag([amigo.costume('Zorro')]);amigo.click([amigo.if_(amigo.eq(cap,0),[amigo.b('looks_nextcostume'),amigo.change(friend,1),amigo.if_(amigo.gt(friend,3),[amigo.set(friend,1)])])])
 start=button(p,'Comenzar','COMENZAR EL CUENTO',0,-145,220);start.flag([start.forever([start.if_(start.eq(cap,0),[start.show()],[start.hide()]),start.wait(.05)])]);start.click([start.if_(start.eq(cap,0),[start.set(cap,1),start.emit('escena')])])
 for r,label in [(1,'POR EL RÍO'),(2,'POR LA MONTAÑA')]:
  b=button(p,'Camino '+str(r),label,-105 if r==1 else 105,-142,192);b.flag([b.hide(),b.forever([b.if_(b.eq(cap,1),[b.show()],[b.hide()]),b.wait(.05)])]);b.click([b.if_(b.eq(cap,1),[b.set(route,r),b.set(cap,2),b.emit('escena')])])
 b=button(p,'Continuar','CONTINUAR LA HISTORIA',0,-146,236);b.flag([b.hide(),b.forever([b.if_(b.and_(b.eq(done,1),b.lt(cap,5)),[b.show()],[b.hide()]),b.wait(.05)])]);b.click([b.if_(b.eq(done,1),[b.set(done,0),b.change(cap,1),b.emit('escena')])])
 b=button(p,'DiaNoche','DÍA / NOCHE',178,-94,112,'#c9bbee');b.flag([b.forever([b.if_(b.eq(cap,3),[b.hide()],[b.show()]),b.wait(.1)])]);b.click([b.set(day,b.op('subtract',1,day)),b.emit('iluminacion')])
 b=button(p,'Repetir','OTRA AVENTURA',0,-145,185);b.flag([b.hide(),b.forever([b.if_(b.eq(cap,5),[b.show()],[b.hide()]),b.wait(.05)])]);b.click([b.if_(b.eq(cap,5),[b.set(cap,0),b.set(light,0),b.set(pairs,0),b.set(mel,0),b.emit('escena')])])
 for i,(x,y) in enumerate([(-205,0),(-52,20),(68,-32),(180,6),(18,-92)]):
  f=p.sprite('Luciernaga '+str(i+1));f.art('Luz',f'<circle cx="19" cy="19" r="18" fill="#ffdc7766"/>'+star(19,19,12),38,38);f.data.update(x=x,y=y);got=f.local('Encontrada');tone=f.sound(700+i*110)
  f.flag([f.hide()]);f.receive('escena',[f.set(got,0),f.if_(f.eq(cap,2),[f.show()],[f.hide()])]);f.click([f.if_(f.and_(f.eq(cap,2),f.eq(got,0)),[f.set(got,1),f.change(light,1),f.play(tone),f.hide()])])
 for i,val in enumerate([1,3,2,1,2,3]):
  c=p.sprite('Tarjeta '+str(i+1));matched=c.local('ParejaEncontrada');c.art('Reverso','<rect x="1" y="1" width="68" height="54" rx="11" fill="#685b9d" stroke="#c5b8fa" stroke-width="2"/>'+txt(35,39,'?',30),70,56)
  symbol=star(35,28,20) if val==3 else '<path d="M15 40Q13 2 56 12 54 45 15 40Z" fill="#a4eac7"/><path d="M17 39l30-21" stroke="#568c86" stroke-width="3"/>' if val==2 else ''.join(f'<circle cx="{35+math.cos(j*math.pi/3)*13}" cy="{28+math.sin(j*math.pi/3)*13}" r="10" fill="#f2b5d5"/>' for j in range(6))+'<circle cx="35" cy="28" r="8" fill="#ffdda0"/>'
  c.art('Dibujo','<rect x="1" y="1" width="68" height="54" rx="11" fill="#334767" stroke="#c5b8fa" stroke-width="2"/>'+symbol,70,56);c.data.update(x=-81+(i%3)*81,y=10-(i//3)*68)
  c.flag([c.hide()]);c.receive('escena',[c.if_(c.eq(cap,3),[c.set(matched,0),c.effect('COLOR',0),c.costume('Reverso'),c.show()],[c.hide()])])
  c.receive('pareja',[c.if_(c.or_(c.eq(first,i+1),c.eq(second,i+1)),[c.set(matched,1),c.effect('COLOR',30)])])
  c.receive('tapar',[c.if_(c.eq(matched,0),[c.costume('Reverso')])])
  c.click([c.if_(c.and_(c.eq(cap,3),c.eq(matched,0),c.eq(busy,0),c.not_(c.eq(first,i+1))),[c.costume('Dibujo'),c.if_(c.eq(first,0),[c.set(first,i+1),c.set(v1,val)],[c.set(busy,1),c.set(second,i+1),c.set(v2,val),c.wait(.85),c.if_(c.eq(v1,v2),[c.emit('pareja',True),c.change(pairs,1)]),c.emit('tapar',True),c.set(first,0),c.set(second,0),c.set(busy,0)])])])
 for n,label in [(1,'FLOR'),(2,'HOJA'),(3,'ESTRELLA')]:
  pad=button(p,'Nota '+str(n),label,-132+(n-1)*132,-20,120,['#e6b4d4','#a6e7ca','#ffe1a0'][n-1]);tone=pad.sound([523,659,784][n-1]);pad.flag([pad.hide()]);pad.receive('escena',[pad.if_(pad.eq(cap,4),[pad.show()],[pad.hide()])]);pad.receive('nota'+str(n),[pad.effect('BRIGHTNESS',40),pad.play(tone),pad.wait(.45),pad.effect('BRIGHTNESS',0)])
  expected=pad.or_(pad.and_(pad.or_(pad.eq(step,1),pad.eq(step,4)),pad.eq(n,1)),pad.and_(pad.eq(step,2),pad.eq(n,3)),pad.and_(pad.eq(step,3),pad.eq(n,2)))
  pad.click([pad.if_(pad.and_(pad.eq(cap,4),pad.eq(busy,0),pad.eq(showmel,1),pad.gt(step,0),pad.eq(mel,0)),[pad.play(tone),pad.if_(expected,[pad.change(step,1),pad.if_(pad.eq(step,5),[pad.set(mel,1)])],[pad.set(step,0),pad.say('Mira la melodía otra vez',1)])])])
 b=button(p,'Ver melodia','VER MELODÍA',0,-93,180,'#cbbcf5');b.flag([b.hide()]);b.receive('escena',[b.if_(b.eq(cap,4),[b.show()],[b.hide()])]);b.click([b.if_(b.and_(b.eq(cap,4),b.eq(busy,0),b.eq(mel,0)),[b.set(busy,1),b.set(showmel,0),b.set(step,0),b.wait(.4),b.emit('nota1',True),b.wait(.25),b.emit('nota3',True),b.wait(.25),b.emit('nota2',True),b.wait(.25),b.emit('nota1',True),b.set(step,1),b.set(showmel,1),b.set(busy,0)])])
 p.save('El_Bosque_de_los_Colores_Interactivo.sb3')

if __name__=='__main__':
 OUT.mkdir(exist_ok=True,parents=True)
 game1();game3();story()
