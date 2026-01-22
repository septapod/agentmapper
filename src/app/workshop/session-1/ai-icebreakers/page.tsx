"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useWorkshopStore, useIcebreakerResponses, useCognitiveBiases } from "@/store/workshop";

// NOBL's exact prompts
const promptA = {
  text: "AI will have a dramatic impact on society within the next three years.",
  options: [
    { value: 0, label: "0", description: "Completely disagree. AI is overhyped." },
    { value: 1, label: "1", description: "Somewhat disagree" },
    { value: 2, label: "2", description: "Unsure" },
    { value: 3, label: "3", description: "Somewhat agree" },
    { value: 4, label: "4", description: "Completely agree. The AI revolution is imminent." },
  ],
};

const promptB = {
  text: "AI will have net positive outcomes for individuals and society.",
  options: [
    { value: 0, label: "0", description: "Completely disagree. AI will lead to far more harm than good." },
    { value: 1, label: "1", description: "Somewhat disagree" },
    { value: 2, label: "2", description: "Unsure" },
    { value: 3, label: "3", description: "Somewhat agree" },
    { value: 4, label: "4", description: "Completely agree. AI will improve human life as we know it." },
  ],
};

export default function AIIcebreakersPage() {
  const responses = useIcebreakerResponses();
  const biases = useCognitiveBiases();
  const { addIcebreakerResponse, deleteIcebreakerResponse, toggleCognitiveBias } = useWorkshopStore();

  const [name, setName] = useState("");
  const [impactScore, setImpactScore] = useState<number | null>(null);
  const [optimismScore, setOptimismScore] = useState<number | null>(null);

  const handleAdd = () => {
    if (!name.trim() || impactScore === null || optimismScore === null) return;

    addIcebreakerResponse({
      participantName: name.trim(),
      impactScore,
      optimismScore,
    });

    // Reset form
    setName("");
    setImpactScore(null);
    setOptimismScore(null);
  };

  const canAdd = name.trim() && impactScore !== null && optimismScore !== null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop/session-1"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Session 1
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Icebreakers</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 1 of 3 · Session 1</p>
          </div>
        </div>

        <div className="bg-[var(--color-accent)]/10 border-l-4 border-[var(--color-accent)] p-4 rounded-r-lg">
          <p className="text-[var(--color-text-body)] font-medium">
            Individually, rate your level of agreement with the following prompts. Do not share your answers.
          </p>
        </div>
      </motion.div>

      {/* Add Participant Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card accent="yellow" hoverable={false}>
          <CardContent>
            <div className="space-y-6">
              {/* Name Input */}
              <Input
                label="Participant Name"
                placeholder="e.g., Sarah Mitchell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              {/* Prompt A */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-[var(--color-text)]">
                  Prompt A: <span className="font-normal text-[var(--color-text-body)]">{promptA.text}</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {promptA.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setImpactScore(option.value)}
                      className={`
                        p-3 rounded-lg border transition-all text-center
                        ${impactScore === option.value
                          ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)]"
                          : "border-white/[0.1] hover:border-[var(--color-border-hover)]"
                        }
                      `}
                    >
                      <div className={`text-xl font-bold mb-1 ${impactScore === option.value ? "text-[var(--color-accent-coral)]" : "text-[var(--color-text)]"}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] leading-tight">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt B */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-[var(--color-text)]">
                  Prompt B: <span className="font-normal text-[var(--color-text-body)]">{promptB.text}</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {promptB.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setOptimismScore(option.value)}
                      className={`
                        p-3 rounded-lg border transition-all text-center
                        ${optimismScore === option.value
                          ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)]"
                          : "border-white/[0.1] hover:border-[var(--color-border-hover)]"
                        }
                      `}
                    >
                      <div className={`text-xl font-bold mb-1 ${optimismScore === option.value ? "text-[var(--color-accent-coral)]" : "text-[var(--color-text)]"}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] leading-tight">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!canAdd}
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Add Response
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Responses List */}
      {responses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">
            Team Responses <span className="text-[var(--color-text-muted)]">({responses.length})</span>
          </h3>
          <div className="space-y-3">
            {responses.map((response) => (
              <Card key={response.id} className="group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-coral)]/20 flex items-center justify-center text-[var(--color-accent-coral)] font-bold">
                        {response.impactScore}
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-teal)]/20 flex items-center justify-center text-[var(--color-accent-teal)] font-bold">
                        {response.optimismScore}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--color-text)]">{response.participantName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Impact: {response.impactScore} · Optimism: {response.optimismScore}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteIcebreakerResponse(response.id)}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cognitive Biases Discussion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h3 className="text-lg font-semibold mb-2">Cognitive Biases Discussion</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Check off biases you've discussed as a team:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {biases.map((bias) => (
            <Card
              key={bias.id}
              accent={bias.checked ? "teal" : "none"}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => toggleCognitiveBias(bias.id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={bias.checked}
                  onChange={() => {}}
                  className="mt-1 w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-surface)] checked:bg-[var(--color-accent-teal)] checked:border-[var(--color-accent-teal)]"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[var(--color-text)] mb-1">{bias.name}</h4>
                  <p className="text-sm text-[var(--color-text-muted)]">{bias.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center"
      >
        <Link href="/workshop/session-1">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 1
          </Button>
        </Link>
        {responses.length > 0 && biases.filter(b => b.checked).length >= 3 && (
          <Link href="/workshop/session-1/working-principles">
            <Button
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Working Principles
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
