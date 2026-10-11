// Syntax-check the game script inside www/index.html (run after node tools/build.js); exits non-zero on a syntax error.
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(require('path').join(__dirname,'../www/index.html'),'utf8');
const code=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
try{new vm.Script(code,{filename:'www/index.html'});console.log('game script OK')}catch(e){console.error('SYNTAX ERROR in game script:',e.message);console.error(e.stack.split('\n').slice(0,4).join('\n'));process.exit(1)}
