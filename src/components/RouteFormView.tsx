import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Compass,
  Flag,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { RouteFormInput } from '../types/route';

interface RouteFormViewProps {
  initialInput: RouteFormInput;
  isSubmitting: boolean;
  apiError: string | null;
  onSubmit: (input: RouteFormInput) => void;
  onDraftChange: (input: RouteFormInput) => void;
  onBackToLanding: () => void;
}

const GOAL_EXAMPLES = [
  'Get my first internship in AI.',
  'Find scholarships for an undergraduate degree abroad.',
  'Improve my semester grades.',
  'Learn web development and build a portfolio.',
  'Turn my idea into a startup prototype.',
];

const ROADBLOCK_EXAMPLES = [
  'Not knowing where to begin',
  'Limited money for courses or tools',
  'Lack of prior experience or portfolio',
  'Lack of time alongside classes and work',
  'Uncertainty about which path to choose',
  'Difficulty staying consistent week to week',
];

const TIME_OPTIONS = [
  { id: '2-3h', label: '2–3 hours per week', value: '2–3 hours per week' },
  { id: '5h', label: '5 hours per week', value: '5 hours per week' },
  { id: '1h-day', label: '1 hour per day (7 hours/week)', value: '1 hour per day' },
  { id: 'custom', label: 'Custom schedule', value: 'custom' },
];

export const RouteFormView: React.FC<RouteFormViewProps> = ({
  initialInput,
  isSubmitting,
  apiError,
  onSubmit,
  onDraftChange,
  onBackToLanding,
}) => {
  const [goal, setGoal] = useState(initialInput.goal || '');
  const [currentSituation, setCurrentSituation] = useState(initialInput.currentSituation || '');
  const [biggestObstacle, setBiggestObstacle] = useState(initialInput.biggestObstacle || '');

  const isPresetTime = TIME_OPTIONS.some(
    (opt) => opt.id !== 'custom' && opt.value === initialInput.timeAvailable
  );
  const [selectedTimeOption, setSelectedTimeOption] = useState<string>(
    initialInput.timeAvailable
      ? isPresetTime
        ? initialInput.timeAvailable
        : 'custom'
      : '5 hours per week'
  );
  const [customTime, setCustomTime] = useState<string>(
    !isPresetTime && initialInput.timeAvailable ? initialInput.timeAvailable : ''
  );
  const [additionalContext, setAdditionalContext] = useState(initialInput.additionalContext || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);

  const effectiveTimeAvailable =
    selectedTimeOption === 'custom' ? customTime.trim() : selectedTimeOption;

  useEffect(() => {
    onDraftChange({
      goal,
      currentSituation,
      biggestObstacle,
      timeAvailable: effectiveTimeAvailable,
      additionalContext,
    });
  }, [goal, currentSituation, biggestObstacle, effectiveTimeAvailable, additionalContext]);

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStageIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const completedRequiredCount = [
    goal.trim().length >= 5,
    currentSituation.trim().length >= 5,
    biggestObstacle.trim().length >= 3,
    effectiveTimeAvailable.length >= 2,
  ].filter(Boolean).length;

  const progressPercentage = Math.round((completedRequiredCount / 4) * 100);

  const handleLoadQuickExample = () => {
    setGoal('Learn web development and build a portfolio to land freelance or part-time student work.');
    setCurrentSituation(
      'First-year university student. I know basic HTML and CSS from a high school class, but JavaScript feels confusing and I have never deployed a real site.'
    );
    setBiggestObstacle(
      'Not knowing where to begin—every tutorial lists 15 different frameworks, I have no budget for paid courses, and I get stuck whenever I try to build something without a video guide.'
    );
    setSelectedTimeOption('5 hours per week');
    setCustomTime('');
    setAdditionalContext(
      'Using a modest Windows laptop. Need free learning resources and practical projects that do not require paid hosting.'
    );
    setValidationError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (goal.trim().length < 5) {
      setValidationError('Please describe where you want to go (at least a few words).');
      return;
    }
    if (currentSituation.trim().length < 5) {
      setValidationError('Please describe where you are starting from so the route fits your actual level.');
      return;
    }
    if (biggestObstacle.trim().length < 3) {
      setValidationError('Please share what is making progress difficult right now.');
      return;
    }
    if (effectiveTimeAvailable.length < 2) {
      setValidationError('Please specify how much time you can realistically commit each week.');
      return;
    }

    onSubmit({
      goal: goal.trim(),
      currentSituation: currentSituation.trim(),
      biggestObstacle: biggestObstacle.trim(),
      timeAvailable: effectiveTimeAvailable,
      additionalContext: additionalContext.trim(),
    });
  };

  const loadingStages = [
    'Reading your current coordinates and constraints...',
    'Plotting 3 to 4 practical milestones with Gemma 4 (gemma-4-26b-a4b-it)...',
    'Designing a realistic 7-day plan that fits your weekly hours...',
    'Preparing alternate routes around your roadblocks...',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Top Back Link & Example Loader */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBackToLanding}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0F172A] transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to overview</span>
        </button>

        <button
          type="button"
          onClick={handleLoadQuickExample}
          disabled={isSubmitting}
          className="text-xs font-semibold text-[#1E3A8A] hover:text-[#06B6D4] transition-colors cursor-pointer disabled:opacity-50"
        >
          Prefill with a realistic student scenario
        </button>
      </div>

      {/* Header & Form Progress */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
          Set your coordinates
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
          You have a destination. Let&apos;s work out the next part of the route. Be honest about your time and constraints—the plan works best when it fits your real week.
        </p>

        {/* Visible Progress Bar through the form */}
        <div className="mt-5 bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
            <span>Route coordinates readiness</span>
            <span className="font-mono tabular-nums text-[#1E3A8A] font-semibold">
              {completedRequiredCount} / 4 required details ({progressPercentage}%)
            </span>
          </div>
          <div
            className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[#06B6D4] transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${progressPercentage / 100})` }}
            />
          </div>
        </div>
      </div>

      {/* API Error Alert with Retry button & Preserved Inputs Notice */}
      {apiError && (
        <div
          role="alert"
          className="mb-8 bg-rose-50/90 border border-rose-200 rounded-xl p-5 text-rose-950"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h2 className="text-sm font-bold text-rose-900">
                Couldn&apos;t complete route calculation
              </h2>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">{apiError}</p>
              <p className="text-xs text-rose-700 mt-2">
                Your entered details have been preserved below so you don&apos;t have to retype anything.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Retry Route Generation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Validation Error */}
      {validationError && (
        <div
          role="alert"
          className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-sm"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Guided Form */}
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* 1. Destination */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <Flag className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
            <span>01. Destination</span>
          </div>
          <label htmlFor="goal-input" className="block text-lg font-bold text-[#0F172A]">
            Where do you want to go?
          </label>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
            Describe a specific academic, career, or personal goal in your own words. Even if it feels rough, write what you&apos;re aiming for.
          </p>

          <textarea
            id="goal-input"
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Get my first internship in AI by next semester, or improve my calculus and physics grades..."
            className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm sm:text-base text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-colors"
          />

          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Or choose an example to customize:
            </p>
            <div className="flex flex-wrap gap-2">
              {GOAL_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setGoal(example)}
                  className={`text-left text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    goal === example
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-medium'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Starting Point */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <MapPin className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
            <span>02. Current Location</span>
          </div>
          <label htmlFor="situation-input" className="block text-lg font-bold text-[#0F172A]">
            Where are you starting from?
          </label>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
            Share your current year or stage, what you&apos;ve tried so far, or what skills you already have. No judgment—honest coordinates make a better plan.
          </p>

          <textarea
            id="situation-input"
            rows={3}
            value={currentSituation}
            onChange={(e) => setCurrentSituation(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., 2nd-year CS student. I know basic Python from class, have no portfolio projects yet, and haven't written a technical resume..."
            className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm sm:text-base text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-colors"
          />
        </section>

        {/* 3. Biggest Roadblock */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <ShieldAlert className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
            <span>03. Roadblocks</span>
          </div>
          <label htmlFor="obstacle-input" className="block text-lg font-bold text-[#0F172A]">
            What&apos;s the biggest roadblock?
          </label>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
            What is making progress difficult right now? We&apos;ll use this to build realistic detours and alternate routes.
          </p>

          <textarea
            id="obstacle-input"
            rows={2}
            value={biggestObstacle}
            onChange={(e) => setBiggestObstacle(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Not knowing where to begin, limited budget for paid courses, or getting overwhelmed by too many topics..."
            className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm sm:text-base text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-colors"
          />

          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Common student roadblocks (click to add):
            </p>
            <div className="flex flex-wrap gap-2">
              {ROADBLOCK_EXAMPLES.map((item) => {
                const isIncluded = biggestObstacle.toLowerCase().includes(item.toLowerCase());
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      if (!biggestObstacle.trim()) {
                        setBiggestObstacle(item);
                      } else if (!isIncluded) {
                        setBiggestObstacle(`${biggestObstacle.trim().replace(/\.$/, '')}; ${item.toLowerCase()}.`);
                      }
                    }}
                    className={`text-left text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isIncluded
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] font-medium'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Weekly Time Commitment */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <Clock className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
            <span>04. Weekly Pace</span>
          </div>
          <label className="block text-lg font-bold text-[#0F172A]">
            How much time can you realistically commit?
          </label>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
            Pick an amount you can sustain even during a normal week of classes or work.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIME_OPTIONS.map((option) => {
              const isSelected = selectedTimeOption === option.value;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedTimeOption(option.value)}
                  className={`px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-2xs'
                      : 'bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border-slate-200'
                  }`}
                >
                  <span className="font-mono tabular-nums">{option.label}</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-white bg-[#06B6D4]' : 'border-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {selectedTimeOption === 'custom' && (
            <div className="mt-4">
              <label htmlFor="custom-time-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Describe your weekly schedule or available hours:
              </label>
              <input
                id="custom-time-input"
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g., 4 hours total on weekends only, or 20 minutes on weekday mornings"
                className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
              />
            </div>
          )}
        </section>

        {/* 5. Optional Context */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">05. Additional Context</span>
            <span className="text-xs text-slate-400">Optional</span>
          </div>
          <label htmlFor="context-input" className="block text-lg font-bold text-[#0F172A]">
            Anything else we should take into account?
          </label>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
            Mention any deadlines, hardware limits, financial constraints, or learning preferences.
          </p>

          <textarea
            id="context-input"
            rows={2}
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Cannot afford paid courses, working a part-time job on Fridays, or applications close in 6 weeks..."
            className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-4 py-3 text-sm sm:text-base text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-colors"
          />
        </section>

        {/* Submit / Loading State Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {isSubmitting ? (
            <div className="flex items-center gap-3.5 text-sm text-[#1E3A8A]">
              <Loader2 className="w-5 h-5 text-[#06B6D4] animate-spin shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#0F172A]">{loadingStages[loadingStageIndex]}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generating your route with Gemma 4 (gemma-4-26b-a4b-it). This usually takes 30–40 seconds.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-600">
              <p className="font-medium text-[#0F172A]">Ready to calculate your route?</p>
              <p className="text-xs text-slate-500 mt-0.5">
                You can adjust or recalculate your plan anytime if your week changes.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-60 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B6D4]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Calculating Route...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
                <span>Generate My Route</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
