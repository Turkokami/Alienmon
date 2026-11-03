// pictures for the objects the map editor places: chests, signs, items lying on the ground and locked ways.
// Drawn in code so every world has them; shared by the game (sections engine) and the map editor (www/objart.js).
// g: canvas context, x,y: the tile's top-left (16 px tiles), done: opened or taken, f: frame counter
function objArt(g,o,x,y,done,f){
 const R=(c,a,b,w,h)=>{g.fillStyle=c;g.fillRect(x+a,y+b,w,h)},shadow=w=>{g.fillStyle='rgba(20,10,20,0.35)';g.beginPath();g.ellipse(x+8,y+15,w,2,0,0,6.283);g.fill()};
 if(o.k==='chest'){shadow(7);R('#1b1424',1,6,14,9);R('#8a5a2e',2,10,12,4);R('#6e4523',2,13,12,1);
  if(done){R('#1b1424',1,1,14,6);R('#2a1810',2,7,12,3);R('#a86b34',2,2,12,3);R('#5ff2ff',2,4,12,1)}
  else{R('#a86b34',2,7,12,3);R('#c98a4a',2,7,12,1);R('#5ff2ff',2,9,12,1);R('#ffd23f',7,9,2,3);R('#1b1424',7,11,2,1)}return}
 if(o.k==='sign'){shadow(4);R('#1b1424',6,8,4,8);R('#5a3c22',7,8,2,7);R('#1b1424',1,1,14,9);R('#c9a26b',2,2,12,7);R('#e0bd86',2,2,12,1);R('#7a5a3a',4,4,8,1);R('#7a5a3a',4,6,6,1);return}
 if(o.k==='pickup'){if(done)return;const b=(f>>4)&1;shadow(4);R('#1b1424',4,7-b,8,7);R('#ffd23f',5,8-b,6,2);R('#fff2a8',5,8-b,2,1);R('#9b5cff',5,10-b,6,3);R('#5ff2ff',7,10-b,2,1);
  if(f%48<24){R('#fff',12,3-b,1,3);R('#fff',11,4-b,3,1)}return}
 if(o.k==='lock'){if(done)return;const look=o.look||'barrier';
  if(look==='rock'){shadow(8);g.fillStyle='#1b1424';g.beginPath();g.ellipse(x+8,y+9,8,7,0,0,6.283);g.fill();g.fillStyle='#7b7480';g.beginPath();g.ellipse(x+8,y+9,7,6,0,0,6.283);g.fill();
   R('#958e9b',4,5,5,2);R('#5d5763',9,11,4,2);R('#5d5763',3,10,2,1);return}
  if(look==='gate'){R('#1b1424',0,2,16,14);R('#3a3640',1,3,14,1);R('#3a3640',1,13,14,1);for(const a of[1,5,9,13])R('#8c8894',a,3,2,11);R('#ffd23f',7,7,2,3);return}
  R('#1b1424',0,2,3,14);R('#1b1424',13,2,3,14);R('#4a4652',1,3,1,12);R('#4a4652',14,3,1,12);R('#5ff2ff',1,2,1,1);R('#5ff2ff',14,2,1,1);   // barrier: an energy fence between two posts
  for(let i=0;i<4;i++){g.fillStyle='rgba(95,242,255,'+(0.45+0.35*Math.sin(f/6+i*1.7)).toFixed(2)+')';g.fillRect(x+3,y+4+i*3,10,1)}}
}
