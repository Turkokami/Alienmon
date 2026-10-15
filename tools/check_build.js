// Syntax-check the game script inside www/index.html (run after node tools/build.js); exits non-zero on a syntax error.
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(require('path').join(__dirname,'../www/index.html'),'utf8');
const code=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
try{new vm.Script(code,{filename:'www/index.html'});console.log('game script OK')}catch(e){console.error('SYNTAX ERROR in game script:',e.message);console.error(e.stack.split('\n').slice(0,4).join('\n'));process.exit(1)}
// art/audio on this disk but not in git would build locally and be missing on Vercel
try{const {execSync}=require('child_process'),path=require('path'),fs=require('fs');const root=path.join(__dirname,'..');
 const tracked=new Set(execSync('git ls-files',{cwd:root}).toString().split('\n'));const miss=[];
 for(const d of['art/sprites','art/sprites_back','art/overworld','art/characters','art/portraits','art/scenes','art/planets','art/space','art/fx','art/ui','art/ui/icons','art/world','art/sections_over','art/portraits_talk','audio'].concat(fs.existsSync(path.join(root,'art/props'))?fs.readdirSync(path.join(root,'art/props')).map(d=>'art/props/'+d):[]).concat(fs.existsSync(path.join(root,'art/sections_game'))?fs.readdirSync(path.join(root,'art/sections_game')).map(d=>'art/sections_game/'+d):[]))
  {const p=path.join(root,d);if(fs.existsSync(p))for(const f of fs.readdirSync(p)){const r=d+'/'+f;if(fs.statSync(path.join(p,f)).isFile()&&!tracked.has(r))miss.push(r)}}
 if(miss.length){console.error('NOT IN GIT (will be missing on Vercel): '+miss.join(', '));process.exitCode=1}else console.log('all build files are in git')}catch(e){}
