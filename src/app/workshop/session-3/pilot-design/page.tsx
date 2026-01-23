"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Compass,
  AlertCircle,
  Lightbulb,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  usePilotDesigns,
  useFrictionPoints,
} from "@/store/workshop";

// Anthropic's 5 Workflow Patterns
const aiPatterns = [
  {
    id: "prompt-chaining",
    name: "Prompt Chaining",
    description: "Sequential steps where each AI call processes the previous output",
    bestFor: "Fixed subtasks with verification between steps",
  },
  {
    id: "routing",
    name: "Routing",
    description: "Classify inputs and direct to specialized handlers",
    bestFor: "Distinct categories requiring different processing",
  },
  {
    id: "parallelization",
    name: "Parallelization",
    description: "Multiple AI operations running simultaneously",
    bestFor: "Independent subtasks or getting multiple perspectives",
  },
  {
    id: "orchestrator-workers",
    name: "Orchestrator-Workers",
    description: "Central AI delegates to specialized workers dynamically",
    bestFor: "Complex tasks with unpredictable subtask breakdown",
  },
  {
    id: "evaluator-optimizer",
    name: "Evaluator-Optimizer",
    description: "One AI generates, another evaluates in iterative loops",
    bestFor: "Quality improvement through iteration",
  },
] as const;

// BCG's 4 Autonomy Tiers
const autonomyLevels = [
  {
    id: "shadow",
    name: "Shadow Mode",
    tier: "Tier 1",
    description: "AI suggests, humans decide and act",
    recommended: true,
    detail: "Training ground to validate AI logic without operational risk",
  },
  {
    id: "supervised",
    name: "Supervised Autonomy",
    tier: "Tier 2",
    description: "AI acts with approval gates",
    recommended: false,
    detail: "Human-in-the-loop with tap-to-approve workflow",
  },
  {
    id: "monitored",
    name: "Monitored Autonomy",
    tier: "Tier 3",
    description: "AI acts, humans monitor",
    recommended: false,
    detail: "Human-on-the-loop with policy-based operation",
  },
  {
    id: "full",
    name: "Full Autonomy",
    tier: "Tier 4",
    description: "AI operates independently",
    recommended: false,
    detail: "Reserved for mature, low-risk environments",
  },
] as const;

// McKinsey's 4 Risk Categories
const riskCategories = [
  {
    id: "decisionBoundaries",
    name: "Decision Boundaries",
    description: "AI might make decisions outside its defined scope",
  },
  {
    id: "hallucinations",
    name: "Hallucinations",
    description: "AI might produce confident but incorrect outputs",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "AI interfaces might create new attack vectors",
  },
  {
    id: "chainOfAuthority",
    name: "Chain of Authority",
    description: "Accountability for AI actions might be unclear",
  },
] as const;

type AIPattern = typeof aiPatterns[number]["id"];
type AutonomyLevel = typeof autonomyLevels[number]["id"];

export default function PilotDesignPage() {
  const pilotDesigns = usePilotDesigns();
  const frictionPoints = useFrictionPoints();
  const { addPilotDesign, deletePilotDesign } = useWorkshopStore();

  // Form state
  const [selectedFrictionId, setSelectedFrictionId] = useState("");
  const [aiPattern, setAiPattern] = useState<AIPattern>("prompt-chaining");
  const [patternRationale, setPatternRationale] = useState("");
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>("shadow");
  const [promotionCriteria, setPromotionCriteria] = useState("");
  const [risks, setRisks] = useState({
    decisionBoundaries: false,
    hallucinations: false,
    cybersecurity: false,
    chainOfAuthority: false,
  });
  const [mitigations, setMitigations] = useState("");

  const handleRiskToggle = (riskId: keyof typeof risks) => {
    setRisks((prev) => ({ ...prev, [riskId]: !prev[riskId] }));
  };

  const handleSubmit = () => {
    if (!selectedFrictionId) return;

    addPilotDesign({
      frictionPointId: selectedFrictionId,
      aiPattern,
      patternRationale: patternRationale.trim(),
      autonomyLevel,
      promotionCriteria: promotionCriteria.trim(),
      risks,
      mitigations: mitigations.trim(),
    });

    // Reset form
    setSelectedFrictionId("");
    setAiPattern("prompt-chaining");
    setPatternRationale("");
    setAutonomyLevel("shadow");
    setPromotionCriteria("");
    setRisks({
      decisionBoundaries: false,
      hallucinations: false,
      cybersecurity: false,
      chainOfAuthority: false,
    });
    setMitigations("");
  };

  // Only require friction selection
  const canSubmit = !!selectedFrictionId;

  const getPatternLabel = (id: AIPattern) => aiPatterns.find((p) => p.id === id)?.name || id;
  const getAutonomyLabel = (id: AutonomyLevel) => autonomyLevels.find((a) => a.id === id)?.name || id;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop/session-3"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Session 3
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-teal)]/20 flex items-center justify-center">
            <Compass className="w-6 h-6 text-[var(--color-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Pilot Design</h1>
            <p className="text-[var(--color-text-muted)]">
              Design how AI will work in your workflow
            </p>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">Three Critical Decisions</p>
              <p className="text-[var(--color-text-muted)]">
                Before building, executives must decide: (1) which AI pattern fits this workflow,
                (2) what autonomy level to start with, and (3) what risks to mitigate.
                <span className="font-medium text-[var(--color-text)]"> Start with Shadow Mode</span> —
                autonomy is earned through proven performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Design Your Pilot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Step 1: Select Friction Point */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <span className="inline-flex items-center gap-2">
                  <Badge variant="teal">Step 1</Badge>
                  Select Friction Point
                  <span className="text-[var(--color-accent-coral)]">*</span>
                </span>
              </label>
              {frictionPoints.length === 0 ? (
                <Card accent="yellow">
                  <CardContent className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">No friction points found</p>
                      <p className="text-[var(--color-text-muted)]">
                        Please complete Session 2 (Friction Mapping) first.
                      </p>
                      <Link href="/workshop/session-2/friction-map">
                        <Button variant="default" size="sm" className="mt-3">
                          Go to Friction Mapping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <select
                  value={selectedFrictionId}
                  onChange={(e) => setSelectedFrictionId(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                >
                  <option value="">Choose a friction point...</option>
                  {frictionPoints.map((fp) => (
                    <option key={fp.id} value={fp.id}>
                      {fp.processArea}: {fp.description.substring(0, 100)}
                      {fp.description.length > 100 ? "..." : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 2: Choose AI Pattern */}
            <div>
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center gap-2">
                  <Badge variant="teal">Step 2</Badge>
                  Choose AI Pattern
                </span>
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                How should AI process this work? Based on Anthropic&apos;s 5 workflow patterns.
              </p>
              <div className="space-y-3">
                {aiPatterns.map((pattern) => (
                  <label
                    key={pattern.id}
                    className={`
                      flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        aiPattern === pattern.id
                          ? "border-[var(--color-accent-teal)] bg-[var(--color-accent-teal)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-accent-teal)]/50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="aiPattern"
                      value={pattern.id}
                      checked={aiPattern === pattern.id}
                      onChange={(e) => setAiPattern(e.target.value as AIPattern)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{pattern.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{pattern.description}</p>
                      <p className="text-xs text-[var(--color-accent-teal)] mt-1">
                        Best for: {pattern.bestFor}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
                  Why this pattern? (optional)
                </label>
                <TextArea
                  value={patternRationale}
                  onChange={(e) => setPatternRationale(e.target.value)}
                  placeholder="Briefly explain why this pattern fits your workflow..."
                  rows={2}
                  className="w-full"
                />
              </div>
            </div>

            {/* Step 3: Set Autonomy Level */}
            <div>
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center gap-2">
                  <Badge variant="teal">Step 3</Badge>
                  Set Starting Autonomy
                </span>
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                How much should AI do on its own? Based on BCG&apos;s graduated autonomy framework.
              </p>
              <div className="space-y-3">
                {autonomyLevels.map((level) => (
                  <label
                    key={level.id}
                    className={`
                      flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        autonomyLevel === level.id
                          ? "border-[var(--color-accent-teal)] bg-[var(--color-accent-teal)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-accent-teal)]/50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="autonomyLevel"
                      value={level.id}
                      checked={autonomyLevel === level.id}
                      onChange={(e) => setAutonomyLevel(e.target.value as AutonomyLevel)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">
                        {level.name}
                        {level.recommended && (
                          <Badge variant="teal" className="ml-2 text-xs">
                            Recommended
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        <span className="font-medium">{level.tier}:</span> {level.description}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{level.detail}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
                  What earns higher autonomy? (optional)
                </label>
                <TextArea
                  value={promotionCriteria}
                  onChange={(e) => setPromotionCriteria(e.target.value)}
                  placeholder="e.g., 95% accuracy for 30 days, zero critical errors..."
                  rows={2}
                  className="w-full"
                />
              </div>
            </div>

            {/* Step 4: Flag Risks */}
            <div>
              <label className="block text-sm font-medium mb-3">
                <span className="inline-flex items-center gap-2">
                  <Badge variant="yellow">Step 4</Badge>
                  Flag Risks
                </span>
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                What could go wrong? Based on McKinsey&apos;s agentic AI risk categories.
              </p>
              <div className="space-y-3">
                {riskCategories.map((risk) => (
                  <label
                    key={risk.id}
                    className={`
                      flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all
                      ${
                        risks[risk.id as keyof typeof risks]
                          ? "border-[var(--color-accent-yellow)] bg-[var(--color-accent-yellow)]/10"
                          : "border-[var(--color-border)] hover:border-[var(--color-accent-yellow)]/50"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={risks[risk.id as keyof typeof risks]}
                      onChange={() => handleRiskToggle(risk.id as keyof typeof risks)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[var(--color-accent-yellow)]" />
                        {risk.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">{risk.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
                  Mitigations (optional)
                </label>
                <TextArea
                  value={mitigations}
                  onChange={(e) => setMitigations(e.target.value)}
                  placeholder="How will you address the flagged risks?"
                  rows={2}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!canSubmit}
              className="w-full"
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Save Pilot Design
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing Pilot Designs */}
      {pilotDesigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-4">Your Pilot Designs</h2>
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {pilotDesigns.map((design) => {
                const friction = frictionPoints.find((fp) => fp.id === design.frictionPointId);
                const flaggedRisks = Object.entries(design.risks)
                  .filter(([, flagged]) => flagged)
                  .map(([id]) => riskCategories.find((r) => r.id === id)?.name || id);

                return (
                  <motion.div
                    key={design.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card accent="teal">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default">
                                {friction?.processArea || "Unknown Area"}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">
                              {friction?.description.substring(0, 100) || "No friction point linked"}
                            </CardTitle>
                          </div>
                          <Button
                            onClick={() => deletePilotDesign(design.id)}
                            variant="ghost"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                              AI Pattern
                            </p>
                            <Badge variant="teal">{getPatternLabel(design.aiPattern)}</Badge>
                            {design.patternRationale && (
                              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                {design.patternRationale}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                              Starting Autonomy
                            </p>
                            <Badge variant="default">{getAutonomyLabel(design.autonomyLevel)}</Badge>
                            {design.promotionCriteria && (
                              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                Promotion: {design.promotionCriteria}
                              </p>
                            )}
                          </div>
                        </div>

                        {flaggedRisks.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                              Flagged Risks
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {flaggedRisks.map((risk) => (
                                <Badge key={risk} variant="yellow">
                                  <Shield className="w-3 h-3 mr-1" />
                                  {risk}
                                </Badge>
                              ))}
                            </div>
                            {design.mitigations && (
                              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                <span className="font-medium">Mitigations:</span> {design.mitigations}
                              </p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-3">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 3
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          {pilotDesigns.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)]">
              Tip: Save at least one pilot design to continue
            </p>
          )}
          {pilotDesigns.length > 0 && (
            <Link href="/workshop/session-3/mvp-spec">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to MVP Specification
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
