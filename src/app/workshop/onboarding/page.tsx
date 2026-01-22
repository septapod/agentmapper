"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Scale, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useIcebreakerResponses,
  useCognitiveBiases,
  useWorkingPrinciples,
  useTradeoffs,
} from "@/store/workshop";

const exercises = [
  {
    id: "ai-icebreakers",
    title: "AI Icebreakers",
    description: "Collect team perspectives on AI timeline and cognitive biases",
    duration: "15-30 min",
    icon: Users,
    route: "/workshop/onboarding/ai-icebreakers",
  },
  {
    id: "working-principles",
    title: "Working Principles",
    description: "Define ethical principles and governance do's/don'ts",
    duration: "45-60 min",
    icon: Scale,
    route: "/workshop/onboarding/working-principles",
  },
  {
    id: "tradeoff-navigator",
    title: "Tradeoff Navigator",
    description: "Make strategic decisions on control, priority, and communications",
    duration: "30-45 min",
    icon: Zap,
    route: "/workshop/onboarding/tradeoff-navigator",
  },
];

export default function OnboardingOverviewPage() {
  const router = useRouter();
  const icebreakerResponses = useIcebreakerResponses();
  const biases = useCognitiveBiases();
  const principles = useWorkingPrinciples();
  const tradeoffs = useTradeoffs();
  const { markOnboardingComplete } = useWorkshopStore();

  const exerciseStatus = useMemo(() => {
    const isIcebreakersComplete =
      icebreakerResponses.length >= 1 && biases.filter((b) => b.checked).length >= 3;
    const isPrinciplesComplete =
      principles.length === 4 &&
      principles.every((p) => p.dos.length >= 2 && p.donts.length >= 2);
    const isTradeoffsComplete = tradeoffs.every((t) => t.rationale.trim().length >= 20);

    return {
      "ai-icebreakers": isIcebreakersComplete,
      "working-principles": isPrinciplesComplete,
      "tradeoff-navigator": isTradeoffsComplete,
    };
  }, [icebreakerResponses, biases, principles, tradeoffs]);

  const completedCount = Object.values(exerciseStatus).filter(Boolean).length;
  const allComplete = completedCount === 3;

  const handleCompleteOnboarding = () => {
    markOnboardingComplete();
    router.push("/workshop");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Workshop
        </Link>

        <h1 className="text-3xl font-bold mb-2">AI Strategy Foundation</h1>
        <p className="text-[var(--color-text-body)] mb-4">
          Complete these 3 exercises to establish your organization's AI governance approach before diving into the workshop.
        </p>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/[0.05] rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-muted)]">
            {completedCount} of 3 complete
          </span>
        </div>
      </motion.div>

      {/* Exercises */}
      <div className="space-y-4 mb-8">
        {exercises.map((exercise, idx) => {
          const isComplete = exerciseStatus[exercise.id as keyof typeof exerciseStatus];
          const Icon = exercise.icon;

          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={exercise.route}>
                <Card
                  accent={isComplete ? "teal" : "yellow"}
                  className="hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isComplete
                          ? "bg-[var(--color-accent-teal)]/20"
                          : "bg-[var(--color-accent)]/20"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6 text-[var(--color-accent-teal)]" />
                      ) : (
                        <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[var(--color-text)]">
                          {exercise.title}
                        </h3>
                        <Badge variant={isComplete ? "teal" : "default"} className="text-xs">
                          {isComplete ? "Complete" : exercise.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {exercise.description}
                      </p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0 mt-2" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Complete Button */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Card accent="teal" hoverable={false} className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--color-accent-teal)]" />
              <h2 className="text-xl font-bold">All Exercises Complete!</h2>
            </div>
            <p className="text-[var(--color-text-muted)] mb-6">
              You've established your AI governance foundation. Ready to start the workshop?
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCompleteOnboarding}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Complete Onboarding & Begin Workshop
            </Button>
          </Card>
        </motion.div>
      )}

      {!allComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card hoverable={false} className="bg-white/[0.02]">
            <p className="text-sm text-[var(--color-text-muted)] text-center">
              Complete all 3 exercises above to unlock the main workshop
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
