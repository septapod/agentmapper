"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckSquare, Users as UsersIcon, Lightbulb, Repeat, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { useScalingChecklist, useTrainingPlan, useLessonsLearned, useNextOpportunities } from "@/store/workshop";

const exercises = [
  {
    id: "scaling-checklist",
    title: "Scaling Checklist",
    icon: <CheckSquare className="w-5 h-5" />,
    description:
      "Verify readiness to scale: documentation exists, training materials are created, ownership is clear, feedback loops work, and metrics are tracked.",
    duration: "20-30 min",
    tips: [
      "Ensure the solution is documented for others to understand",
      "Create training materials before broader rollout",
      "Assign clear ownership for ongoing support",
      "Establish feedback channels for users",
    ],
    path: "/workshop/session-5/scaling-checklist",
  },
  {
    id: "training-plan",
    title: "Training Plan",
    icon: <UsersIcon className="w-5 h-5" />,
    description:
      "Define role-based training needs, identify champions who will advocate for adoption, and set target dates for training completion.",
    duration: "30-45 min",
    tips: [
      "Different roles need different training depth",
      "Identify early adopters who can champion the solution",
      "Plan for ongoing training as solution evolves",
      "Include hands-on practice sessions",
    ],
    path: "/workshop/session-5/training-plan",
  },
  {
    id: "lessons-learned",
    title: "Lessons Learned",
    icon: <Lightbulb className="w-5 h-5" />,
    description:
      "Capture what worked well, what challenges you faced, unexpected outcomes, and recommendations for future AI pilots.",
    duration: "30-45 min",
    tips: [
      "Document both successes and failures honestly",
      "Include unexpected findings - they're often most valuable",
      "Note which patterns can be reused elsewhere",
      "Share learnings across the organization",
    ],
    path: "/workshop/session-5/lessons-learned",
  },
  {
    id: "next-opportunities",
    title: "Next Opportunities",
    icon: <Repeat className="w-5 h-5" />,
    description:
      "Identify the next friction areas where you can apply proven patterns, estimate value, and prioritize your pipeline.",
    duration: "30-45 min",
    tips: [
      "Look for similar friction patterns in other areas",
      "Reuse successful approaches from this pilot",
      "Start small again - don't try to scale too fast",
      "Build momentum with quick wins",
    ],
    path: "/workshop/session-5/next-opportunities",
  },
];

export default function Session5Page() {
  const scalingChecklist = useScalingChecklist();
  const trainingPlan = useTrainingPlan();
  const lessonsLearned = useLessonsLearned();
  const nextOpportunities = useNextOpportunities();

  const getExerciseStatus = (id: string): "pending" | "in-progress" | "completed" => {
    switch (id) {
      case "scaling-checklist":
        return scalingChecklist.length > 0 ? "completed" : "pending";
      case "training-plan":
        return trainingPlan.length > 0 ? "completed" : "pending";
      case "lessons-learned":
        return lessonsLearned.length > 0 ? "completed" : "pending";
      case "next-opportunities":
        return nextOpportunities.length > 0 ? "completed" : "pending";
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
          Session 5 of 5
        </span>
        <h1 className="text-3xl font-bold mb-4">Empower Teams</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Scale what works and build organizational capability. Document learnings, train teams,
          establish ownership, and identify the next opportunities for AI-enabled transformation.
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
                          <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
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
        <Link href="/workshop/session-4">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 4
          </Button>
        </Link>
        {completedCount === exercises.length && (
          <Link href="/workshop">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Complete Workshop
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
