"use client";

import { useIcebreakerResponses, useCognitiveBiases, useWorkingPrinciples, useTradeoffs, useFrictionPoints, useScoredOpportunities, useMVPSpecs, usePilotPlans, useRoadmapMilestones, useScalingChecklist, useTrainingPlan, useLessonsLearned, useNextOpportunities } from "@/store/workshop";

// Helper to truncate text
const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

// Mapping for tradeoff topics to human-readable labels
const tradeoffLabels: Record<string, { left: string; right: string }> = {
  "control": { left: "AI Decides", right: "Human Control" },
  "priority": { left: "Productivity", right: "Quality" },
  "users": { left: "Limited Users", right: "All Users" },
  "external-comms": { left: "Not Disclosed", right: "Fully Disclosed" },
  "internal-comms": { left: "Need-to-Know", right: "Open" },
};

// Mapping for principle types
const principleLabels: Record<string, string> = {
  "human-centered": "Human-Centered",
  "control-accountability": "Control & Accountability",
  "observability-explainability": "Observability",
  "improvement-responsiveness": "Improvement",
};

interface SessionSummaryProps {
  sessionNumber: 1 | 2 | 3 | 4 | 5;
}

export function SessionSummary({ sessionNumber }: SessionSummaryProps) {
  // Session 1 data
  const icebreakerResponses = useIcebreakerResponses();
  const biases = useCognitiveBiases();
  const workingPrinciples = useWorkingPrinciples();
  const tradeoffs = useTradeoffs();

  // Session 2 data
  const frictionPoints = useFrictionPoints();
  const scoredOpportunities = useScoredOpportunities();

  // Session 3 data
  const mvpSpecs = useMVPSpecs();

  // Session 4 data
  const pilotPlans = usePilotPlans();
  const roadmapMilestones = useRoadmapMilestones();

  // Session 5 data
  const scalingChecklist = useScalingChecklist();
  const trainingPlan = useTrainingPlan();
  const lessonsLearned = useLessonsLearned();
  const nextOpportunities = useNextOpportunities();

  // Check if session has any data
  const hasSessionData = (): boolean => {
    switch (sessionNumber) {
      case 1:
        return icebreakerResponses.length > 0 || workingPrinciples.length > 0 || tradeoffs.some(t => t.rationale.trim().length > 0);
      case 2:
        return frictionPoints.length > 0 || scoredOpportunities.length > 0;
      case 3:
        return mvpSpecs.length > 0;
      case 4:
        return pilotPlans.length > 0 || roadmapMilestones.length > 0;
      case 5:
        return scalingChecklist.length > 0 || trainingPlan.length > 0 || lessonsLearned.length > 0 || nextOpportunities.length > 0;
      default:
        return false;
    }
  };

  if (!hasSessionData()) return null;

  const renderSession1Summary = () => {
    const items: React.ReactNode[] = [];

    // Team perspectives
    if (icebreakerResponses.length > 0) {
      const avgImpact = icebreakerResponses.reduce((sum, r) => sum + r.impactScore, 0) / icebreakerResponses.length;
      const avgOptimism = icebreakerResponses.reduce((sum, r) => sum + r.optimismScore, 0) / icebreakerResponses.length;
      items.push(
        <div key="perspectives" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Team Views:</span>
          <span className="font-medium">
            {avgImpact >= 2.5 ? "High" : "Moderate"} impact expectation, {avgOptimism >= 2.5 ? "Optimistic" : "Cautious"} outlook
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">({icebreakerResponses.length} participants)</span>
        </div>
      );
    }

    // Key principle
    if (workingPrinciples.length > 0) {
      const firstPrinciple = workingPrinciples[0];
      items.push(
        <div key="principles" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Governance:</span>
          <span className="font-medium">{workingPrinciples.length}/4 principles defined</span>
          {firstPrinciple.dos.length > 0 && (
            <span className="text-xs text-[var(--color-text-muted)]">
              ({principleLabels[firstPrinciple.principleType]}: "{truncate(firstPrinciple.dos[0], 30)}")
            </span>
          )}
        </div>
      );
    }

    // Key tradeoff position
    const completedTradeoffs = tradeoffs.filter(t => t.rationale.trim().length > 0);
    if (completedTradeoffs.length > 0) {
      const controlTradeoff = completedTradeoffs.find(t => t.topic === "control");
      if (controlTradeoff) {
        const position = controlTradeoff.sliderValue <= 33 ? "AI-driven" : controlTradeoff.sliderValue >= 67 ? "Human-controlled" : "Balanced";
        items.push(
          <div key="tradeoffs" className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-text-muted)]">Control:</span>
            <span className="font-medium">{position}</span>
            <span className="text-xs text-[var(--color-text-muted)]">({completedTradeoffs.length}/5 positions defined)</span>
          </div>
        );
      }
    }

    return items;
  };

  const renderSession2Summary = () => {
    const items: React.ReactNode[] = [];

    // Friction points
    if (frictionPoints.length > 0) {
      const areas = [...new Set(frictionPoints.map(fp => fp.processArea))];
      items.push(
        <div key="friction" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Friction:</span>
          <span className="font-medium">{frictionPoints.length} points in {areas.slice(0, 2).join(", ")}{areas.length > 2 ? ` +${areas.length - 2} more` : ""}</span>
        </div>
      );
    }

    // Top opportunity
    if (scoredOpportunities.length > 0) {
      const quickWins = scoredOpportunities.filter(o => o.quadrant === "quick-win");
      const selectedPilots = scoredOpportunities.filter(o => o.selectedForPilot);

      if (selectedPilots.length > 0) {
        items.push(
          <div key="pilot" className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-text-muted)]">Selected Pilot:</span>
            <span className="font-medium">{truncate(selectedPilots[0].title, 40)}</span>
            {selectedPilots.length > 1 && <span className="text-xs text-[var(--color-text-muted)]">(+{selectedPilots.length - 1} more)</span>}
          </div>
        );
      } else if (quickWins.length > 0) {
        items.push(
          <div key="quickwin" className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-text-muted)]">Top Quick Win:</span>
            <span className="font-medium">{truncate(quickWins[0].title, 40)}</span>
          </div>
        );
      }
    }

    return items;
  };

  const renderSession3Summary = () => {
    const items: React.ReactNode[] = [];

    if (mvpSpecs.length > 0) {
      const spec = mvpSpecs[0];
      items.push(
        <div key="scope" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">MVP Scope:</span>
          <span className="font-medium">{truncate(spec.scope, 50)}</span>
        </div>
      );

      if (spec.toolsToUse.length > 0) {
        items.push(
          <div key="tools" className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-text-muted)]">Tools:</span>
            <span className="font-medium">{spec.toolsToUse.slice(0, 3).join(", ")}{spec.toolsToUse.length > 3 ? ` +${spec.toolsToUse.length - 3}` : ""}</span>
          </div>
        );
      }

      if (spec.humanCheckpoints.length > 0) {
        items.push(
          <div key="checkpoints" className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-text-muted)]">Human Checkpoints:</span>
            <span className="font-medium">{spec.humanCheckpoints.length} defined</span>
          </div>
        );
      }
    }

    return items;
  };

  const renderSession4Summary = () => {
    const items: React.ReactNode[] = [];

    if (pilotPlans.length > 0) {
      const plan = pilotPlans[0];
      items.push(
        <div key="pilot" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Pilot:</span>
          <span className="font-medium">{plan.duration} with {plan.testUsers.length} test users</span>
        </div>
      );
    }

    if (roadmapMilestones.length > 0) {
      const phases = [...new Set(roadmapMilestones.map(m => m.phase))];
      items.push(
        <div key="roadmap" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Roadmap:</span>
          <span className="font-medium">{roadmapMilestones.length} milestones across {phases.join(", ")}</span>
        </div>
      );
    }

    return items;
  };

  const renderSession5Summary = () => {
    const items: React.ReactNode[] = [];

    if (scalingChecklist.length > 0) {
      const completed = scalingChecklist.filter(i => i.completed).length;
      const percent = Math.round((completed / scalingChecklist.length) * 100);
      items.push(
        <div key="scaling" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Scaling Readiness:</span>
          <span className="font-medium">{percent}% complete</span>
          <span className="text-xs text-[var(--color-text-muted)]">({completed}/{scalingChecklist.length} items)</span>
        </div>
      );
    }

    if (lessonsLearned.length > 0) {
      const successes = lessonsLearned.filter(l => l.category === "success").length;
      items.push(
        <div key="lessons" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Lessons:</span>
          <span className="font-medium">{lessonsLearned.length} documented ({successes} successes)</span>
        </div>
      );
    }

    if (nextOpportunities.length > 0) {
      const highValue = nextOpportunities.filter(o => o.estimatedValue === "high").length;
      items.push(
        <div key="opportunities" className="flex items-center gap-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Pipeline:</span>
          <span className="font-medium">{nextOpportunities.length} opportunities ({highValue} high-value)</span>
        </div>
      );
    }

    return items;
  };

  const renderSummary = () => {
    switch (sessionNumber) {
      case 1: return renderSession1Summary();
      case 2: return renderSession2Summary();
      case 3: return renderSession3Summary();
      case 4: return renderSession4Summary();
      case 5: return renderSession5Summary();
      default: return null;
    }
  };

  const summaryItems = renderSummary();
  if (!summaryItems || (Array.isArray(summaryItems) && summaryItems.length === 0)) return null;

  return (
    <div className="bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg p-4 mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
        Session Summary
      </p>
      <div className="space-y-2">
        {summaryItems}
      </div>
    </div>
  );
}
