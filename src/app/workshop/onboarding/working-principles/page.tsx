"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Trash2, Shield, Scale, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWorkshopStore, useWorkingPrinciples } from "@/store/workshop";

const principles = [
  {
    type: "human-centered" as const,
    title: "Human-Centeredness",
    icon: Shield,
    description: "Ensure AI systems prioritize human dignity, autonomy, and well-being.",
    questions: [
      "Who are the people affected by this AI system?",
      "How do we ensure their dignity and autonomy are preserved?",
      "What happens if the system fails or makes an error?",
    ],
  },
  {
    type: "control-accountability" as const,
    title: "Control & Accountability",
    icon: Scale,
    description: "Maintain clear lines of authority and responsibility for AI decisions.",
    questions: [
      "Who ultimately decides when and how AI is used?",
      "How do we audit AI decisions and actions?",
      "Who is responsible when things go wrong?",
    ],
  },
  {
    type: "observability-explainability" as const,
    title: "Observability & Explainability",
    icon: Eye,
    description: "Make AI decisions transparent and understandable to stakeholders.",
    questions: [
      "Can we explain how the AI reached its decision?",
      "What level of transparency do stakeholders need?",
      "How do we make AI actions visible and trackable?",
    ],
  },
  {
    type: "improvement-responsiveness" as const,
    title: "Improvement & Responsiveness",
    icon: TrendingUp,
    description: "Build systems that learn, adapt, and respond to feedback.",
    questions: [
      "How do we continuously learn from outcomes?",
      "How quickly can we adapt when issues arise?",
      "How do we capture and act on user feedback?",
    ],
  },
];

export default function WorkingPrinciplesPage() {
  const savedPrinciples = useWorkingPrinciples();
  const { addWorkingPrinciple, updateWorkingPrinciple } = useWorkshopStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [dos, setDos] = useState<string[]>([""]);
  const [donts, setDonts] = useState<string[]>([""]);

  const currentPrinciple = principles[currentStep];
  const existingPrinciple = savedPrinciples.find(p => p.principleType === currentPrinciple.type);

  // Load existing data when switching steps
  const loadPrincipleData = (step: number) => {
    const principle = principles[step];
    const existing = savedPrinciples.find(p => p.principleType === principle.type);

    if (existing) {
      setDos(existing.dos.length > 0 ? existing.dos : [""]);
      setDonts(existing.donts.length > 0 ? existing.donts : [""]);
    } else {
      setDos([""]);
      setDonts([""]);
    }
  };

  const handleNext = () => {
    saveCurrent();
    if (currentStep < principles.length - 1) {
      setCurrentStep(currentStep + 1);
      loadPrincipleData(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    saveCurrent();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      loadPrincipleData(currentStep - 1);
    }
  };

  const saveCurrent = () => {
    const filteredDos = dos.filter(d => d.trim());
    const filteredDonts = donts.filter(d => d.trim());

    if (filteredDos.length === 0 && filteredDonts.length === 0) return;

    const principleData = {
      principleType: currentPrinciple.type,
      promptingAnswers: {}, // Can be extended if needed
      dos: filteredDos,
      donts: filteredDonts,
    };

    if (existingPrinciple) {
      updateWorkingPrinciple(existingPrinciple.id, principleData);
    } else {
      addWorkingPrinciple(principleData);
    }
  };

  const addDo = () => {
    setDos([...dos, ""]);
  };

  const updateDo = (index: number, value: string) => {
    const newDos = [...dos];
    newDos[index] = value;
    setDos(newDos);
  };

  const removeDo = (index: number) => {
    if (dos.length > 1) {
      setDos(dos.filter((_, i) => i !== index));
    }
  };

  const addDont = () => {
    setDonts([...donts, ""]);
  };

  const updateDont = (index: number, value: string) => {
    const newDonts = [...donts];
    newDonts[index] = value;
    setDonts(newDonts);
  };

  const removeDont = (index: number) => {
    if (donts.length > 1) {
      setDonts(donts.filter((_, i) => i !== index));
    }
  };

  const isComplete = savedPrinciples.length === 4 &&
    savedPrinciples.every(p => p.dos.length >= 2 && p.donts.length >= 2);

  const Icon = currentPrinciple.icon;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop/onboarding"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Onboarding
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Scale className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Working Principles</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 2 of 3 · Onboarding</p>
          </div>
        </div>

        <p className="text-[var(--color-text-body)] mb-6">
          Define your organization's AI governance through 4 key principles. For each principle, list specific Do's and Don'ts.
        </p>

        {/* Progress */}
        <div className="flex gap-2">
          {principles.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-colors ${
                idx < currentStep
                  ? "bg-[var(--color-accent-teal)]"
                  : idx === currentStep
                  ? "bg-[var(--color-accent)]"
                  : "bg-white/[0.1]"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Current Principle */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card accent="yellow" hoverable={false} className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-[var(--color-accent)]" />
              {currentPrinciple.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4">{currentPrinciple.description}</p>

            <div className="bg-[var(--color-surface-hover)] rounded-lg p-4">
              <p className="text-sm font-semibold text-[var(--color-text)] mb-2">Consider these questions:</p>
              <ul className="space-y-1">
                {currentPrinciple.questions.map((q, idx) => (
                  <li key={idx} className="text-sm text-[var(--color-text-muted)]">• {q}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Do's Section */}
        <Card className="mb-6">
          <CardContent>
            <h3 className="font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <span className="text-[var(--color-accent-teal)] text-xl">✓</span>
              Do's: Actions we should take
            </h3>

            <div className="space-y-3">
              {dos.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="e.g., Always keep a human in the loop for final decisions"
                    value={item}
                    onChange={(e) => updateDo(idx, e.target.value)}
                    className="flex-1"
                  />
                  {dos.length > 1 && (
                    <button
                      onClick={() => removeDo(idx)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addDo}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Do
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Don'ts Section */}
        <Card className="mb-8">
          <CardContent>
            <h3 className="font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <span className="text-[var(--color-accent-coral)] text-xl">✗</span>
              Don'ts: Actions we should avoid
            </h3>

            <div className="space-y-3">
              {donts.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="e.g., Never deploy AI without testing on real scenarios"
                    value={item}
                    onChange={(e) => updateDont(idx, e.target.value)}
                    className="flex-1"
                  />
                  {donts.length > 1 && (
                    <button
                      onClick={() => removeDont(idx)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addDont}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Don't
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous Principle
        </Button>

        {currentStep < principles.length - 1 ? (
          <Button
            variant="primary"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next Principle
          </Button>
        ) : (
          <Link href={isComplete ? "/workshop/onboarding/tradeoff-navigator" : "#"}>
            <Button
              variant="primary"
              onClick={saveCurrent}
              disabled={!isComplete}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Tradeoff Navigator
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
