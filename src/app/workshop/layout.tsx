"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import { useOrganization } from "@/store/workshop";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CloudSyncPanel } from "@/components/workshop/CloudSyncPanel";
import { useEffect } from "react";

const sessions = [
  {
    number: 1,
    title: "Orientation",
    exercises: [
      { id: "future-headlines", title: "Future Headlines" },
      { id: "opportunity-brainstorm", title: "Opportunity Brainstorm" },
      { id: "design-principles", title: "Design Principles" },
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

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const organization = useOrganization();

  // Redirect if no organization
  useEffect(() => {
    if (!organization) {
      router.push("/");
    }
  }, [organization, router]);

  if (!organization) {
    return null;
  }

  // Calculate overall progress
  const totalExercises = sessions.reduce((acc, s) => acc + s.exercises.length, 0);
  const completedExercises = 0; // TODO: Calculate from state
  const progressPercent = (completedExercises / totalExercises) * 100;

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
