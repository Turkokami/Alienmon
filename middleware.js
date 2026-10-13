// Access gates (Vercel Routing Middleware).
// - Private beta project (PRIVATE_TESTING=1): browser password prompt; any user name, password in TEST_PASSWORD.
// - Main site with TESTER_CODE set: every page opens on a tester login screen. The right code sets a signed-in
//   cookie for 30 days. Only the share image, icons and manifest stay public so links still preview.
//   Without TESTER_CODE the site is open as normal.
export const config = { matcher: '/:path*' };

const PUBLIC = /^\/(og\.jpg|icons\/.*|manifest\.webmanifest|favicon\.ico|robots\.txt|fonts\/.*)$/;
const COOKIE = 'alienmon_tester';

async function token(code) {
  const data = new TextEncoder().encode('alienmon-tester:' + code.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// link-preview crawlers have no tester cookie: they get the same login page, but with a 200 so every app shows the preview
const PREVIEW_BOT = /facebookexternalhit|facebot|twitterbot|slackbot|discordbot|whatsapp|linkedinbot|telegrambot|pinterest|redditbot|applebot|skypeuripreview|embedly|vkshare|bingpreview/i;
const SHARE_IMG = 'https://alienmon.com/img/og/game.jpg';   // 1200x630, served publicly by the alienmon.com website

function loginPage(wrong, request) {
  const bot = PREVIEW_BOT.test((request && request.headers.get('user-agent')) || '');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex"><title>Alienmon · Tester login</title>
<meta property="og:type" content="website"><meta property="og:site_name" content="Alienmon">
<meta property="og:title" content="Play Alienmon">
<meta property="og:description" content="Catch them. Bond with them. Save them. Play the free demo in your browser.">
<meta property="og:url" content="https://alienmon.com/play/">
<meta property="og:image" content="${SHARE_IMG}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SHARE_IMG}">
<link rel="icon" href="/icons/icon-192.png">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;background:#120c22;
 background-image:radial-gradient(1px 1px at 20% 30%,#fff8,transparent),radial-gradient(1px 1px at 70% 80%,#fff6,transparent),radial-gradient(1px 1px at 40% 70%,#fff5,transparent),radial-gradient(1px 1px at 85% 20%,#fff7,transparent);
 font-family:"Press Start 2P",ui-monospace,Menlo,monospace;color:#e8e0ff}
.card{width:min(380px,100%);background:#1d1433;border:3px solid #5ff2ff;border-radius:14px;padding:20px;text-align:center;box-shadow:0 12px 48px #000b}
img{width:100%;border-radius:8px;display:block;margin-bottom:16px}
h1{font-size:13px;color:#5ff2ff;margin:0 0 12px;line-height:1.6}
p{font-size:9px;line-height:1.9;margin:0 0 14px;color:#cfc6ea}
input{width:100%;font:inherit;font-size:13px;padding:12px;border-radius:8px;border:2px solid #3b2a5c;background:#120c22;color:#fff;text-align:center;outline:none}
input:focus{border-color:#ffd23f}
button{margin-top:14px;width:100%;font:inherit;font-size:11px;padding:12px;border:0;border-radius:10px;background:#ffd23f;color:#1b1424;cursor:pointer;box-shadow:0 4px 0 #0006}
.err{color:#ff8a1e;font-size:9px;min-height:16px;margin-top:10px}
.apply{margin:14px 0 0;font-size:8px}.apply a{color:#5ff2ff}
</style></head><body>
<form class="card" method="post" action="/tester-login">
<img src="/og.jpg" alt="Alienmon">
<h1>Tester login</h1>
<p>Alienmon is in testing. Enter your tester code to play.</p>
<input name="code" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" placeholder="Tester code" autofocus required>
<button type="submit">Enter</button>
<div class="err">${wrong ? 'That code is not right. Try again.' : ''}</div>
<p class="apply">No code yet? <a href="https://alienmon.com/testers">Apply to be a tester</a></p>
</form></body></html>`;
  return new Response(html, { status: bot ? 200 : 401, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
}

export default async function middleware(request) {
  // private beta: browser password prompt
  if (process.env.PRIVATE_TESTING === '1') {
    const password = process.env.TEST_PASSWORD;
    if (!password) return new Response('Alienmon beta is closed: no testing password has been set yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    const auth = request.headers.get('authorization') || '';
    if (auth.startsWith('Basic ')) {
      let given = '';
      try { given = atob(auth.slice(6)).split(':').slice(1).join(':'); } catch (e) {}
      if (given.length === password.length && [...given].every((c, i) => c === password[i])) return;
    }
    return new Response('Alienmon private beta: please sign in with the testing password.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Alienmon beta", charset="UTF-8"', 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' },
    });
  }
  // main site: tester login screen
  const code = process.env.TESTER_CODE;
  if (!code) return;
  const url = new URL(request.url);
  if (PUBLIC.test(url.pathname)) return;
  const want = await token(code);
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)alienmon_tester=([a-f0-9]{64})/);
  if (m && m[1] === want) return;
  if (url.pathname === '/tester-login' && request.method === 'POST') {
    let given = '';
    try { given = String((await request.formData()).get('code') || ''); } catch (e) {}
    if ((await token(given)) === want) {
      // alienmon.com serves the website and proxies the game under /play/, so send testers back to the path they signed in from
      let back = '/';
      try { const ref = new URL(request.headers.get('referer') || ''); if (ref.pathname.startsWith('/play')) back = '/play/'; } catch (e) {}
      return new Response(null, { status: 303, headers: { Location: back, 'Cache-Control': 'no-store',
        'Set-Cookie': `${COOKIE}=${want}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax` } });
    }
    return loginPage(true, request);
  }
  return loginPage(false, request);
}
