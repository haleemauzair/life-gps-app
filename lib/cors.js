// CORS for the Vercel functions.
//
// The GitHub Pages frontend (https://haleemauzair.github.io) lives on a different
// origin than the Vercel backend, so the browser needs these headers before it
// will let the page read the response.
//
// Extra origins (e.g. a custom domain later) can be added without code changes via
// the ALLOWED_ORIGINS env var on Vercel: comma-separated, e.g.
//   ALLOWED_ORIGINS=https://lifegps.example.com,https://another.example.com

const DEFAULT_ALLOWED_ORIGINS = ['https://haleemauzair.github.io'];

function allowedOrigins() {
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return [...DEFAULT_ALLOWED_ORIGINS, ...extra];
}

function isLocalhost(origin) {
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

/**
 * Returns true when the request may proceed: no Origin header (curl, server-to-server),
 * same-origin (the app served from Vercel itself), an allow-listed origin, or localhost.
 */
export function isOriginAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  const host = request.headers.get('host');
  try {
    if (host && new URL(origin).host === host) return true;
  } catch {
    return false;
  }

  return isLocalhost(origin) || allowedOrigins().includes(origin);
}

export function corsHeaders(request) {
  const origin = request.headers.get('origin');
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && isOriginAllowed(request)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

export function jsonResponse(request, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  });
}

export function preflightResponse(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
