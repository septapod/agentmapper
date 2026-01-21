"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Puzzle,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useFrictionPoints,
  useScoredOpportunities,
  useOpportunities,
} from "@/store/workshop";

const valueFactors = [
  { label: "Member Impact", description: "How much does this improve member experience?" },
  { label: "Efficiency Gains", description: "How much time/cost savings does this create?" },
  { label: "Revenue Potential", description: "Does this drive growth or reduce losses?" },
  { label: "Strategic Alignment", description: "How well does this align with CU priorities?" },
];

const complexityFactors = [
  { label: "Technical", description: "Systems integration, data quality, AI model complexity" },
  { label: "Organizational", description: "Change management, training, process redesign" },
  { label: "Regulatory", description: "Compliance requirements, audit considerations" },
  { label: "Data Availability", description: "Is the data clean, accessible, and sufficient?" },
];

const getQuadrant = (value: number, complexity: number): "quick-win" | "strategic" | "fill-in" | "deprioritize" => {
  if (value >= 3 && complexity <= 3) return "quick-win";
  if (value >= 3 && complexity > 3) return "strategic";
  if (value < 3 && complexity <= 3) return "fill-in";
  return "deprioritize";
};

const quadrantInfo = {
  "quick-win": {
    label: "Quick Win",
    color: "teal",
    description: "High value, low complexity - prioritize these"
  },
  "strategic": {
    label: "Strategic",
    color: "yellow",
    description: "High value, high complexity - plan carefully"
  },
  "fill-in": {
    label: "Fill-In",
    color: "yellow",
    description: "Low value, low complexity - do when resources allow"
  },
  "deprioritize": {
    label: "Deprioritize",
    color: "coral",
    description: "Low value, high complexity - avoid for now"
  },
};

export default function OpportunityScoringPage() {
  const frictionPoints = useFrictionPoints();
  const opportunities = useOpportunities();
  const scoredOpportunities = useScoredOpportunities();
  const { addScoredOpportunity, updateScoredOpportunity } = useWorkshopStore();

  // Combine friction points and opportunities as scoring candidates
  const candidates = useMemo(() => {
    const items: Array<{ id: string; title: string; description: string; type: "friction" | "opportunity"; source: string }> = [];

    frictionPoints.forEach(fp => {
      items.push({
        id: fp.id,
        title: `[${fp.processArea}] Friction Point`,
        description: fp.description,
        type: "friction",
        source: fp.processArea,
      });
    });

    opportunities.forEach(opp => {
      items.push({
        id: opp.id,
        title: opp.title,
        description: opp.description,
        type: "opportunity",
        source: opp.area,
      });
    });

    return items;
  }, [frictionPoints, opportunities]);

  // Find unscored candidates
  const unscoredCandidates = candidates.filter(
    c => !scoredOpportunities.some(s => s.frictionId === c.id || s.title === c.title)
  );

  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(
    unscoredCandidates[0] || null
  );
  const [valueScore, setValueScore] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [complexityScore, setComplexityScore] = useState<1 | 2 | 3 | 4 | 5>(3);

  const handleScore = () => {
    if (!selectedCandidate) return;

    const quadrant = getQuadrant(valueScore, complexityScore);

    addScoredOpportunity({
      frictionId: selectedCandidate.type === "friction" ? selectedCandidate.id : undefined,
      title: selectedCandidate.title,
      description: selectedCandidate.description,
      valueScore,
      complexityScore,
      quadrant,
      voteCount: 0,
      selectedForPilot: false,
    });

    // Move to next unscored candidate
    const nextUnscored = candidates.find(
      c =>
        c.id !== selectedCandidate.id &&
        !scoredOpportunities.some(s => s.frictionId === c.id || s.title === c.title)
    );
    setSelectedCandidate(nextUnscored || null);
    setValueScore(3);
    setComplexityScore(3);
  };

  const scoredCount = scoredOpportunities.length;
  const totalCandidates = candidates.length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
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
            <BarChart3 className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Opportunity Scoring</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 2 of 4 · Session 2</p>
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
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4">
              Score each opportunity on two dimensions: <strong>Value</strong> (impact, efficiency, revenue)
              and <strong>Complexity</strong> (technical, organizational, regulatory).
              This will automatically position them in the priority matrix.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-[var(--color-accent-teal)]/10 rounded-lg border border-[var(--color-accent-teal)]/20">
                <p className="font-semibold text-[var(--color-accent-teal)] mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Value Factors
                </p>
                <ul className="space-y-2 text-[var(--color-text-muted)]">
                  {valueFactors.map((f, i) => (
                    <li key={i}>
                      <span className="font-medium text-[var(--color-text)]">{f.label}:</span>{" "}
                      {f.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-accent-coral)]/10 rounded-lg border border-[var(--color-accent-coral)]/20">
                <p className="font-semibold text-[var(--color-accent-coral)] mb-2 flex items-center gap-2">
                  <Puzzle className="w-4 h-4" />
                  Complexity Factors
                </p>
                <ul className="space-y-2 text-[var(--color-text-muted)]">
                  {complexityFactors.map((f, i) => (
                    <li key={i}>
                      <span className="font-medium text-[var(--color-text)]">{f.label}:</span>{" "}
                      {f.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[var(--color-text-muted)]">
            Scored {scoredCount} of {totalCandidates} opportunities
          </span>
        </div>
        <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-accent)]"
            initial={{ width: 0 }}
            animate={{ width: totalCandidates > 0 ? `${(scoredCount / totalCandidates) * 100}%` : "0%" }}
          />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scoring Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {candidates.length === 0 ? (
            <Card accent="coral" hoverable={false}>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-accent-coral)]" />
                <p className="text-[var(--color-text)] font-medium mb-2">No candidates to score</p>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Complete the Friction Mapping exercise first, or add opportunities in Session 1.
                </p>
                <Link href="/workshop/session-2/friction-map">
                  <Button variant="primary">Go to Friction Mapping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : !selectedCandidate ? (
            <Card accent="teal" hoverable={false}>
              <CardContent className="text-center py-12">
                <Check className="w-12 h-12 mx-auto mb-4 text-[var(--color-accent-teal)]" />
                <p className="text-[var(--color-text)] font-medium mb-2">All opportunities scored!</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Review the results and continue to the Priority Matrix.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card accent="yellow" hoverable={false}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant={selectedCandidate.type === "friction" ? "coral" : "default"}>
                      {selectedCandidate.type === "friction" ? "Friction Point" : "Opportunity"}
                    </Badge>
                    <CardTitle as="h3" className="mt-2">{selectedCandidate.title}</CardTitle>
                  </div>
                  <Badge variant="default">{selectedCandidate.source}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--color-text-body)] mb-6">{selectedCandidate.description}</p>

                {/* Value Score */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 mb-3 text-sm font-medium text-[var(--color-text)]">
                    <TrendingUp className="w-4 h-4 text-[var(--color-accent-teal)]" />
                    Value Score
                    <span className="ml-auto text-lg font-bold text-[var(--color-accent-teal)]">{valueScore}</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => setValueScore(score as 1 | 2 | 3 | 4 | 5)}
                        className={`
                          flex-1 py-3 text-sm font-medium rounded-lg border transition-colors
                          ${
                            valueScore === score
                              ? "bg-[var(--color-accent-teal)]/20 border-[var(--color-accent-teal)] text-[var(--color-accent-teal)]"
                              : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          }
                        `}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                    <span>Low value</span>
                    <span>High value</span>
                  </div>
                </div>

                {/* Complexity Score */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 mb-3 text-sm font-medium text-[var(--color-text)]">
                    <Puzzle className="w-4 h-4 text-[var(--color-accent-coral)]" />
                    Complexity Score
                    <span className="ml-auto text-lg font-bold text-[var(--color-accent-coral)]">{complexityScore}</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => setComplexityScore(score as 1 | 2 | 3 | 4 | 5)}
                        className={`
                          flex-1 py-3 text-sm font-medium rounded-lg border transition-colors
                          ${
                            complexityScore === score
                              ? "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)] text-[var(--color-accent-coral)]"
                              : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          }
                        `}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                    <span>Low complexity</span>
                    <span>High complexity</span>
                  </div>
                </div>

                {/* Quadrant Preview */}
                <div className="p-4 bg-[var(--color-bg)] rounded-lg mb-6">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Will be placed in:</p>
                  <p className="font-semibold text-[var(--color-text)]">
                    {quadrantInfo[getQuadrant(valueScore, complexityScore)].label}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {quadrantInfo[getQuadrant(valueScore, complexityScore)].description}
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleScore}
                  className="w-full"
                >
                  Score & Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Unscored List */}
          {unscoredCandidates.length > 1 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
                Remaining to Score ({unscoredCandidates.length - 1})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {unscoredCandidates
                  .filter(c => c.id !== selectedCandidate?.id)
                  .map(candidate => (
                    <button
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="w-full text-left p-3 rounded-lg border border-white/[0.08] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={candidate.type === "friction" ? "coral" : "default"} className="text-xs">
                          {candidate.type}
                        </Badge>
                        <span className="text-xs text-[var(--color-text-muted)]">{candidate.source}</span>
                      </div>
                      <p className="text-sm text-[var(--color-text)] truncate">{candidate.title}</p>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Scored List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4">
            Scored Opportunities{" "}
            <span className="text-[var(--color-text-muted)]">({scoredOpportunities.length})</span>
          </h3>

          {scoredOpportunities.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-muted)] border border-dashed border-white/[0.1] rounded-lg">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Scored opportunities will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {scoredOpportunities.map((opp) => (
                  <motion.div
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card
                      accent={quadrantInfo[opp.quadrant].color as any}
                      className="group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={quadrantInfo[opp.quadrant].color as any}>
                              {quadrantInfo[opp.quadrant].label}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                            {opp.title}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-[var(--color-accent-teal)]" />
                              Value: {opp.valueScore}
                            </span>
                            <span className="flex items-center gap-1">
                              <Puzzle className="w-3 h-3 text-[var(--color-accent-coral)]" />
                              Complexity: {opp.complexityScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Quadrant Summary */}
          {scoredOpportunities.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {(["quick-win", "strategic", "fill-in", "deprioritize"] as const).map(q => {
                const count = scoredOpportunities.filter(o => o.quadrant === q).length;
                return (
                  <div
                    key={q}
                    className={`p-3 rounded-lg border ${
                      count > 0
                        ? `border-[var(--color-accent-${quadrantInfo[q].color})]/30 bg-[var(--color-accent-${quadrantInfo[q].color})]/5`
                        : "border-white/[0.08] bg-[var(--color-surface)]"
                    }`}
                  >
                    <p className="text-xs text-[var(--color-text-muted)]">{quadrantInfo[q].label}</p>
                    <p className="text-2xl font-bold text-[var(--color-text)]">{count}</p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-2/friction-map">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Previous: Friction Map
          </Button>
        </Link>
        <Link href="/workshop/session-2/priority-matrix">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next: Priority Matrix
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
