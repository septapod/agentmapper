"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Vote,
  Lightbulb,
  Star,
  CheckCircle2,
  Circle,
  Trophy,
  AlertCircle,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useScoredOpportunities,
} from "@/store/workshop";

const MAX_VOTES = 5;

const quadrantColors = {
  "quick-win": "teal",
  "strategic": "yellow",
  "fill-in": "default",
  "deprioritize": "coral",
};

const quadrantLabels = {
  "quick-win": "Quick Win",
  "strategic": "Strategic",
  "fill-in": "Fill-In",
  "deprioritize": "Deprioritize",
};

export default function DotVotingPage() {
  const scoredOpportunities = useScoredOpportunities();
  const { voteForOpportunity, togglePilotSelection, updateScoredOpportunity } = useWorkshopStore();

  const [votesRemaining, setVotesRemaining] = useState(MAX_VOTES);
  const [votingComplete, setVotingComplete] = useState(false);

  // Filter to votable opportunities (prioritize quick wins and strategic)
  const votableOpportunities = useMemo(() => {
    return [...scoredOpportunities]
      .filter(o => o.quadrant === "quick-win" || o.quadrant === "strategic")
      .sort((a, b) => {
        // Sort by quadrant first (quick wins first), then by value score
        if (a.quadrant === "quick-win" && b.quadrant !== "quick-win") return -1;
        if (b.quadrant === "quick-win" && a.quadrant !== "quick-win") return 1;
        return b.valueScore - a.valueScore;
      });
  }, [scoredOpportunities]);

  const allOpportunitiesSorted = useMemo(() => {
    return [...scoredOpportunities].sort((a, b) => b.voteCount - a.voteCount);
  }, [scoredOpportunities]);

  const selectedForPilot = scoredOpportunities.filter(o => o.selectedForPilot);
  const topVoted = allOpportunitiesSorted.filter(o => o.voteCount > 0).slice(0, 3);

  const handleVote = (id: string) => {
    if (votesRemaining <= 0) return;
    voteForOpportunity(id);
    setVotesRemaining(prev => prev - 1);
  };

  const handleResetVotes = () => {
    // Reset all vote counts
    scoredOpportunities.forEach(o => {
      if (o.voteCount > 0) {
        updateScoredOpportunity(o.id, { voteCount: 0 });
      }
    });
    setVotesRemaining(MAX_VOTES);
    setVotingComplete(false);
  };

  const handleFinishVoting = () => {
    setVotingComplete(true);
  };

  const totalVotesCast = MAX_VOTES - votesRemaining;

  if (scoredOpportunities.length === 0) {
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
              <Vote className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dot Voting</h1>
              <p className="text-[var(--color-text-muted)]">Exercise 4 of 4 · Session 2</p>
            </div>
          </div>
        </motion.div>

        <Card accent="coral" hoverable={false}>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-accent-coral)]" />
            <p className="text-[var(--color-text)] font-medium mb-2">No opportunities to vote on</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Complete the Opportunity Scoring exercise first.
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
            <Vote className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dot Voting</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 4 of 4 · Session 2</p>
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
              You have <strong>{MAX_VOTES} votes</strong> to distribute among the opportunities.
              You can give multiple votes to a single opportunity if you feel strongly about it.
              Focus on <strong>Quick Wins</strong> and <strong>Strategic</strong> opportunities for pilot selection.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-[var(--color-text-muted)]">Click to vote</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-teal)]" />
                <span className="text-[var(--color-text-muted)]">Select top 2-3 for pilots</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Voting Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-text-muted)]">
              Votes Remaining:
            </span>
            <div className="flex gap-1">
              {Array.from({ length: MAX_VOTES }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1 }}
                  animate={{ scale: i < votesRemaining ? 1 : 0.8, opacity: i < votesRemaining ? 1 : 0.3 }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    i < votesRemaining
                      ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
                      : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                  }`}
                >
                  <Star className="w-3 h-3" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleResetVotes}>
              Reset Votes
            </Button>
            {totalVotesCast > 0 && !votingComplete && (
              <Button variant="primary" size="sm" onClick={handleFinishVoting}>
                Finish Voting
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Voting Panel */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {votingComplete ? "Results" : "Vote for Opportunities"}
            </h3>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {(votingComplete ? allOpportunitiesSorted : votableOpportunities).map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      accent={opp.selectedForPilot ? "teal" : quadrantColors[opp.quadrant] as any}
                      className={`relative ${opp.selectedForPilot ? "ring-2 ring-[var(--color-accent-teal)]" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Vote Count */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleVote(opp.id)}
                            disabled={votesRemaining === 0 || votingComplete}
                            className={`
                              w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold transition-all
                              ${
                                votesRemaining > 0 && !votingComplete
                                  ? "bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 text-[var(--color-accent)] cursor-pointer"
                                  : "bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed"
                              }
                            `}
                          >
                            {opp.voteCount > 0 ? opp.voteCount : <Star className="w-5 h-5" />}
                          </button>
                          {opp.voteCount > 0 && (
                            <span className="text-xs text-[var(--color-text-muted)]">
                              {opp.voteCount === 1 ? "vote" : "votes"}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={quadrantColors[opp.quadrant] as any}>
                              {quadrantLabels[opp.quadrant]}
                            </Badge>
                            {votingComplete && index < 3 && opp.voteCount > 0 && (
                              <Badge variant="teal">
                                <Trophy className="w-3 h-3 mr-1" />
                                Top {index + 1}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[var(--color-text)] font-medium mb-1">{opp.title}</p>
                          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                            {opp.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                            <span>Value: {opp.valueScore}</span>
                            <span>Complexity: {opp.complexityScore}</span>
                          </div>
                        </div>

                        {/* Pilot Selection */}
                        {votingComplete && (
                          <button
                            onClick={() => togglePilotSelection(opp.id)}
                            className={`
                              p-2 rounded-lg transition-all
                              ${
                                opp.selectedForPilot
                                  ? "bg-[var(--color-accent-teal)]/20 text-[var(--color-accent-teal)]"
                                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                              }
                            `}
                          >
                            {opp.selectedForPilot ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Selection Summary */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card accent="teal" hoverable={false}>
              <CardHeader>
                <CardTitle as="h3" className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-[var(--color-accent-teal)]" />
                  Selected for Pilots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedForPilot.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-text-muted)]">
                    <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {votingComplete
                        ? "Click the circle icon to select opportunities for pilots"
                        : "Complete voting to select pilots"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedForPilot.map((opp, index) => (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent-teal)]/30"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg font-bold text-[var(--color-accent-teal)]">
                            {index + 1}.
                          </span>
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">{opp.title}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {opp.voteCount} votes · {quadrantLabels[opp.quadrant]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {votingComplete && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      These opportunities will be developed into pilot projects in Session 3.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vote Summary */}
            {totalVotesCast > 0 && (
              <Card accent="yellow" hoverable={false} className="mt-4">
                <CardContent>
                  <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Vote Summary</h4>
                  <div className="space-y-2">
                    {topVoted.map(opp => (
                      <div key={opp.id} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)] truncate max-w-[180px]">
                          {opp.title}
                        </span>
                        <span className="font-medium text-[var(--color-accent)]">
                          {opp.voteCount} {opp.voteCount === 1 ? "vote" : "votes"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-2/priority-matrix">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Previous: Priority Matrix
          </Button>
        </Link>
        <Link href="/workshop/session-2">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Complete Session 2
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
