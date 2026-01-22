"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOrganization, useCurrentSession, useOnboardingComplete } from "@/store/workshop";

const sessions = [
  {
    number: 0,
    title: "AI Strategy Foundation",
    duration: "2-4 hours",
    description:
      "Establish your organization's AI governance approach through strategic exercises. Collect team perspectives, define ethical principles, and make key strategic tradeoffs.",
    exercises: [
      { id: "ai-icebreakers", title: "AI Icebreakers", description: "Team alignment on AI timeline and cognitive biases" },
      { id: "working-principles", title: "Working Principles", description: "Define ethical principles and governance do's/don'ts" },
      { id: "tradeoff-navigator", title: "Tradeoff Navigator", description: "Strategic decisions on control, priority, and communications" },
    ],
  },
  {
    number: 1,
    title: "Orientation & Shared Understanding",
    duration: "2-3 hours",
    description:
      "Build a common understanding of Agentic AI, define your aspirations with Future Headlines, brainstorm opportunities, and establish design principles and guardrails.",
    exercises: [
      { id: "future-headlines", title: "Future Headlines", description: "Imagine 2-3 year future headlines about your AI journey" },
      { id: "opportunity-brainstorm", title: "Opportunity Brainstorm", description: "Capture where AI could help across your organization" },
      { id: "design-principles", title: "Design Principles", description: "Define hard boundaries and guiding principles" },
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

export default function WorkshopPage() {
  const organization = useOrganization();
  const currentSession = useCurrentSession();
  const onboardingComplete = useOnboardingComplete();

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

      {/* Sessions Grid */}
      <div className="space-y-8">
        {sessions.map((session, index) => {
          const isCompleted = session.number === 0
            ? onboardingComplete
            : session.number < currentSession;
          const isCurrent = session.number === 0
            ? !onboardingComplete
            : session.number === currentSession;
          const isLocked = session.number > 0 && !onboardingComplete ? true : session.number > currentSession;

          return (
            <motion.div
              key={session.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                accent={isCompleted ? "teal" : isCurrent ? "yellow" : "none"}
                hoverable={!isLocked}
                className={isLocked ? "opacity-50" : ""}
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
                    {!isLocked && (
                      <Link href={session.number === 0 ? "/workshop/onboarding" : `/workshop/session-${session.number}`}>
                        <Button
                          variant={isCurrent ? "primary" : "default"}
                          size="sm"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-[var(--color-text-body)] mb-6">{session.description}</p>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {session.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={`
                          p-3 rounded-lg border
                          ${
                            isLocked
                              ? "border-white/[0.05] bg-transparent"
                              : "border-white/[0.08] bg-[var(--color-bg)]"
                          }
                        `}
                      >
                        <div className="flex items-start gap-2">
                          <Circle className="w-4 h-4 mt-0.5 text-[var(--color-text-muted)]" />
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">
                              {exercise.title}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                              {exercise.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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
