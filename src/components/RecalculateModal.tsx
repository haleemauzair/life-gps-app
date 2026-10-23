import React, { useState } from 'react';
import { AlertCircle, Clock, Compass, Loader2, RefreshCw, ShieldAlert, X } from 'lucide-react';
import { LifeGPSRoute, RouteFormInput } from '../types/route';

interface RecalculateModalProps {
  isOpen: boolean;
  route: LifeGPSRoute;
  completedSummary: string[];
  isSubmitting: boolean;
  apiError: string | null;
  onClose: () => void;
  onRecalculate: (updatedInput: RouteFormInput) => void;
}

const TIME_OPTIONS = [
  '2–3 hours per week',
  '5 hours per week',
  '1 hour per day',
];

export const RecalculateModal: React.FC<RecalculateModalProps> = ({
  isOpen,
  route,
  completedSummary,
  isSubmitting,
  apiError,
  onClose,
  onRecalculate,
}) => {
  const [goal, setGoal] = useState(route.input.goal);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [recalculationReason, setRecalculationReason] = useState('');
  const [biggestObstacle, setBiggestObstacle] = useState(route.input.biggestObstacle);
  const [timeAvailable, setTimeAvailable] = useState(route.input.timeAvailable);
  const [currentSituation, setCurrentSituation] = useState(route.input.currentSituation);
  const [additionalContext, setAdditionalContext] = useState(route.input.additionalContext || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (goal.trim().length < 5) {
      setValidationError('Please keep a valid destination goal.');
      return;
    }
    if (biggestObstacle.trim().length < 3) {
      setValidationError('Please describe the current roadblock or constraint.');
      return;
    }
    if (timeAvailable.trim().length < 2) {
      setValidationError('Please specify your updated weekly time availability.');
      return;
    }

    onRecalculate({
      goal: goal.trim(),
      currentSituation: currentSituation.trim(),
      biggestObstacle: biggestObstacle.trim(),
      timeAvailable: timeAvailable.trim(),
      additionalContext: additionalContext.trim(),
      isRecalculation: true,
      previousDestination: route.destination.concreteDestination || route.input.goal,
      completedSummary,
      recalculationReason:
        recalculationReason.trim() ||
        'Updated weekly constraints, roadblocks, or current progress.',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recalculate-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED] mb-1">
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Route Recalculation</span>
            </div>
            <h2 id="recalculate-modal-title" className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              If this plan doesn&apos;t fit your week, let&apos;s adjust it
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your destination stays locked unless you choose to change it. Update what shifted in your schedule or roadblocks and Gemma 4 will plot a revised route.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close recalculation dialog"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {apiError && (
          <div
            role="alert"
            className="mt-5 bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 text-xs sm:text-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold">Recalculation error</p>
                <p className="mt-1 text-rose-800">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {validationError && (
          <div
            role="alert"
            className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-900 text-xs sm:text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Preserved Destination */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-[#1E3A8A]">Preserved Destination</span>
              <button
                type="button"
                onClick={() => setIsEditingGoal(!isEditingGoal)}
                disabled={isSubmitting}
                className="text-xs font-medium text-[#06B6D4] hover:underline cursor-pointer"
              >
                {isEditingGoal ? 'Done editing' : 'Change destination'}
              </button>
            </div>
            {isEditingGoal ? (
              <textarea
                rows={2}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#1E3A8A] focus:outline-none"
              />
            ) : (
              <p className="text-sm font-medium text-[#0F172A]">{goal}</p>
            )}

            {completedSummary.length > 0 && (
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200/70">
                <span className="font-semibold text-slate-700 font-mono tabular-nums">
                  {completedSummary.length} completed step(s)
                </span>{' '}
                will be passed to Gemma 4 so your new route builds on what you already finished.
              </p>
            )}
          </div>

          {/* What changed? */}
          <div>
            <label htmlFor="recalc-reason" className="block text-sm font-bold text-[#0F172A]">
              What changed or got in the way?
            </label>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              Did exams come up, did a step take longer than expected, or did you hit a new obstacle?
            </p>
            <textarea
              id="recalc-reason"
              rows={2}
              value={recalculationReason}
              onChange={(e) => setRecalculationReason(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., Midterms reduced my free time this week, or the dataset I picked was too messy..."
              className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          {/* Updated Roadblock */}
          <div>
            <label htmlFor="recalc-obstacle" className="block text-sm font-bold text-[#0F172A]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                <span>Current biggest roadblock</span>
              </span>
            </label>
            <textarea
              id="recalc-obstacle"
              rows={2}
              value={biggestObstacle}
              onChange={(e) => setBiggestObstacle(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          {/* Updated Time Available */}
          <div>
            <label htmlFor="recalc-time" className="block text-sm font-bold text-[#0F172A]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
                <span>Updated weekly time available</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2.5">
              {TIME_OPTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setTimeAvailable(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums border transition-colors cursor-pointer ${
                    timeAvailable === preset
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-medium'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              id="recalc-time"
              type="text"
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., 2–3 hours per week"
              className="w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3.5 py-2 text-sm text-[#0F172A] focus:bg-white focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          {/* Updated Current Situation */}
          <div>
            <label htmlFor="recalc-situation" className="block text-sm font-bold text-[#0F172A]">
              Current situation update
            </label>
            <textarea
              id="recalc-situation"
              rows={2}
              value={currentSituation}
              onChange={(e) => setCurrentSituation(e.target.value)}
              disabled={isSubmitting}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-60 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Recalculating with Gemma 4...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
                  <span>Recalculate My Route</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
