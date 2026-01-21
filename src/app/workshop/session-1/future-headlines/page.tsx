"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Newspaper,
  Calendar,
  Tag,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useFutureHeadlines,
} from "@/store/workshop";
import type { FutureHeadline } from "@/types/workshop";

const timeframes = [
  { value: "1-year", label: "1 Year" },
  { value: "2-year", label: "2 Years" },
  { value: "3-year", label: "3 Years" },
] as const;

const categories = [
  { value: "member", label: "Member Experience", color: "yellow" },
  { value: "employee", label: "Employee Experience", color: "coral" },
  { value: "business", label: "Business Results", color: "teal" },
  { value: "risk", label: "Risk & Governance", color: "yellow" },
] as const;

const exampleHeadlines = [
  {
    headline: "Organization Achieves 50% Faster Loan Decisions with AI Assistant",
    timeframe: "2-year",
    category: "member",
  },
  {
    headline: "Employee Satisfaction Soars as AI Handles Routine Tasks",
    timeframe: "1-year",
    category: "employee",
  },
  {
    headline: "AI-Powered Fraud Detection Prevents $2M in Losses",
    timeframe: "2-year",
    category: "business",
  },
  {
    headline: "Regulatory Audit Praises Transparent AI Governance Framework",
    timeframe: "3-year",
    category: "risk",
  },
];

export default function FutureHeadlinesPage() {
  const futureHeadlines = useFutureHeadlines();
  const { addFutureHeadline, deleteFutureHeadline } = useWorkshopStore();

  const [headline, setHeadline] = useState("");
  const [timeframe, setTimeframe] = useState<"1-year" | "2-year" | "3-year">("2-year");
  const [category, setCategory] = useState<"member" | "employee" | "business" | "risk">("member");
  const [showExamples, setShowExamples] = useState(true);

  const handleAdd = () => {
    if (!headline.trim()) return;

    addFutureHeadline({
      headline: headline.trim(),
      timeframe,
      category,
    });

    setHeadline("");
  };

  const getCategoryInfo = (cat: string) => {
    return categories.find((c) => c.value === cat) || categories[0];
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
            <Newspaper className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Future Headlines</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 1 of 3 · Session 1</p>
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
              Imagine it's 2-3 years from now. Your organization has successfully implemented
              Agentic AI. What headlines would you want to read about this journey?
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Think about:</p>
                <ul className="space-y-1 text-[var(--color-text-muted)]">
                  <li>• Member experience improvements</li>
                  <li>• Employee satisfaction gains</li>
                  <li>• Business metrics and results</li>
                  <li>• Risks you've successfully managed</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text)] mb-2">Goal:</p>
                <p className="text-[var(--color-text-muted)]">
                  Create at least 3-5 headlines that capture your vision. Be bold!
                  These aren't predictions—they're aspirations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Example Headlines */}
      {showExamples && futureHeadlines.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Example Headlines (click to use as inspiration)
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowExamples(false)}>
              Hide Examples
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {exampleHeadlines.map((example, i) => (
              <motion.button
                key={i}
                className="text-left p-4 rounded-lg border border-white/[0.08] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                onClick={() => {
                  setHeadline(example.headline);
                  setTimeframe(example.timeframe as any);
                  setCategory(example.category as any);
                }}
                whileHover={{ y: -2 }}
              >
                <p className="text-sm text-[var(--color-text)] mb-2">{example.headline}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    {getCategoryInfo(example.category).label}
                  </Badge>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {example.timeframe}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Headline Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card accent="yellow" hoverable={false}>
          <CardContent>
            <div className="space-y-4">
              <TextArea
                label="Your Headline"
                placeholder="e.g., 'Organization Achieves 50% Faster Loan Decisions with AI Assistant'"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="min-h-[80px]"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Timeframe
                  </label>
                  <div className="flex gap-2">
                    {timeframes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTimeframe(t.value)}
                        className={`
                          flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                          ${
                            timeframe === t.value
                              ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]"
                              : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          }
                        `}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[var(--color-text)]">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className={`
                          px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                          ${
                            category === c.value
                              ? c.color === "yellow"
                                ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]"
                                : c.color === "coral"
                                ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-accent-coral)]"
                                : "bg-[var(--color-accent-teal)]/20 border-[var(--color-accent-teal)] text-[var(--color-accent-teal)]"
                              : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          }
                        `}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!headline.trim()}
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full"
              >
                Add Headline
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Headlines List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Your Headlines{" "}
            <span className="text-[var(--color-text-muted)]">({futureHeadlines.length})</span>
          </h3>
        </div>

        <AnimatePresence mode="popLayout">
          {futureHeadlines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[var(--color-text-muted)]"
            >
              <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No headlines yet. Add your first one above!</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {futureHeadlines.map((h) => (
                <motion.div
                  key={h.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card accent={getCategoryInfo(h.category).color as any} className="group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-[var(--color-text)] font-medium mb-2">
                          "{h.headline}"
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="default">
                            {getCategoryInfo(h.category).label}
                          </Badge>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {h.timeframe === "1-year"
                              ? "1 Year"
                              : h.timeframe === "2-year"
                              ? "2 Years"
                              : "3 Years"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteFutureHeadline(h.id)}
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
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
        <Link href="/workshop/session-1">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 1
          </Button>
        </Link>
        <Link href="/workshop/session-1/opportunity-brainstorm">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Opportunity Brainstorm
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
