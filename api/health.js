// Vercel serverless function: GET /api/health
// Quick way to check the backend is alive and the API key is configured
// (it reports true/false only — never the key itself).

import { healthPayload } from '../lib/routeEngine.js';
import { jsonResponse, preflightResponse } from '../lib/cors.js';

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return preflightResponse(request);
    }
    return jsonResponse(request, 200, healthPayload());
  },
};
