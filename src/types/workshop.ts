// Organization
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentSession: number;
  completionPercent: number;
}

// Session 1 Types - AI Strategy Foundation
export interface AIIcebreakerResponse {
  id: string;
  participantName: string;
  impactScore: number; // 0-4: Prompt A - "AI will have a dramatic impact on society within the next three years"
  optimismScore: number; // 0-4: Prompt B - "AI will have net positive outcomes for individuals and society"
  createdAt: string;
}

export interface CognitiveBias {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export interface AIWorkingPrinciple {
  id: string;
  principleType: "human-centered" | "control-accountability" | "observability-explainability" | "improvement-responsiveness";
  promptingAnswers: Record<string, string>;
  dos: string[];
  donts: string[];
  createdAt: string;
}

export interface AITradeoff {
  id: string;
  topic: "control" | "priority" | "users" | "external-comms" | "internal-comms";
  sliderValue: number; // 0-100
  rationale: string;
  createdAt: string;
}

// Session 2 Types
export interface FrictionPoint {
  id: string;
  processArea: string;        // Free text - what area of work?
  description: string;         // Free text - describe the friction
  priority?: "high" | "medium" | "low";  // Optional priority for ranking
  impactLevel?: number;        // Optional impact level for sync
  frequency?: string;          // Optional frequency for sync
  affectedRoles?: string[];    // Optional affected roles for sync
  createdAt: string;
}

export interface ScoredOpportunity {
  id: string;
  frictionId?: string;
  title: string;
  description: string;
  valueScore: 1 | 2 | 3 | 4 | 5;
  complexityScore: 1 | 2 | 3 | 4 | 5;
  quadrant: "quick-win" | "strategic" | "fill-in" | "deprioritize";
  voteCount: number;
  selectedForPilot: boolean;
}

// Session 3 Types - Design the Pilot
export interface MVPSpec {
  id: string;
  frictionPointId: string;        // Links to selected friction point
  scope: string;                   // Free text: what are we building?
  toolsToUse: string[];            // e.g., ["Claude", "Copilot", "Excel"]
  humanCheckpoints: string[];      // Where does human stay in loop?
  successThreshold: string;        // e.g., "Works for 80% of cases"
  timeframe: string;               // e.g., "2 weeks"
  createdAt: string;
}

// Session 4 Types - Create the 90-Day Roadmap
export interface PilotPlan {
  id: string;
  mvpSpecId: string;               // Links to MVP spec
  testUsers: string[];             // Who will test? (2-3 names)
  metricsToTrack: string[];        // What will we measure?
  duration: string;                // e.g., "4 weeks"
  stopCriteria: string[];          // What would make us stop?
  createdAt: string;
}

export interface RoadmapMilestone {
  id: string;
  pilotPlanId: string;
  weekStart: number;               // 1-12
  weekEnd: number;                 // 1-12
  activity: string;                // What happens?
  owner: string;                   // Who owns it?
  successCriteria: string;         // How do we know it worked?
  phase: "build" | "pilot" | "refine" | "scale";
  createdAt: string;
}

// Session 5 Types - Empower Teams
export interface ScalingChecklistItem {
  id: string;
  category: "documentation" | "training" | "ownership" | "feedback" | "metrics";
  item: string;
  completed: boolean;
  notes: string;
  createdAt: string;
}

export interface TrainingPlanEntry {
  id: string;
  role: string;
  trainingNeeds: string[];
  resources: string[];
  champion: string;
  targetDate: string;
  createdAt: string;
}

export interface LessonLearned {
  id: string;
  category: "success" | "challenge" | "surprise" | "recommendation";
  description: string;
  applicableTo: string[];
  createdAt: string;
}

export interface NextOpportunity {
  id: string;
  title: string;
  domain: string;
  patternToReuse: string;
  estimatedValue: "low" | "medium" | "high";
  priority: number;
  createdAt: string;
}

// Workshop State
export interface WorkshopState {
  organization: Organization | null;
  currentSession: number;

  // Session 1
  aiIcebreakerResponses: AIIcebreakerResponse[];
  cognitiveBiases: CognitiveBias[];
  aiWorkingPrinciples: AIWorkingPrinciple[];
  aiTradeoffs: AITradeoff[];

  // Session 2
  frictionPoints: FrictionPoint[];
  scoredOpportunities: ScoredOpportunity[];

  // Session 3 - Design the Pilot
  mvpSpecs: MVPSpec[];

  // Session 4 - Create the Roadmap
  pilotPlans: PilotPlan[];
  roadmapMilestones: RoadmapMilestone[];

  // Session 5 - Empower Teams
  scalingChecklist: ScalingChecklistItem[];
  trainingPlan: TrainingPlanEntry[];
  lessonsLearned: LessonLearned[];
  nextOpportunities: NextOpportunity[];

  // Meta
  isDirty: boolean;
  lastSaved: string | null;
}

// Session completion tracking
export interface SessionProgress {
  session: number;
  totalExercises: number;
  completedExercises: number;
  exercises: {
    id: string;
    name: string;
    completed: boolean;
  }[];
}
