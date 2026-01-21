"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Shield,
  AlertTriangle,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useDesignPrinciples,
} from "@/store/workshop";

const exampleGuardrails = [
  "Never take adverse action on a member account without human approval",
  "Never store or transmit unencrypted PII",
  "Always maintain explainability—members can ask 'why' and get a clear answer",
  "Never use AI to make final credit decisions without human review",
];

const examplePrinciples = [
  "AI should augment human judgment, not replace it",
  "Start with assistive roles before autonomous ones",
  "Member trust is more important than operational efficiency",
  "Fail gracefully—if uncertain, escalate to humans",
  "Transparency is default; members should know when AI is involved",
];

export default function DesignPrinciplesPage() {
  const designPrinciples = useDesignPrinciples();
  const { addDesignPrinciple, deleteDesignPrinciple } = useWorkshopStore();

  const [principle, setPrinciple] = useState("");
  const [isGuardrail, setIsGuardrail] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  const handleAdd = () => {
    if (!principle.trim()) return;

    addDesignPrinciple({
      principle: principle.trim(),
      isGuardrail,
    });

    setPrinciple("");
  };

  const guardrails = designPrinciples.filter((p) => p.isGuardrail);
  const principles = designPrinciples.filter((p) => !p.isGuardrail);
  const totalCount = designPrinciples.length;

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
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-teal)]/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[var(--color-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Design Principles & Guardrails</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 3 of 3 · Session 1</p>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card accent="teal" hoverable={false}>
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4">
              Define both guardrails (hard boundaries that must never be crossed) and
              design principles (aspirational guidelines that shape decisions).
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[var(--color-accent-coral)]/10 rounded-lg border border-[var(--color-accent-coral)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--color-accent-coral)]" />
                  <p className="font-semibold text-[var(--color-accent-coral)]">Guardrails</p>
                </div>
                <p className="text-[var(--color-text-muted)]">
                  Non-negotiable boundaries. Violations should trigger immediate escalation.
                  Think: "We will NEVER..."
                </p>
              </div>
              <div className="p-4 bg-[var(--color-accent)]/10 rounded-lg border border-[var(--color-accent)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                  <p className="font-semibold text-[var(--color-accent)]">Principles</p>
                </div>
                <p className="text-[var(--color-text-muted)]">
                  Aspirational guidelines that guide decision-making. Think: "We will
                  strive to..."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Example Principles */}
      {showExamples && totalCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Examples (click to add)
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowExamples(false)}>
              Hide Examples
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Guardrails Examples */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-coral)] mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Guardrail Examples
              </h4>
              <div className="space-y-2">
                {exampleGuardrails.map((g, i) => (
                  <motion.button
                    key={i}
                    className="text-left w-full p-3 rounded-lg border border-[var(--color-accent-coral)]/20 bg-[var(--color-accent-coral)]/5 hover:bg-[var(--color-accent-coral)]/10 transition-colors text-sm"
                    onClick={() => {
                      setPrinciple(g);
                      setIsGuardrail(true);
                    }}
                    whileHover={{ x: 4 }}
                  >
                    {g}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Principles Examples */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Principle Examples
              </h4>
              <div className="space-y-2">
                {examplePrinciples.map((p, i) => (
                  <motion.button
                    key={i}
                    className="text-left w-full p-3 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 transition-colors text-sm"
                    onClick={() => {
                      setPrinciple(p);
                      setIsGuardrail(false);
                    }}
                    whileHover={{ x: 4 }}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card accent={isGuardrail ? "coral" : "yellow"} hoverable={false}>
          <CardContent>
            <div className="space-y-4">
              {/* Type Toggle */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsGuardrail(true)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border transition-colors
                      ${
                        isGuardrail
                          ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-accent-coral)]"
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Guardrail
                  </button>
                  <button
                    onClick={() => setIsGuardrail(false)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border transition-colors
                      ${
                        !isGuardrail
                          ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    <Sparkles className="w-4 h-4" />
                    Principle
                  </button>
                </div>
              </div>

              <TextArea
                label={isGuardrail ? "Guardrail Statement" : "Principle Statement"}
                placeholder={
                  isGuardrail
                    ? "e.g., 'Never take adverse action without human approval'"
                    : "e.g., 'AI should augment human judgment, not replace it'"
                }
                value={principle}
                onChange={(e) => setPrinciple(e.target.value)}
                className="min-h-[80px]"
              />

              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!principle.trim()}
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Add {isGuardrail ? "Guardrail" : "Principle"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Principles List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Your Principles & Guardrails{" "}
            <span className="text-[var(--color-text-muted)]">({totalCount})</span>
          </h3>
        </div>

        <AnimatePresence mode="popLayout">
          {totalCount === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[var(--color-text-muted)]"
            >
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No principles or guardrails yet. Add your first one above!</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Guardrails */}
              {guardrails.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-coral)] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Guardrails ({guardrails.length})
                  </h4>
                  <div className="space-y-3">
                    {guardrails.map((g) => (
                      <motion.div
                        key={g.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card accent="coral" className="group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-[var(--color-accent-coral)] flex-shrink-0 mt-0.5" />
                              <p className="text-[var(--color-text)]">{g.principle}</p>
                            </div>
                            <button
                              onClick={() => deleteDesignPrinciple(g.id)}
                              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Principles */}
              {principles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Design Principles ({principles.length})
                  </h4>
                  <div className="space-y-3">
                    {principles.map((p) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card accent="yellow" className="group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Sparkles className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                              <p className="text-[var(--color-text)]">{p.principle}</p>
                            </div>
                            <button
                              onClick={() => deleteDesignPrinciple(p.id)}
                              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-1/opportunity-brainstorm">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Previous: Opportunity Brainstorm
          </Button>
        </Link>
        <Link href="/workshop/session-1">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Complete Session 1
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
