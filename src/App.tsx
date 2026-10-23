/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { RouteFormView } from './components/RouteFormView';
import { RouteDashboardView } from './components/RouteDashboardView';
import { LifeGPSRoute, RouteCompletionState, RouteFormInput } from './types/route';
import { generatePersonalizedRoute } from './services/routeApi';
import {
  clearDraftFormInput,
  loadActiveRoute,
  loadCompletionState,
  loadDraftFormInput,
  saveActiveRoute,
  saveCompletionState,
  saveDraftFormInput,
} from './utils/storage';
import { SAMPLE_JOURNEY_ROUTE } from './data/sampleJourney';

const EMPTY_FORM_INPUT: RouteFormInput = {
  goal: '',
  currentSituation: '',
  biggestObstacle: '',
  timeAvailable: '5 hours per week',
  additionalContext: '',
};

export default function App() {
  const [savedRoute, setSavedRoute] = useState<LifeGPSRoute | null>(() => loadActiveRoute());
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const existing = loadActiveRoute();
    return existing ? 'dashboard' : 'landing';
  });

  const [formInput, setFormInput] = useState<RouteFormInput>(() => {
    const draft = loadDraftFormInput();
    return draft || EMPTY_FORM_INPUT;
  });

  const [completionState, setCompletionState] = useState<RouteCompletionState>(() => {
    const existing = loadActiveRoute();
    if (existing) {
      return loadCompletionState(existing.id);
    }
    return {
      routeId: '',
      nextTurnCompleted: false,
      completedMilestoneIds: [],
      completedDayIds: [],
      lastUpdated: new Date().toISOString(),
    };
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recalcError, setRecalcError] = useState<string | null>(null);

  // Sync completion state whenever active route changes
  useEffect(() => {
    if (savedRoute) {
      const loaded = loadCompletionState(savedRoute.id);
      setCompletionState(loaded);
    }
  }, [savedRoute?.id]);

  const handleGenerateRoute = async (input: RouteFormInput) => {
    setIsGenerating(true);
    setApiError(null);
    saveDraftFormInput(input);
    setFormInput(input);

    try {
      const generated = await generatePersonalizedRoute({
        ...input,
        recalculationCount: 0,
      });
      setSavedRoute(generated);
      saveActiveRoute(generated);

      const initialCompletion: RouteCompletionState = {
        routeId: generated.id,
        nextTurnCompleted: false,
        completedMilestoneIds: [],
        completedDayIds: [],
        lastUpdated: new Date().toISOString(),
      };
      setCompletionState(initialCompletion);
      saveCompletionState(initialCompletion);
      clearDraftFormInput();
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while generating your route.';
      setApiError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRecalculateRoute = async (updatedInput: RouteFormInput) => {
    if (!savedRoute) return;
    setIsGenerating(true);
    setRecalcError(null);

    try {
      const nextRecalcCount = (savedRoute.recalculationCount || 0) + 1;
      const revisedRoute = await generatePersonalizedRoute({
        ...updatedInput,
        isRecalculation: true,
        recalculationCount: nextRecalcCount,
      });
      setSavedRoute(revisedRoute);
      saveActiveRoute(revisedRoute);

      const freshCompletion: RouteCompletionState = {
        routeId: revisedRoute.id,
        nextTurnCompleted: false,
        completedMilestoneIds: [],
        completedDayIds: [],
        lastUpdated: new Date().toISOString(),
      };
      setCompletionState(freshCompletion);
      saveCompletionState(freshCompletion);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to recalculate route at this moment. Your current route is still intact.';
      setRecalcError(msg);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExploreSample = () => {
    setApiError(null);
    setSavedRoute(SAMPLE_JOURNEY_ROUTE);
    saveActiveRoute(SAMPLE_JOURNEY_ROUTE);
    const sampleCompletion = loadCompletionState(SAMPLE_JOURNEY_ROUTE.id);
    setCompletionState(sampleCompletion);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConvertSampleToLiveAI = async () => {
    if (!savedRoute) return;
    setFormInput(savedRoute.input);
    setCurrentView('form');
    await handleGenerateRoute(savedRoute.input);
  };

  const handleStartNewRoute = () => {
    setApiError(null);
    setRecalcError(null);
    setFormInput(EMPTY_FORM_INPUT);
    clearDraftFormInput();
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleNextTurn = () => {
    if (!savedRoute) return;
    const nextState: RouteCompletionState = {
      ...completionState,
      routeId: savedRoute.id,
      nextTurnCompleted: !completionState.nextTurnCompleted,
    };
    setCompletionState(nextState);
    saveCompletionState(nextState);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!savedRoute) return;
    const exists = completionState.completedMilestoneIds.includes(milestoneId);
    const updatedIds = exists
      ? completionState.completedMilestoneIds.filter((id) => id !== milestoneId)
      : [...completionState.completedMilestoneIds, milestoneId];

    const nextState: RouteCompletionState = {
      ...completionState,
      routeId: savedRoute.id,
      completedMilestoneIds: updatedIds,
    };
    setCompletionState(nextState);
    saveCompletionState(nextState);
  };

  const handleToggleDay = (dayId: string) => {
    if (!savedRoute) return;
    const exists = completionState.completedDayIds.includes(dayId);
    const updatedIds = exists
      ? completionState.completedDayIds.filter((id) => id !== dayId)
      : [...completionState.completedDayIds, dayId];

    const nextState: RouteCompletionState = {
      ...completionState,
      routeId: savedRoute.id,
      completedDayIds: updatedIds,
    };
    setCompletionState(nextState);
    saveCompletionState(nextState);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar
        currentView={currentView}
        hasSavedRoute={Boolean(savedRoute && !savedRoute.isSample)}
        isSampleRoute={Boolean(savedRoute?.isSample)}
        onNavigate={(view) => {
          setApiError(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreSample={handleExploreSample}
        onStartNewRoute={handleStartNewRoute}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            hasSavedRoute={Boolean(savedRoute)}
            savedRouteGoal={savedRoute?.destination?.concreteDestination || savedRoute?.input?.goal}
            onFindMyRoute={() => {
              setApiError(null);
              setCurrentView('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreSample={handleExploreSample}
            onResumeSavedRoute={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'form' && (
          <RouteFormView
            initialInput={formInput}
            isSubmitting={isGenerating}
            apiError={apiError}
            onSubmit={handleGenerateRoute}
            onDraftChange={(draft) => {
              setFormInput(draft);
              saveDraftFormInput(draft);
            }}
            onBackToLanding={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'dashboard' && savedRoute && (
          <RouteDashboardView
            route={savedRoute}
            completionState={completionState}
            isRecalculating={isGenerating}
            recalcError={recalcError}
            onToggleNextTurn={handleToggleNextTurn}
            onToggleMilestone={handleToggleMilestone}
            onToggleDay={handleToggleDay}
            onRecalculate={handleRecalculateRoute}
            onStartOver={handleStartNewRoute}
            onConvertSampleToLiveAI={handleConvertSampleToLiveAI}
            onClearRecalcError={() => setRecalcError(null)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-[#1E3A8A]">Life GPS</span>
            <span aria-hidden="true">·</span>
            <span>You don&apos;t need your whole life figured out. You just need your next turn.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={handleExploreSample}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Sample Journey
            </button>
            <button
              type="button"
              onClick={handleStartNewRoute}
              className="hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              New Route
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
