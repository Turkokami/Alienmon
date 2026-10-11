// Password gate for the private beta site (Vercel Routing Middleware).
// Only active on a Vercel project with the environment variable PRIVATE_TESTING=1; the public site never sets it.
// Testers sign in with any user name and the password in TEST_PASSWORD. If PRIVATE_TESTING is on but no password
// is configured, the site stays closed rather than open.
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  if (process.env.PRIVATE_TESTING !== '1') return;   // public site: carry on as normal
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
