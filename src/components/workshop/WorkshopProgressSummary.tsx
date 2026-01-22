"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import { useIcebreakerResponses, useWorkingPrinciples, useTradeoffs, useFrictionPoints, useScoredOpportunities, useMVPSpecs, usePilotPlans, useRoadmapMilestones, useScalingChecklist, useLessonsLearned, useNextOpportunities } from "@/store/workshop";

// Helper to truncate text
const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export function WorkshopProgressSummary() {
  // Session 1 data
  const icebreakerResponses = useIcebreakerResponses();
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
  const lessonsLearned = useLessonsLearned();
  const nextOpportunities = useNextOpportunities();

  // Check session completion
  const session1HasData = icebreakerResponses.length > 0 || workingPrinciples.length > 0 || tradeoffs.some(t => t.rationale.trim().length > 0);
  const session2HasData = frictionPoints.length > 0 || scoredOpportunities.length > 0;
  const session3HasData = mvpSpecs.length > 0;
  const session4HasData = pilotPlans.length > 0 || roadmapMilestones.length > 0;
  const session5HasData = scalingChecklist.length > 0 || lessonsLearned.length > 0 || nextOpportunities.length > 0;

  // If no data at all, don't show summary
  if (!session1HasData && !session2HasData && !session3HasData && !session4HasData && !session5HasData) {
    return null;
  }

  interface SessionMilestone {
    sessionNum: number;
    title: string;
    hasData: boolean;
    keyDecision?: string;
    subDetail?: string;
  }

  const milestones: SessionMilestone[] = [];

  // Session 1 milestone
  if (session1HasData) {
    let keyDecision = "";
    let subDetail = "";

    if (workingPrinciples.length > 0) {
      keyDecision = `${workingPrinciples.length}/4 AI principles defined`;
      if (workingPrinciples[0].dos.length > 0) {
        subDetail = truncate(workingPrinciples[0].dos[0], 40);
      }
    } else if (tradeoffs.some(t => t.rationale.trim().length > 0)) {
      const controlTradeoff = tradeoffs.find(t => t.topic === "control");
      if (controlTradeoff) {
        const position = controlTradeoff.sliderValue <= 33 ? "AI-driven" : controlTradeoff.sliderValue >= 67 ? "Human-controlled" : "Balanced";
        keyDecision = `Control: ${position}`;
      }
    } else if (icebreakerResponses.length > 0) {
      keyDecision = `${icebreakerResponses.length} team perspectives gathered`;
    }

    milestones.push({
      sessionNum: 1,
      title: "AI Principles Defined",
      hasData: true,
      keyDecision,
      subDetail,
    });
  }

  // Session 2 milestone
  if (session2HasData) {
    let keyDecision = "";
    let subDetail = "";

    const selectedPilots = scoredOpportunities.filter(o => o.selectedForPilot);
    if (selectedPilots.length > 0) {
      keyDecision = `Pilot selected: ${truncate(selectedPilots[0].title, 35)}`;
      subDetail = `${selectedPilots[0].voteCount} votes`;
    } else if (frictionPoints.length > 0) {
      const areas = [...new Set(frictionPoints.map(fp => fp.processArea))];
      keyDecision = `${frictionPoints.length} friction points identified`;
      subDetail = areas.slice(0, 2).join(", ");
    }

    milestones.push({
      sessionNum: 2,
      title: "Friction Identified",
      hasData: true,
      keyDecision,
      subDetail,
    });
  }

  // Session 3 milestone
  if (session3HasData) {
    const spec = mvpSpecs[0];
    milestones.push({
      sessionNum: 3,
      title: "MVP Designed",
      hasData: true,
      keyDecision: truncate(spec.scope, 45),
      subDetail: spec.toolsToUse.length > 0 ? `Tools: ${spec.toolsToUse.slice(0, 2).join(", ")}` : undefined,
    });
  }

  // Session 4 milestone
  if (session4HasData) {
    let keyDecision = "";
    let subDetail = "";

    if (roadmapMilestones.length > 0) {
      keyDecision = `${roadmapMilestones.length} roadmap milestones planned`;
      const phases = [...new Set(roadmapMilestones.map(m => m.phase))];
      subDetail = phases.join(" → ");
    } else if (pilotPlans.length > 0) {
      const plan = pilotPlans[0];
      keyDecision = `${plan.duration} pilot with ${plan.testUsers.length} users`;
    }

    milestones.push({
      sessionNum: 4,
      title: "Roadmap Created",
      hasData: true,
      keyDecision,
      subDetail,
    });
  }

  // Session 5 milestone
  if (session5HasData) {
    let keyDecision = "";
    let subDetail = "";

    if (scalingChecklist.length > 0) {
      const completed = scalingChecklist.filter(i => i.completed).length;
      const percent = Math.round((completed / scalingChecklist.length) * 100);
      keyDecision = `${percent}% scaling ready`;
    }
    if (nextOpportunities.length > 0) {
      subDetail = `${nextOpportunities.length} future opportunities identified`;
    }

    milestones.push({
      sessionNum: 5,
      title: "Teams Empowered",
      hasData: true,
      keyDecision,
      subDetail,
    });
  }

  if (milestones.length === 0) return null;

  return (
    <div className="bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
        Your Progress
      </p>

      <div className="flex flex-wrap items-start gap-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.sessionNum} className="flex items-start gap-3">
            {/* Milestone indicator */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-teal)]/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-teal)]" />
              </div>
            </div>

            {/* Milestone content */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)]">
                Session {milestone.sessionNum}: {milestone.title}
              </p>
              {milestone.keyDecision && (
                <p className="text-sm text-[var(--color-text-body)] mt-0.5">
                  {milestone.keyDecision}
                </p>
              )}
              {milestone.subDetail && (
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {milestone.subDetail}
                </p>
              )}
            </div>

            {/* Arrow separator (not after last item) */}
            {index < milestones.length - 1 && (
              <div className="hidden md:flex items-center px-2 pt-2">
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
