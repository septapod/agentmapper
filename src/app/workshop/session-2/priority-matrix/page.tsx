"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Grid3X3,
  Lightbulb,
  Rocket,
  Clock,
  Gauge,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useScoredOpportunities } from "@/store/workshop";

const quadrantConfig = {
  "quick-win": {
    label: "Quick Wins",
    icon: <Rocket className="w-5 h-5" />,
    color: "teal",
    bgColor: "bg-[var(--color-accent-teal)]/10",
    borderColor: "border-[var(--color-accent-teal)]/30",
    textColor: "text-[var(--color-accent-teal)]",
    description: "High value, low complexity. Start here!",
    position: "top-left",
  },
  "strategic": {
    label: "Strategic Initiatives",
    icon: <Gauge className="w-5 h-5" />,
    color: "yellow",
    bgColor: "bg-[var(--color-accent)]/10",
    borderColor: "border-[var(--color-accent)]/30",
    textColor: "text-[var(--color-accent)]",
    description: "High value, high complexity. Plan carefully.",
    position: "top-right",
  },
  "fill-in": {
    label: "Fill-Ins",
    icon: <Clock className="w-5 h-5" />,
    color: "yellow",
    bgColor: "bg-[var(--color-surface)]",
    borderColor: "border-white/[0.1]",
    textColor: "text-[var(--color-text-muted)]",
    description: "Low value, low complexity. When resources allow.",
    position: "bottom-left",
  },
  "deprioritize": {
    label: "Deprioritize",
    icon: <XCircle className="w-5 h-5" />,
    color: "coral",
    bgColor: "bg-[var(--color-accent-coral)]/5",
    borderColor: "border-[var(--color-accent-coral)]/20",
    textColor: "text-[var(--color-accent-coral)]",
    description: "Low value, high complexity. Avoid for now.",
    position: "bottom-right",
  },
};

export default function PriorityMatrixPage() {
  const scoredOpportunities = useScoredOpportunities();

  const groupedByQuadrant = useMemo(() => {
    return {
      "quick-win": scoredOpportunities.filter(o => o.quadrant === "quick-win"),
      "strategic": scoredOpportunities.filter(o => o.quadrant === "strategic"),
      "fill-in": scoredOpportunities.filter(o => o.quadrant === "fill-in"),
      "deprioritize": scoredOpportunities.filter(o => o.quadrant === "deprioritize"),
    };
  }, [scoredOpportunities]);

  const totalScored = scoredOpportunities.length;

  if (totalScored === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
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
            <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Priority Matrix</h1>
              <p className="text-[var(--color-text-muted)]">Exercise 3 of 4 · Session 2</p>
            </div>
          </div>
        </motion.div>

        <Card accent="coral" hoverable={false}>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-accent-coral)]" />
            <p className="text-[var(--color-text)] font-medium mb-2">No scored opportunities yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Complete the Opportunity Scoring exercise first to populate this matrix.
            </p>
            <Link href="/workshop/session-2/opportunity-scoring">
              <Button variant="primary">Go to Opportunity Scoring</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
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
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Grid3X3 className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Priority Matrix</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 3 of 4 · Session 2</p>
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
        <Card accent="yellow" hoverable={false}>
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
              Understanding the Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4">
              Your scored opportunities are automatically positioned based on their Value and Complexity scores.
              Focus on <strong>Quick Wins</strong> for immediate pilots, and plan <strong>Strategic</strong> initiatives carefully.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-text)]">{totalScored}</span> opportunities scored and positioned
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2x2 Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Axis Labels */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              ← Low Value | High Value →
            </span>
          </div>
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              ← Low Complexity | High Complexity →
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-2 gap-4 ml-8">
            {/* Top Row: Quick Wins & Strategic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`min-h-[280px] rounded-xl p-4 border ${quadrantConfig["quick-win"].bgColor} ${quadrantConfig["quick-win"].borderColor}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={quadrantConfig["quick-win"].textColor}>
                  {quadrantConfig["quick-win"].icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${quadrantConfig["quick-win"].textColor}`}>
                    {quadrantConfig["quick-win"].label}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {quadrantConfig["quick-win"].description}
                  </p>
                </div>
                <Badge variant="teal" className="ml-auto">
                  {groupedByQuadrant["quick-win"].length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedByQuadrant["quick-win"].map((opp) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent-teal)]/20"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] mb-1">{opp.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span>V: {opp.valueScore}</span>
                      <span>C: {opp.complexityScore}</span>
                    </div>
                  </motion.div>
                ))}
                {groupedByQuadrant["quick-win"].length === 0 && (
                  <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                    No quick wins identified
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className={`min-h-[280px] rounded-xl p-4 border ${quadrantConfig["strategic"].bgColor} ${quadrantConfig["strategic"].borderColor}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={quadrantConfig["strategic"].textColor}>
                  {quadrantConfig["strategic"].icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${quadrantConfig["strategic"].textColor}`}>
                    {quadrantConfig["strategic"].label}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {quadrantConfig["strategic"].description}
                  </p>
                </div>
                <Badge variant="yellow" className="ml-auto">
                  {groupedByQuadrant["strategic"].length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedByQuadrant["strategic"].map((opp) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)]/20"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] mb-1">{opp.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span>V: {opp.valueScore}</span>
                      <span>C: {opp.complexityScore}</span>
                    </div>
                  </motion.div>
                ))}
                {groupedByQuadrant["strategic"].length === 0 && (
                  <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                    No strategic initiatives identified
                  </p>
                )}
              </div>
            </motion.div>

            {/* Bottom Row: Fill-Ins & Deprioritize */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={`min-h-[280px] rounded-xl p-4 border ${quadrantConfig["fill-in"].bgColor} ${quadrantConfig["fill-in"].borderColor}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={quadrantConfig["fill-in"].textColor}>
                  {quadrantConfig["fill-in"].icon}
                </div>
                <div>
                  <h3 className={`font-semibold text-[var(--color-text)]`}>
                    {quadrantConfig["fill-in"].label}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {quadrantConfig["fill-in"].description}
                  </p>
                </div>
                <Badge variant="default" className="ml-auto">
                  {groupedByQuadrant["fill-in"].length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedByQuadrant["fill-in"].map((opp) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-[var(--color-bg)] rounded-lg border border-white/[0.08]"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] mb-1">{opp.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span>V: {opp.valueScore}</span>
                      <span>C: {opp.complexityScore}</span>
                    </div>
                  </motion.div>
                ))}
                {groupedByQuadrant["fill-in"].length === 0 && (
                  <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                    No fill-ins identified
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              className={`min-h-[280px] rounded-xl p-4 border ${quadrantConfig["deprioritize"].bgColor} ${quadrantConfig["deprioritize"].borderColor}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={quadrantConfig["deprioritize"].textColor}>
                  {quadrantConfig["deprioritize"].icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${quadrantConfig["deprioritize"].textColor}`}>
                    {quadrantConfig["deprioritize"].label}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {quadrantConfig["deprioritize"].description}
                  </p>
                </div>
                <Badge variant="coral" className="ml-auto">
                  {groupedByQuadrant["deprioritize"].length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedByQuadrant["deprioritize"].map((opp) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent-coral)]/10"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] mb-1">{opp.title}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span>V: {opp.valueScore}</span>
                      <span>C: {opp.complexityScore}</span>
                    </div>
                  </motion.div>
                ))}
                {groupedByQuadrant["deprioritize"].length === 0 && (
                  <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                    No deprioritized items
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card accent="teal" hoverable={false}>
          <CardHeader>
            <CardTitle as="h2">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-accent-teal)] mb-2">
                  For Dot Voting, Focus On:
                </h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-body)]">
                  <li className="flex items-start gap-2">
                    <Rocket className="w-4 h-4 mt-0.5 text-[var(--color-accent-teal)]" />
                    <span><strong>Quick Wins</strong> are ideal first pilots—high value with manageable complexity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Gauge className="w-4 h-4 mt-0.5 text-[var(--color-accent)]" />
                    <span><strong>Strategic</strong> opportunities may need to be broken into smaller phases</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">
                  Consider Avoiding:
                </h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5" />
                    <span><strong>Fill-Ins</strong> offer limited learning—save for later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 text-[var(--color-accent-coral)]" />
                    <span><strong>Deprioritize</strong> items aren't worth the effort right now</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center"
      >
        <Link href="/workshop/session-2/opportunity-scoring">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Previous: Opportunity Scoring
          </Button>
        </Link>
        <Link href="/workshop/session-2/dot-voting">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Dot Voting
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
