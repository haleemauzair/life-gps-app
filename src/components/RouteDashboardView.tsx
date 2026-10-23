import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  CornerDownRight,
  Flag,
  MapPin,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { LifeGPSRoute, RouteCompletionState, RouteFormInput } from '../types/route';
import { RecalculateModal } from './RecalculateModal';

interface RouteDashboardViewProps {
  route: LifeGPSRoute;
  completionState: RouteCompletionState;
  isRecalculating: boolean;
  recalcError: string | null;
  onToggleNextTurn: () => void;
  onToggleMilestone: (milestoneId: string) => void;
  onToggleDay: (dayId: string) => void;
  onRecalculate: (updatedInput: RouteFormInput) => void;
  onStartOver: () => void;
  onConvertSampleToLiveAI: () => void;
  onClearRecalcError: () => void;
}

export const RouteDashboardView: React.FC<RouteDashboardViewProps> = ({
  route,
  completionState,
  isRecalculating,
  recalcError,
  onToggleNextTurn,
  onToggleMilestone,
  onToggleDay,
  onRecalculate,
  onStartOver,
  onConvertSampleToLiveAI,
  onClearRecalcError,
}) => {
  const [isRecalcModalOpen, setIsRecalcModalOpen] = useState(false);
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false);

  const actionableDays = route.sevenDayPlan.filter((d) => !d.isRestOrLightDay);
  const totalTrackableSteps = 1 + route.milestones.length + actionableDays.length;

  const completedMilestoneCount = route.milestones.filter((m) =>
    completionState.completedMilestoneIds.includes(m.id)
  ).length;
  const completedActionableDayCount = actionableDays.filter((d) =>
    completionState.completedDayIds.includes(d.id)
  ).length;
  const completedTotal =
    (completionState.nextTurnCompleted ? 1 : 0) +
    completedMilestoneCount +
    completedActionableDayCount;

  const overallPercent =
    totalTrackableSteps > 0 ? Math.round((completedTotal / totalTrackableSteps) * 100) : 0;

  // Build summary of completed items to feed into Recalculation
  const completedSummary: string[] = [];
  if (completionState.nextTurnCompleted) {
    completedSummary.push(`Next Turn completed: ${route.nextTurn.headline}`);
  }
  route.milestones.forEach((m) => {
    if (completionState.completedMilestoneIds.includes(m.id)) {
      completedSummary.push(`Milestone ${m.stepNumber} completed: ${m.title}`);
    }
  });
  route.sevenDayPlan.forEach((d) => {
    if (completionState.completedDayIds.includes(d.id)) {
      completedSummary.push(`${d.dayLabel} completed: ${d.title}`);
    }
  });

  const handleOpenRecalc = () => {
    onClearRecalcError();
    setIsRecalcModalOpen(true);
  };

  const handleRecalcSubmit = async (updatedInput: RouteFormInput) => {
    await onRecalculate(updatedInput);
    setIsRecalcModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Sample Journey Notice Banner (Only shown when viewing the sample preview) */}
      {route.isSample && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-600">
            <span className="font-bold text-[#1E3A8A]">Sample Journey Preview: </span>
            <span>
              You are exploring an interactive example route. You can check off milestones right here, regenerate this exact scenario live with Gemma 4, or start your own route.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onConvertSampleToLiveAI}
              disabled={isRecalculating}
              className="px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isRecalculating ? 'Calling Gemma 4...' : 'Run Live with Gemma 4'}
            </button>
            <button
              type="button"
              onClick={onStartOver}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Plan My Own Route
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Telemetry & Action Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
              <span className="font-semibold text-[#1E3A8A]">Active Navigation Route</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Weekly pace: {route.input.timeAvailable}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Horizon: {route.destination.estimatedHorizon}
              </span>
              {route.recalculationCount > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-[#7C3AED]">
                    Recalculated {route.recalculationCount}x
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {route.destination.concreteDestination}
            </h1>
          </div>

          {/* Action Buttons: Recalculate & Start Over */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenRecalc}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1E3A8A] bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4]"
            >
              <RefreshCw className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
              <span>Recalculate my route</span>
            </button>

            {showStartOverConfirm ? (
              <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-medium text-rose-900">Start a new goal?</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowStartOverConfirm(false);
                    onStartOver();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg cursor-pointer"
                >
                  Yes, start over
                </button>
                <button
                  type="button"
                  onClick={() => setShowStartOverConfirm(false)}
                  className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowStartOverConfirm(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Start over</span>
              </button>
            )}
          </div>
        </div>

        {/* Route Completion Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mb-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-[#0F172A]">Route Progress</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Next Turn: {completionState.nextTurnCompleted ? '1/1' : '0/1'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Milestones: {completedMilestoneCount}/{route.milestones.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                7-Day Actions: {completedActionableDayCount}/{actionableDays.length}
              </span>
            </div>
            <span className="font-mono tabular-nums font-bold text-[#1E3A8A]">
              {completedTotal} of {totalTrackableSteps} steps complete ({overallPercent}%)
            </span>
          </div>
          <div
            className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={overallPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[#06B6D4] transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${overallPercent / 100})` }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 (PRIMARY FOCAL ANCHOR): YOUR NEXT TURN */}
      <section
        aria-labelledby="next-turn-heading"
        className="bg-[#1E3A8A] text-white rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#06B6D4] tracking-wide">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>YOUR NEXT TURN — DO THIS FIRST</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-sky-200">
                Estimated time: {route.nextTurn.timeNeeded}
              </span>
            </div>

            <h2
              id="next-turn-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
            >
              {route.nextTurn.headline}
            </h2>

            <p className="text-base sm:text-lg text-slate-100 leading-relaxed">
              {route.nextTurn.action}
            </p>

            <div className="pt-4 mt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-sky-200 font-semibold mb-1">Why this is your first turn</p>
                <p className="text-slate-200 leading-relaxed">{route.nextTurn.whyFirst}</p>
              </div>
              <div>
                <p className="text-sky-200 font-semibold mb-1">Definition of done</p>
                <p className="text-slate-200 leading-relaxed">{route.nextTurn.definitionOfDone}</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3">
            <button
              type="button"
              onClick={onToggleNextTurn}
              className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                completionState.nextTurnCompleted
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-[#06B6D4] text-slate-950 hover:bg-cyan-300'
              }`}
            >
              {completionState.nextTurnCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Next Turn Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Mark Next Turn Complete</span>
                </>
              )}
            </button>
            <p className="text-xs text-sky-200/90 text-left lg:text-right">
              You don&apos;t need to solve everything today—just complete this single step.
            </p>
          </div>
        </div>
      </section>

      {/* SECTIONS 1 & 2: YOUR DESTINATION & YOUR CURRENT LOCATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. Your Destination */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
                <Flag className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
                <span>01. Your Destination</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {route.destination.estimatedHorizon}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">
              {route.destination.concreteDestination}
            </h3>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {route.destination.clarityNote}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Your original stated goal: </span>
            <span>&ldquo;{route.destination.statedGoal}&rdquo;</span>
          </div>
        </section>

        {/* 2. Your Current Location */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A] mb-3">
              <MapPin className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>02. Your Current Location</span>
            </div>

            <p className="text-sm sm:text-base font-medium text-[#0F172A] leading-relaxed">
              {route.currentLocation.summary}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <h4 className="text-xs font-semibold text-emerald-800 mb-2">
                  What you already have going for you
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {route.currentLocation.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 mb-2">
                  What remains uncertain or constrained
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {route.currentLocation.uncertainties.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 3: THE ROUTE AHEAD (CONNECTED MILESTONES) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A] mb-1">
              <Compass className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>03. The Route Ahead</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Step-by-step milestones to your destination
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Each waypoint builds directly toward the next. Mark milestones complete as you finish each deliverable.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
            {completedMilestoneCount} of {route.milestones.length} milestones reached
          </div>
        </div>

        {/* Connected Route Timeline */}
        <div className="mt-8 relative">
          {route.milestones.map((milestone, index) => {
            const isCompleted = completionState.completedMilestoneIds.includes(milestone.id);
            const isLast = index === route.milestones.length - 1;
            const prevAllCompleted = route.milestones
              .slice(0, index)
              .every((m) => completionState.completedMilestoneIds.includes(m.id));
            const isCurrentActive = !isCompleted && prevAllCompleted;

            return (
              <div key={milestone.id} className="relative flex gap-4 sm:gap-6 pb-8 last:pb-0">
                {/* Connecting Vertical Route Line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-10 bottom-0 w-0.5 -translate-x-1/2 transition-colors ${
                      isCompleted ? 'bg-[#06B6D4]' : 'bg-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Waypoint Marker Button */}
                <button
                  type="button"
                  onClick={() => onToggleMilestone(milestone.id)}
                  aria-label={`Mark milestone ${milestone.stepNumber}: ${milestone.title} as ${
                    isCompleted ? 'incomplete' : 'complete'
                  }`}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-mono tabular-nums text-xs font-bold shrink-0 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4] ${
                    isCompleted
                      ? 'bg-[#06B6D4] text-slate-950 border-2 border-[#06B6D4]'
                      : isCurrentActive
                      ? 'bg-[#1E3A8A] text-white border-2 border-[#06B6D4] ring-4 ring-[#06B6D4]/15'
                      : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-[#1E3A8A]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <span>0{milestone.stepNumber}</span>
                  )}
                </button>

                {/* Milestone Content */}
                <div className="flex-1 pt-0.5 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <h3
                        className={`text-base sm:text-lg font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-[#0F172A]'
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      {isCurrentActive && (
                        <span className="text-xs font-semibold text-[#06B6D4]">
                          · Active Waypoint
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono tabular-nums text-slate-500">
                        {milestone.estimatedTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleMilestone(milestone.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Mark complete'}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {milestone.description}
                  </p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#F8FAFC] p-4 rounded-xl">
                    <div>
                      <span className="font-semibold text-[#1E3A8A] block mb-1">
                        Why this milestone matters
                      </span>
                      <span className="text-slate-600 leading-relaxed">{milestone.whyItMatters}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#1E3A8A] block mb-1">
                        How it leads to the next step
                      </span>
                      <span className="text-slate-600 leading-relaxed">
                        {milestone.connectionToNext}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#7C3AED] block mb-1">
                        Checkpoint deliverable
                      </span>
                      <span className="text-slate-700 font-medium leading-relaxed">
                        {milestone.deliverable}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: YOUR SEVEN-DAY ROUTE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A] mb-1">
              <Calendar className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>04. Your Seven-Day Route</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Practical day-by-day plan for this week
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Paced for <span className="font-semibold text-[#0F172A]">{route.input.timeAvailable}</span>, including intentional lighter or rest days so you don&apos;t burn out.
            </p>
          </div>
          <div className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
            {completedActionableDayCount} of {actionableDays.length} action days completed
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {route.sevenDayPlan.map((day) => {
            const isDone = completionState.completedDayIds.includes(day.id);

            return (
              <div
                key={day.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  day.isRestOrLightDay
                    ? 'bg-slate-50/70 border-slate-200/80 text-slate-600'
                    : isDone
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-[#F8FAFC] border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
                    <span className="text-xs font-mono tabular-nums font-bold text-[#1E3A8A]">
                      {day.dayLabel}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500">
                      {day.timeEstimate}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold mt-3 leading-snug ${
                      isDone ? 'line-through text-slate-400' : 'text-[#0F172A]'
                    }`}
                  >
                    {day.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{day.action}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-3">
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Done when: </span>
                    <span>{day.definitionOfDone}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleDay(day.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : day.isRestOrLightDay
                        ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'bg-white border border-slate-300 text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <span>{day.isRestOrLightDay ? 'Log Rest Day' : 'Mark Day Done'}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: ROADBLOCKS AND ALTERNATE ROUTES */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-1">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            <span>05. Roadblocks &amp; Alternate Routes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Pre-planned detours when obstacles show up
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Grounded in the constraints you shared, along with what you should verify independently.
          </p>
        </div>

        <div className="mt-6 divide-y divide-slate-100">
          {route.roadblocks.map((item, idx) => (
            <div
              key={item.id || idx}
              className="py-5 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <div className="lg:col-span-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Likely Roadblock 0{idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">{item.obstacle}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.whyItHappens}
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="text-xs font-semibold text-[#06B6D4] mb-1">
                  Practical Alternate Route
                </div>
                <p className="text-sm text-[#0F172A] leading-relaxed">{item.alternateRoute}</p>
              </div>

              <div className="lg:col-span-3 bg-[#F8FAFC] p-3.5 rounded-xl">
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  What to verify
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.verificationNote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTIONS 7 & 8: HOW YOU'LL KNOW YOU'RE MOVING & A NOTE FROM YOUR NAVIGATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 7. How you'll know you're moving */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A] mb-1">
              <TrendingUp className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>06. How You&apos;ll Know You&apos;re Moving</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              Measurable indicators of real momentum
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Based on tangible outputs and completed actions rather than arbitrary scores.
            </p>

            <div className="space-y-4">
              {route.progressIndicators.map((indicator, idx) => (
                <div
                  key={indicator.id || idx}
                  className="pt-4 first:pt-0 border-t first:border-t-0 border-slate-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">{indicator.metric}</h3>
                    <span className="text-xs font-mono tabular-nums text-[#1E3A8A]">
                      {indicator.cadence}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {indicator.tangibleOutput}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. A Note From Your Navigator */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-2">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>07. A Note From Your Navigator</span>
            </div>

            <p className="text-base sm:text-lg font-medium text-[#0F172A] leading-relaxed mt-2">
              &ldquo;{route.navigatorNote}&rdquo;
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                Guidance note: Generated routes are practical planning aids, not guaranteed academic or career outcomes. Always verify official deadlines and eligibility rules.
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Model: {route.modelUsed}</span>
              <button
                type="button"
                onClick={handleOpenRecalc}
                className="font-sans font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                Need to adjust this route? Recalculate →
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Recalculate Route Modal */}
      <RecalculateModal
        isOpen={isRecalcModalOpen}
        route={route}
        completedSummary={completedSummary}
        isSubmitting={isRecalculating}
        apiError={recalcError}
        onClose={() => setIsRecalcModalOpen(false)}
        onRecalculate={handleRecalcSubmit}
      />
    </div>
  );
};
