// Fails if a renamed species' old name appears anywhere in the tracked project (data/renames.json is the only place it may live).
// Word match and case-sensitive, so Rustlegrove, Rustlit and the English word "rustle" are fine.  Usage: node tools/check_names.js
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const root=path.join(__dirname,'..'),R=JSON.parse(fs.readFileSync(path.join(root,'data/renames.json'),'utf8'));
const old=Object.keys(R).filter(k=>!k.startsWith('_')),re=new RegExp('\\b('+old.join('|')+')\\b');
function walk(d,o=[]){for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){if(/^(\.git|node_modules|www|\.vercel|import_report\.json)$/.test(e.name))continue;const r=d?d+'/'+e.name:e.name;if(e.isDirectory())walk(r,o);else o.push(r)}return o}
let files;try{files=execSync('git ls-files',{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).split('\n').filter(Boolean)}catch(e){files=walk('')}   // some build machines have no git
const bad=[];
for(const f of files){if(f==='data/renames.json')continue;if(re.test(path.basename(f,path.extname(f))))bad.push(f+' (file name)');
 if(!/\.(js|json|html|md|csv|txt|py|ya?ml)$/.test(f))continue;let s;try{s=fs.readFileSync(path.join(root,f),'utf8')}catch(e){continue}
 s.split('\n').forEach((l,i)=>{const m=re.exec(l);if(m)bad.push(f+':'+(i+1)+' '+m[1]+' -> '+R[m[1]])})}
if(bad.length){console.error('Old species names found (rename them, see data/renames.json):\n'+bad.slice(0,40).join('\n'));process.exit(1)}
console.log('species names OK');
