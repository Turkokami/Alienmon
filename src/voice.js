/* ---------- Story voices (audio/voice, indexed by tools/voice_index.py from docs/voice_pack) ----------
 When a dialogue page or story panel shows a main-story line, its recorded line plays (the book's audiobook voices,
 made in ElevenLabs). Matching uses the words of the line (speaker name stripped), so formatting changes don't break it.
 A new clip replaces the one playing; music dips while someone is speaking. Options > Voices turns it off. */
const VOICE=__VOICE__,VOLINES=__VOICELINES__,VOPAT=VOLINES.pattern.map(([r,f])=>[new RegExp(r),f]);
let VOA=null,VOLAST={dlg:null,i:-1,cut:null,p:-1},VOQ=[];
const voOn=()=>!(G&&G.opt&&G.opt.voice===false)&&musicMode!=='off';
const voNorm=s=>String(s||'').replace(/^[A-Z][\w.'&-]*(?: [A-Z&][\w.'-]*){0,3}(?: \([^)]*\))?:\s+/,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function voFind(line){const k=voNorm(line);if(!k)return null;let f=VOLINES.exact[k];
 if(!f)for(const[re,fn]of VOPAT)if(re.test(k)){f=fn;break}
 if(f&&!VOICE[f]){const st=typeof myStarter==='function'&&G&&G.party&&G.party.length?D[myStarter()].name.toLowerCase():'sporix';f=VOICE[f+'_'+st]?f+'_'+st:null}   /* starter-name lines come in three versions */
 return f&&VOICE[f]?f:null}
function voPlay(list){if(!voOn()||!list||!list.length)return;VOQ=list.slice();voNext()}
/* phones only let a page play sound from an element first started during a tap, so one element is unlocked on the first
 touch or key press and reused for every line (a new Audio() per line stayed silent on Android) */
let VOEL=null;const voEl=()=>VOEL||(VOEL=new Audio());
function voUnlock(){const a=voEl();if(a.dataset.ok)return;a.dataset.ok=1;if(!a.src||a.paused){a.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';a.muted=true;const p=a.play();if(p&&p.then)p.then(()=>{a.pause();a.muted=false}).catch(()=>{a.muted=false;delete a.dataset.ok});else a.muted=false}}
for(const ev of['touchend','pointerup','keydown','click'])addEventListener(ev,voUnlock,{capture:true,passive:true});
function voNext(){if(VOA){VOA.onended=null;VOA.pause()}const f=VOQ.shift();if(!f){VOA=null;return}
 VOA=voEl();VOA.muted=false;VOA.src=VOICE[f];VOA.volume=Math.min(1,0.9*volMul());VOA.onended=voNext;const p=VOA.play();if(p&&p.catch)p.catch(()=>{VOA=null})}
const voSpeaking=()=>!!(VOA&&!VOA.paused&&!VOA.ended);
/* say() pages: the clip of a line plays on the first page of that line */
function voPages(lines){const out=[];for(const l of[].concat(lines)){const w=wrap(l),f=voFind(typeof qFmt==='function'?qFmt(l):l);for(let i=0;i<w.length;i+=2)out.push(i===0?f:null)}return out}
/* Xenodex notes page: its spoken entry (dex_<No.>_xenodex) */
function voDex(){if(typeof CH==='undefined'||!CH||typeof drawDexLore==='undefined'||CH.draw!==drawDexLore){VOLAST.dex=null;return}if(VOLAST.dex===CH.mon)return;VOLAST.dex=CH.mon;
 const f='dex_'+String(D[CH.mon].n).padStart(3,'0')+'_xenodex';if(VOICE[f])voPlay([f])}
function voTick(){voDex();if(typeof DLG!=='undefined'&&DLG&&DLG.vo){if(DLG!==VOLAST.dlg||DLG.i!==VOLAST.i){VOLAST.dlg=DLG;VOLAST.i=DLG.i;const f=DLG.vo[DLG.i];if(f)voPlay([f])}}
 if(typeof CUT!=='undefined'&&CUT&&CUT.board){if(CUT!==VOLAST.cut||CUT.p!==VOLAST.p){VOLAST.cut=CUT;VOLAST.p=CUT.p;const ps=CUT.board[CUT.p];if(ps&&ps.vo)voPlay(ps.vo)}}}
addEventListener('visibilitychange',()=>{if(document.hidden&&VOA)VOA.pause()});
