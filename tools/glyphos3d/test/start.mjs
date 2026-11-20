// Start test: runs the real game scripts in node with a stub WebGL2 context, for one world, and reports any error
// before or during startGame (map build, story setup, first frames). Usage: node start.mjs <sporeholm3d dir> <world>
import fs from 'fs'; import vm from 'vm'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); const { createCanvas, Image } = require('../node_modules/canvas');
const DIR = process.argv[2], WORLD = process.argv[3];
const errs = []; const log = (...a) => console.log('[' + WORLD + ']', ...a);
const names = {}; let nid = 0x9000; const C = new Proxy({}, { get: (t, p) => { if (typeof p !== 'string') return undefined; if (!(p in t)) { t[p] = ++nid; names[t[p]] = p; } return t[p]; } });
const mkObj = () => ({});
const glFn = (name) => (...a) => {
  switch (name) {
    case 'getParameter': { const n = names[a[0]] || ''; if (n === 'VERSION') return 'WebGL 2.0'; if (n === 'SHADING_LANGUAGE_VERSION') return 'WebGL GLSL ES 3.00'; if (n.startsWith('MAX_')) return 16384; if (n === 'VIEWPORT' || n === 'SCISSOR_BOX') return new Int32Array([0, 0, 800, 600]); if (n === 'ALIASED_LINE_WIDTH_RANGE') return [1, 1]; return 1; }
    case 'getShaderPrecisionFormat': return { precision: 23, rangeMin: 127, rangeMax: 127 };
    case 'getExtension': return new Proxy({}, { get: (t, p) => typeof p === 'string' && /^[A-Z_0-9]+$/.test(p) ? C[p] : () => mkObj() });
    case 'getSupportedExtensions': return [];
    case 'getContextAttributes': return { alpha: true, antialias: true, depth: true, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false };
    case 'getShaderParameter': case 'getProgramParameter': { const n = names[a[1]] || ''; if (n === 'ACTIVE_UNIFORMS' || n === 'ACTIVE_ATTRIBUTES') return 0; return true; }
    case 'getShaderInfoLog': case 'getProgramInfoLog': return '';
    case 'checkFramebufferStatus': return C.FRAMEBUFFER_COMPLETE;
    case 'getUniformLocation': return {}; case 'getAttribLocation': return 0;
    case 'isContextLost': return false; case 'getError': return 0;
    case 'fenceSync': return {}; case 'clientWaitSync': return C.ALREADY_SIGNALED; case 'getSyncParameter': return C.SIGNALED;
    default: if (name.startsWith('create')) return mkObj(); return undefined; } };
const gl = new Proxy({ drawingBufferWidth: 800, drawingBufferHeight: 600 }, { get: (t, p) => { if (p in t) return t[p]; if (typeof p !== 'string') return undefined; if (/^[A-Z_0-9]+$/.test(p)) return C[p]; return (t[p] = glFn(p)); } });
const el = (tag) => { if (tag === 'img') { const im = new win.Image(); im.style = {}; return im; } const e = { tagName: tag, style: {}, children: [], dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, appendChild(c) { this.children.push(c); return c; }, removeChild() {}, remove() {}, insertBefore(c) { return c; }, setAttribute() {}, getAttribute: () => null, addEventListener() {}, removeEventListener() {}, querySelector: () => el('div'), querySelectorAll: () => [], getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600 }), focus() {}, blur() {}, click() {}, textContent: '', innerHTML: '', value: '', width: 800, height: 600, clientWidth: 800, clientHeight: 600, play: () => Promise.resolve(), pause() {}, load() {} };
  if (tag === 'canvas') { const cv = createCanvas(64, 64), g2 = cv.getContext.bind(cv); cv.getContext = (k, o) => (k === 'webgl2' || k === 'webgl' ? gl : g2(k, o)); Object.assign(cv, { style: {}, addEventListener() {}, removeEventListener() {}, setAttribute() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }), clientWidth: 800, clientHeight: 600, dataset: {}, classList: e.classList }); return cv; }
  return e; };
const store = { am_world: WORLD };
const ids = {};
const doc = { createElement: el, createElementNS: (ns, t) => el(t), getElementById: (i) => ids[i] || (ids[i] = el('div')), body: el('body'), head: el('head'), documentElement: el('html'), addEventListener() {}, removeEventListener() {}, querySelector: () => el('div'), querySelectorAll: () => [], hidden: false, visibilityState: 'visible', write() {} };
let frames = 0, t0 = Date.now();
const win = { document: doc, navigator: { userAgent: 'node', maxTouchPoints: 0, getGamepads: () => [], hardwareConcurrency: 8, vibrate() {} }, location: { search: '?world=' + WORLD, pathname: '/', href: 'http://x/?world=' + WORLD, hostname: 'x', origin: 'http://x' },
  localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } }, sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  innerWidth: 800, innerHeight: 600, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), performance, console: { log() {}, info() {}, debug() {}, warn() {}, error: (...a) => errs.push('console.error: ' + a.map(String).join(' ').slice(0, 300)) },
  requestAnimationFrame: (f) => setTimeout(() => { frames++; if (frames === 1) log('FIRST FRAME after', ((Date.now() - t0) / 1000).toFixed(1), 's'); try { f(performance.now()); } catch (e) { errs.push('frame: ' + e.stack.split('\n').slice(0, 3).join(' | ')); } }, 16), cancelAnimationFrame: clearTimeout,
  setTimeout, clearTimeout, setInterval, clearInterval, Image: class extends Image { constructor() { super(); this._l = []; } addEventListener(k, f) { if (k === 'load') this._l.push(f); } removeEventListener() {} setAttribute() {} set src(v) { const f = DIR + '/' + String(v).split('?')[0]; const done = () => setTimeout(() => { this.onload && this.onload(); this._l.forEach((g) => g()); }, 1); if (!String(v).startsWith('data:') && fs.existsSync(f)) { try { super.src = fs.readFileSync(f); } catch (e) {} } done(); } get src() { return ''; } }, Audio: class { play() { return Promise.resolve(); } pause() {} addEventListener() {} },
  AudioContext: class { constructor() { this.destination = {}; this.currentTime = 0; this.state = 'running'; } createGain() { return { gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; } createOscillator() { return { frequency: { value: 0, setValueAtTime() {} }, connect() {}, start() {}, stop() {} }; } createBufferSource() { return { connect() {}, start() {}, stop() {} }; } decodeAudioData() { return Promise.resolve({}); } resume() { return Promise.resolve(); } },
  fetch: async (u) => { const f = DIR + '/' + String(u).split('?')[0]; if (fs.existsSync(f)) { const b = fs.readFileSync(f); return { ok: true, status: 200, json: async () => JSON.parse(b), text: async () => String(b), arrayBuffer: async () => { const AB = vm.runInContext('ArrayBuffer', ctx), U8 = vm.runInContext('Uint8Array', ctx), ab = new AB(b.length); new U8(ab).set(b); return ab; }, blob: async () => ({}) }; } return { ok: false, status: 404, json: async () => ({}), text: async () => '', blob: async () => ({}) }; },
  URL: Object.assign(function (u, b) { return new URL(u, b || 'http://x/'); }, { createObjectURL: () => 'blob:x', revokeObjectURL() {} }), URLSearchParams, Blob: class {}, TextDecoder, TextEncoder, createImageBitmap: async () => { const c = createCanvas(8, 8); c.close = () => {}; return c; }, speechSynthesis: { speak() {}, cancel() {}, getVoices: () => [] }, SpeechSynthesisUtterance: class {}, HTMLCanvasElement: class {}, HTMLImageElement: class {}, ImageBitmap: class {}, OffscreenCanvas: undefined, WebGL2RenderingContext: class {}, structuredClone };
win.window = win; win.self = win; win.globalThis = win; win.top = win;
const ctx = vm.createContext(win);
process.on('uncaughtException', (e) => errs.push('uncaught: ' + (e.stack || e).toString().split('\n').slice(0, 3).join(' | ')));
process.on('unhandledRejection', (e) => errs.push('rejection: ' + ((e && e.stack) || e).toString().split('\n').slice(0, 3).join(' | ')));
const scripts = ['assets.js', 'world.js'].concat(WORLD === 'glyphos' ? ['glyphos.js'] : [], ['game.js']);
for (const s of scripts) { try { vm.runInContext(fs.readFileSync(DIR + '/' + s, 'utf8'), ctx, { filename: s }); } catch (e) { errs.push(s + ': ' + e.stack.split('\n').slice(0, 3).join(' | ')); } }
log('WORLD', win.WORLD, 'GLY', win.GLY, 'NEO', win.NEO);
try { await win.startGame(); log('startGame resolved after', ((Date.now() - t0) / 1000).toFixed(1), 's'); } catch (e) { errs.push('startGame: ' + e.stack.split('\n').slice(0, 4).join(' | ')); }
await new Promise((r) => setTimeout(r, 4000));
log('frames', frames, 'errors', errs.length); for (const e of [...new Set(errs)].slice(0, 12)) log('  ', e);
process.exit(0);
