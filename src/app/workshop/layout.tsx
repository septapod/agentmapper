"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ChevronRight, Printer, Clock } from "lucide-react";
import { useOrganization, useIcebreakerResponses, useCognitiveBiases, useWorkingPrinciples, useTradeoffs, useFrictionPoints, useScoredOpportunities, useMVPSpecs, usePilotPlans, useRoadmapMilestones, useScalingChecklist, useTrainingPlan, useLessonsLearned, useNextOpportunities, useWorkshopStore } from "@/store/workshop";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CloudSyncPanel } from "@/components/workshop/CloudSyncPanel";
import { useEffect, useMemo } from "react";

const sessions = [
  {
    number: 1,
    title: "AI Strategy Foundation",
    exercises: [
      { id: "ai-icebreakers", title: "AI Icebreakers" },
      { id: "working-principles", title: "Working Principles" },
      { id: "tradeoff-navigator", title: "Tradeoff Navigator" },
    ],
  },
  {
    number: 2,
    title: "Find the Friction",
    exercises: [
      { id: "friction-map", title: "Friction Map" },
      { id: "opportunity-scoring", title: "Opportunity Scoring" },
      { id: "priority-matrix", title: "Priority Matrix" },
      { id: "dot-voting", title: "Dot Voting" },
    ],
  },
  {
    number: 3,
    title: "Organize the Work",
    exercises: [
      { id: "pattern-matching", title: "Pattern Matching" },
      { id: "future-state-workflow", title: "Workflow Design" },
      { id: "risk-governance", title: "Risk Assessment" },
      { id: "mvp-charter", title: "MVP Charter" },
    ],
  },
  {
    number: 4,
    title: "Roadmap & Governance",
    exercises: [
      { id: "roadmap-builder", title: "90-Day Roadmap" },
      { id: "raci-matrix", title: "RACI Matrix" },
      { id: "governance", title: "Governance" },
    ],
  },
  {
    number: 5,
    title: "Empower Teams",
    exercises: [
      { id: "scaling-checklist", title: "Scaling Checklist" },
      { id: "training-plan", title: "Training Plan" },
      { id: "lessons-learned", title: "Lessons Learned" },
      { id: "next-opportunities", title: "Next Opportunities" },
    ],
  },
];

// Helper to format time ago
function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const organization = useOrganization();

  // Get all data for progress calculation
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
  const lastSaved = useWorkshopStore((state) => state.lastSaved);

  // Redirect if no organization
  useEffect(() => {
    if (!organization) {
      router.push("/");
    }
  }, [organization, router]);

  // Calculate overall progress based on "has data" (guided freedom model)
  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const exerciseStatus: Record<string, boolean> = {
      // Session 1
      "ai-icebreakers": icebreakerResponses.length > 0,
      "working-principles": workingPrinciples.length > 0,
      "tradeoff-navigator": tradeoffs.some(t => t.rationale.length > 0),
      // Session 2
      "friction-map": frictionPoints.length > 0,
      "opportunity-scoring": scoredOpportunities.length > 0,
      "priority-matrix": scoredOpportunities.length > 0,
      "dot-voting": scoredOpportunities.some(o => o.selectedForPilot),
      // Session 3
      "pattern-matching": false, // Not implemented
      "future-state-workflow": false, // Not implemented
      "risk-governance": false, // Not implemented
      "mvp-charter": mvpSpecs.length > 0,
      // Session 4
      "roadmap-builder": roadmapMilestones.length > 0,
      "raci-matrix": false, // Not implemented
      "governance": false, // Not implemented
      // Session 5
      "scaling-checklist": scalingChecklist.some(i => i.completed),
      "training-plan": trainingPlan.length > 0,
      "lessons-learned": lessonsLearned.length > 0,
      "next-opportunities": nextOpportunities.length > 0,
    };

    const completed = Object.values(exerciseStatus).filter(Boolean).length;
    const total = Object.keys(exerciseStatus).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completedCount: completed, totalCount: total, progressPercent: percent };
  }, [icebreakerResponses, workingPrinciples, tradeoffs, frictionPoints, scoredOpportunities, mvpSpecs, roadmapMilestones, scalingChecklist, trainingPlan, lessonsLearned, nextOpportunities]);

  if (!organization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--color-surface)] border-r border-white/[0.08] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08]">
          <Link href="/" className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <h2 className="mt-4 text-lg font-semibold text-[var(--color-text)]">
            {organization.name}
          </h2>
          <div className="mt-2">
            <ProgressBar value={progressPercent} size="sm" showLabel />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-[var(--color-text-muted)]">
                {completedCount}/{totalCount} exercises
              </span>
              {lastSaved && (
                <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(lastSaved)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {sessions.map((session) => (
            <div key={session.number} className="mb-6">
              <Link
                href={`/workshop/session-${session.number}`}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg mb-2
                  ${
                    pathname.includes(`session-${session.number}`)
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.02]"
                  }
                  transition-colors
                `}
              >
                <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">
                  {session.number}
                </span>
                <span className="font-medium">{session.title}</span>
              </Link>

              {pathname.includes(`session-${session.number}`) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="ml-4 space-y-1"
                >
                  {session.exercises.map((exercise) => (
                    <Link
                      key={exercise.id}
                      href={`/workshop/session-${session.number}/${exercise.id}`}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 text-sm rounded
                        ${
                          pathname.includes(exercise.id)
                            ? "text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        }
                        transition-colors
                      `}
                    >
                      <ChevronRight className="w-3 h-3" />
                      {exercise.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Print Report */}
        <div className="p-4 border-t border-white/[0.08]">
          <button
            onClick={() => window.open('/workshop/report', '_blank')}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.02] rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>

        {/* Cloud Sync Status */}
        <div className="p-4 border-t border-white/[0.08]">
          <CloudSyncPanel />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
