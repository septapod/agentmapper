"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Users,
  Lightbulb,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useTrainingPlan,
} from "@/store/workshop";

export default function TrainingPlanPage() {
  const trainingPlan = useTrainingPlan();
  const { addTrainingPlanEntry, deleteTrainingPlanEntry } = useWorkshopStore();

  const [role, setRole] = useState("");
  const [trainingNeeds, setTrainingNeeds] = useState<string[]>([""]);
  const [resources, setResources] = useState<string[]>([""]);
  const [champion, setChampion] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleAddField = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter([...list, ""]);
  };

  const handleUpdateField = (
    index: number,
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const handleRemoveField = (
    index: number,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.length > 1) {
      setter(list.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const filteredNeeds = trainingNeeds.filter((n) => n.trim());
    const filteredResources = resources.filter((r) => r.trim());

    addTrainingPlanEntry({
      role: role.trim() || "General",
      trainingNeeds: filteredNeeds.length > 0 ? filteredNeeds : ["To be defined"],
      resources: filteredResources,
      champion: champion.trim(),
      targetDate: targetDate.trim(),
    });

    // Reset form
    setRole("");
    setTrainingNeeds([""]);
    setResources([""]);
    setChampion("");
    setTargetDate("");
  };

  // No gates - all fields are optional
  const canSubmit = true;

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
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-teal)]/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--color-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Training Plan</h1>
            <p className="text-[var(--color-text-muted)]">
              Define role-based training needs and identify champions
            </p>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">Training Strategy</p>
              <p className="text-[var(--color-text-muted)]">
                Different roles need different depths of training. Identify early adopters who can
                champion the solution and help onboard others. Plan for hands-on practice, not just
                documentation.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Training Plan Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Add Training Plan for Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role */}
            <Input
              label="Role"
              placeholder="e.g., Loan Officers, Underwriters, Contact Center Agents"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            {/* Training Needs */}
            <div>
              <label className="block text-sm font-medium mb-2">Training Needs</label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                What does this role need to learn to use the solution effectively?
              </p>
              <div className="space-y-2">
                {trainingNeeds.map((need, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={need}
                      onChange={(e) =>
                        handleUpdateField(index, e.target.value, trainingNeeds, setTrainingNeeds)
                      }
                      placeholder={`Training need ${index + 1}`}
                      className="flex-1"
                    />
                    {trainingNeeds.length > 1 && (
                      <Button
                        onClick={() => handleRemoveField(index, trainingNeeds, setTrainingNeeds)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => handleAddField(trainingNeeds, setTrainingNeeds)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Training Need
                </Button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <label className="block text-sm font-medium mb-2">Training Resources</label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                What materials, guides, or sessions will support this training?
              </p>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={resource}
                      onChange={(e) =>
                        handleUpdateField(index, e.target.value, resources, setResources)
                      }
                      placeholder={`Resource ${index + 1}`}
                      className="flex-1"
                    />
                    {resources.length > 1 && (
                      <Button
                        onClick={() => handleRemoveField(index, resources, setResources)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => handleAddField(resources, setResources)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Resource
                </Button>
              </div>
            </div>

            {/* Champion */}
            <Input
              label="Champion (optional)"
              placeholder="Who will advocate for adoption within this role?"
              value={champion}
              onChange={(e) => setChampion(e.target.value)}
            />

            {/* Target Date */}
            <Input
              label="Target Date (optional)"
              placeholder="e.g., End of Q2, March 2026"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />

            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!canSubmit}
              className="w-full"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Training Plan
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing Training Plans */}
      {trainingPlan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold">Training Plans</h2>
          {trainingPlan.map((plan) => (
            <Card key={plan.id} accent="teal">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{plan.role}</CardTitle>
                    {plan.champion && (
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Champion: {plan.champion}
                      </p>
                    )}
                    {plan.targetDate && (
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Target: {plan.targetDate}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => deleteTrainingPlanEntry(plan.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                    Training Needs
                  </p>
                  <ul className="space-y-1">
                    {plan.trainingNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent-teal)]" />
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.resources.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                      Resources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.resources.map((resource, i) => (
                        <Badge key={i} variant="teal">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-5/scaling-checklist">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Scaling Checklist
          </Button>
        </Link>
        <Link href="/workshop/session-5/lessons-learned">
          <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue to Lessons Learned
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
