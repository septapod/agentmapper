"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Clock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOrganization, useCurrentSession, useIcebreakerResponses, useCognitiveBiases, useWorkingPrinciples, useTradeoffs, useFrictionPoints, useScoredOpportunities, useMVPSpecs, usePilotPlans, useRoadmapMilestones, useScalingChecklist, useTrainingPlan, useLessonsLearned, useNextOpportunities } from "@/store/workshop";
import { WorkshopProgressSummary } from "@/components/workshop/WorkshopProgressSummary";

const sessions = [
  {
    number: 1,
    title: "AI Strategy Foundation",
    duration: "2-4 hours",
    description:
      "Build your organization's AI governance foundation. Understand team perspectives, define core principles, and make strategic positioning decisions that will guide all future AI implementation work.",
    exercises: [
      { id: "ai-icebreakers", title: "AI Icebreakers", description: "Team alignment on AI timeline and cognitive biases" },
      { id: "working-principles", title: "Working Principles", description: "Define ethical principles and governance do's/don'ts" },
      { id: "tradeoff-navigator", title: "Tradeoff Navigator", description: "Strategic decisions on control, priority, and communications" },
    ],
  },
  {
    number: 2,
    title: "Find the Friction",
    duration: "3-4 hours",
    description:
      "Map your processes to identify friction points, score opportunities by value and complexity, and use dot voting to prioritize your focus areas.",
    exercises: [
      { id: "friction-map", title: "Friction Mapping", description: "Journey map processes to find pain points" },
      { id: "opportunity-scoring", title: "Opportunity Scoring", description: "Rate opportunities on value and complexity" },
      { id: "priority-matrix", title: "Priority Matrix", description: "Position opportunities on a 2x2 matrix" },
      { id: "dot-voting", title: "Dot Voting", description: "Vote to select top candidates for pilots" },
    ],
  },
  {
    number: 3,
    title: "Design the Pilot",
    duration: "30-45 min",
    description:
      "Organize the work and design your MVP. Define what you'll build, which tools you'll use, where humans stay in the loop, and how you'll measure success.",
    exercises: [
      { id: "mvp-spec", title: "MVP Specification", description: "Design the smallest useful version of your solution" },
    ],
  },
  {
    number: 4,
    title: "Create the 90-Day Roadmap",
    duration: "1 hour",
    description:
      "Plan your pilot, define how you'll gather feedback, and create a 90-day timeline from MVP to scaled solution.",
    exercises: [
      { id: "pilot-plan", title: "Pilot Plan", description: "Define test users, metrics, duration, and stop criteria" },
      { id: "roadmap-builder", title: "90-Day Roadmap", description: "Create your implementation timeline with clear milestones" },
    ],
  },
  {
    number: 5,
    title: "Empower Teams",
    duration: "2-3 hours",
    description:
      "Scale what works across the organization. Document learnings, train staff, establish ownership, and identify the next opportunities for AI-enabled transformation.",
    exercises: [
      { id: "scaling-checklist", title: "Scaling Checklist", description: "Verify readiness to scale: documentation, training, ownership" },
      { id: "training-plan", title: "Training Plan", description: "Define role-based training needs and identify champions" },
      { id: "lessons-learned", title: "Lessons Learned", description: "Capture what worked, what didn't, and recommendations" },
      { id: "next-opportunities", title: "Next Opportunities", description: "Identify patterns to reuse for new friction areas" },
    ],
  },
];

// Compact progress snippet for exercise cards
function getExerciseProgress(exerciseId: string, data: {
  icebreakerResponses: { impactScore: number; optimismScore: number }[];
  biases: { checked: boolean }[];
  workingPrinciples: { dos: string[]; donts: string[] }[];
  tradeoffs: { topic: string; sliderValue: number; rationale: string }[];
  frictionPoints: { processArea: string; priority?: string }[];
  scoredOpportunities: { title: string; quadrant: string; voteCount: number; selectedForPilot: boolean }[];
  mvpSpecs: { scope: string; toolsToUse: string[] }[];
  pilotPlans: { duration: string; testUsers: string[] }[];
  roadmapMilestones: { phase: string }[];
  scalingChecklist: { completed: boolean }[];
  trainingPlan: { role: string }[];
  lessonsLearned: { category: string }[];
  nextOpportunities: { title: string }[];
}): { hasData: boolean; snippet: string; detail?: string } | null {
  switch (exerciseId) {
    case "ai-icebreakers": {
      if (data.icebreakerResponses.length === 0) return null;
      const avgImpact = (data.icebreakerResponses.reduce((sum, r) => sum + r.impactScore, 0) / data.icebreakerResponses.length).toFixed(1);
      const biasCount = data.biases.filter(b => b.checked).length;
      return {
        hasData: true,
        snippet: `${data.icebreakerResponses.length} participant${data.icebreakerResponses.length !== 1 ? 's' : ''}, avg impact ${avgImpact}`,
        detail: biasCount > 0 ? `${biasCount} biases discussed` : undefined
      };
    }
    case "working-principles": {
      if (data.workingPrinciples.length === 0) return null;
      const totalDos = data.workingPrinciples.reduce((sum, p) => sum + p.dos.length, 0);
      const totalDonts = data.workingPrinciples.reduce((sum, p) => sum + p.donts.length, 0);
      return {
        hasData: true,
        snippet: `${data.workingPrinciples.length}/4 principles defined`,
        detail: `${totalDos} do's, ${totalDonts} don'ts`
      };
    }
    case "tradeoff-navigator": {
      const completed = data.tradeoffs.filter(t => t.rationale.trim().length > 0);
      if (completed.length === 0) return null;
      // Find the most decisive tradeoff (furthest from 50)
      const mostDecisive = completed.reduce((best, t) => {
        const decisiveness = Math.abs(t.sliderValue - 50);
        return decisiveness > Math.abs(best.sliderValue - 50) ? t : best;
      }, completed[0]);
      const position = mostDecisive.sliderValue <= 33 ? "left-leaning" : mostDecisive.sliderValue >= 67 ? "right-leaning" : "balanced";
      return {
        hasData: true,
        snippet: `${completed.length}/5 tradeoffs decided`,
        detail: `${mostDecisive.topic}: ${position}`
      };
    }
    case "friction-map": {
      if (data.frictionPoints.length === 0) return null;
      const areas = [...new Set(data.frictionPoints.map(fp => fp.processArea))];
      const highPriority = data.frictionPoints.filter(fp => fp.priority === "high").length;
      return {
        hasData: true,
        snippet: `${data.frictionPoints.length} friction point${data.frictionPoints.length !== 1 ? 's' : ''} found`,
        detail: highPriority > 0 ? `${highPriority} high priority` : areas.slice(0, 2).join(", ")
      };
    }
    case "opportunity-scoring": {
      if (data.scoredOpportunities.length === 0) return null;
      const quickWins = data.scoredOpportunities.filter(o => o.quadrant === "quick-win").length;
      const strategic = data.scoredOpportunities.filter(o => o.quadrant === "strategic").length;
      return {
        hasData: true,
        snippet: `${data.scoredOpportunities.length} opportunities scored`,
        detail: `${quickWins} quick win${quickWins !== 1 ? 's' : ''}, ${strategic} strategic`
      };
    }
    case "priority-matrix": {
      if (data.scoredOpportunities.length === 0) return null;
      const quadrantCounts: Record<string, number> = {};
      data.scoredOpportunities.forEach(o => {
        quadrantCounts[o.quadrant] = (quadrantCounts[o.quadrant] || 0) + 1;
      });
      return {
        hasData: true,
        snippet: "Matrix populated",
        detail: Object.entries(quadrantCounts).map(([k, v]) => `${v} ${k.replace("-", " ")}`).join(", ")
      };
    }
    case "dot-voting": {
      const selected = data.scoredOpportunities.filter(o => o.selectedForPilot);
      const totalVotes = data.scoredOpportunities.reduce((sum, o) => sum + o.voteCount, 0);
      if (totalVotes === 0 && selected.length === 0) return null;
      return {
        hasData: true,
        snippet: selected.length > 0 ? `${selected.length} pilot${selected.length !== 1 ? 's' : ''} selected` : `${totalVotes} total votes`,
        detail: selected.length > 0 ? selected[0].title.slice(0, 30) : undefined
      };
    }
    case "mvp-spec": {
      if (data.mvpSpecs.length === 0) return null;
      const spec = data.mvpSpecs[0];
      return {
        hasData: true,
        snippet: "MVP defined",
        detail: spec.toolsToUse.length > 0 ? `${spec.toolsToUse.length} tool${spec.toolsToUse.length !== 1 ? 's' : ''} selected` : spec.scope.slice(0, 35)
      };
    }
    case "pilot-plan": {
      if (data.pilotPlans.length === 0) return null;
      const plan = data.pilotPlans[0];
      return {
        hasData: true,
        snippet: `${plan.duration} pilot planned`,
        detail: `${plan.testUsers.length} test user${plan.testUsers.length !== 1 ? 's' : ''}`
      };
    }
    case "roadmap-builder": {
      if (data.roadmapMilestones.length === 0) return null;
      const phases = [...new Set(data.roadmapMilestones.map(m => m.phase))];
      return {
        hasData: true,
        snippet: `${data.roadmapMilestones.length} milestone${data.roadmapMilestones.length !== 1 ? 's' : ''} planned`,
        detail: phases.join(" → ")
      };
    }
    case "scaling-checklist": {
      if (data.scalingChecklist.length === 0) return null;
      const completed = data.scalingChecklist.filter(i => i.completed).length;
      const percent = Math.round((completed / data.scalingChecklist.length) * 100);
      return {
        hasData: true,
        snippet: `${percent}% scaling ready`,
        detail: `${completed}/${data.scalingChecklist.length} items complete`
      };
    }
    case "training-plan": {
      if (data.trainingPlan.length === 0) return null;
      return {
        hasData: true,
        snippet: `${data.trainingPlan.length} role${data.trainingPlan.length !== 1 ? 's' : ''} covered`,
        detail: data.trainingPlan.slice(0, 2).map(t => t.role).join(", ")
      };
    }
    case "lessons-learned": {
      if (data.lessonsLearned.length === 0) return null;
      const successes = data.lessonsLearned.filter(l => l.category === "success").length;
      const challenges = data.lessonsLearned.filter(l => l.category === "challenge").length;
      return {
        hasData: true,
        snippet: `${data.lessonsLearned.length} lesson${data.lessonsLearned.length !== 1 ? 's' : ''} captured`,
        detail: `${successes} success${successes !== 1 ? 'es' : ''}, ${challenges} challenge${challenges !== 1 ? 's' : ''}`
      };
    }
    case "next-opportunities": {
      if (data.nextOpportunities.length === 0) return null;
      return {
        hasData: true,
        snippet: `${data.nextOpportunities.length} future opportunit${data.nextOpportunities.length !== 1 ? 'ies' : 'y'}`,
        detail: data.nextOpportunities[0]?.title.slice(0, 35)
      };
    }
    default:
      return null;
  }
}

export default function WorkshopPage() {
  const organization = useOrganization();
  const currentSession = useCurrentSession();

  // Get all data for progress snippets
  const icebreakerResponses = useIcebreakerResponses();
  const biases = useCognitiveBiases();
  const workingPrinciples = useWorkingPrinciples();
  const tradeoffs = useTradeoffs();
  const frictionPoints = useFrictionPoints();
  const scoredOpportunities = useScoredOpportunities();
  const mvpSpecs = useMVPSpecs();
  const pilotPlans = usePilotPlans();
  const roadmapMilestones = useRoadmapMilestones();
  const scalingChecklist = useScalingChecklist();
  const trainingPlan = useTrainingPlan();
  const lessonsLearned = useLessonsLearned();
  const nextOpportunities = useNextOpportunities();

  const progressData = {
    icebreakerResponses,
    biases,
    workingPrinciples,
    tradeoffs,
    frictionPoints,
    scoredOpportunities,
    mvpSpecs,
    pilotPlans,
    roadmapMilestones,
    scalingChecklist,
    trainingPlan,
    lessonsLearned,
    nextOpportunities
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded">
          Workshop Overview
        </span>
        <h1 className="text-3xl font-bold mb-4">
          Welcome, <span className="text-[var(--color-accent)]">{organization?.name}</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg max-w-2xl">
          Your journey to implementing Agentic AI starts here. Work through each session
          in order, completing the exercises to build a comprehensive implementation plan.
        </p>
      </motion.div>

      {/* Workshop Progress Summary */}
      <WorkshopProgressSummary />

      {/* Sessions Grid */}
      <div className="space-y-8">
        {sessions.map((session, index) => {
          const isCompleted = session.number < currentSession;
          const isCurrent = session.number === currentSession;

          return (
            <motion.div
              key={session.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                accent={isCompleted ? "teal" : isCurrent ? "yellow" : "none"}
                hoverable
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                          ${
                            isCompleted
                              ? "bg-[var(--color-accent-teal)] text-[var(--color-bg)]"
                              : isCurrent
                              ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                              : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          session.number
                        )}
                      </div>
                      <div>
                        <CardTitle as="h2">{session.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          {session.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <Link href={session.number === 0 ? "/workshop/onboarding" : `/workshop/session-${session.number}`}>
                      <Button
                        variant={isCurrent ? "primary" : "default"}
                        size="sm"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-[var(--color-text-body)] mb-6">{session.description}</p>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {session.exercises.map((exercise) => {
                      const progress = getExerciseProgress(exercise.id, progressData);
                      const hasProgress = progress?.hasData;

                      return (
                        <Link
                          key={exercise.id}
                          href={`/workshop/session-${session.number}/${exercise.id}`}
                        >
                          <div
                            className={`
                              p-3 rounded-lg border transition-all h-full
                              ${
                                hasProgress
                                  ? "border-[var(--color-accent-teal)]/30 bg-[var(--color-accent-teal)]/5 hover:border-[var(--color-accent-teal)]/50"
                                  : "border-white/[0.08] bg-[var(--color-bg)] hover:border-white/[0.15] hover:bg-[var(--color-surface)]"
                              }
                            `}
                          >
                            <div className="flex items-start gap-2">
                              {hasProgress ? (
                                <Check className="w-4 h-4 mt-0.5 text-[var(--color-accent-teal)]" />
                              ) : (
                                <Circle className="w-4 h-4 mt-0.5 text-[var(--color-text-muted)]" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${hasProgress ? "text-[var(--color-accent-teal)]" : "text-[var(--color-text)]"}`}>
                                  {exercise.title}
                                </p>
                                {hasProgress ? (
                                  <div className="mt-1">
                                    <p className="text-xs text-[var(--color-text)]">
                                      {progress.snippet}
                                    </p>
                                    {progress.detail && (
                                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                                        {progress.detail}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                    {exercise.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Link href={`/workshop/session-${currentSession}`}>
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {currentSession === 1 ? "Start Session 1" : `Continue Session ${currentSession}`}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
