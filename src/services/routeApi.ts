import { LifeGPSRoute, RouteFormInput } from '../types/route';

export interface GenerateRouteResponse {
  route: LifeGPSRoute;
}

const ConfiguredApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

function getRouteGenerateEndpoint(): string {
  return ConfiguredApiBase ? `${ConfiguredApiBase}/api/route/generate` : '/api/route/generate';
}

export async function generatePersonalizedRoute(
  input: RouteFormInput & { recalculationCount?: number }
): Promise<LifeGPSRoute> {
  const endpoint = getRouteGenerateEndpoint();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    });
  } catch (networkErr: unknown) {
    const detail = networkErr instanceof Error ? networkErr.message : String(networkErr);
    throw new Error(
      `Could not reach the Life GPS backend server (${endpoint}). If you are viewing a static build, make sure the Node.js backend is running and reachable (${detail}). Your entered details are preserved.`
    );
  }

  if (response.status === 405) {
    throw new Error(
      'HTTP 405 (Method Not Allowed): The backend API endpoint (/api/route/generate) is unavailable because this site is being served by a static file host (such as GitHub Pages) that cannot execute the Node.js server. To generate live routes with Gemma 4, open the app in Google AI Studio / a Node.js hosting environment, or configure VITE_API_BASE_URL to point to your deployed Node.js backend. Your entered details have been saved.'
    );
  }

  let data: { route?: LifeGPSRoute; error?: string; model?: string } = {};
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned a non-JSON response (HTTP ${response.status}). Ensure the Node.js backend (server.ts) is running and serving /api/route/generate. Your entered details are still saved.`
    );
  }

  if (!response.ok || !data.route) {
    throw new Error(
      data.error ||
        `Route generation failed (HTTP ${response.status}). Your entered details are preserved so you can retry.`
    );
  }

  return data.route;
}
