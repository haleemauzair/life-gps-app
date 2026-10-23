export interface RouteFormInput {
  goal: string;
  currentSituation: string;
  biggestObstacle: string;
  timeAvailable: string;
  additionalContext?: string;
  // Used when recalculating an existing route
  isRecalculation?: boolean;
  previousDestination?: string;
  completedSummary?: string[];
  recalculationReason?: string;
}

export interface DestinationSummary {
  statedGoal: string;
  concreteDestination: string;
  clarityNote: string;
  estimatedHorizon: string;
}

export interface CurrentLocationSummary {
  summary: string;
  strengths: string[];
  uncertainties: string[];
}

export interface RouteMilestone {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  whyItMatters: string;
  connectionToNext: string;
  estimatedTime: string;
  deliverable: string;
}

export interface NextTurnAction {
  id: string;
  headline: string;
  action: string;
  timeNeeded: string;
  whyFirst: string;
  definitionOfDone: string;
}

export interface SevenDayStep {
  id: string;
  dayNumber: number;
  dayLabel: string;
  title: string;
  action: string;
  timeEstimate: string;
  definitionOfDone: string;
  isRestOrLightDay: boolean;
}

export interface RoadblockAlternate {
  id: string;
  obstacle: string;
  whyItHappens: string;
  alternateRoute: string;
  verificationNote: string;
}

export interface ProgressIndicator {
  id: string;
  metric: string;
  tangibleOutput: string;
  cadence: string;
}

export interface LifeGPSRoute {
  id: string;
  createdAt: string;
  updatedAt: string;
  modelUsed: string;
  isSample?: boolean;
  input: RouteFormInput;
  destination: DestinationSummary;
  currentLocation: CurrentLocationSummary;
  nextTurn: NextTurnAction;
  milestones: RouteMilestone[];
  sevenDayPlan: SevenDayStep[];
  roadblocks: RoadblockAlternate[];
  progressIndicators: ProgressIndicator[];
  navigatorNote: string;
  recalculationCount: number;
}

export interface RouteCompletionState {
  routeId: string;
  nextTurnCompleted: boolean;
  completedMilestoneIds: string[];
  completedDayIds: string[];
  lastUpdated: string;
}
