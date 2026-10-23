import { LifeGPSRoute, RouteFormInput } from '../types/route';

export interface GenerateRouteResponse {
  route: LifeGPSRoute;
}

export async function generatePersonalizedRoute(
  input: RouteFormInput & { recalculationCount?: number }
): Promise<LifeGPSRoute> {
  const response = await fetch('/api/route/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  let data: { route?: LifeGPSRoute; error?: string; model?: string } = {};
  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned an unreadable response (HTTP ${response.status}). Your entered details are still saved—please try again.`
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
