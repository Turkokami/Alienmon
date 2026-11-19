// Offline Neonis renderer: headless-gl (WebGL1) + three r162 + node-canvas.
import { createRequire } from 'module';
import fs from 'fs';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
const require = createRequire(import.meta.url);
const { createCanvas } = require('canvas');
const { PNG } = require('pngjs');
const createGL = require('gl');

globalThis.window = globalThis;
globalThis.document = { createElement: (t) => { if (t === 'canvas') { const c = createCanvas(1, 1); c.style = {}; return c; } return { style: {} }; } };
globalThis.ASSETS = {};
const WORLD = process.argv[2];
const OUT = process.argv[3];
const JOBS = JSON.parse(process.argv[4]);
for (const f of WORLD.split(',')) new Function(fs.readFileSync(f, 'utf8'))();
const W0 = 1600, H0 = 1000;
const gl = createGL(W0, H0, { preserveDrawingBuffer: true, antialias: true });
const fakeCanvas = { width: W0, height: H0, style: {}, addEventListener() {}, removeEventListener() {}, getContext: () => gl };
const renderer = new THREE.WebGLRenderer({ canvas: fakeCanvas, context: gl, antialias: true });
renderer.setSize(W0, H0, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.outputColorSpace = THREE.SRGBColorSpace;
console.time('build');
const scene = new THREE.Scene();
const full = ASSETS.fn.gmap(THREE, { all: true, gres: 24, grassK: 1, grass: true, windify: (m) => m, walk: true, cache: {} });
scene.add(full.object);
console.timeEnd('build');
const G2W = (gx, gz) => full.unwarp ? full.unwarp(gx, gz) : [gx, gz];
const ray = new THREE.Raycaster();
const groundY0 = (x, z) => { ray.set(new THREE.Vector3(x, 200, z), new THREE.Vector3(0, -1, 0)); const h = ray.intersectObject(full.object, true).find((i) => i.object.isMesh); return h ? h.point.y : 0; };

function lights(night) {
  const g = new THREE.Group();
  const hemi = new THREE.HemisphereLight(night ? '#8a9ad8' : '#bcd4ff', night ? '#2a2030' : '#6a7a48', night ? 0.8 : 1.25);
  const sun = new THREE.DirectionalLight(night ? '#b8c8ff' : '#fff0cc', night ? 1.1 : 2.4); sun.position.set(-120, 160, -60);
  g.add(hemi, sun, sun.target); return g;
}
function sky(night) {
  const c = createCanvas(8, 512), x = c.getContext('2d'), L = x.createLinearGradient(0, 0, 0, 512);
  if (night) { L.addColorStop(0, '#04020e'); L.addColorStop(0.45, '#120a2a'); L.addColorStop(0.5, '#3a1650'); L.addColorStop(1, '#080414'); }
  else { L.addColorStop(0, '#4a8ac8'); L.addColorStop(0.3, '#8ac0e0'); L.addColorStop(0.45, '#d8ecd8'); L.addColorStop(0.5, '#f4f0c8'); L.addColorStop(0.55, '#b8d0a0'); L.addColorStop(1, '#4a6a48'); }
  x.fillStyle = L; x.fillRect(0, 0, 8, 512); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.SphereGeometry(330, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false }));
}

const groundY = (x, z) => { const g = full.ght ? full.ght(x, z) : 0; return Number.isFinite(g) ? g : 0; };
const RZ = gl.getExtension('STACKGL_resize_drawingbuffer');
const box = new THREE.Box3().setFromObject(full.object);
console.log('bbox', box.min.toArray().map(Math.round), box.max.toArray().map(Math.round));

for (const j of JOBS) {
  const w = j.w || W0, h = j.h || H0;
  RZ.resize(w, h); fakeCanvas.width = w; fakeCanvas.height = h; renderer.setSize(w, h, false); renderer.setViewport(0, 0, w, h);
  const L = lights(j.night); scene.add(L);
  let S = null;
  if (!j.top) { S = sky(j.night); scene.add(S); scene.fog = new THREE.FogExp2(j.night ? '#121a34' : '#b4ccb0', j.fog ?? 0.0055); }
  else { scene.fog = null; scene.background = new THREE.Color('#2a4a5a'); }
  let cam;
  if (j.top) {
    const [x0, z0, x1, z1] = j.rect ? (j.g ? [...G2W(j.rect[0], j.rect[1]), ...G2W(j.rect[2], j.rect[3])] : j.rect) : [box.min.x, box.min.z, box.max.x, box.max.z];
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, hw = (x1 - x0) / 2, hh = (z1 - z0) / 2, asp = w / h;
    const sx = Math.max(hw, hh * asp), sz = sx / asp;
    cam = new THREE.OrthographicCamera(-sx, sx, sz, -sz, 1, 800);
    cam.position.set(cx, 400, cz); cam.up.set(0, 0, -1); cam.lookAt(cx, 0, cz);
  } else {
    cam = new THREE.PerspectiveCamera(j.fov || 55, w / h, 0.1, 900);
    const [px, pz] = j.g ? G2W(...j.pos) : j.pos, [tx, tz] = j.g ? G2W(...j.look) : j.look;
    const py = groundY(px, pz) + (j.h_ || 3), ty = groundY(tx, tz) + (j.th || 2);
    cam.position.set(px, py, pz); cam.lookAt(tx, ty, tz);
  }
  scene.updateMatrixWorld(true);
  console.time(j.name); renderer.setRenderTarget(null); renderer.render(scene, cam); console.timeEnd(j.name); const comp = null;
  const px = new Uint8Array(w * h * 4); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
  const png = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) png.data.set(px.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4);
  for (let i = 3; i < png.data.length; i += 4) png.data[i] = 255;
  fs.writeFileSync(`${OUT}/${j.name}.png`, PNG.sync.write(png));
  scene.remove(L); if (S) scene.remove(S); scene.background = null; 
}
console.log('done');
