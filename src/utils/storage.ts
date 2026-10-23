import { LifeGPSRoute, RouteCompletionState, RouteFormInput } from '../types/route';

const ACTIVE_ROUTE_KEY = 'lifegps_active_route_v1';
const COMPLETION_STATE_PREFIX = 'lifegps_completion_v1_';
const DRAFT_FORM_KEY = 'lifegps_draft_form_v1';

export function saveActiveRoute(route: LifeGPSRoute | null): void {
  try {
    if (!route) {
      localStorage.removeItem(ACTIVE_ROUTE_KEY);
      return;
    }
    localStorage.setItem(ACTIVE_ROUTE_KEY, JSON.stringify(route));
  } catch (err) {
    console.warn('Unable to save route to localStorage:', err);
  }
}

export function loadActiveRoute(): LifeGPSRoute | null {
  try {
    const raw = localStorage.getItem(ACTIVE_ROUTE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LifeGPSRoute;
    if (!parsed || !parsed.id || !parsed.destination || !Array.isArray(parsed.milestones)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function loadCompletionState(routeId: string): RouteCompletionState {
  try {
    const raw = localStorage.getItem(`${COMPLETION_STATE_PREFIX}${routeId}`);
    if (!raw) {
      return {
        routeId,
        nextTurnCompleted: false,
        completedMilestoneIds: [],
        completedDayIds: [],
        lastUpdated: new Date().toISOString(),
      };
    }
    const parsed = JSON.parse(raw) as RouteCompletionState;
    return {
      routeId,
      nextTurnCompleted: Boolean(parsed.nextTurnCompleted),
      completedMilestoneIds: Array.isArray(parsed.completedMilestoneIds)
        ? parsed.completedMilestoneIds
        : [],
      completedDayIds: Array.isArray(parsed.completedDayIds) ? parsed.completedDayIds : [],
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch {
    return {
      routeId,
      nextTurnCompleted: false,
      completedMilestoneIds: [],
      completedDayIds: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function saveCompletionState(state: RouteCompletionState): void {
  try {
    localStorage.setItem(
      `${COMPLETION_STATE_PREFIX}${state.routeId}`,
      JSON.stringify({
        ...state,
        lastUpdated: new Date().toISOString(),
      })
    );
  } catch (err) {
    console.warn('Unable to save completion state to localStorage:', err);
  }
}

export function saveDraftFormInput(input: RouteFormInput): void {
  try {
    localStorage.setItem(DRAFT_FORM_KEY, JSON.stringify(input));
  } catch {
    // Ignore storage errors
  }
}

export function loadDraftFormInput(): RouteFormInput | null {
  try {
    const raw = localStorage.getItem(DRAFT_FORM_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RouteFormInput;
  } catch {
    return null;
  }
}

export function clearDraftFormInput(): void {
  try {
    localStorage.removeItem(DRAFT_FORM_KEY);
  } catch {
    // Ignore
  }
}
