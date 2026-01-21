"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  CheckSquare,
  Lightbulb,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useScalingChecklist,
} from "@/store/workshop";

const categories = [
  { value: "documentation", label: "Documentation", color: "teal" },
  { value: "training", label: "Training", color: "coral" },
  { value: "ownership", label: "Ownership", color: "yellow" },
  { value: "feedback", label: "Feedback", color: "teal" },
  { value: "metrics", label: "Metrics", color: "coral" },
] as const;

const suggestedItems = {
  documentation: [
    "Solution architecture documented",
    "User guide created",
    "API documentation exists",
    "Troubleshooting guide available",
  ],
  training: [
    "Training materials created",
    "Hands-on practice sessions planned",
    "FAQ document maintained",
    "Support resources identified",
  ],
  ownership: [
    "Primary owner assigned",
    "Backup support identified",
    "Escalation path defined",
    "Maintenance schedule set",
  ],
  feedback: [
    "User feedback channel established",
    "Regular check-ins scheduled",
    "Issue tracking system in place",
    "Improvement process defined",
  ],
  metrics: [
    "Success metrics defined",
    "Tracking system configured",
    "Reporting cadence set",
    "Review meetings scheduled",
  ],
};

export default function ScalingChecklistPage() {
  const scalingChecklist = useScalingChecklist();
  const { addScalingChecklistItem, updateScalingChecklistItem, deleteScalingChecklistItem } = useWorkshopStore();

  const [category, setCategory] = useState<"documentation" | "training" | "ownership" | "feedback" | "metrics">("documentation");
  const [item, setItem] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!item.trim()) return;

    addScalingChecklistItem({
      category,
      item: item.trim(),
      completed: false,
      notes: notes.trim(),
    });

    setItem("");
    setNotes("");
  };

  const handleToggle = (id: string, completed: boolean) => {
    updateScalingChecklistItem(id, { completed });
  };

  const itemsByCategory = categories.map((cat) => ({
    ...cat,
    items: scalingChecklist.filter((item) => item.category === cat.value),
  }));

  const completedCount = scalingChecklist.filter((item) => item.completed).length;
  const totalCount = scalingChecklist.length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop/session-5"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Session 5
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Scaling Checklist</h1>
            <p className="text-[var(--color-text-muted)]">
              Verify readiness to scale beyond the pilot
            </p>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">FORGE Principle: Scale What Works</p>
              <p className="text-[var(--color-text-muted)]">
                "Once something proves valuable, expand it thoughtfully. Ensure documentation exists,
                training materials are created, and ownership is clear before scaling."
              </p>
            </div>
          </CardContent>
        </Card>

        {totalCount > 0 && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent-teal)] transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">
              {completedCount} / {totalCount} complete
            </span>
          </div>
        )}
      </motion.div>

      {/* Add Item Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Add Checklist Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`
                      px-4 py-2 text-sm rounded-lg border transition-colors
                      ${
                        category === cat.value
                          ? `bg-[var(--color-accent-${cat.color})]/20 border-[var(--color-accent-${cat.color})] text-[var(--color-accent-${cat.color})]`
                          : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Items */}
            {suggestedItems[category].length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Suggested Items (click to use)
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedItems[category].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setItem(suggestion)}
                      className="text-xs px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Item */}
            <Input
              label="Checklist Item"
              placeholder="What needs to be done before scaling?"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />

            {/* Notes */}
            <TextArea
              label="Notes (optional)"
              placeholder="Additional context or details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            <Button
              onClick={handleAdd}
              variant="primary"
              disabled={!item.trim()}
              leftIcon={<Plus className="w-4 h-4" />}
              className="w-full"
            >
              Add Item
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Checklist by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {itemsByCategory.map((cat) => (
          cat.items.length > 0 && (
            <div key={cat.value}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={cat.color as any}>{cat.label}</Badge>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {cat.items.filter((i) => i.completed).length} / {cat.items.length} complete
                </span>
              </div>
              <div className="space-y-2">
                {cat.items.map((checklistItem) => (
                  <Card key={checklistItem.id} className="group">
                    <div className="flex items-start gap-4 p-4">
                      <button
                        onClick={() => handleToggle(checklistItem.id, !checklistItem.completed)}
                        className={`
                          w-6 h-6 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0
                          ${
                            checklistItem.completed
                              ? "bg-[var(--color-accent-teal)] border-[var(--color-accent-teal)] text-[var(--color-bg)]"
                              : "border-[var(--color-border)] hover:border-[var(--color-accent-teal)]"
                          }
                        `}
                      >
                        {checklistItem.completed && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            checklistItem.completed
                              ? "line-through text-[var(--color-text-muted)]"
                              : "text-[var(--color-text)]"
                          }`}
                        >
                          {checklistItem.item}
                        </p>
                        {checklistItem.notes && (
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {checklistItem.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteScalingChecklistItem(checklistItem.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        ))}

        {scalingChecklist.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No checklist items yet. Add your first item above!</p>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-5">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 5
          </Button>
        </Link>
        {scalingChecklist.length > 0 && (
          <Link href="/workshop/session-5/training-plan">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Training Plan
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
