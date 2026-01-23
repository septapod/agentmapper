"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, EyeOff, Eye, Plus, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea, Input } from "@/components/ui/Input";
import { useWorkshopStore, useTradeoffs } from "@/store/workshop";

// NOBL Tradeoff Topics - Exact content from framework
const tradeoffTopics = [
  {
    topic: "control" as const,
    number: "01",
    title: "Control",
    question: "How will we manage the introduction and use of AI in our organization?",
    leftLabel: "A centralized function that sets direction and oversees decisions",
    rightLabel: "Autonomous teams or departments that make decisions for themselves",
    leftTradeoffs: [
      "Lower risk through increased control",
      "Efficiencies through single platform selections and subscription fees",
      "Slow to respond to organizational needs",
      "Likely limited in creativity as one central group cannot predict all ways AI can be used",
    ],
    rightTradeoffs: [
      "Greater experimentation",
      "Lack of larger investments in core infrastructure",
      "Increased risks",
      "Communication and direction still required to align efforts",
      "Alternative budgeting approaches likely required to fund ad-hoc projects",
    ],
  },
  {
    topic: "priority" as const,
    number: "02",
    title: "Priority",
    question: "What is the current purpose for introducing AI into our organization?",
    leftLabel: "Efficiency",
    rightLabel: "Differentiation",
    leftTradeoffs: [
      "Likely quickest path to results and returns",
      "Potential valuation upside taking advantage of current investor hype-cycle",
      "Threatening signal to employees, expect potential degradation of engagement",
    ],
    rightTradeoffs: [
      "Exciting signal to employees to drive partnership, engagement and innovation",
      "Slower returns on investment as top-of-funnel ideas are generated, tested and make impact in the market",
      "Not guaranteed to win customers until tested",
    ],
  },
  {
    topic: "users" as const,
    number: "03",
    title: "Users",
    question: "Who do we want to primarily use AI systems at this time?",
    leftLabel: "Internal employees",
    rightLabel: "External customers",
    leftTradeoffs: [
      "More controlled environment for testing and learning",
      "Faster and more available audience to partner with, co-design and test use cases with",
      "Less data or fewer measures to start from",
    ],
    rightTradeoffs: [
      "Opportunity to be first to market with solutions and products for customers",
      "Less controlled environment, with problems and learnings exposed to the public",
      "More data or clearer measures to assess",
    ],
  },
  {
    topic: "external-comms" as const,
    number: "04",
    title: "External comms",
    question: "How public do we want to be with our AI approach?",
    leftLabel: "Let's shy away from attention for it",
    rightLabel: "Let's be loud and bring attention to it",
    leftTradeoffs: [
      "Provides time and cover for experimentation and learning",
      "Allows for testing communication approach with select stakeholders to gauge reaction and hone message",
      "Could backfire if being quiet erodes trust",
    ],
    rightTradeoffs: [
      "Potential upside and attention from investors and customers",
      "Negative employee and recruiting repercussions if results are efficiencies and layoffs",
      "Initial experiences could be damaging to the brand given the time it takes to improve these systems",
    ],
  },
  {
    topic: "internal-comms" as const,
    number: "05",
    title: "Internal comms",
    question: "How transparent do we want to be with our AI approach?",
    leftLabel: "Keep information only to key decision-makers",
    rightLabel: "Openly design and discuss plans with our workforce",
    leftTradeoffs: [
      "Minimizes immediate worry over efficiency plays or job losses",
      "Can erode long-term trust in leadership",
      "Greater control over messaging",
      "Decisions can be made in a knowledge vacuum",
    ],
    rightTradeoffs: [
      "Transparency will be appreciated and valued by some",
      "Will require forums to develop shared understanding of the approach and results (e.g., town halls, round tables, roadshows, lunch & learns, etc.)",
      "Consensus and debate slow processes down and people still may be unhappy",
    ],
  },
];

interface CustomTradeoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; question: string; leftLabel: string; rightLabel: string }) => void;
}

function CustomTradeoffModal({ isOpen, onClose, onSubmit }: CustomTradeoffModalProps) {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [leftLabel, setLeftLabel] = useState("");
  const [rightLabel, setRightLabel] = useState("");

  const handleSubmit = () => {
    if (title.trim() && question.trim() && leftLabel.trim() && rightLabel.trim()) {
      onSubmit({ title, question, leftLabel, rightLabel });
      setTitle("");
      setQuestion("");
      setLeftLabel("");
      setRightLabel("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--color-surface)] rounded-xl p-6 max-w-lg w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Add Custom Tradeoff</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.05] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="Tradeoff Title"
            placeholder="e.g., Build vs Buy"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Question"
            placeholder="e.g., Should we build AI solutions in-house or purchase them?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Input
            label="Left Position"
            placeholder="e.g., Build in-house"
            value={leftLabel}
            onChange={(e) => setLeftLabel(e.target.value)}
          />
          <Input
            label="Right Position"
            placeholder="e.g., Buy/partner"
            value={rightLabel}
            onChange={(e) => setRightLabel(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !question.trim() || !leftLabel.trim() || !rightLabel.trim()}
          >
            Add Tradeoff
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TradeoffNavigatorPage() {
  const tradeoffs = useTradeoffs();
  const { updateTradeoff, toggleTradeoffIgnored, addCustomTradeoff, deleteCustomTradeoff } = useWorkshopStore();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleSliderChange = (topic: string, value: number) => {
    const tradeoff = tradeoffs.find(t => t.topic === topic);
    updateTradeoff(topic, value, tradeoff?.rationale || "");
  };

  const handleRationaleChange = (topic: string, rationale: string) => {
    const tradeoff = tradeoffs.find(t => t.topic === topic);
    updateTradeoff(topic, tradeoff?.sliderValue || 50, rationale);
  };

  // Track tradeoffs with missing rationale for guidance
  const activeTradeoffs = tradeoffs.filter(t => !t.ignored);
  const tradeoffsWithoutRationale = activeTradeoffs.filter(t => !t.rationale.trim());

  return (
    <div className="p-8 max-w-5xl mx-auto">
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

        <h1 className="text-2xl font-bold mb-2">Tradeoff Navigator</h1>
        <p className="text-[var(--color-text-muted)]">Exercise 3 of 3 · Session 1</p>

        <p className="text-[var(--color-text-body)] mt-4">
          Position your organization on each strategic spectrum. You can ignore tradeoffs that don't apply or add your own custom tradeoffs.
        </p>
      </motion.div>

      {/* Tradeoff Cards */}
      <div className="space-y-8 mb-12">
        {tradeoffs.map((tradeoff, idx) => {
          // Find the matching NOBL topic or use custom data
          const topicConfig = tradeoffTopics.find(t => t.topic === tradeoff.topic);
          const isCustom = tradeoff.isCustom;

          const title = isCustom ? tradeoff.customTitle : topicConfig?.title;
          const question = isCustom ? tradeoff.customQuestion : topicConfig?.question;
          const leftLabel = isCustom ? tradeoff.customLeftLabel : topicConfig?.leftLabel;
          const rightLabel = isCustom ? tradeoff.customRightLabel : topicConfig?.rightLabel;
          const leftTradeoffs = topicConfig?.leftTradeoffs || [];
          const rightTradeoffs = topicConfig?.rightTradeoffs || [];
          const topicNumber = topicConfig?.number || String(idx + 1).padStart(2, "0");

          return (
            <motion.div
              key={tradeoff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={tradeoff.ignored ? "opacity-50" : ""}
            >
              <Card hoverable={false}>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-6 border-b border-white/[0.1]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-[var(--color-accent)] border border-[var(--color-accent)]/30 px-2 py-0.5 rounded">
                        TOPIC {topicNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        {isCustom && (
                          <button
                            onClick={() => deleteCustomTradeoff(tradeoff.id)}
                            className="p-1.5 rounded hover:bg-white/[0.05] text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)]"
                            title="Delete custom tradeoff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleTradeoffIgnored(tradeoff.id)}
                          className="p-1.5 rounded hover:bg-white/[0.05] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                          title={tradeoff.ignored ? "Include this tradeoff" : "Ignore this tradeoff"}
                        >
                          {tradeoff.ignored ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        {tradeoff.ignored && (
                          <span className="text-xs bg-white/[0.05] px-2 py-1 rounded text-[var(--color-text-muted)]">
                            Ignored
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
                    <p className="text-[var(--color-text-body)] mt-1">{question}</p>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${tradeoff.ignored ? "pointer-events-none" : ""}`}>
                    {/* Labels above slider */}
                    <div className="grid grid-cols-2 gap-8 mb-4">
                      <div className="bg-white/[0.03] border border-white/[0.1] rounded-lg p-4">
                        <p className="text-sm text-[var(--color-text)]">{leftLabel}</p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.1] rounded-lg p-4 text-right">
                        <p className="text-sm text-[var(--color-text)]">{rightLabel}</p>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="mb-6">
                      <div className="relative py-4">
                        {/* Tick marks */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
                          {[...Array(11)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-0.5 h-3 ${i === 0 || i === 10 ? "bg-[var(--color-text-muted)]" : "bg-white/[0.1]"}`}
                            />
                          ))}
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tradeoff.sliderValue}
                          onChange={(e) => handleSliderChange(tradeoff.topic, Number(e.target.value))}
                          disabled={tradeoff.ignored}
                          className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer slider relative z-10"
                          style={{
                            background: `linear-gradient(to right, var(--color-accent-teal) 0%, var(--color-accent-teal) ${tradeoff.sliderValue}%, rgba(255,255,255,0.08) ${tradeoff.sliderValue}%, rgba(255,255,255,0.08) 100%)`,
                          }}
                        />
                      </div>
                      {/* Position indicator */}
                      <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
                        <span>0</span>
                        <span className="text-[var(--color-accent)]">{tradeoff.sliderValue}</span>
                        <span>100</span>
                      </div>
                    </div>

                    {/* Potential Tradeoffs - Only show for NOBL topics */}
                    {(leftTradeoffs.length > 0 || rightTradeoffs.length > 0) && (
                      <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                          <h4 className="text-xs font-mono text-[var(--color-text-muted)] mb-3 tracking-wider">
                            POTENTIAL TRADEOFFS
                          </h4>
                          <ul className="space-y-2">
                            {leftTradeoffs.map((item, i) => (
                              <li key={i} className="text-sm text-[var(--color-text-body)] flex gap-2">
                                <span className="text-[var(--color-text-muted)]">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono text-[var(--color-text-muted)] mb-3 tracking-wider">
                            POTENTIAL TRADEOFFS
                          </h4>
                          <ul className="space-y-2">
                            {rightTradeoffs.map((item, i) => (
                              <li key={i} className="text-sm text-[var(--color-text-body)] flex gap-2">
                                <span className="text-[var(--color-text-muted)]">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Rationale */}
                    {!tradeoff.ignored && (
                      <div>
                        <TextArea
                          label="Rationale"
                          placeholder="Explain why your organization chose this position..."
                          value={tradeoff.rationale}
                          onChange={(e) => handleRationaleChange(tradeoff.topic, e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Add Custom Tradeoff Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowCustomModal(true)}
            className="w-full border-2 border-dashed border-white/[0.1] rounded-xl p-6 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Custom Tradeoff
          </button>
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <Link href="/workshop/session-1/working-principles">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Working Principles
          </Button>
        </Link>
        <div className="flex flex-col items-end gap-2">
          <Link href="/workshop/session-2">
            <Button
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Session 2
            </Button>
          </Link>
          {tradeoffsWithoutRationale.length > 0 && (
            <p className="text-xs text-[var(--color-text-muted)]">
              Tip: Add rationale to each tradeoff for better documentation
            </p>
          )}
        </div>
      </motion.div>

      {/* Custom Tradeoff Modal */}
      <CustomTradeoffModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={addCustomTradeoff}
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-accent-teal);
          cursor: pointer;
          border: 2px solid var(--color-surface);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 10;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-accent-teal);
          cursor: pointer;
          border: 2px solid var(--color-surface);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        .slider:disabled::-webkit-slider-thumb {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .slider:disabled::-moz-range-thumb {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
