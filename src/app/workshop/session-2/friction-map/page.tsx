"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Map,
  AlertCircle,
  Lightbulb,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useFrictionPoints,
  useOpportunities,
} from "@/store/workshop";
import type { FrictionPoint } from "@/types/workshop";

const processAreas = [
  "Member Services",
  "Lending",
  "Collections",
  "Contact Center",
  "Back Office",
  "Compliance",
  "Marketing",
  "HR/Internal",
  "IT Operations",
  "Onboarding",
  "Fraud Prevention",
  "Other",
];

const frequencies = [
  { value: "daily", label: "Daily", color: "coral" },
  { value: "weekly", label: "Weekly", color: "yellow" },
  { value: "monthly", label: "Monthly", color: "teal" },
  { value: "quarterly", label: "Quarterly", color: "yellow" },
] as const;

const impactLevels = [
  { value: 1, label: "Minimal", description: "Minor inconvenience" },
  { value: 2, label: "Low", description: "Noticeable inefficiency" },
  { value: 3, label: "Medium", description: "Significant time/effort waste" },
  { value: 4, label: "High", description: "Major pain point" },
  { value: 5, label: "Critical", description: "Severe impact on operations" },
] as const;

const exampleFrictions = [
  {
    processArea: "Lending",
    description: "Loan officers spend 30+ minutes manually reviewing and keying in data from income documents (pay stubs, tax returns) into the LOS",
    impactLevel: 4 as const,
    frequency: "daily" as const,
    affectedRoles: ["Loan Officers", "Underwriters"],
  },
  {
    processArea: "Contact Center",
    description: "Agents must toggle between 5+ systems to answer basic member questions, leading to long hold times and frustrated members",
    impactLevel: 5 as const,
    frequency: "daily" as const,
    affectedRoles: ["Contact Center Agents", "Members"],
  },
  {
    processArea: "Collections",
    description: "Manual outreach calls follow a static schedule rather than being timed for when members are most likely to respond",
    impactLevel: 3 as const,
    frequency: "daily" as const,
    affectedRoles: ["Collections Specialists"],
  },
  {
    processArea: "Onboarding",
    description: "New members often abandon the account opening process due to lengthy identity verification steps",
    impactLevel: 4 as const,
    frequency: "weekly" as const,
    affectedRoles: ["New Members", "MSRs"],
  },
];

export default function FrictionMapPage() {
  const frictionPoints = useFrictionPoints();
  const opportunities = useOpportunities();
  const { addFrictionPoint, deleteFrictionPoint } = useWorkshopStore();

  const [processArea, setProcessArea] = useState("Member Services");
  const [description, setDescription] = useState("");
  const [impactLevel, setImpactLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "quarterly">("daily");
  const [affectedRoles, setAffectedRoles] = useState("");
  const [showExamples, setShowExamples] = useState(true);

  const handleAdd = () => {
    if (!description.trim()) return;

    addFrictionPoint({
      processArea,
      description: description.trim(),
      impactLevel,
      frequency,
      affectedRoles: affectedRoles.split(",").map(r => r.trim()).filter(Boolean),
    });

    setDescription("");
    setAffectedRoles("");
  };

  const groupedFrictions = frictionPoints.reduce((acc, fp) => {
    if (!acc[fp.processArea]) acc[fp.processArea] = [];
    acc[fp.processArea].push(fp);
    return acc;
  }, {} as Record<string, FrictionPoint[]>);

  const getImpactColor = (level: number) => {
    if (level >= 4) return "text-[var(--color-accent-coral)]";
    if (level >= 3) return "text-[var(--color-accent)]";
    return "text-[var(--color-text-muted)]";
  };

  const getFrequencyBadge = (freq: string) => {
    const f = frequencies.find(f => f.value === freq);
    return f ? f.color : "yellow";
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
          href="/workshop/session-2"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Session 2
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-coral)]/20 flex items-center justify-center">
            <Map className="w-6 h-6 text-[var(--color-accent-coral)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Friction Mapping</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 1 of 4 · Session 2</p>
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
        <Card accent="coral" hoverable={false}>
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4">
              Map friction points across your processes. Think about where time is wasted,
              errors occur, handoffs fail, or members experience frustration.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Look for:</p>
                <ul className="space-y-1 text-[var(--color-text-muted)]">
                  <li>• Manual data entry and re-keying</li>
                  <li>• Waiting for approvals or handoffs</li>
                  <li>• System switching and context loss</li>
                  <li>• Error-prone steps requiring rework</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Goal:</p>
                <p className="text-[var(--color-text-muted)]">
                  Identify at least 5-8 friction points. High-frequency, high-impact
                  frictions are your best candidates for AI-assisted improvement.
                </p>
              </div>
            </div>

            {/* Show opportunities from Session 1 */}
            {opportunities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/[0.08]">
                <p className="text-sm font-semibold text-[var(--color-text)] mb-2">
                  <Zap className="w-4 h-4 inline mr-2 text-[var(--color-accent)]" />
                  Your Session 1 Opportunities ({opportunities.length})
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">
                  Consider these opportunities as you map friction points:
                </p>
                <div className="flex flex-wrap gap-2">
                  {opportunities.slice(0, 6).map(opp => (
                    <Badge key={opp.id} variant="default">{opp.title}</Badge>
                  ))}
                  {opportunities.length > 6 && (
                    <Badge variant="default">+{opportunities.length - 6} more</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Example Frictions */}
      {showExamples && frictionPoints.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Example Friction Points (click to use)
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowExamples(false)}>
              Hide Examples
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {exampleFrictions.map((example, i) => (
              <motion.button
                key={i}
                className="text-left p-4 rounded-lg border border-white/[0.08] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => {
                  setProcessArea(example.processArea);
                  setDescription(example.description);
                  setImpactLevel(example.impactLevel);
                  setFrequency(example.frequency);
                  setAffectedRoles(example.affectedRoles.join(", "));
                }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">{example.processArea}</Badge>
                  <Badge variant={getFrequencyBadge(example.frequency) as any}>
                    {example.frequency}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--color-text)] mb-2">
                  {example.description.slice(0, 100)}...
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <AlertCircle className={`w-3 h-3 ${getImpactColor(example.impactLevel)}`} />
                  Impact: {impactLevels.find(l => l.value === example.impactLevel)?.label}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Friction Point Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card accent="coral" hoverable={false}>
          <CardContent>
            <div className="space-y-4">
              {/* Process Area */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  Process Area
                </label>
                <div className="flex flex-wrap gap-2">
                  {processAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => setProcessArea(area)}
                      className={`
                        px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                        ${
                          processArea === area
                            ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-accent-coral)]"
                            : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        }
                      `}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <TextArea
                label="Friction Description"
                placeholder="Describe the friction point: What happens? Why is it painful? What triggers it?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />

              {/* Impact & Frequency */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Impact Level
                  </label>
                  <div className="space-y-2">
                    {impactLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setImpactLevel(level.value as 1 | 2 | 3 | 4 | 5)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border transition-colors
                          ${
                            impactLevel === level.value
                              ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-text)]"
                              : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          }
                        `}
                      >
                        <span className="font-medium">{level.value}. {level.label}</span>
                        <span className="text-xs opacity-60">{level.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Frequency
                  </label>
                  <div className="space-y-2">
                    {frequencies.map((freq) => (
                      <button
                        key={freq.value}
                        onClick={() => setFrequency(freq.value)}
                        className={`
                          w-full px-3 py-2 text-sm font-medium rounded-lg border transition-colors text-left
                          ${
                            frequency === freq.value
                              ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-text)]"
                              : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          }
                        `}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Affected Roles */}
              <Input
                label={
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Affected Roles (comma-separated)
                  </span>
                }
                placeholder="e.g., Loan Officers, Members, Contact Center Agents"
                value={affectedRoles}
                onChange={(e) => setAffectedRoles(e.target.value)}
              />

              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!description.trim()}
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Add Friction Point
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Friction Points List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Your Friction Points{" "}
            <span className="text-[var(--color-text-muted)]">({frictionPoints.length})</span>
          </h3>
        </div>

        <AnimatePresence mode="popLayout">
          {frictionPoints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[var(--color-text-muted)]"
            >
              <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No friction points yet. Add your first one above!</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFrictions).map(([areaName, areaFrictions]) => (
                <div key={areaName}>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    {areaName} ({areaFrictions.length})
                  </h4>
                  <div className="space-y-3">
                    {areaFrictions.map((fp) => (
                      <motion.div
                        key={fp.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card accent="coral" className="group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getFrequencyBadge(fp.frequency) as any}>
                                  {fp.frequency}
                                </Badge>
                                <span className={`text-sm font-medium ${getImpactColor(fp.impactLevel)}`}>
                                  Impact: {impactLevels.find(l => l.value === fp.impactLevel)?.label}
                                </span>
                              </div>
                              <p className="text-[var(--color-text)] mb-2">{fp.description}</p>
                              {fp.affectedRoles.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                                  <Users className="w-3 h-3" />
                                  {fp.affectedRoles.join(", ")}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteFrictionPoint(fp.id)}
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
              ))}
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
        <Link href="/workshop/session-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 2
          </Button>
        </Link>
        <Link href="/workshop/session-2/opportunity-scoring">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Opportunity Scoring
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
