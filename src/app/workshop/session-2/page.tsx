"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Map, BarChart3, Grid3X3, Vote, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepProgress } from "@/components/ui/ProgressBar";
import { useFrictionPoints, useScoredOpportunities } from "@/store/workshop";

const exercises = [
  {
    id: "friction-map",
    title: "Friction Mapping",
    icon: <Map className="w-5 h-5" />,
    description:
      "Journey map your processes to identify pain points, bottlenecks, and friction. Focus on where time is wasted, errors occur, or members experience frustration.",
    duration: "45-60 min",
    tips: [
      "Walk through actual member journeys step by step",
      "Note where manual handoffs occur",
      "Identify repetitive tasks that drain employee time",
      "Mark points where errors commonly happen",
    ],
    path: "/workshop/session-2/friction-map",
  },
  {
    id: "opportunity-scoring",
    title: "Opportunity Scoring",
    icon: <BarChart3 className="w-5 h-5" />,
    description:
      "Rate each opportunity on Value (member impact, efficiency gains) and Complexity (technical, organizational, regulatory). This creates input for prioritization.",
    duration: "30-45 min",
    tips: [
      "Consider both immediate and long-term value",
      "Factor in regulatory and compliance complexity",
      "Think about data availability and quality",
      "Consider change management requirements",
    ],
    path: "/workshop/session-2/opportunity-scoring",
  },
  {
    id: "priority-matrix",
    title: "Priority Matrix",
    icon: <Grid3X3 className="w-5 h-5" />,
    description:
      "Position opportunities on a 2x2 matrix (Value vs. Complexity) to identify Quick Wins, Strategic initiatives, Fill-ins, and opportunities to Deprioritize.",
    duration: "20-30 min",
    tips: [
      "Quick Wins: High value, low complexity - start here",
      "Strategic: High value, high complexity - plan carefully",
      "Fill-ins: Low value, low complexity - do when resources allow",
      "Deprioritize: Low value, high complexity - avoid for now",
    ],
    path: "/workshop/session-2/priority-matrix",
  },
  {
    id: "dot-voting",
    title: "Dot Voting",
    icon: <Vote className="w-5 h-5" />,
    description:
      "Use dot voting to democratically select which opportunities to advance as pilots. Each participant votes for their top choices.",
    duration: "15-20 min",
    tips: [
      "Give each participant 3-5 votes to distribute",
      "Votes can be concentrated or spread across options",
      "Select top 2-3 opportunities for pilots",
      "Document rationale for selections",
    ],
    path: "/workshop/session-2/dot-voting",
  },
];

export default function Session2Page() {
  const frictionPoints = useFrictionPoints();
  const scoredOpportunities = useScoredOpportunities();

  const getExerciseStatus = (id: string): "pending" | "in-progress" | "completed" => {
    switch (id) {
      case "friction-map":
        return frictionPoints.length > 0 ? "completed" : "pending";
      case "opportunity-scoring":
        return scoredOpportunities.length > 0 ? "completed" : "pending";
      case "priority-matrix":
        return scoredOpportunities.filter(o => o.quadrant).length > 0 ? "completed" : "pending";
      case "dot-voting":
        return scoredOpportunities.filter(o => o.selectedForPilot).length > 0 ? "completed" : "pending";
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
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)] rounded">
          Session 2 of 5
        </span>
        <h1 className="text-3xl font-bold mb-4">Find the Friction</h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          This session focuses on mapping your processes to identify friction points,
          scoring opportunities by value and complexity, and prioritizing which ones
          to pursue as pilots.
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
                accent={status === "completed" ? "teal" : status === "in-progress" ? "coral" : "none"}
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
                              ? "bg-[var(--color-accent-coral)]/20 text-[var(--color-accent-coral)]"
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
                          <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent-coral)]" />
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
        <Link href="/workshop/session-1">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 1
          </Button>
        </Link>
        {completedCount === exercises.length && (
          <Link href="/workshop/session-3">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Session 3
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
