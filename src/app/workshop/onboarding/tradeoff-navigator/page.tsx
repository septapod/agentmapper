"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Zap, Users, Volume, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { useWorkshopStore, useTradeoffs } from "@/store/workshop";

const tradeoffTopics = [
  {
    topic: "control" as const,
    title: "Control",
    icon: Shield,
    leftLabel: "Highly Centralized",
    rightLabel: "Highly Distributed",
    description: "How should AI decision-making authority be distributed across your organization?",
  },
  {
    topic: "priority" as const,
    title: "Priority",
    icon: Zap,
    leftLabel: "Cost Efficiency",
    rightLabel: "Innovation Acceleration",
    description: "What's the primary driver for AI adoption in your organization?",
  },
  {
    topic: "users" as const,
    title: "Users",
    icon: Users,
    leftLabel: "Controlled Rollout",
    rightLabel: "Broad Access",
    description: "How quickly should AI tools be made available to users?",
  },
  {
    topic: "external-comms" as const,
    title: "External Communications",
    icon: Volume,
    leftLabel: "Quiet & Cautious",
    rightLabel: "Bold & Vocal",
    description: "How should you communicate AI adoption externally?",
  },
  {
    topic: "internal-comms" as const,
    title: "Internal Communications",
    icon: Eye,
    leftLabel: "Need to Know",
    rightLabel: "Open & Transparent",
    description: "How much should employees know about AI usage?",
  },
];

export default function TradeoffNavigatorPage() {
  const tradeoffs = useTradeoffs();
  const { updateTradeoff } = useWorkshopStore();

  const handleSliderChange = (topic: string, value: number) => {
    const tradeoff = tradeoffs.find(t => t.topic === topic);
    updateTradeoff(topic, value, tradeoff?.rationale || "");
  };

  const handleRationaleChange = (topic: string, rationale: string) => {
    const tradeoff = tradeoffs.find(t => t.topic === topic);
    updateTradeoff(topic, tradeoff?.sliderValue || 50, rationale);
  };

  const isComplete = tradeoffs.every(t => t.rationale.trim().length >= 20);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop/onboarding"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Onboarding
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tradeoff Navigator</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 3 of 3 · Onboarding</p>
          </div>
        </div>

        <p className="text-[var(--color-text-body)]">
          Make strategic decisions on 5 key dimensions. Position your organization on each spectrum and explain your reasoning.
        </p>
      </motion.div>

      {/* Tradeoff Cards */}
      <div className="space-y-6 mb-12">
        {tradeoffTopics.map((item, idx) => {
          const tradeoff = tradeoffs.find(t => t.topic === item.topic);
          const value = tradeoff?.sliderValue || 50;
          const rationale = tradeoff?.rationale || "";
          const Icon = item.icon;

          return (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card accent="yellow" hoverable={false}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">
                    {item.description}
                  </p>

                  {/* Spectrum Labels */}
                  <div className="flex justify-between text-sm font-medium text-[var(--color-text)] mb-2">
                    <span>{item.leftLabel}</span>
                    <span>{item.rightLabel}</span>
                  </div>

                  {/* Slider */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleSliderChange(item.topic, Number(e.target.value))}
                      className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${value}%, rgba(255,255,255,0.1) ${value}%, rgba(255,255,255,0.1) 100%)`,
                      }}
                    />
                    <div className="flex justify-center mt-2">
                      <div className="px-4 py-1 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold text-sm">
                        {value}%
                      </div>
                    </div>
                  </div>

                  {/* Rationale */}
                  <TextArea
                    label="Rationale"
                    placeholder="Explain why your organization chose this position... (at least 20 characters)"
                    value={rationale}
                    onChange={(e) => handleRationaleChange(item.topic, e.target.value)}
                    className="min-h-[100px]"
                  />
                  {rationale.length > 0 && rationale.length < 20 && (
                    <p className="text-xs text-[var(--color-accent-coral)] mt-1">
                      {20 - rationale.length} more characters needed
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <Link href="/workshop/onboarding/working-principles">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Working Principles
          </Button>
        </Link>
        <Link href={isComplete ? "/workshop/onboarding" : "#"}>
          <Button
            variant="primary"
            disabled={!isComplete}
          >
            Back to Onboarding Overview
          </Button>
        </Link>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: 3px solid var(--color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: 3px solid var(--color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
