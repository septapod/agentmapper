"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Wrench, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { useMVPSpecs } from "@/store/workshop";
import { ExerciseDataSummary } from "@/components/workshop/ExerciseDataSummary";

const exercises = [
  {
    id: "mvp-spec",
    title: "MVP Specification",
    icon: <Wrench className="w-5 h-5" />,
    description:
      "Design the smallest useful version of your solution. Define scope, tools, human checkpoints, and success criteria for a 2-week prototype.",
    duration: "30-45 min",
    tips: [
      "Start with the simplest thing that could work",
      "Use tools you already have (Claude, Copilot, etc.)",
      "Define clear human-in-loop checkpoints",
      "'Works for 80% of cases' is a great first milestone",
    ],
    path: "/workshop/session-3/mvp-spec",
  },
];

export default function Session3Page() {
  const mvpSpecs = useMVPSpecs();

  const getExerciseStatus = (id: string): "pending" | "in-progress" | "completed" => {
    switch (id) {
      case "mvp-spec":
        return mvpSpecs.length > 0 ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  // Check if exercise has any data (for showing dashboard vs description)
  const exerciseHasData = (id: string): boolean => {
    switch (id) {
      case "mvp-spec":
        return mvpSpecs.length > 0;
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
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)] rounded">
          Session 3 of 5
        </span>
        <h1 className="text-3xl font-bold mb-4">Design the Pilot</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Organize the work and design your MVP. Define what you'll build, which tools you'll use,
          where humans stay in the loop, and how you'll measure success.
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
                              ? "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]"
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
                              <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent-purple)]" />
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
        <Link href="/workshop/session-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 2
          </Button>
        </Link>
        {completedCount === exercises.length && (
          <Link href="/workshop/session-4">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Session 4
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
