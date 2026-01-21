// Organization
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentSession: number;
  completionPercent: number;
}

// Session 1 Types
export interface FutureHeadline {
  id: string;
  headline: string;
  timeframe: "1-year" | "2-year" | "3-year";
  category: "member" | "employee" | "business" | "risk";
  createdAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  area: string;
  createdAt: string;
}

export interface DesignPrinciple {
  id: string;
  principle: string;
  isGuardrail: boolean;
  createdAt: string;
}

// Session 2 Types
export interface FrictionPoint {
  id: string;
  processArea: string;
  description: string;
  impactLevel: 1 | 2 | 3 | 4 | 5;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  affectedRoles: string[];
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

// Session 3 Types
export type AgenticPattern = "copilot" | "autonomous" | "crew";

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  description: string;
  currentOwner: string;
  canAgentDo: "yes" | "no" | "assist";
  humanInTheLoop: boolean;
  notes: string;
}

export interface RiskScore {
  govern: number;
  map: number;
  measure: number;
  manage: number;
}

export interface Pilot {
  id: string;
  opportunityId: string;
  aiPattern: AgenticPattern;
  workflowCurrent: WorkflowStep[];
  workflowFuture: WorkflowStep[];
  riskScores: RiskScore;
  charterData: PilotCharter;
}

export interface PilotCharter {
  problemStatement: string;
  successCriteria: string[];
  riskTier: "low" | "medium" | "high";
  initialAutonomyBoundary: string;
  teamMembers: {
    productOwner: string;
    technicalLead: string;
    riskCompliance: string;
  };
}

// Session 4 Types
export interface RoadmapMilestone {
  id: string;
  pilotId: string;
  title: string;
  weekNumber: number;
  owner: string;
  deliverable: string;
  dependencies: string[];
  status: "not-started" | "in-progress" | "completed";
}

export interface RACIEntry {
  id: string;
  activity: string;
  roleAssignments: {
    executiveSponsor: "R" | "A" | "C" | "I" | "";
    aiCoE: "R" | "A" | "C" | "I" | "";
    productOwner: "R" | "A" | "C" | "I" | "";
    technicalLead: "R" | "A" | "C" | "I" | "";
    riskCompliance: "R" | "A" | "C" | "I" | "";
    infoSec: "R" | "A" | "C" | "I" | "";
  };
}

// Workshop State
export interface WorkshopState {
  organization: Organization | null;
  currentSession: number;

  // Session 1
  futureHeadlines: FutureHeadline[];
  opportunities: Opportunity[];
  designPrinciples: DesignPrinciple[];

  // Session 2
  frictionPoints: FrictionPoint[];
  scoredOpportunities: ScoredOpportunity[];

  // Session 3
  pilots: Pilot[];

  // Session 4
  roadmapMilestones: RoadmapMilestone[];
  raciEntries: RACIEntry[];

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
