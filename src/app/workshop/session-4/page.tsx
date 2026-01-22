"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Users, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { usePilotPlans, useRoadmapMilestones } from "@/store/workshop";
import { ExerciseDataSummary } from "@/components/workshop/ExerciseDataSummary";

const exercises = [
  {
    id: "pilot-plan",
    title: "Pilot Plan",
    icon: <Users className="w-5 h-5" />,
    description:
      "Define your pilot structure: who will test, what you'll measure, how long it will run, and what would make you stop.",
    duration: "20-30 min",
    tips: [
      "Choose 2-3 friendly users who will give honest feedback",
      "Track metrics that matter (time saved, error rate, satisfaction)",
      "Plan for 2-4 weeks of pilot testing",
      "Define clear stop criteria (what would make you pull the plug)",
    ],
    path: "/workshop/session-4/pilot-plan",
  },
  {
    id: "roadmap-builder",
    title: "90-Day Roadmap",
    icon: <Calendar className="w-5 h-5" />,
    description:
      "Create your 90-day implementation timeline with clear milestones, owners, and success criteria for each phase.",
    duration: "30-45 min",
    tips: [
      "Weeks 1-2: Build the MVP",
      "Weeks 3-6: Run the pilot with test users",
      "Weeks 7-8: Refine based on feedback",
      "Weeks 9-12: Scale to broader team",
    ],
    path: "/workshop/session-4/roadmap-builder",
  },
];

export default function Session4Page() {
  const pilotPlans = usePilotPlans();
  const roadmapMilestones = useRoadmapMilestones();

  const getExerciseStatus = (id: string): "pending" | "in-progress" | "completed" => {
    switch (id) {
      case "pilot-plan":
        return pilotPlans.length > 0 ? "completed" : "pending";
      case "roadmap-builder":
        return roadmapMilestones.length > 0 ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  // Check if exercise has any data (for showing dashboard vs description)
  const exerciseHasData = (id: string): boolean => {
    switch (id) {
      case "pilot-plan":
        return pilotPlans.length > 0;
      case "roadmap-builder":
        return roadmapMilestones.length > 0;
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
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)] rounded">
          Session 4 of 5
        </span>
        <h1 className="text-3xl font-bold mb-4">Create the 90-Day Roadmap</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Plan your pilot, define how you'll gather feedback, and create a 90-day timeline
          from MVP to scaled solution.
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
                accent={status === "completed" ? "teal" : status === "in-progress" ? "teal" : "none"}
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
                              ? "bg-[var(--color-accent-teal)]/20 text-[var(--color-accent-teal)]"
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
                              <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent-teal)]" />
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
        <Link href="/workshop/session-3">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 3
          </Button>
        </Link>
        {completedCount === exercises.length && (
          <Link href="/workshop/session-5">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Session 5
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
