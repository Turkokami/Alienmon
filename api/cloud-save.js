// Cloud backup for saves (Options > Cloud backup, and Restore on the title screen of a new device).
// A player's save is stored privately in Supabase Storage (bucket "saves", created on first use) under a hash of their
// Linker backup code: 16 letters/digits the game makes up and shows to the player. No email or personal details are
// collected (a kids' game). Uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from the Vercel Supabase integration; the key
// never leaves the server. The tester login (middleware.js) guards this route like every other page.
const crypto = require('crypto');
const BUCKET = 'saves', MAX = 2 * 1024 * 1024;
const CODE = /^[A-HJ-NP-Z2-9]{16}$/;   // no I, O, 0 or 1: easy to read back and type

function env() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  return url && key ? { url, key } : null;
}
const hdr = (key, extra) => ({ apikey: key, ...(key.startsWith('ey') ? { Authorization: 'Bearer ' + key } : {}), ...(extra || {}) });
const slot = code => crypto.createHash('sha256').update('alienmon-cloud:' + code).digest('hex');
const clean = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

async function ensureBucket(E) {
  const r = await fetch(E.url + '/storage/v1/bucket', { method: 'POST', headers: hdr(E.key, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false, file_size_limit: MAX }) });
  return r.ok || r.status === 400 || r.status === 409;   // 400/409: it already exists
}

module.exports = async (req, res) => {
  const E = env();
  if (!E) return res.status(503).json({ ok: false, error: 'Cloud backup is not set up on this server.' });
  const obj = name => E.url + '/storage/v1/object/' + BUCKET + '/' + name + '.json';
  try {
    if (req.method === 'GET') {
      const code = clean(req.query && req.query.code);
      if (!CODE.test(code)) return res.status(400).json({ ok: false, error: 'That backup code is not valid.' });
      const r = await fetch(obj(slot(code)), { headers: hdr(E.key) });
      if (r.status === 400 || r.status === 404) return res.status(404).json({ ok: false, error: 'No backup was found for that code.' });
      if (!r.ok) return res.status(502).json({ ok: false, error: 'The cloud did not answer (' + r.status + ').' });
      const j = await r.json();
      return res.status(200).json({ ok: true, t: j.t, info: j.info || null, save: j.save });
    }
    if (req.method === 'POST') {
      const b = req.body || {};
      const code = clean(b.code);
      if (!CODE.test(code)) return res.status(400).json({ ok: false, error: 'That backup code is not valid.' });
      if (typeof b.save !== 'string' || b.save.length > MAX) return res.status(400).json({ ok: false, error: 'That save is missing or too big.' });
      try { JSON.parse(b.save); } catch (e) { return res.status(400).json({ ok: false, error: 'That save could not be read.' }); }
      const info = b.info && typeof b.info === 'object' ? { party: String(b.info.party || '').slice(0, 120), shards: b.info.shards | 0, dex: b.info.dex | 0, place: String(b.info.place || '').slice(0, 60) } : null;
      const body = JSON.stringify({ t: Date.now(), info, save: b.save });
      const put = () => fetch(obj(slot(code)), { method: 'POST', headers: hdr(E.key, { 'Content-Type': 'application/json', 'x-upsert': 'true' }), body });
      let r = await put();
      if (!r.ok && (r.status === 400 || r.status === 404)) { await ensureBucket(E); r = await put(); }   // first ever backup: make the bucket
      if (!r.ok) return res.status(502).json({ ok: false, error: 'The cloud refused the backup (' + r.status + ').' });
      return res.status(200).json({ ok: true, t: Date.now() });
    }
    return res.status(405).json({ ok: false, error: 'GET or POST only' });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'Could not reach the cloud.' });
  }
};
