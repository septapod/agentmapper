"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users, Smile, Frown, Meh } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useWorkshopStore, useIcebreakerResponses, useCognitiveBiases } from "@/store/workshop";

const timelineOptions = [
  { value: 6, label: "6 months" },
  { value: 12, label: "1 year" },
  { value: 18, label: "18 months" },
  { value: 24, label: "2 years" },
  { value: 36, label: "3+ years" },
];

const optimismEmojis = [
  { value: 1, emoji: "😟", label: "Very concerned" },
  { value: 2, emoji: "😕", label: "Concerned" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Optimistic" },
  { value: 5, emoji: "😊", label: "Very optimistic" },
];

export default function AIIcebreakersPage() {
  const responses = useIcebreakerResponses();
  const biases = useCognitiveBiases();
  const { addIcebreakerResponse, deleteIcebreakerResponse, toggleCognitiveBias } = useWorkshopStore();

  const [name, setName] = useState("");
  const [timeline, setTimeline] = useState<number>(12);
  const [optimism, setOptimism] = useState<number>(3);

  const handleAdd = () => {
    if (!name.trim()) return;

    addIcebreakerResponse({
      participantName: name.trim(),
      timelineMonths: timeline,
      optimismScore: optimism,
    });

    // Reset form
    setName("");
    setTimeline(12);
    setOptimism(3);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      handleAdd();
    }
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

        <p className="text-[var(--color-text-body)]">
          Collect team perspectives on AI's timeline and impact. Quickly add each participant's response below.
        </p>
      </motion.div>

      {/* Quick Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card accent="yellow" hoverable={false}>
          <CardContent>
            <h3 className="font-semibold mb-4">Add Participant Response</h3>

            <div className="space-y-6">
              {/* Name Input */}
              <Input
                label="Participant Name"
                placeholder="e.g., Sarah Mitchell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />

              {/* Timeline Selection */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  When will AI significantly impact your role?
                </label>
                <div className="flex gap-2 flex-wrap">
                  {timelineOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeline(option.value)}
                      className={`
                        px-4 py-2 rounded-lg border transition-colors text-sm font-medium
                        ${timeline === option.value
                          ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optimism Scale */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  How do you feel about AI's impact?
                </label>
                <div className="flex gap-3 justify-between">
                  {optimismEmojis.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setOptimism(option.value)}
                      className={`
                        flex-1 p-4 rounded-lg border transition-all
                        ${optimism === option.value
                          ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] scale-110"
                          : "border-white/[0.1] hover:border-[var(--color-border-hover)] hover:scale-105"
                        }
                      `}
                      title={option.label}
                    >
                      <div className="text-3xl mb-1">{option.emoji}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!name.trim()}
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
            {responses.map((response) => {
              const emoji = optimismEmojis.find(e => e.value === response.optimismScore)?.emoji || "😐";
              const timelineLabel = timelineOptions.find(t => t.value === response.timelineMonths)?.label || `${response.timelineMonths} months`;

              return (
                <Card key={response.id} className="group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">{emoji}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-[var(--color-text)]">{response.participantName}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Timeline: {timelineLabel}
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
              );
            })}
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
