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
  Lightbulb,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useFrictionPoints,
} from "@/store/workshop";
import type { FrictionPoint } from "@/types/workshop";

const exampleFrictions = [
  {
    processArea: "Lending",
    description: "Loan officers spend 30+ minutes manually reviewing and keying in data from income documents (pay stubs, tax returns) into the LOS",
    priority: "high" as const,
  },
  {
    processArea: "Contact Center",
    description: "Agents must toggle between 5+ systems to answer basic member questions, leading to long hold times and frustrated members",
    priority: "high" as const,
  },
  {
    processArea: "Collections",
    description: "Manual outreach calls follow a static schedule rather than being timed for when members are most likely to respond",
    priority: "medium" as const,
  },
  {
    processArea: "Onboarding",
    description: "New members often abandon the account opening process due to lengthy identity verification steps",
    priority: "high" as const,
  },
];

export default function FrictionMapPage() {
  const frictionPoints = useFrictionPoints();
  const { addFrictionPoint, deleteFrictionPoint } = useWorkshopStore();

  const [processArea, setProcessArea] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | undefined>(undefined);
  const [showExamples, setShowExamples] = useState(true);

  // Validation state
  const [errors, setErrors] = useState<{
    processArea?: string;
    description?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!processArea.trim()) {
      newErrors.processArea = "Process area is required";
    } else if (processArea.trim().length < 2) {
      newErrors.processArea = "Process area must be at least 2 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) {
      return;
    }

    addFrictionPoint({
      processArea: processArea.trim(),
      description: description.trim(),
      priority,
    });

    setProcessArea("");
    setDescription("");
    setPriority(undefined);
    setErrors({});
  };

  // Clear errors on input change
  const handleProcessAreaChange = (value: string) => {
    setProcessArea(value);
    if (errors.processArea) {
      setErrors({ ...errors, processArea: undefined });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.description) {
      setErrors({ ...errors, description: undefined });
    }
  };

  const groupedFrictions = frictionPoints.reduce((acc, fp) => {
    if (!acc[fp.processArea]) acc[fp.processArea] = [];
    acc[fp.processArea].push(fp);
    return acc;
  }, {} as Record<string, FrictionPoint[]>);

  const getPriorityColor = (p?: string) => {
    if (p === "high") return "coral";
    if (p === "medium") return "yellow";
    if (p === "low") return "teal";
    return "default";
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
        <Card hoverable={false}>
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
              FORGE Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4 font-medium">
              Where do people say "I wish I didn't have to..."?
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Look for:</p>
                <ul className="space-y-1 text-[var(--color-text-muted)]">
                  <li>• Work that's repetitive and time-consuming</li>
                  <li>• Tasks where errors happen because humans get tired</li>
                  <li>• Processes that require switching between multiple systems</li>
                  <li>• Steps where smart people get stuck on tedious work</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Goal:</p>
                <p className="text-[var(--color-text-muted)]">
                  Identify concrete friction points in plain language. Focus on describing the
                  problem, not scoring or categorizing it.
                </p>
              </div>
            </div>
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
                  setPriority(example.priority);
                }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">{example.processArea}</Badge>
                  {example.priority && (
                    <Badge variant={getPriorityColor(example.priority) as any}>
                      {example.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text)]">
                  {example.description.slice(0, 120)}...
                </p>
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
              <Input
                label="Process Area"
                placeholder="e.g., Lending, Contact Center, Collections, Back Office..."
                value={processArea}
                onChange={(e) => handleProcessAreaChange(e.target.value)}
                error={errors.processArea}
                required
              />

              {/* Description */}
              <TextArea
                label="Friction Description"
                placeholder="Describe the friction point: What takes hours that should take minutes? Where do errors happen? What's repetitive and tedious?"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                error={errors.description}
                className="min-h-[100px]"
                required
              />

              {/* Priority (Optional) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  Priority <span className="text-xs text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPriority(priority === "high" ? undefined : "high")}
                    className={`
                      flex-1 px-4 py-2 text-sm rounded-lg border transition-colors
                      ${
                        priority === "high"
                          ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-accent-coral)]"
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
                      }
                    `}
                  >
                    High
                  </button>
                  <button
                    onClick={() => setPriority(priority === "medium" ? undefined : "medium")}
                    className={`
                      flex-1 px-4 py-2 text-sm rounded-lg border transition-colors
                      ${
                        priority === "medium"
                          ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
                      }
                    `}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setPriority(priority === "low" ? undefined : "low")}
                    className={`
                      flex-1 px-4 py-2 text-sm rounded-lg border transition-colors
                      ${
                        priority === "low"
                          ? "bg-[var(--color-accent-teal)]/20 border-[var(--color-accent-teal)] text-[var(--color-accent-teal)]"
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
                      }
                    `}
                  >
                    Low
                  </button>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  Priority is optional - use it to help rank friction points if helpful
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!processArea.trim() || !description.trim()}
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
                              {fp.priority && (
                                <Badge variant={getPriorityColor(fp.priority) as any} className="mb-2">
                                  {fp.priority} priority
                                </Badge>
                              )}
                              <p className="text-[var(--color-text)]">{fp.description}</p>
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
        {frictionPoints.length > 0 && (
          <Link href="/workshop/session-2/opportunity-scoring">
            <Button
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Opportunity Scoring
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
