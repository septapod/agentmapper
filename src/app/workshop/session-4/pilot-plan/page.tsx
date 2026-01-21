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
  AlertCircle,
  Lightbulb,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  usePilotPlans,
  useMVPSpecs,
} from "@/store/workshop";

export default function PilotPlanPage() {
  const pilotPlans = usePilotPlans();
  const mvpSpecs = useMVPSpecs();
  const { addPilotPlan, deletePilotPlan } = useWorkshopStore();

  const [selectedMVPId, setSelectedMVPId] = useState("");
  const [testUsers, setTestUsers] = useState<string[]>([""]);
  const [metricsToTrack, setMetricsToTrack] = useState<string[]>([""]);
  const [duration, setDuration] = useState("4 weeks");
  const [stopCriteria, setStopCriteria] = useState<string[]>([""]);

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
    if (!selectedMVPId) return;

    const filteredUsers = testUsers.filter((u) => u.trim());
    const filteredMetrics = metricsToTrack.filter((m) => m.trim());
    const filteredCriteria = stopCriteria.filter((c) => c.trim());

    if (filteredUsers.length === 0 || filteredMetrics.length === 0) return;

    addPilotPlan({
      mvpSpecId: selectedMVPId,
      testUsers: filteredUsers,
      metricsToTrack: filteredMetrics,
      duration: duration.trim() || "4 weeks",
      stopCriteria: filteredCriteria,
    });

    // Reset form
    setSelectedMVPId("");
    setTestUsers([""]);
    setMetricsToTrack([""]);
    setDuration("4 weeks");
    setStopCriteria([""]);
  };

  const canSubmit =
    selectedMVPId &&
    testUsers.some((u) => u.trim()) &&
    metricsToTrack.some((m) => m.trim());

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/workshop/session-4"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Session 4
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-teal)]/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--color-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Pilot Plan</h1>
            <p className="text-[var(--color-text-muted)]">
              Define your pilot structure and feedback approach
            </p>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">FORGE Principle: Generate Feedback Early</p>
              <p className="text-[var(--color-text-muted)]">
                "Get feedback from real users as fast as possible. 2-4 weeks is usually enough to
                know if something is worth scaling. Track what matters: time saved, error reduction,
                user satisfaction."
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Create Pilot Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select MVP Spec */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select MVP Specification <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              {mvpSpecs.length === 0 ? (
                <Card accent="yellow">
                  <CardContent className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">No MVP specs found</p>
                      <p className="text-[var(--color-text-muted)]">
                        Please complete Session 3 (MVP Specification) first.
                      </p>
                      <Link href="/workshop/session-3/mvp-spec">
                        <Button variant="default" size="sm" className="mt-3">
                          Go to MVP Specification
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <select
                  value={selectedMVPId}
                  onChange={(e) => setSelectedMVPId(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                >
                  <option value="">Choose an MVP spec...</option>
                  {mvpSpecs.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.scope.substring(0, 100)}
                      {spec.scope.length > 100 ? "..." : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Test Users */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Users <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Who will test this pilot? Choose 2-3 friendly users who will give honest feedback.
              </p>
              <div className="space-y-2">
                {testUsers.map((user, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={user}
                      onChange={(e) =>
                        handleUpdateField(index, e.target.value, testUsers, setTestUsers)
                      }
                      placeholder={`Test user ${index + 1}: e.g., Sarah (Loan Officer)`}
                      className="flex-1"
                    />
                    {testUsers.length > 1 && (
                      <Button
                        onClick={() => handleRemoveField(index, testUsers, setTestUsers)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => handleAddField(testUsers, setTestUsers)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Test User
                </Button>
              </div>
            </div>

            {/* Metrics to Track */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Metrics to Track <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                What will you measure to know if this is working? Time saved? Error rate? User
                satisfaction?
              </p>
              <div className="space-y-2">
                {metricsToTrack.map((metric, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={metric}
                      onChange={(e) =>
                        handleUpdateField(index, e.target.value, metricsToTrack, setMetricsToTrack)
                      }
                      placeholder={`Metric ${index + 1}: e.g., Time to process loan (minutes)`}
                      className="flex-1"
                    />
                    {metricsToTrack.length > 1 && (
                      <Button
                        onClick={() =>
                          handleRemoveField(index, metricsToTrack, setMetricsToTrack)
                        }
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => handleAddField(metricsToTrack, setMetricsToTrack)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Metric
                </Button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Pilot Duration</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 4 weeks"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                FORGE recommendation: 2-4 weeks is usually enough to validate an idea
              </p>
            </div>

            {/* Stop Criteria */}
            <div>
              <label className="block text-sm font-medium mb-2">Stop Criteria</label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                What would make you stop the pilot early? When would you pull the plug?
              </p>
              <div className="space-y-2">
                {stopCriteria.map((criterion, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={criterion}
                      onChange={(e) =>
                        handleUpdateField(index, e.target.value, stopCriteria, setStopCriteria)
                      }
                      placeholder={`Criterion ${index + 1}: e.g., Error rate >10%`}
                      className="flex-1"
                    />
                    {stopCriteria.length > 1 && (
                      <Button
                        onClick={() => handleRemoveField(index, stopCriteria, setStopCriteria)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={() => handleAddField(stopCriteria, setStopCriteria)}
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Stop Criterion
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!canSubmit}
              className="w-full"
            >
              Create Pilot Plan
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing Pilot Plans */}
      {pilotPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-4">Your Pilot Plans</h2>
          <div className="space-y-4">
            {pilotPlans.map((plan) => {
              const mvpSpec = mvpSpecs.find((s) => s.id === plan.mvpSpecId);
              return (
                <Card key={plan.id} accent="teal">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {mvpSpec?.scope.substring(0, 100) || "No MVP spec linked"}
                        </CardTitle>
                      </div>
                      <Button
                        onClick={() => deletePilotPlan(plan.id)}
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
                        Test Users
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plan.testUsers.map((user, i) => (
                          <Badge key={i} variant="teal">
                            {user}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                        Metrics to Track
                      </p>
                      <ul className="space-y-1">
                        {plan.metricsToTrack.map((metric, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full bg-[var(--color-accent-teal)]" />
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.stopCriteria.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                          Stop Criteria
                        </p>
                        <ul className="space-y-1">
                          {plan.stopCriteria.map((criterion, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <X className="w-4 h-4 text-[var(--color-accent-coral)] flex-shrink-0 mt-0.5" />
                              {criterion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                        Duration
                      </p>
                      <p className="text-sm">{plan.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex justify-between items-center"
      >
        <Link href="/workshop/session-4">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 4
          </Button>
        </Link>
        {pilotPlans.length > 0 && (
          <Link href="/workshop/session-4/roadmap-builder">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Roadmap Builder
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
