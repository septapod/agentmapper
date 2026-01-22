"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Construction,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PatternMatchingPage() {
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
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Construction className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Pattern Matching</h1>
            <p className="text-[var(--color-text-muted)]">Exercise 1 of 4 · Session 3</p>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card accent="none" hoverable={false}>
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Construction className="w-5 h-5 text-[var(--color-accent)]" />
              Exercise Under Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--color-text-body)] mb-4">
              This exercise is currently being developed and will be available in a future update.
            </p>

            <div className="bg-[var(--color-surface-hover)] rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" />
                What This Exercise Will Do
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                Pattern Matching helps you identify common AI use cases that have been successfully implemented
                in similar organizations or industries. This exercise will guide you through:
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                <li>• Reviewing proven AI patterns from your industry</li>
                <li>• Matching your friction points to successful implementations</li>
                <li>• Identifying quick wins vs. complex transformations</li>
                <li>• Learning from what's worked (and what hasn't) at peer organizations</li>
              </ul>
            </div>

            <div className="bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/20 rounded-lg p-4">
              <h3 className="font-semibold text-[var(--color-text)] mb-2">
                For Now: Skip to MVP Specification
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                You can continue your workshop by proceeding directly to the MVP Specification exercise, which is fully functional.
                The pattern matching insights will be incorporated into future versions of this tool.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center"
      >
        <Link href="/workshop/session-3">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 3
          </Button>
        </Link>
        <Link href="/workshop/session-3/mvp-spec">
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Skip to MVP Specification
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
