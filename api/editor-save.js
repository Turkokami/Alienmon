// Map editor "Save" on the web (maps-v2 test build only).
// Commits the editor's changes as data/editor/pending.json to the maps-v2 branch; the GitHub workflow
// .github/workflows/editor-apply.yml then rebuilds the game from it and pushes, and Vercel republishes the test link.
// Needs the EDITOR_GITHUB_TOKEN environment variable (a GitHub token with Contents read/write on this repo),
// set by the owner in Vercel. The tester login (middleware.js) guards this route like every other page.
const REPO = 'Turkokami/Alienmon', BRANCH = 'maps-v2', PATH = 'data/editor/pending.json';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' });
  if (process.env.VERCEL_GIT_COMMIT_REF !== BRANCH) return res.status(403).json({ ok: false, error: 'The editor only saves from the maps-v2 test build.' });
  const token = process.env.EDITOR_GITHUB_TOKEN;
  if (!token) return res.status(503).json({ ok: false, error: 'Web saving is not switched on yet (EDITOR_GITHUB_TOKEN is not set in Vercel).' });
  const b = req.body;
  if (!b || typeof b !== 'object' || b.version !== 1 || typeof b.layout !== 'object') return res.status(400).json({ ok: false, error: 'Not an editor save.' });
  const body = Buffer.from(JSON.stringify(b));
  if (body.length > 4_000_000) return res.status(413).json({ ok: false, error: 'Too big to save from the web; use Save on a computer with the game folder.' });
  const gh = (url, opts = {}) => fetch('https://api.github.com/repos/' + REPO + url, { ...opts, headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'alienmon-map-editor', ...(opts.headers || {}) } });
  try {
    const cur = await gh('/contents/' + PATH + '?ref=' + BRANCH);
    const sha = cur.ok ? (await cur.json()).sha : undefined;
    const put = await gh('/contents/' + PATH, { method: 'PUT', body: JSON.stringify({ message: 'Map editor save (from the web)', content: body.toString('base64'), branch: BRANCH, ...(sha ? { sha } : {}) }) });
    if (!put.ok) return res.status(502).json({ ok: false, error: 'GitHub refused the save (' + put.status + ').' });
    const j = await put.json();
    return res.status(200).json({ ok: true, commit: j.commit && j.commit.sha });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'Could not reach GitHub.' });
  }
};
