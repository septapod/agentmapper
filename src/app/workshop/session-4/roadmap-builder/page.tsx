"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Lightbulb,
  Edit2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useRoadmapMilestones,
  usePilotPlans,
} from "@/store/workshop";

const phases = [
  { value: "build", label: "Build", color: "yellow", weeks: "1-2" },
  { value: "pilot", label: "Pilot", color: "teal", weeks: "3-6" },
  { value: "refine", label: "Refine", color: "coral", weeks: "7-8" },
  { value: "scale", label: "Scale", color: "teal", weeks: "9-12" },
] as const;

export default function RoadmapBuilderPage() {
  const roadmapMilestones = useRoadmapMilestones();
  const pilotPlans = usePilotPlans();
  const { addRoadmapMilestone, deleteRoadmapMilestone } = useWorkshopStore();

  const [selectedPilotPlanId, setSelectedPilotPlanId] = useState("");
  const [weekStart, setWeekStart] = useState(1);
  const [weekEnd, setWeekEnd] = useState(2);
  const [activity, setActivity] = useState("");
  const [owner, setOwner] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [phase, setPhase] = useState<"build" | "pilot" | "refine" | "scale">("build");

  const handleSubmit = () => {
    if (!selectedPilotPlanId || !activity.trim() || !owner.trim()) return;

    addRoadmapMilestone({
      pilotPlanId: selectedPilotPlanId,
      weekStart,
      weekEnd,
      activity: activity.trim(),
      owner: owner.trim(),
      successCriteria: successCriteria.trim(),
      phase,
    });

    // Reset form
    setActivity("");
    setOwner("");
    setSuccessCriteria("");
  };

  const canSubmit =
    selectedPilotPlanId && activity.trim() && owner.trim() && weekStart <= weekEnd;

  const selectedPilotMilestones = selectedPilotPlanId
    ? roadmapMilestones.filter((m) => m.pilotPlanId === selectedPilotPlanId)
    : [];

  const milestonesByWeek = selectedPilotMilestones.reduce((acc, milestone) => {
    for (let week = milestone.weekStart; week <= milestone.weekEnd; week++) {
      if (!acc[week]) acc[week] = [];
      acc[week].push(milestone);
    }
    return acc;
  }, {} as Record<number, typeof selectedPilotMilestones>);

  const getPhaseColor = (p: string) => {
    const phaseObj = phases.find((ph) => ph.value === p);
    return phaseObj?.color || "yellow";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
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
            <Calendar className="w-6 h-6 text-[var(--color-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">90-Day Roadmap Builder</h1>
            <p className="text-[var(--color-text-muted)]">
              Create your implementation timeline from MVP to scale
            </p>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">Typical 90-Day Timeline</p>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• <strong>Weeks 1-2 (Build):</strong> Build the MVP</li>
                <li>• <strong>Weeks 3-6 (Pilot):</strong> Test with friendly users</li>
                <li>• <strong>Weeks 7-8 (Refine):</strong> Fix issues based on feedback</li>
                <li>• <strong>Weeks 9-12 (Scale):</strong> Roll out to broader team</li>
              </ul>
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
            <CardTitle>Add Milestone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Pilot Plan */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Pilot Plan <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              {pilotPlans.length === 0 ? (
                <Card accent="yellow">
                  <CardContent className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">No pilot plans found</p>
                      <p className="text-[var(--color-text-muted)]">
                        Please complete the Pilot Plan exercise first.
                      </p>
                      <Link href="/workshop/session-4/pilot-plan">
                        <Button variant="default" size="sm" className="mt-3">
                          Go to Pilot Plan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <select
                  value={selectedPilotPlanId}
                  onChange={(e) => setSelectedPilotPlanId(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                >
                  <option value="">Choose a pilot plan...</option>
                  {pilotPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.duration} pilot with {plan.testUsers.length} test users
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedPilotPlanId && (
              <>
                {/* Phase Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Phase</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {phases.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => {
                          setPhase(p.value);
                          // Auto-set week ranges based on phase
                          if (p.value === "build") {
                            setWeekStart(1);
                            setWeekEnd(2);
                          } else if (p.value === "pilot") {
                            setWeekStart(3);
                            setWeekEnd(6);
                          } else if (p.value === "refine") {
                            setWeekStart(7);
                            setWeekEnd(8);
                          } else if (p.value === "scale") {
                            setWeekStart(9);
                            setWeekEnd(12);
                          }
                        }}
                        className={`
                          px-4 py-3 rounded-lg border-2 transition-all text-left
                          ${
                            phase === p.value
                              ? `border-[var(--color-accent-${p.color})] bg-[var(--color-accent-${p.color})]/10`
                              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                          }
                        `}
                      >
                        <div className="font-medium text-sm">{p.label}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">Weeks {p.weeks}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Week Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Week Start</label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={weekStart}
                      onChange={(e) => setWeekStart(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Week End</label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={weekEnd}
                      onChange={(e) => setWeekEnd(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Activity <span className="text-[var(--color-accent-coral)]">*</span>
                  </label>
                  <TextArea
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="What happens during this milestone?"
                    rows={2}
                  />
                </div>

                {/* Owner */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Owner <span className="text-[var(--color-accent-coral)]">*</span>
                  </label>
                  <Input
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Who is responsible?"
                  />
                </div>

                {/* Success Criteria */}
                <div>
                  <label className="block text-sm font-medium mb-2">Success Criteria</label>
                  <Input
                    value={successCriteria}
                    onChange={(e) => setSuccessCriteria(e.target.value)}
                    placeholder="How do we know it worked?"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  disabled={!canSubmit}
                  className="w-full"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Milestone
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline View */}
      {selectedPilotPlanId && selectedPilotMilestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-4">90-Day Timeline</h2>

          {/* Phase Legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {phases.map((p) => (
              <div key={p.value} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full bg-[var(--color-accent-${p.color})]`} />
                <span className="text-sm">
                  {p.label} <span className="text-[var(--color-text-muted)]">(Weeks {p.weeks})</span>
                </span>
              </div>
            ))}
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => {
              const weekMilestones = milestonesByWeek[week] || [];
              const phaseForWeek =
                week <= 2
                  ? "build"
                  : week <= 6
                  ? "pilot"
                  : week <= 8
                  ? "refine"
                  : "scale";
              const phaseColor = getPhaseColor(phaseForWeek);

              return (
                <Card
                  key={week}
                  className={`${
                    weekMilestones.length > 0
                      ? `border-l-4 border-l-[var(--color-accent-${phaseColor})]`
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Week {week}</CardTitle>
                      <Badge variant={phaseColor as any}>
                        {phases.find((p) => p.value === phaseForWeek)?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  {weekMilestones.length > 0 && (
                    <CardContent className="space-y-3">
                      {weekMilestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="text-sm bg-[var(--color-bg)] rounded p-3 relative group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium flex-1">{milestone.activity}</p>
                            <Button
                              onClick={() => deleteRoadmapMilestone(milestone.id)}
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-[var(--color-text-muted)] mb-1">
                            Owner: {milestone.owner}
                          </p>
                          {milestone.successCriteria && (
                            <p className="text-xs text-[var(--color-text-muted)]">
                              Success: {milestone.successCriteria}
                            </p>
                          )}
                          {milestone.weekStart !== milestone.weekEnd && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                              Weeks {milestone.weekStart}-{milestone.weekEnd}
                            </p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Milestone List */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">All Milestones</h3>
            <div className="space-y-3">
              {selectedPilotMilestones
                .sort((a, b) => a.weekStart - b.weekStart)
                .map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="flex items-start justify-between gap-4 py-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={getPhaseColor(milestone.phase) as any}>
                            {phases.find((p) => p.value === milestone.phase)?.label}
                          </Badge>
                          <span className="text-sm text-[var(--color-text-muted)]">
                            Week{milestone.weekStart === milestone.weekEnd ? "" : "s"}{" "}
                            {milestone.weekStart}
                            {milestone.weekStart !== milestone.weekEnd && `-${milestone.weekEnd}`}
                          </span>
                        </div>
                        <p className="font-medium mb-1">{milestone.activity}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Owner: {milestone.owner}
                        </p>
                        {milestone.successCriteria && (
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Success: {milestone.successCriteria}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => deleteRoadmapMilestone(milestone.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
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
        <Link href="/workshop/session-4/pilot-plan">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Pilot Plan
          </Button>
        </Link>
        {selectedPilotMilestones.length > 0 && (
          <Link href="/workshop">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Complete Workshop
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
