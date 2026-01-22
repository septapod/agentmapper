"use client";

import { useIcebreakerResponses, useCognitiveBiases, useWorkingPrinciples, useTradeoffs, useFrictionPoints, useScoredOpportunities, useMVPSpecs, usePilotPlans, useRoadmapMilestones, useScalingChecklist, useTrainingPlan, useLessonsLearned, useNextOpportunities } from "@/store/workshop";

// Helper to truncate text with ellipsis
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

// Mapping for principle types to human-readable labels
const principleLabels: Record<string, string> = {
  "human-centered": "Human-Centered",
  "control-accountability": "Control & Accountability",
  "observability-explainability": "Observability & Explainability",
  "improvement-responsiveness": "Improvement & Responsiveness",
};

// Mapping for scored opportunity quadrants
const quadrantLabels: Record<string, string> = {
  "quick-win": "Quick Win",
  "strategic": "Strategic",
  "fill-in": "Fill-In",
  "deprioritize": "Deprioritize",
};

interface ExerciseDataSummaryProps {
  exerciseId: string;
  variant?: "compact" | "full";
}

export function ExerciseDataSummary({ exerciseId, variant = "compact" }: ExerciseDataSummaryProps) {
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

  switch (exerciseId) {
    // ===== SESSION 1 EXERCISES =====
    case "ai-icebreakers": {
      if (icebreakerResponses.length === 0) return null;
      const selectedBiases = biases.filter(b => b.checked);

      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Team Perspectives ({icebreakerResponses.length} participants)
            </p>
            <div className="space-y-2">
              {icebreakerResponses.slice(0, variant === "compact" ? 3 : undefined).map((resp) => (
                <div key={resp.id} className="flex items-center justify-between bg-[var(--color-bg)] rounded p-2">
                  <span className="font-medium text-sm">{resp.participantName}</span>
                  <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
                    <span>Impact: <span className="text-[var(--color-text)]">{resp.impactScore}/4</span></span>
                    <span>Optimism: <span className="text-[var(--color-text)]">{resp.optimismScore}/4</span></span>
                  </div>
                </div>
              ))}
              {variant === "compact" && icebreakerResponses.length > 3 && (
                <p className="text-xs text-[var(--color-text-muted)]">+{icebreakerResponses.length - 3} more participants</p>
              )}
            </div>
          </div>

          {selectedBiases.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Biases Discussed
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedBiases.slice(0, variant === "compact" ? 4 : undefined).map((bias) => (
                  <span key={bias.id} className="px-2 py-0.5 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded">
                    {bias.name}
                  </span>
                ))}
                {variant === "compact" && selectedBiases.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-[var(--color-text-muted)]">+{selectedBiases.length - 4} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    case "working-principles": {
      if (workingPrinciples.length === 0) return null;

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            AI Governance Principles ({workingPrinciples.length}/4 defined)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {workingPrinciples.slice(0, variant === "compact" ? 2 : undefined).map((principle) => (
              <div key={principle.id} className="bg-[var(--color-bg)] rounded p-3">
                <p className="font-medium text-sm text-[var(--color-accent)] mb-1">
                  {principleLabels[principle.principleType] || principle.principleType}
                </p>
                {principle.dos.length > 0 && (
                  <p className="text-xs text-[var(--color-text-body)]">
                    <span className="text-[var(--color-accent-teal)]">Do:</span> {truncate(principle.dos[0], 60)}
                  </p>
                )}
                {principle.donts.length > 0 && (
                  <p className="text-xs text-[var(--color-text-body)]">
                    <span className="text-[var(--color-accent-coral)]">Don't:</span> {truncate(principle.donts[0], 60)}
                  </p>
                )}
              </div>
            ))}
            {variant === "compact" && workingPrinciples.length > 2 && (
              <p className="text-xs text-[var(--color-text-muted)]">+{workingPrinciples.length - 2} more principles</p>
            )}
          </div>
        </div>
      );
    }

    case "tradeoff-navigator": {
      const completedTradeoffs = tradeoffs.filter(t => t.rationale.trim().length > 0);
      if (completedTradeoffs.length === 0) return null;

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Strategic Positions ({completedTradeoffs.length}/5 defined)
          </p>
          <div className="space-y-2">
            {completedTradeoffs.slice(0, variant === "compact" ? 3 : undefined).map((tradeoff) => {
              const labels = tradeoffLabels[tradeoff.topic] || { left: "Left", right: "Right" };
              const position = tradeoff.sliderValue <= 33 ? labels.left : tradeoff.sliderValue >= 67 ? labels.right : "Balanced";

              return (
                <div key={tradeoff.id} className="bg-[var(--color-bg)] rounded p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{tradeoff.topic.replace("-", " ")}</span>
                    <span className="text-xs px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded">
                      {position}
                    </span>
                  </div>
                  {/* Slider visualization */}
                  <div className="w-full h-1.5 bg-[var(--color-surface)] rounded-full relative">
                    <div
                      className="absolute top-0 h-1.5 w-2 bg-[var(--color-accent)] rounded-full"
                      style={{ left: `calc(${tradeoff.sliderValue}% - 4px)` }}
                    />
                  </div>
                </div>
              );
            })}
            {variant === "compact" && completedTradeoffs.length > 3 && (
              <p className="text-xs text-[var(--color-text-muted)]">+{completedTradeoffs.length - 3} more positions</p>
            )}
          </div>
        </div>
      );
    }

    // ===== SESSION 2 EXERCISES =====
    case "friction-map": {
      if (frictionPoints.length === 0) return null;

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Friction Points Identified ({frictionPoints.length})
          </p>
          <div className="space-y-2">
            {frictionPoints.slice(0, variant === "compact" ? 3 : undefined).map((fp) => (
              <div key={fp.id} className="bg-[var(--color-bg)] rounded p-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs px-2 py-0.5 bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] rounded mr-2">
                      {fp.processArea}
                    </span>
                    <p className="text-sm text-[var(--color-text-body)] mt-1">{truncate(fp.description, 80)}</p>
                  </div>
                  {fp.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded ml-2 ${
                      fp.priority === "high" ? "bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]" :
                      fp.priority === "medium" ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]" :
                      "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                    }`}>
                      {fp.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {variant === "compact" && frictionPoints.length > 3 && (
              <p className="text-xs text-[var(--color-text-muted)]">+{frictionPoints.length - 3} more friction points</p>
            )}
          </div>
        </div>
      );
    }

    case "opportunity-scoring": {
      if (scoredOpportunities.length === 0) return null;

      // Sort by value score descending
      const topOpportunities = [...scoredOpportunities]
        .sort((a, b) => b.valueScore - a.valueScore);

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Opportunities Scored ({scoredOpportunities.length})
          </p>
          <div className="space-y-2">
            {topOpportunities.slice(0, variant === "compact" ? 3 : undefined).map((opp) => (
              <div key={opp.id} className="bg-[var(--color-bg)] rounded p-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium">{truncate(opp.title, 50)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    opp.quadrant === "quick-win" ? "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]" :
                    opp.quadrant === "strategic" ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]" :
                    "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                  }`}>
                    {quadrantLabels[opp.quadrant]}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-[var(--color-text-muted)]">
                  <span>Value: <span className="text-[var(--color-text)]">{opp.valueScore}/5</span></span>
                  <span>Complexity: <span className="text-[var(--color-text)]">{opp.complexityScore}/5</span></span>
                </div>
              </div>
            ))}
            {variant === "compact" && scoredOpportunities.length > 3 && (
              <p className="text-xs text-[var(--color-text-muted)]">+{scoredOpportunities.length - 3} more opportunities</p>
            )}
          </div>
        </div>
      );
    }

    case "priority-matrix": {
      if (scoredOpportunities.length === 0) return null;

      // Count by quadrant
      const quadrantCounts = scoredOpportunities.reduce((acc, opp) => {
        acc[opp.quadrant] = (acc[opp.quadrant] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Priority Distribution
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(quadrantLabels).map(([key, label]) => (
              <div key={key} className={`bg-[var(--color-bg)] rounded p-2 text-center ${
                key === "quick-win" ? "border border-[var(--color-accent-teal)]/30" :
                key === "strategic" ? "border border-[var(--color-accent)]/30" :
                ""
              }`}>
                <p className="text-lg font-bold text-[var(--color-text)]">{quadrantCounts[key] || 0}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "dot-voting": {
      const selectedPilots = scoredOpportunities.filter(o => o.selectedForPilot);
      const topVoted = [...scoredOpportunities].sort((a, b) => b.voteCount - a.voteCount);

      if (topVoted.length === 0 || topVoted.every(o => o.voteCount === 0)) return null;

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            {selectedPilots.length > 0 ? `Selected for Pilot (${selectedPilots.length})` : "Top Voted Options"}
          </p>
          <div className="space-y-2">
            {(selectedPilots.length > 0 ? selectedPilots : topVoted.slice(0, 3)).map((opp) => (
              <div key={opp.id} className="bg-[var(--color-bg)] rounded p-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{truncate(opp.title, 45)}</p>
                  <span className="flex items-center gap-1 text-sm">
                    <span className="text-[var(--color-accent)]">{opp.voteCount}</span>
                    <span className="text-[var(--color-text-muted)]">votes</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ===== SESSION 3 EXERCISES =====
    case "pattern-matching":
    case "future-state-workflow":
    case "risk-governance":
    case "mvp-charter": {
      // These are stub exercises - show coming soon
      return (
        <div className="bg-[var(--color-surface-hover)] rounded p-3 text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Exercise under development</p>
        </div>
      );
    }

    case "mvp-spec": {
      if (mvpSpecs.length === 0) return null;
      const spec = mvpSpecs[0]; // Usually there's one MVP spec

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            MVP Specification
          </p>
          <div className="bg-[var(--color-bg)] rounded p-3 space-y-2">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Scope</p>
              <p className="text-sm">{truncate(spec.scope, 100)}</p>
            </div>
            {spec.toolsToUse.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Tools</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {spec.toolsToUse.slice(0, 3).map((tool, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded">
                      {tool}
                    </span>
                  ))}
                  {spec.toolsToUse.length > 3 && (
                    <span className="text-xs text-[var(--color-text-muted)]">+{spec.toolsToUse.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
            {spec.humanCheckpoints.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Human Checkpoints</p>
                <p className="text-sm">{truncate(spec.humanCheckpoints[0], 60)}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ===== SESSION 4 EXERCISES =====
    case "pilot-plan": {
      if (pilotPlans.length === 0) return null;
      const plan = pilotPlans[0];

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Pilot Plan
          </p>
          <div className="bg-[var(--color-bg)] rounded p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">Duration</span>
              <span className="text-sm font-medium">{plan.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">Test Users</span>
              <span className="text-sm">{plan.testUsers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">Metrics</span>
              <span className="text-sm">{plan.metricsToTrack.length}</span>
            </div>
          </div>
        </div>
      );
    }

    case "roadmap-builder": {
      if (roadmapMilestones.length === 0) return null;

      // Group by phase
      const phaseGroups = roadmapMilestones.reduce((acc, m) => {
        acc[m.phase] = (acc[m.phase] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            90-Day Roadmap ({roadmapMilestones.length} milestones)
          </p>
          <div className="flex gap-2">
            {["build", "pilot", "refine", "scale"].map((phase) => (
              phaseGroups[phase] ? (
                <div key={phase} className="flex-1 bg-[var(--color-bg)] rounded p-2 text-center">
                  <p className="text-lg font-bold">{phaseGroups[phase]}</p>
                  <p className="text-xs text-[var(--color-text-muted)] capitalize">{phase}</p>
                </div>
              ) : null
            ))}
          </div>
        </div>
      );
    }

    // ===== SESSION 5 EXERCISES =====
    case "scaling-checklist": {
      const completedItems = scalingChecklist.filter(i => i.completed);
      if (scalingChecklist.length === 0) return null;

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Scaling Readiness
          </p>
          <div className="bg-[var(--color-bg)] rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">{completedItems.length}/{scalingChecklist.length} items complete</span>
              <span className="text-sm font-medium">{Math.round((completedItems.length / scalingChecklist.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-surface)] rounded-full">
              <div
                className="h-2 bg-[var(--color-accent-teal)] rounded-full transition-all"
                style={{ width: `${(completedItems.length / scalingChecklist.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      );
    }

    case "training-plan": {
      if (trainingPlan.length === 0) return null;

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Training Plan ({trainingPlan.length} roles)
          </p>
          <div className="space-y-2">
            {trainingPlan.slice(0, variant === "compact" ? 2 : undefined).map((entry) => (
              <div key={entry.id} className="bg-[var(--color-bg)] rounded p-2">
                <p className="text-sm font-medium">{entry.role}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{entry.trainingNeeds.length} training needs identified</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "lessons-learned": {
      if (lessonsLearned.length === 0) return null;

      const categoryCounts = lessonsLearned.reduce((acc, l) => {
        acc[l.category] = (acc[l.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Lessons Documented ({lessonsLearned.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <span key={category} className={`px-2 py-1 text-xs rounded ${
                category === "success" ? "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]" :
                category === "challenge" ? "bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]" :
                "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
              }`}>
                {count} {category}
              </span>
            ))}
          </div>
        </div>
      );
    }

    case "next-opportunities": {
      if (nextOpportunities.length === 0) return null;

      // Sort by priority
      const sortedOpps = [...nextOpportunities].sort((a, b) => a.priority - b.priority);

      return (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            Future Opportunities ({nextOpportunities.length})
          </p>
          <div className="space-y-2">
            {sortedOpps.slice(0, variant === "compact" ? 2 : undefined).map((opp) => (
              <div key={opp.id} className="bg-[var(--color-bg)] rounded p-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{truncate(opp.title, 40)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    opp.estimatedValue === "high" ? "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]" :
                    opp.estimatedValue === "medium" ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]" :
                    "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                  }`}>
                    {opp.estimatedValue} value
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">{opp.domain}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// Export a helper to check if an exercise has data
export function hasExerciseData(exerciseId: string, data: {
  icebreakerResponses: unknown[];
  workingPrinciples: unknown[];
  tradeoffs: { rationale: string }[];
  frictionPoints: unknown[];
  scoredOpportunities: unknown[];
  mvpSpecs: unknown[];
  pilotPlans: unknown[];
  roadmapMilestones: unknown[];
  scalingChecklist: unknown[];
  trainingPlan: unknown[];
  lessonsLearned: unknown[];
  nextOpportunities: unknown[];
}): boolean {
  switch (exerciseId) {
    case "ai-icebreakers":
      return data.icebreakerResponses.length > 0;
    case "working-principles":
      return data.workingPrinciples.length > 0;
    case "tradeoff-navigator":
      return data.tradeoffs.some(t => t.rationale.trim().length > 0);
    case "friction-map":
      return data.frictionPoints.length > 0;
    case "opportunity-scoring":
    case "priority-matrix":
    case "dot-voting":
      return data.scoredOpportunities.length > 0;
    case "mvp-spec":
      return data.mvpSpecs.length > 0;
    case "pilot-plan":
      return data.pilotPlans.length > 0;
    case "roadmap-builder":
      return data.roadmapMilestones.length > 0;
    case "scaling-checklist":
      return data.scalingChecklist.length > 0;
    case "training-plan":
      return data.trainingPlan.length > 0;
    case "lessons-learned":
      return data.lessonsLearned.length > 0;
    case "next-opportunities":
      return data.nextOpportunities.length > 0;
    default:
      return false;
  }
}
