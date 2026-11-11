import {useId} from 'react'

export function Coneja({exploradora=false,feliz=false}){
 return <svg className="nucita-coneja" viewBox="0 0 220 252" aria-label="Nucita, la coneja exploradora" role="img">
 <ellipse cx="113" cy="235" rx="79" ry="10" fill="#142938" opacity=".22"/>
 <path d="M162 183q42-26 48 6q0 22-31 16" fill="#fff4e4" stroke="#613f57" strokeWidth="4"/>
 <path d="M62 125C37 87 34 25 51 14c25-13 48 51 47 82m37 3c3-41 30-91 49-82 18 10 7 71-14 102" fill="#fff0db" stroke="#613f57" strokeWidth="4"/>
 <path d="M65 95C54 68 44 32 54 29c11-3 27 42 29 68m63 3c9-33 25-69 34-65 8 4-1 43-15 73" fill="#e695a5"/>
 <path d="M62 155q46-27 96 0l19 66q-60 18-126 0z" fill={exploradora?'#dc9d55':'#8268bf'} stroke="#613f57" strokeWidth="4"/>
 <path d="M62 171q-39 10-29 37 10 11 30-9m93-28q38 8 29 35-11 11-31-10" fill="#fff0db" stroke="#613f57" strokeWidth="4"/>
 <ellipse cx="77" cy="223" rx="32" ry="14" fill="#fff0db" stroke="#613f57" strokeWidth="4"/><ellipse cx="146" cy="223" rx="32" ry="14" fill="#fff0db" stroke="#613f57" strokeWidth="4"/>
 <path d="M51 112q13-35 57-35 49 0 66 35 20 42-15 63-20 12-51 12-48 0-65-29-13-25 8-46" fill="#fff0db" stroke="#613f57" strokeWidth="4"/>
 <ellipse cx="72" cy="147" rx="13" ry="7" fill="#ed9bad"/><ellipse cx="147" cy="147" rx="13" ry="7" fill="#ed9bad"/>
 {feliz?<path d="M77 130q8-12 16 0m34 0q8-12 16 0" fill="none" stroke="#402d50" strokeWidth="4" strokeLinecap="round"/>:<g fill="#402d50"><ellipse cx="85" cy="128" rx="6" ry="10"/><ellipse cx="135" cy="128" rx="6" ry="10"/><circle cx="87" cy="125" r="2" fill="white"/><circle cx="137" cy="125" r="2" fill="white"/></g>}
 <path d="M103 142q7-7 14 0l-7 7z" fill="#b6607d"/><path d={feliz?'M99 156q11 22 23 0z':'M99 154q11 10 23 0'} fill={feliz?'#ae5671':'none'} stroke="#613f57" strokeWidth="3" strokeLinecap="round"/>
 <path d="M85 181q23 9 49 0l-12 20-18-7-16 7z" fill={exploradora?'#e66263':'#f2bc61'} stroke="#613f57" strokeWidth="3"/>
 {exploradora&&<path d="M65 96l12-15q24-12 67-2l16 20-92 7z" fill="#ad663f" stroke="#613f57" strokeWidth="3"/>}
 </svg>
}

export default function NucitaEscena({parque,farol,pio,final,children}){
 const id=useId().replace(/:/g,'')
 const grad=(n)=>`url(#${id}-${n})`
 return <div className={`nucita-escena ${parque?'parque':'bosque'}`}>
 <svg viewBox="0 0 960 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
 <defs>
 <linearGradient id={id+'-cielo'} x2="0" y2="1"><stop stopColor={parque?'#7c85bb':'#96c9bd'}/><stop offset="1" stopColor={parque?'#ffd2a3':'#f9dfa7'}/></linearGradient>
 <linearGradient id={id+'-suelo'} x2="0" y2="1"><stop stopColor={parque?'#829a6f':'#729864'}/><stop offset="1" stopColor={parque?'#355a58':'#294e49'}/></linearGradient>
 <radialGradient id={id+'-luz'}><stop stopColor="#fff9b8" stopOpacity=".95"/><stop offset="1" stopColor="#ffe99f" stopOpacity="0"/></radialGradient>
 <pattern id={id+'-flores'} width="92" height="64" patternUnits="userSpaceOnUse"><path d="M14 47q0-13 4-17m33 24q2-12 7-16" stroke="#aad090" opacity=".75" fill="none" strokeWidth="2"/><circle cx="18" cy="29" r="4" fill="#f4bb8d"/><circle cx="59" cy="37" r="3" fill="#e6a0b2"/><circle cx="74" cy="18" r="2" fill="#f3eab0"/></pattern>
 </defs>
 <path fill={grad('cielo')} d="M0 0h960v430H0z"/><circle cx="685" cy="99" r="104" fill={grad('luz')}/><circle cx="685" cy="99" r="36" fill="#fff1c0"/>
 <path d="M0 215Q144 100 300 183T600 175T960 147V370H0Z" fill={parque?'#9298a7':'#799e91'}/>
 <path d="M0 229Q171 146 312 231T642 215T960 197V390H0Z" fill={parque?'#798b8a':'#608c7e'}/>
 <path d="M0 270Q225 212 449 258T960 251V430H0Z" fill={grad('suelo')}/>
 <path d="M0 307Q204 292 406 320T960 293V430H0Z" fill={grad('flores')} opacity=".8"/>
 <path d="M113 430C230 348 533 378 611 321S685 274 716 267c-12 24-25 57-62 89-62 52-162 32-213 74z" fill={parque?'#d1b69d':'#b8a783'} opacity=".9"/>
 {!parque&&[5,130,865,950].map((x,i)=><g key={x} transform={`translate(${x} ${i%2?40:-4})`}>
 <path d="M-33 322Q-10 230-19 113l38-8q-11 125 18 217z" fill={i%2?'#496352':'#365b52'}/><path d="M0 263q11-72 9-132" stroke="#709278" strokeWidth="5" fill="none"/>
 <path d="M-83 118q-42-65 15-95 10-44 74-36 57-6 79 43 35 14 28 53-4 47-70 52-79 19-126-17" fill={i%2?'#5b8a70':'#43725f'}/><path d="M-73 62q35-48 102-43" fill="none" stroke="#84ad7b" opacity=".7" strokeWidth="10" strokeLinecap="round"/></g>)}
 {parque&&<>
 <path d="M0 256h960m0 14H0" stroke="#ebd5b1" strokeWidth="4"/>{Array.from({length:25},(_,i)=><path key={i} d={`M${i*40} 246v40`} stroke="#f5dfb9" strokeWidth="4"/>)}
 <path d="M700 257v-99l78-54 78 54v99" fill="#b29089"/><path d="M683 164l95-68 94 68" fill="none" stroke="#6d5c83" strokeWidth="15" strokeLinejoin="round"/>
 <path d="M763 256v-46q15-30 30 0v46z" fill="#674e68"/><rect x="721" y="177" width="23" height="29" rx="3" fill="#ffdf9b"/><rect x="810" y="177" width="23" height="29" rx="3" fill="#ffdf9b"/>
 <ellipse cx="551" cy="319" rx="95" ry="27" fill="#789d9b"/><ellipse cx="551" cy="314" rx="84" ry="21" fill="#a8ddd5"/><path d="M551 314V267m0 0q-28 8-36 29m36-29q29 4 37 29" fill="none" stroke="#def5e6" strokeWidth="4" strokeLinecap="round"/>
 {final==='fiesta'&&<g><path d="M112 105Q470 230 835 112" stroke="#665271" strokeWidth="3" fill="none"/>{Array.from({length:13},(_,i)=><circle key={i} className="nucita-brillo" cx={130+i*57} cy={112+Math.sin(i/12*Math.PI)*59} r="7" fill={['#fff0a0','#ffb5d0','#bcf3db'][i%3]}/>)}</g>}
 <g transform={final==='sendero'?'translate(-99 38)':''}><path d="M737 346V201m-12 0h24l7 17h-38z" stroke="#473b5a" strokeWidth="5" fill="#6c5070"/><rect x="721" y="219" width="32" height="31" rx="4" fill={farol?'#fff2a3':'#8b8093'}/>
 {farol&&<circle className="nucita-brillo" cx="737" cy="235" r="100" fill={grad('luz')}/>}</g>
 {pio&&<g transform="translate(437 198)"><path d="M-15 31q-27-15-32-7 5 23 36 24" fill="#6283b2"/><ellipse cy="33" rx="26" ry="23" fill="#80acc8"/><circle cy="13" r="23" fill="#98bfd3"/><path d="M18 14l22 8-20 5z" fill="#f3ae65"/><circle cx="9" cy="8" r="4" fill="#302e52"/><path d="M-13 31q-16 9 5 14" stroke="#5276aa" strokeWidth="5" fill="none"/></g>}
 </>}
 {Array.from({length:21},(_,i)=><circle key={i} className="nucita-luciernaga" style={{animationDelay:`${(i%7)*.38}s`}} cx={34+(i*107)%890} cy={57+(i*71)%327} r={i%3+1.3} fill={final==='fiesta'?'#ffb4d4':'#fff4aa'} opacity=".77"/>)}
 </svg>{children}</div>
}
