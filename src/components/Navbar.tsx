import React from 'react';
import { Compass } from 'lucide-react';

export type AppView = 'landing' | 'form' | 'dashboard';

interface NavbarProps {
  currentView: AppView;
  hasSavedRoute: boolean;
  isSampleRoute: boolean;
  onNavigate: (view: AppView) => void;
  onExploreSample: () => void;
  onStartNewRoute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  hasSavedRoute,
  isSampleRoute,
  onNavigate,
  onExploreSample,
  onStartNewRoute,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#1E3A8A] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4] rounded-md"
        >
          <Compass className="w-5 h-5 text-[#06B6D4] shrink-0" aria-hidden="true" />
          <span>Life GPS</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentView === 'landing'
                ? 'border-[#1E3A8A] text-[#0F172A] font-semibold'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigate('form')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentView === 'form'
                ? 'border-[#1E3A8A] text-[#0F172A] font-semibold'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Plan Route
          </button>
          <button
            type="button"
            onClick={onExploreSample}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              currentView === 'dashboard' && isSampleRoute
                ? 'border-[#1E3A8A] text-[#0F172A] font-semibold'
                : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
            }`}
          >
            Sample Journey
          </button>
          {hasSavedRoute && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                currentView === 'dashboard' && !isSampleRoute
                  ? 'border-[#1E3A8A] text-[#0F172A] font-semibold'
                  : 'border-transparent hover:text-[#0F172A] hover:border-slate-300'
              }`}
            >
              My Route
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'dashboard' ? (
            <button
              type="button"
              onClick={onStartNewRoute}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4]"
            >
              Plan New Route
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('form')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4]"
            >
              Find My Route
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
