"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lightbulb, Target, Shield, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { useFutureHeadlines, useOpportunities, useDesignPrinciples } from "@/store/workshop";

const exercises = [
  {
    id: "future-headlines",
    title: "Future Headlines",
    icon: <Lightbulb className="w-5 h-5" />,
    description:
      "Imagine it's 2-3 years from now. What headlines would you want to read about your organization's AI journey? This exercise helps align on aspirations and vision.",
    duration: "30-45 min",
    tips: [
      "Think bold - don't limit yourself to what seems possible today",
      "Consider headlines about member experience, employee satisfaction, and business results",
      "Include both opportunities and risks you've successfully navigated",
    ],
    path: "/workshop/session-1/future-headlines",
  },
  {
    id: "opportunity-brainstorm",
    title: "Opportunity Brainstorm",
    icon: <Target className="w-5 h-5" />,
    description:
      "Capture initial ideas about where Agentic AI could help across your organization. We'll refine and prioritize these in Session 2.",
    duration: "45-60 min",
    tips: [
      "Focus on friction points and pain points first",
      "Consider both member-facing and back-office processes",
      "Don't worry about feasibility yet - that comes later",
    ],
    path: "/workshop/session-1/opportunity-brainstorm",
  },
  {
    id: "design-principles",
    title: "Design Principles & Guardrails",
    icon: <Shield className="w-5 h-5" />,
    description:
      "Define the hard boundaries that must never be crossed (guardrails) and the aspirational principles that should guide your AI implementation.",
    duration: "30-45 min",
    tips: [
      "Guardrails are non-negotiable - violations should trigger immediate escalation",
      "Principles are aspirational goals that guide decision-making",
      "Consider member trust, employee empowerment, and regulatory compliance",
    ],
    path: "/workshop/session-1/design-principles",
  },
];

export default function Session1Page() {
  const futureHeadlines = useFutureHeadlines();
  const opportunities = useOpportunities();
  const designPrinciples = useDesignPrinciples();

  const getExerciseStatus = (id: string): "pending" | "in-progress" | "completed" => {
    switch (id) {
      case "future-headlines":
        return futureHeadlines.length > 0 ? "completed" : "pending";
      case "opportunity-brainstorm":
        return opportunities.length > 0 ? "completed" : "pending";
      case "design-principles":
        return designPrinciples.length > 0 ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  const completedCount = exercises.filter((e) => getExerciseStatus(e.id) === "completed").length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded">
          Session 1 of 4
        </span>
        <h1 className="text-3xl font-bold mb-4">Orientation & Shared Understanding</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          The goal of this session is to build a common understanding of what Agentic AI
          means for your organization, define your aspirations, and establish clear
          boundaries.
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <StepProgress
          steps={exercises.map((e) => e.title)}
          currentStep={completedCount}
          completedSteps={exercises
            .map((e, i) => (getExerciseStatus(e.id) === "completed" ? i : -1))
            .filter((i) => i !== -1)}
        />
      </motion.div>

      {/* Exercises */}
      <div className="space-y-6">
        {exercises.map((exercise, index) => {
          const status = getExerciseStatus(exercise.id);

          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card
                accent={status === "completed" ? "teal" : status === "in-progress" ? "yellow" : "none"}
                hoverable
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                          w-12 h-12 rounded-lg flex items-center justify-center
                          ${
                            status === "completed"
                              ? "bg-[var(--color-accent-teal)]/20 text-[var(--color-accent-teal)]"
                              : status === "in-progress"
                              ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                              : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                          }
                        `}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          exercise.icon
                        )}
                      </div>
                      <div>
                        <CardTitle as="h2">{exercise.title}</CardTitle>
                        <CardDescription>{exercise.duration}</CardDescription>
                      </div>
                    </div>
                    <Link href={exercise.path}>
                      <Button
                        variant={status === "in-progress" ? "primary" : "default"}
                        size="sm"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {status === "completed" ? "Review" : status === "in-progress" ? "Continue" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-[var(--color-text-body)] mb-4">{exercise.description}</p>

                  <div className="bg-[var(--color-bg)] rounded-lg p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                      Tips for Success
                    </p>
                    <ul className="space-y-2">
                      {exercise.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-body)]">
                          <Circle className="w-1.5 h-1.5 mt-2 flex-shrink-0 fill-[var(--color-accent)]" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop">
          <Button variant="ghost">Back to Overview</Button>
        </Link>
        {completedCount === exercises.length && (
          <Link href="/workshop/session-2">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Session 2
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
