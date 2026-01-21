"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Target,
  Building2,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useOpportunities,
} from "@/store/workshop";

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
  "Other",
];

const exampleOpportunities = [
  {
    title: "Automated Loan Document Processing",
    description: "Use AI to extract and validate information from loan applications, reducing manual data entry and speeding up decisions.",
    area: "Lending",
  },
  {
    title: "Intelligent Call Routing",
    description: "Route calls to the best-suited agent based on member history, intent, and agent expertise.",
    area: "Contact Center",
  },
  {
    title: "Proactive Fraud Detection",
    description: "Monitor transactions in real-time and flag suspicious activity before losses occur.",
    area: "Compliance",
  },
  {
    title: "Personalized Member Outreach",
    description: "Send timely, personalized financial recommendations based on member behavior and life events.",
    area: "Marketing",
  },
];

export default function OpportunityBrainstormPage() {
  const opportunities = useOpportunities();
  const { addOpportunity, deleteOpportunity } = useWorkshopStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("Member Services");
  const [showExamples, setShowExamples] = useState(true);

  const handleAdd = () => {
    if (!title.trim()) return;

    addOpportunity({
      title: title.trim(),
      description: description.trim(),
      area,
    });

    setTitle("");
    setDescription("");
  };

  const groupedOpportunities = opportunities.reduce((acc, opp) => {
    if (!acc[opp.area]) acc[opp.area] = [];
    acc[opp.area].push(opp);
    return acc;
  }, {} as Record<string, typeof opportunities>);

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
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-coral)]/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-[var(--color-accent-coral)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Opportunity Brainstorm</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 2 of 3 · Session 1</p>
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
              Capture initial ideas about where Agentic AI could help across your organization.
              Think about friction points, repetitive tasks, and areas where speed or accuracy matter.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Consider:</p>
                <ul className="space-y-1 text-[var(--color-text-muted)]">
                  <li>• Where do people spend time on repetitive tasks?</li>
                  <li>• What processes have long wait times?</li>
                  <li>• Where do errors commonly occur?</li>
                  <li>• What could be more personalized?</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Goal:</p>
                <p className="text-[var(--color-text-muted)]">
                  Capture at least 5-10 opportunities. Don't worry about feasibility yet—
                  we'll refine and prioritize these in Session 2.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Example Opportunities */}
      {showExamples && opportunities.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Example Opportunities (click to use as starting point)
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowExamples(false)}>
              Hide Examples
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {exampleOpportunities.map((example, i) => (
              <motion.button
                key={i}
                className="text-left p-4 rounded-lg border border-white/[0.08] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => {
                  setTitle(example.title);
                  setDescription(example.description);
                  setArea(example.area);
                }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">{example.area}</Badge>
                </div>
                <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                  {example.title}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {example.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Opportunity Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card accent="coral" hoverable={false}>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Opportunity Title"
                placeholder="e.g., 'Automated Loan Document Processing'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextArea
                label="Description"
                placeholder="Briefly describe what the AI would do and the expected benefit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Process Area
                </label>
                <div className="flex flex-wrap gap-2">
                  {processAreas.map((a) => (
                    <button
                      key={a}
                      onClick={() => setArea(a)}
                      className={`
                        px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                        ${
                          area === a
                            ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-accent-coral)]"
                            : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                        }
                      `}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!title.trim()}
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Add Opportunity
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Opportunities List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Your Opportunities{" "}
            <span className="text-[var(--color-text-muted)]">({opportunities.length})</span>
          </h3>
        </div>

        <AnimatePresence mode="popLayout">
          {opportunities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[var(--color-text-muted)]"
            >
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No opportunities yet. Add your first one above!</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedOpportunities).map(([areaName, areaOpps]) => (
                <div key={areaName}>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    {areaName} ({areaOpps.length})
                  </h4>
                  <div className="space-y-3">
                    {areaOpps.map((opp) => (
                      <motion.div
                        key={opp.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card accent="coral" className="group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-[var(--color-text)] font-medium mb-1">
                                {opp.title}
                              </p>
                              {opp.description && (
                                <p className="text-sm text-[var(--color-text-muted)]">
                                  {opp.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => deleteOpportunity(opp.id)}
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
        <Link href="/workshop/session-1/future-headlines">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Previous: Future Headlines
          </Button>
        </Link>
        <Link href="/workshop/session-1/design-principles">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Design Principles
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
