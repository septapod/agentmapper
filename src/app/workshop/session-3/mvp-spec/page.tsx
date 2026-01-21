"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Wrench,
  AlertCircle,
  Lightbulb,
  X,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useMVPSpecs,
  useFrictionPoints,
} from "@/store/workshop";

const commonTools = [
  "Claude (Anthropic)",
  "ChatGPT (OpenAI)",
  "GitHub Copilot",
  "Microsoft Copilot",
  "Google Gemini",
  "Cursor",
  "Excel/Google Sheets",
  "Power Automate",
  "Zapier",
  "Custom Script/Code",
];

export default function MVPSpecPage() {
  const mvpSpecs = useMVPSpecs();
  const frictionPoints = useFrictionPoints();
  const { addMVPSpec, deleteMVPSpec } = useWorkshopStore();

  const [selectedFrictionId, setSelectedFrictionId] = useState("");
  const [scope, setScope] = useState("");
  const [toolsToUse, setToolsToUse] = useState<string[]>([]);
  const [customTool, setCustomTool] = useState("");
  const [humanCheckpoints, setHumanCheckpoints] = useState<string[]>([""]);
  const [successThreshold, setSuccessThreshold] = useState("");
  const [timeframe, setTimeframe] = useState("2 weeks");

  const handleAddTool = (tool: string) => {
    if (!toolsToUse.includes(tool)) {
      setToolsToUse([...toolsToUse, tool]);
    }
  };

  const handleRemoveTool = (tool: string) => {
    setToolsToUse(toolsToUse.filter((t) => t !== tool));
  };

  const handleAddCustomTool = () => {
    if (customTool.trim() && !toolsToUse.includes(customTool.trim())) {
      setToolsToUse([...toolsToUse, customTool.trim()]);
      setCustomTool("");
    }
  };

  const handleAddCheckpoint = () => {
    setHumanCheckpoints([...humanCheckpoints, ""]);
  };

  const handleUpdateCheckpoint = (index: number, value: string) => {
    const updated = [...humanCheckpoints];
    updated[index] = value;
    setHumanCheckpoints(updated);
  };

  const handleRemoveCheckpoint = (index: number) => {
    if (humanCheckpoints.length > 1) {
      setHumanCheckpoints(humanCheckpoints.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (!selectedFrictionId || !scope.trim() || toolsToUse.length === 0) return;

    addMVPSpec({
      frictionPointId: selectedFrictionId,
      scope: scope.trim(),
      toolsToUse,
      humanCheckpoints: humanCheckpoints.filter((c) => c.trim()),
      successThreshold: successThreshold.trim() || "Works for 80% of cases",
      timeframe: timeframe.trim() || "2 weeks",
    });

    // Reset form
    setSelectedFrictionId("");
    setScope("");
    setToolsToUse([]);
    setHumanCheckpoints([""]);
    setSuccessThreshold("");
    setTimeframe("2 weeks");
  };

  const canSubmit =
    selectedFrictionId && scope.trim() && toolsToUse.length > 0;

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
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-purple)]/20 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-[var(--color-accent-purple)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">MVP Specification</h1>
            <p className="text-[var(--color-text-muted)]">
              Design the smallest useful version of your solution
            </p>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">FORGE Principle: Start Embarrassingly Simple</p>
              <p className="text-[var(--color-text-muted)]">
                "The first version should be embarrassingly simple. 'Works for 80% of cases' is a
                great first milestone. You can add sophistication later based on what you learn."
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
            <CardTitle>Create MVP Specification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Friction Point */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Friction Point <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              {frictionPoints.length === 0 ? (
                <Card accent="yellow">
                  <CardContent className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">No friction points found</p>
                      <p className="text-[var(--color-text-muted)]">
                        Please complete Session 2 (Friction Mapping) first.
                      </p>
                      <Link href="/workshop/session-2/friction-map">
                        <Button variant="default" size="sm" className="mt-3">
                          Go to Friction Mapping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <select
                  value={selectedFrictionId}
                  onChange={(e) => setSelectedFrictionId(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                >
                  <option value="">Choose a friction point...</option>
                  {frictionPoints.map((fp) => (
                    <option key={fp.id} value={fp.id}>
                      {fp.processArea}: {fp.description.substring(0, 100)}
                      {fp.description.length > 100 ? "..." : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Scope */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What are we building? <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              <TextArea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Describe the MVP scope in 2-3 sentences. What's the smallest thing that would be useful?"
                rows={4}
                className="w-full"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                Example: "Claude analyzes loan documents, extracts key data fields, and flags
                potential issues for human review before entry into the LOS."
              </p>
            </div>

            {/* Tools to Use */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tools to Use <span className="text-[var(--color-accent-coral)]">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {commonTools.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => handleAddTool(tool)}
                      disabled={toolsToUse.includes(tool)}
                      className={`
                        px-3 py-1.5 text-sm rounded-lg border transition-colors
                        ${
                          toolsToUse.includes(tool)
                            ? "bg-[var(--color-accent-purple)]/20 border-[var(--color-accent-purple)] text-[var(--color-accent-purple)] cursor-not-allowed"
                            : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent-purple)] hover:bg-[var(--color-accent-purple)]/10"
                        }
                      `}
                    >
                      {toolsToUse.includes(tool) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {tool}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={customTool}
                    onChange={(e) => setCustomTool(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddCustomTool()}
                    placeholder="Add custom tool..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddCustomTool}
                    variant="default"
                                       disabled={!customTool.trim()}
                  >
                    Add
                  </Button>
                </div>

                {toolsToUse.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--color-border)]">
                    <p className="w-full text-xs font-medium text-[var(--color-text-muted)] mb-1">
                      Selected Tools:
                    </p>
                    {toolsToUse.map((tool) => (
                      <Badge key={tool} variant="default">
                        {tool}
                        <button
                          onClick={() => handleRemoveTool(tool)}
                          className="ml-2 hover:text-[var(--color-accent-coral)]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Human Checkpoints */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Human-in-Loop Checkpoints
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Where does a human need to review, approve, or verify before proceeding?
              </p>
              <div className="space-y-2">
                {humanCheckpoints.map((checkpoint, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={checkpoint}
                      onChange={(e) => handleUpdateCheckpoint(index, e.target.value)}
                      placeholder={`Checkpoint ${index + 1}: e.g., "Human reviews all loans over $50k"`}
                      className="flex-1"
                    />
                    {humanCheckpoints.length > 1 && (
                      <Button
                        onClick={() => handleRemoveCheckpoint(index)}
                        variant="ghost"
                                             >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  onClick={handleAddCheckpoint}
                  variant="ghost"
                                   leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Checkpoint
                </Button>
              </div>
            </div>

            {/* Success Threshold */}
            <div>
              <label className="block text-sm font-medium mb-2">Success Threshold</label>
              <Input
                value={successThreshold}
                onChange={(e) => setSuccessThreshold(e.target.value)}
                placeholder="e.g., Works for 80% of cases, 2x faster than manual, <5% error rate"
              />
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-sm font-medium mb-2">Build Timeframe</label>
              <Input
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g., 2 weeks"
              />
            </div>

            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={!canSubmit}
              className="w-full"
            >
              Create MVP Specification
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Existing MVP Specs */}
      {mvpSpecs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold mb-4">Your MVP Specifications</h2>
          <div className="space-y-4">
            {mvpSpecs.map((spec) => {
              const friction = frictionPoints.find((fp) => fp.id === spec.frictionPointId);
              return (
                <Card key={spec.id} accent="teal">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">
                            {friction?.processArea || "Unknown Area"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {friction?.description.substring(0, 100) || "No friction point linked"}
                        </CardTitle>
                      </div>
                      <Button
                        onClick={() => deleteMVPSpec(spec.id)}
                        variant="ghost"
                                             >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                        Scope
                      </p>
                      <p className="text-sm">{spec.scope}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                        Tools
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {spec.toolsToUse.map((tool) => (
                          <Badge key={tool} variant="default">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {spec.humanCheckpoints.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                          Human Checkpoints
                        </p>
                        <ul className="space-y-1">
                          {spec.humanCheckpoints.map((checkpoint, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-teal)] flex-shrink-0 mt-0.5" />
                              {checkpoint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                          Success Threshold
                        </p>
                        <p className="text-sm">{spec.successThreshold}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                          Timeframe
                        </p>
                        <p className="text-sm">{spec.timeframe}</p>
                      </div>
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
        <Link href="/workshop/session-3">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Session 3
          </Button>
        </Link>
        {mvpSpecs.length > 0 && (
          <Link href="/workshop/session-4">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Session 4
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
