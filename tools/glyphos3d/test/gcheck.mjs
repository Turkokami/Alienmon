// Glyphos check: per-area walkable tiles, connectivity, and paths blocked by solid props
import { createRequire } from 'module'; import fs from 'fs'; import * as THREE from 'three';
const require = createRequire(import.meta.url); const { createCanvas } = require('canvas');
globalThis.window = globalThis; globalThis.self = globalThis;
globalThis.document = { createElement: (t) => { if (t === 'canvas') { const c = createCanvas(1, 1); c.style = {}; return c; } return { style: {} }; } };
globalThis.ASSETS = {};
for (const f of process.argv[2].split(',')) new Function(fs.readFileSync(f, 'utf8'))();
const fn = process.argv[3] || 'gmap', noBlock = process.argv.includes('--noblock');
const r = ASSETS.fn[fn](THREE, { all: true, gres: 8, grass: false, flora: false, walk: true, cache: {}, outer: false, windify: (m) => m });
const G = r.grid, H = G.length, W = G[0].length, OY = r.oy, OK = 'pPks.,gf';
const sceneOf = (x, y) => { for (const [k, [rx, rz]] of Object.entries(r.rects)) if (x >= rx && x < rx + 30 && y >= rz && y < rz + 30) return k; return '-'; };
const blocked = new Uint8Array(W * H);
if (!noBlock) { r.object.updateMatrixWorld(true); const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), p = new THREE.Vector3();
  const walkinG = new Set(r.walkins ? [] : []);
  r.object.traverse((o) => { if (!o.isMesh || o.isInstancedMesh) return; if (o.name === 'nocol' || o.name === 'ground' || o.name === 'grass' || o.name === 'water') return; let q = o, skip = false; while (q) { if (q.name === 'nocol') { skip = true; break; } q = q.parent; } if (skip) return;
    const P = o.geometry.attributes.position, I = o.geometry.index, n = I ? I.count : P.count, m = o.matrixWorld;
    for (let t = 0; t < n; t += 3) { const i0 = I ? I.getX(t) : t, i1 = I ? I.getX(t + 1) : t + 1, i2 = I ? I.getX(t + 2) : t + 2; a.fromBufferAttribute(P, i0).applyMatrix4(m); b.fromBufferAttribute(P, i1).applyMatrix4(m); c.fromBufferAttribute(P, i2).applyMatrix4(m);
      const L = Math.max(a.distanceTo(b), b.distanceTo(c), c.distanceTo(a)), k = Math.min(40, Math.max(1, Math.ceil(L / 0.45)));
      for (let u = 0; u <= k; u++) for (let v = 0; v <= k - u; v++) { const w = k - u - v; p.set((a.x * u + b.x * v + c.x * w) / k, (a.y * u + b.y * v + c.y * w) / k, (a.z * u + b.z * v + c.z * w) / k); const g = r.ght(p.x, p.z); if (p.y < g + 0.35 || p.y > g + 1.7) continue; const [gx, gz] = r.warpXY(p.x, p.z), ix = Math.floor(gx), iy = Math.floor(gz) + OY; if (ix < 0 || iy < 0 || ix >= W || iy >= H) continue; blocked[iy * W + ix] = 1; } } }); }
const walkable = (x, y) => OK.includes(G[y][x]) && !blocked[y * W + x];
const per = {}, pathBlk = {}; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const s = sceneOf(x, y - OY); if (s === '-') continue; per[s] = per[s] || [0, 0]; if (OK.includes(G[y][x])) per[s][0]++; if (walkable(x, y)) per[s][1]++; if (blocked[y * W + x] && 'p,ksP'.includes(G[y][x])) (pathBlk[s] = pathBlk[s] || []).push([x, y - OY]); }
const comp = new Int32Array(W * H).fill(-1), sizes = []; for (let i = 0; i < W * H; i++) { const x0 = i % W, y0 = (i / W) | 0; if (comp[i] >= 0 || !walkable(x0, y0)) continue; const id = sizes.length, q = [i]; comp[i] = id; let n = 0, cells = new Map(); while (q.length) { const cc = q.pop(); n++; const x = cc % W, y = (cc / W) | 0; const s = sceneOf(x, y - OY); cells.set(s, (cells.get(s) || 0) + 1); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const kk = ny * W + nx; if (comp[kk] < 0 && walkable(nx, ny)) { comp[kk] = id; q.push(kk); } } } sizes.push([n, [...cells.entries()].sort((p, q) => q[1] - p[1]).slice(0, 4), x0, y0 - OY]); }
const order = sizes.map((s, i) => [s[0], i]).sort((p, q) => q[0] - p[0]); const main = sizes[order[0][1]];
let tot = 0, totB = 0; for (const k in per) { tot += per[k][0]; totB += per[k][1]; }
console.log('areas', Object.keys(per).length, 'walk', tot, 'walk-unblocked', totB, 'main component', main[0], 'components', sizes.length);
const mainId = order[0][1], inMain = (x, z) => { const [gx, gz] = [Math.floor(x), Math.floor(z) + OY]; for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const k = (gz + dz) * W + gx + dx; if (comp[k] === mainId) return true; } return false; };
const hubs = Object.keys(per).filter((s) => { const [rx, rz] = r.rects[s]; let any = false; for (let y = 0; y < 30 && !any; y++) for (let x = 0; x < 30; x++) if (comp[(rz + y + OY) * W + rx + x] === mainId) { any = true; break; } return !any; });
console.log('areas with no tile in the main component:', hubs.join(' ') || 'none');
console.log('quests off the main component:', r.quests.filter((q) => !inMain(q.x, q.z + 1.6) && !inMain(q.x, q.z - 1.6) && !inMain(q.x + 1.6, q.z) && !inMain(q.x - 1.6, q.z)).map((q) => q.id).join(' ') || 'none');
console.log('doors off the main component:', r.walkins.filter((w) => !inMain(...r.warpXY(w.x, w.z + w.d * (w.rz + 1.6)))).map((w) => w.name).join(' | ') || 'none');
console.log('other components >= 6 tiles:', order.slice(1).filter(([n]) => n >= 6).map(([n, i]) => `${n}@${sizes[i][1].map(([k, c]) => k + ':' + c).join('/')}(${sizes[i][2]},${sizes[i][3]})`).join('  '));
console.log('per area (walk / unblocked):', Object.entries(per).map(([k, v]) => `${k}:${v[0]}${v[1] !== v[0] ? '/' + v[1] : ''}`).join(' '));
console.log('blocked path tiles:', Object.entries(pathBlk).map(([k, v]) => `${k}:${v.length}[${v.slice(0, 6).map(([x, y]) => x + ',' + y).join(' ')}]`).join('  '));
console.log('spawn tile', G[166 + OY][55], 'quests', r.quests.length, 'walkins', r.walkins.length, 'patches', r.patches.length);
if (process.argv.includes('--map')) { const out = []; for (let y = 0; y < H; y++) { let row = ''; for (let x = 0; x < W; x++) row += blocked[y * W + x] && OK.includes(G[y][x]) ? '#' : G[y][x]; out.push(row); } fs.writeFileSync('/tmp/claude-0/gl/gmap.txt', out.join('\n')); }
