// Vercel serverless function: POST /api/route/generate
//
// This is what makes the GitHub Pages version of Life GPS work. GitHub Pages can only
// serve static files, so the frontend sends its request here instead
// (via VITE_API_BASE_URL). GEMINI_API_KEY lives only in Vercel's environment
// variables and never reaches the browser.

import { handleGenerateRoute } from '../../lib/routeEngine.js';
import { isOriginAllowed, jsonResponse, preflightResponse } from '../../lib/cors.js';

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return preflightResponse(request);
    }

    if (!isOriginAllowed(request)) {
      return jsonResponse(request, 403, {
        error: 'This origin is not allowed to use the Life GPS API.',
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse(request, 405, {
        error: `Method ${request.method} not allowed on /api/route/generate. Use POST with a JSON body.`,
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, 400, { error: 'Request body must be valid JSON.' });
    }

    const result = await handleGenerateRoute(body);
    return jsonResponse(request, result.status, result.body);
  },
};
