"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, Scale, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { useIcebreakerResponses, useCognitiveBiases, useWorkingPrinciples, useTradeoffs } from "@/store/workshop";
import { ExerciseDataSummary } from "@/components/workshop/ExerciseDataSummary";

const exercises = [
  {
    id: "ai-icebreakers",
    title: "AI Icebreakers",
    icon: <Users className="w-5 h-5" />,
    description:
      "Collect team perspectives on AI's timeline and impact. Quick multi-participant input to understand how your team views AI's role and discuss cognitive biases that might affect AI adoption decisions.",
    duration: "20-30 min",
    tips: [
      "Ensure the solution is documented for others to understand",
      "Create training materials before broader rollout",
      "Assign clear ownership for ongoing support",
      "Establish feedback channels for users",
    ],
    path: "/workshop/session-1/ai-icebreakers",
  },
  {
    id: "working-principles",
    title: "Working Principles",
    icon: <Scale className="w-5 h-5" />,
    description:
      "Define your organization's AI governance through 4 key principles: Human-Centeredness, Control & Accountability, Observability & Explainability, and Improvement & Responsiveness. For each principle, list specific Do's and Don'ts.",
    duration: "30-45 min",
    tips: [
      "Think about how principles apply to your specific context",
      "Be concrete - vague principles don't guide decisions",
      "Include at least 2-3 Do's and Don'ts per principle",
      "These will guide all future AI decisions",
    ],
    path: "/workshop/session-1/working-principles",
  },
  {
    id: "tradeoff-navigator",
    title: "Tradeoff Navigator",
    icon: <Zap className="w-5 h-5" />,
    description:
      "Make strategic decisions on 5 key dimensions: Control, Priority, Users, External Communications, and Internal Communications. Position your organization on each spectrum and explain your reasoning.",
    duration: "30-45 min",
    tips: [
      "There are no right answers - only what's right for your organization",
      "Document your rationale thoroughly - you'll reference it later",
      "Consider both short-term and long-term implications",
      "These positions can evolve as you learn",
    ],
    path: "/workshop/session-1/tradeoff-navigator",
  },
];

export default function Session1Page() {
  const icebreakerResponses = useIcebreakerResponses();
  const biases = useCognitiveBiases();
  const workingPrinciples = useWorkingPrinciples();
  const tradeoffs = useTradeoffs();

  const getExerciseStatus = (id: string): "pending" | "in-progress" | "completed" => {
    switch (id) {
      case "ai-icebreakers":
        return icebreakerResponses.length > 0 && biases.filter(b => b.checked).length >= 3 ? "completed" : "pending";
      case "working-principles":
        return workingPrinciples.length === 4 && workingPrinciples.every(p => p.dos.length >= 2 && p.donts.length >= 2) ? "completed" : "pending";
      case "tradeoff-navigator":
        return tradeoffs.every(t => t.rationale.trim().length >= 20) ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  // Check if exercise has any data (for showing dashboard vs description)
  const exerciseHasData = (id: string): boolean => {
    switch (id) {
      case "ai-icebreakers":
        return icebreakerResponses.length > 0;
      case "working-principles":
        return workingPrinciples.length > 0;
      case "tradeoff-navigator":
        return tradeoffs.some(t => t.rationale.trim().length > 0);
      default:
        return false;
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
          Session 1 of 5
        </span>
        <h1 className="text-3xl font-bold mb-4">AI Strategy Foundation</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Build your organization's AI governance foundation. Understand team perspectives,
          define core principles, and make strategic positioning decisions that will guide
          all future AI implementation work.
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
                  {exerciseHasData(exercise.id) ? (
                    // Show data summary dashboard when exercise has data
                    <ExerciseDataSummary exerciseId={exercise.id} variant="compact" />
                  ) : (
                    // Show description and tips when no data yet
                    <>
                      <p className="text-[var(--color-text-body)] mb-4">{exercise.description}</p>

                      <div className="bg-[var(--color-bg)] rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                          Tips for Success
                        </p>
                        <ul className="space-y-2">
                          {exercise.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-body)]">
                              <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
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
