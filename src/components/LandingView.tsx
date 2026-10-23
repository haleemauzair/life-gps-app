import React from 'react';
import { ArrowRight, Compass, CornerDownRight, Flag, MapPin, RefreshCw, Route } from 'lucide-react';

interface LandingViewProps {
  hasSavedRoute: boolean;
  savedRouteGoal?: string;
  onFindMyRoute: () => void;
  onExploreSample: () => void;
  onResumeSavedRoute: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  hasSavedRoute,
  savedRouteGoal,
  onFindMyRoute,
  onExploreSample,
  onResumeSavedRoute,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
          {/* Left Column: Value Proposition & Primary Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#1E3A8A] tracking-normal mb-4">
              You don&apos;t need your whole life figured out. You just need your next turn.
            </p>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#0F172A] leading-[1.1] tracking-tight mb-6"
              style={{ textWrap: 'balance' }}
            >
              Your future isn&apos;t a straight line. Let&apos;s find your route.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
              Tell us where you want to go, where you&apos;re starting from, and what&apos;s getting in the way.
              We&apos;ll help you turn the distance between the two into a plan you can actually follow.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <button
                type="button"
                onClick={onFindMyRoute}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4]"
              >
                <span>Find My Route</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreSample}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#1E3A8A] bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4]"
              >
                <span>Explore a sample journey</span>
              </button>
            </div>

            {/* Resume existing route banner if available in localStorage */}
            {hasSavedRoute && (
              <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-xl">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-[#0F172A]">Active route saved: </span>
                  <span className="line-clamp-1">{savedRouteGoal || 'Your personalized route'}</span>
                </div>
                <button
                  type="button"
                  onClick={onResumeSavedRoute}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#06B6D4] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Resume route</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Quiet unboxed metadata strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span>Built for university students &amp; recent graduates</span>
              <span aria-hidden="true">·</span>
              <span>Respects real time &amp; budget constraints</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Powered by Gemma 4</span>
            </div>
          </div>

          {/* Right Column: Native SVG Navigation Schematic Visual */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs font-medium text-slate-500">Route Preview Schematic</p>
                  <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                    First AI Internship · <span className="font-mono tabular-nums text-slate-600">5 hrs/wk</span>
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#1E3A8A] font-medium">
                  4 Waypoints
                </span>
              </div>

              {/* SVG Route Map Visualization */}
              <div className="my-6 relative" aria-label="Visual diagram of a student route from current location to destination with waypoints and an alternate route around a roadblock">
                <svg
                  viewBox="0 0 400 280"
                  className="w-full h-auto overflow-visible"
                  role="img"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1E3A8A" />
                      <stop offset="55%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>

                  {/* Subtle background coordinate grid lines */}
                  <line x1="0" y1="56" x2="400" y2="56" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="112" x2="400" y2="112" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="168" x2="400" y2="168" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="224" x2="400" y2="224" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="80" y1="0" x2="80" y2="280" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="280" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="320" y1="0" x2="320" y2="280" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Blocked straight line (Roadblock illustration) */}
                  <path
                    d="M 135 190 L 255 110"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  {/* Roadblock X marker */}
                  <g transform="translate(198, 148)">
                    <circle cx="0" cy="0" r="10" fill="#FFF1F2" stroke="#E11D48" strokeWidth="1.5" />
                    <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                  <text x="214" y="152" className="text-[10px] fill-rose-700 font-medium">
                    Roadblock: No paid GPU budget
                  </text>

                  {/* Active Navigable Route Curve (Detouring cleanly via free tools) */}
                  <path
                    d="M 48 236 C 95 236, 105 190, 135 190 C 165 190, 165 92, 225 84 C 285 76, 305 42, 352 42"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Starting Point Node */}
                  <g transform="translate(48, 236)">
                    <circle cx="0" cy="0" r="8" fill="#1E3A8A" />
                    <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                  </g>
                  <text x="48" y="260" className="text-[11px] fill-[#0F172A] font-semibold">
                    Current Location
                  </text>
                  <text x="48" y="274" className="text-[10px] fill-slate-500">
                    Python basics · No portfolio yet
                  </text>

                  {/* Next Turn Highlight Node (Waypoint 1) */}
                  <g transform="translate(135, 190)">
                    <circle cx="0" cy="0" r="13" fill="#06B6D4" fillOpacity="0.15" />
                    <circle cx="0" cy="0" r="7" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2" />
                  </g>
                  <rect x="24" y="132" width="142" height="40" rx="6" fill="#0F172A" />
                  <text x="34" y="148" className="text-[10px] fill-[#06B6D4] font-semibold">
                    NEXT TURN · 30 MIN
                  </text>
                  <text x="34" y="162" className="text-[10px] fill-white font-medium">
                    Audit 3 real internship posts
                  </text>

                  {/* Waypoint 2 (Alternate Route via Free Compute) */}
                  <g transform="translate(225, 84)">
                    <circle cx="0" cy="0" r="6.5" fill="#FFFFFF" stroke="#06B6D4" strokeWidth="2.5" />
                  </g>
                  <text x="140" y="60" className="text-[11px] fill-[#0F172A] font-semibold">
                    Alternate Route
                  </text>
                  <text x="140" y="73" className="text-[10px] fill-slate-500">
                    Baseline pipeline on free tier
                  </text>

                  {/* Destination Node */}
                  <g transform="translate(352, 42)">
                    <circle cx="0" cy="0" r="12" fill="#7C3AED" fillOpacity="0.14" />
                    <circle cx="0" cy="0" r="7.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
                  </g>
                  <text x="245" y="22" className="text-[11px] fill-[#1E3A8A] font-bold">
                    Destination
                  </text>
                  <text x="245" y="35" className="text-[10px] fill-slate-600">
                    Shipped repo + 15 applications
                  </text>
                </svg>
              </div>

              {/* Bottom Summary inside Schematic Card */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-4 h-4 text-[#06B6D4] shrink-0" aria-hidden="true" />
                  <span>Adapts when exams, work, or budgets shift</span>
                </div>
                <button
                  type="button"
                  onClick={onExploreSample}
                  className="font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Inspect full sample →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Life GPS Works Section */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Designed for real student constraints, not wishful thinking
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              When you have twenty tabs open and conflicting advice, you don&apos;t need another generic motivational speech. You need a clear reading of where you are and one concrete step that fits your week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1E3A8A] mb-2">
                <MapPin className="w-4 h-4 text-[#06B6D4] shrink-0" aria-hidden="true" />
                <span>01. Honest Starting Coordinates</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Start from your actual situation—whether you have two hours a week, zero budget for courses, or no clear idea which path to pick first.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1E3A8A] mb-2">
                <Compass className="w-4 h-4 text-[#06B6D4] shrink-0" aria-hidden="true" />
                <span>02. Your Single Next Turn</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instead of overwhelming you with twenty tasks at once, Life GPS isolates one concrete action small enough to finish today, backed by a realistic seven-day plan.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1E3A8A] mb-2">
                <RefreshCw className="w-4 h-4 text-[#7C3AED] shrink-0" aria-hidden="true" />
                <span>03. Recalculation Without Guilt</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                When midterms hit, a plan stops working, or time runs short, recalculate your route in one click. Changing routes isn&apos;t failing—it&apos;s navigating.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
