// In-game "Report a bug" (Options menu). Files the tester's report as a GitHub issue labelled bug-report, with the
// build, map, position, party and device attached, so reports land where the owner (and Claude) can read them.
// Needs BUG_GITHUB_TOKEN (a GitHub token with Issues read/write on this repo) set by the owner in Vercel; falls back
// to EDITOR_GITHUB_TOKEN if that one also has Issues access. The tester login (middleware.js) guards this route.
const REPO = 'Turkokami/Alienmon';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  const token = process.env.BUG_GITHUB_TOKEN || process.env.EDITOR_GITHUB_TOKEN;
  if (!token) return res.status(503).json({ ok: false, error: 'Bug reports are not switched on yet.' });
  const b = req.body;
  if (!b || typeof b !== 'object' || typeof b.text !== 'string' || !b.text.trim()) return res.status(400).json({ ok: false, error: 'Empty report.' });
  const text = b.text.trim().slice(0, 4000), ctx = b.ctx && typeof b.ctx === 'object' ? b.ctx : {};
  const line = (k, v) => (v == null || v === '' ? '' : '- **' + k + ':** ' + String(v).slice(0, 300) + '\n');
  const where = [ctx.place, ctx.planet].filter(Boolean).join(', ');
  const title = '[Tester] ' + text.split('\n')[0].slice(0, 70) + (where ? ' (' + where.slice(0, 40) + ')' : '');
  let body = text + '\n\n---\n' + line('Build', ctx.build) + line('Branch', ctx.branch) + line('Screen', ctx.scene) + line('Map', where)
    + line('Section', ctx.sec) + line('Position', ctx.pos) + line('Party', ctx.party) + line('Story', ctx.story) + line('Device', ctx.device)
    + line('Viewport', ctx.view) + line('Reported', new Date().toISOString());
  if (typeof ctx.save === 'string' && ctx.save.length < 40000) body += '\n<details><summary>Save data</summary>\n\n```json\n' + ctx.save + '\n```\n</details>\n';
  const gh = (labels) => fetch('https://api.github.com/repos/' + REPO + '/issues', { method: 'POST', body: JSON.stringify({ title, body, ...(labels ? { labels } : {}) }),
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'alienmon-bug-report' } });
  try {
    let r = await gh(['bug-report']);
    if (r.status === 422 || r.status === 403) r = await gh(null);   // label not allowed: file it without
    if (!r.ok) return res.status(502).json({ ok: false, error: 'GitHub refused the report (' + r.status + ').' });
    const j = await r.json();
    return res.status(200).json({ ok: true, number: j.number });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'Could not reach GitHub.' });
  }
};
