"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Target, Users, Shield, Cloud, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useWorkshopStore, useCloudOrgId } from "@/store/workshop";
import { useCloudSync } from "@/hooks/useCloudSync";

export default function Home() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [loadOrgId, setLoadOrgId] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const { setOrganization, organization, resetWorkshop } = useWorkshopStore();
  const cloudOrgId = useCloudOrgId();
  const { connectToCloud, loadFromCloud, isSupabaseAvailable } = useCloudSync();

  const handleStartWorkshop = async () => {
    if (!orgName.trim()) return;

    setIsStarting(true);

    try {
      // If Supabase is available, create org in cloud
      if (isSupabaseAvailable) {
        await connectToCloud(orgName.trim());
      } else {
        // Create organization in local store only
        const newOrg = {
          id: crypto.randomUUID(),
          name: orgName.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentSession: 1,
          completionPercent: 0,
        };
        setOrganization(newOrg);
      }

      router.push("/workshop");
    } catch (error) {
      console.error("Failed to start workshop:", error);
      setIsStarting(false);
    }
  };

  const handleLoadWorkshop = async () => {
    if (!loadOrgId.trim()) return;

    setIsStarting(true);
    try {
      await loadFromCloud(loadOrgId.trim());
      setShowLoadModal(false);
      router.push("/workshop");
    } catch (error) {
      console.error("Failed to load workshop:", error);
      setIsStarting(false);
    }
  };

  const handleResumeWorkshop = () => {
    router.push("/workshop");
  };

  const handleNewWorkshop = () => {
    resetWorkshop();
    setOrgName("");
  };

  const phases = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Find the Friction",
      description: "Identify high-value pain points where AI can make a real difference",
      accent: "yellow",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Organize the Work",
      description: "Map processes and design future-state agentic workflows",
      accent: "coral",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Replicate Intelligence",
      description: "Build lean MVP agents and prove technical viability",
      accent: "teal",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Generate Feedback",
      description: "Run structured pilots, validate performance, and iterate",
      accent: "yellow",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--color-accent-coral)]/5" />

        <div className="container relative py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider uppercase bg-[var(--color-surface)] border-l-4 border-[var(--color-accent)]">
                Interactive Workshop Guide
              </span>
            </motion.div>

            <motion.h1
              className="mb-6 font-[var(--font-display)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-[var(--color-accent)]">Agent</span>
              <span className="text-[var(--color-text)]">Mapper</span>
            </motion.h1>

            <motion.p
              className="mb-10 text-xl text-[var(--color-text-body)] max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              A self-guided workshop for implementing Agentic AI in your organization.
              Four sessions, practical exercises, and a clear path from friction to transformation.
            </motion.p>

            {/* CTA Section */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {organization ? (
                <Card accent="yellow" hoverable={false} className="w-full max-w-md p-6">
                  <CardContent>
                    <p className="text-sm text-[var(--color-text-muted)] mb-2">
                      Resume your workshop
                    </p>
                    <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
                      {organization.name}
                    </p>
                    {cloudOrgId && (
                      <p className="text-xs text-[var(--color-accent-teal)] flex items-center gap-1 mb-4">
                        <Cloud className="w-3 h-3" />
                        Synced to cloud
                      </p>
                    )}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={handleResumeWorkshop}
                        className="flex-1"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continue
                      </Button>
                      <Button variant="ghost" onClick={handleNewWorkshop}>
                        Start Fresh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card accent="yellow" hoverable={false} className="w-full max-w-md p-6">
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        label="Organization Name"
                        placeholder="Enter your organization name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleStartWorkshop()}
                      />
                      <Button
                        variant="primary"
                        onClick={handleStartWorkshop}
                        isLoading={isStarting}
                        disabled={!orgName.trim()}
                        className="w-full"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Begin Workshop
                      </Button>

                      {isSupabaseAvailable && (
                        <div className="pt-4 border-t border-white/[0.08]">
                          <button
                            onClick={() => setShowLoadModal(true)}
                            className="w-full text-sm text-[var(--color-accent-teal)] hover:underline flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Load existing workshop
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Load Workshop Modal */}
              <AnimatePresence>
                {showLoadModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowLoadModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-[var(--color-surface)] border border-white/[0.08] rounded-lg p-6 w-full max-w-md mx-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold mb-4">Load Existing Workshop</h3>

                      <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        Enter the organization ID from a previous session to continue where
                        you left off.
                      </p>

                      <Input
                        label="Organization ID"
                        placeholder="Enter your organization ID"
                        value={loadOrgId}
                        onChange={(e) => setLoadOrgId(e.target.value)}
                        className="mb-4 font-mono"
                      />

                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={handleLoadWorkshop}
                          disabled={!loadOrgId.trim() || isStarting}
                          isLoading={isStarting}
                          className="flex-1"
                        >
                          Load Workshop
                        </Button>
                        <Button variant="ghost" onClick={() => setShowLoadModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Framework Phases */}
      <section className="py-24 bg-[var(--color-surface)]">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[var(--font-display)] mb-4">
              A Proven <span className="text-[var(--color-accent)]">Framework</span>
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              A 5-phase approach to implementing Agentic AI that focuses on
              business value, not just technology.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  accent={phase.accent as "yellow" | "coral" | "teal"}
                  className="h-full"
                  hoverable
                >
                  <div
                    className={`mb-4 p-3 w-fit rounded-lg ${
                      phase.accent === "yellow"
                        ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : phase.accent === "coral"
                        ? "bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]"
                        : "bg-[var(--color-accent-teal)]/10 text-[var(--color-accent-teal)]"
                    }`}
                  >
                    {phase.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {phase.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Structure */}
      <section className="py-24">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[var(--font-display)] mb-4">
              Four Sessions to <span className="text-[var(--color-accent-coral)]">Transformation</span>
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Each session builds on the last, taking you from shared understanding
              to a concrete 90-day implementation roadmap.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                number: 1,
                title: "Orientation & Shared Understanding",
                duration: "2-3 hours",
                description:
                  "Align on what Agentic AI means for your organization. Define aspirations, boundaries, and guardrails.",
                exercises: ["Future Headlines", "Opportunity Brainstorm", "Design Principles"],
              },
              {
                number: 2,
                title: "Find the Friction",
                duration: "3-4 hours",
                description:
                  "Map your processes, identify pain points, and prioritize opportunities using value and complexity scoring.",
                exercises: ["Friction Mapping", "Opportunity Scoring", "Priority Matrix", "Dot Voting"],
              },
              {
                number: 3,
                title: "Organize the Work",
                duration: "3-4 hours",
                description:
                  "Design future-state workflows, assess risks using NIST AI RMF, and create your MVP pilot charter.",
                exercises: ["Pattern Matching", "Workflow Design", "Risk Assessment", "Pilot Charter"],
              },
              {
                number: 4,
                title: "Roadmap & Governance",
                duration: "2-3 hours",
                description:
                  "Build a detailed 90-day roadmap, define roles with RACI, and establish governance guidelines.",
                exercises: ["Roadmap Builder", "RACI Matrix", "Governance Setup", "Commitments"],
              },
            ].map((session, index) => (
              <motion.div
                key={session.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card accent="teal" className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-accent-teal)]/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-[var(--color-accent-teal)]">
                        {session.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{session.title}</h3>
                        <span className="px-2 py-0.5 text-xs bg-[var(--color-surface)] text-[var(--color-text-muted)] rounded">
                          {session.duration}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        {session.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {session.exercises.map((exercise) => (
                          <span
                            key={exercise}
                            className="px-2 py-1 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded"
                          >
                            {exercise}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.08]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[var(--color-text-muted)]">
              AgentMapper
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">
              A structured approach to AI implementation
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
