"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useOrganization,
  useIcebreakerResponses,
  useCognitiveBiases,
  useWorkingPrinciples,
  useTradeoffs,
  useFrictionPoints,
  useScoredOpportunities,
  useMVPSpecs,
  usePilotPlans,
  useRoadmapMilestones,
  useScalingChecklist,
  useTrainingPlan,
  useLessonsLearned,
  useNextOpportunities,
} from "@/store/workshop";

// Empty state component
function EmptySection({ message }: { message: string }) {
  return (
    <div className="print-empty my-4">
      {message}
    </div>
  );
}

// Section wrapper
function ReportSection({ title, children, isEmpty }: { title: string; children: React.ReactNode; isEmpty?: boolean }) {
  return (
    <div className="mb-8 print-no-break">
      <h3 className="print-subsection-title text-lg font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-1">
        {title}
      </h3>
      {isEmpty ? <EmptySection message="Not yet started" /> : children}
    </div>
  );
}

export default function ReportPage() {
  const organization = useOrganization();
  const icebreakerResponses = useIcebreakerResponses();
  const cognitiveBiases = useCognitiveBiases();
  const workingPrinciples = useWorkingPrinciples();
  const tradeoffs = useTradeoffs();
  const frictionPoints = useFrictionPoints();
  const scoredOpportunities = useScoredOpportunities();
  const mvpSpecs = useMVPSpecs();
  const pilotPlans = usePilotPlans();
  const roadmapMilestones = useRoadmapMilestones();
  const scalingChecklist = useScalingChecklist();
  const trainingPlan = useTrainingPlan();
  const lessonsLearned = useLessonsLearned();
  const nextOpportunities = useNextOpportunities();

  const handlePrint = () => window.print();

  const checkedBiases = cognitiveBiases.filter(b => b.checked);

  const principleLabels: Record<string, string> = {
    "human-centered": "Human-Centered",
    "control-accountability": "Control & Accountability",
    "observability-explainability": "Observability & Explainability",
    "improvement-responsiveness": "Improvement & Responsiveness",
  };

  const tradeoffLabels: Record<string, { left: string; right: string; title: string }> = {
    "control": { title: "Control", left: "Humans in charge", right: "AI autonomous" },
    "priority": { title: "Priority", left: "Efficiency first", right: "Experience first" },
    "users": { title: "Users", left: "Internal focus", right: "External focus" },
    "external-comms": { title: "External Comms", left: "Cautious", right: "Transparent" },
    "internal-comms": { title: "Internal Comms", left: "Need-to-know", right: "Open by default" },
  };

  return (
    <div className="print-report">
      {/* Print Controls - hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <Button onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
          Print Report
        </Button>
      </div>

      {/* Report Content */}
      <div className="print-content max-w-4xl mx-auto p-8">
        {/* Cover / Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-gray-300">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AgentMapper Workshop Report</h1>
          <h2 className="text-2xl text-gray-700 mb-4">{organization?.name || "Workshop"}</h2>
          <p className="text-gray-500">Generated: {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </header>

        {/* Session 1: AI Strategy Foundation */}
        <section className="print-page-break mb-12">
          <h2 className="print-section-title text-2xl font-bold mb-6 text-gray-900 border-b-2 border-[#437481] pb-2">
            Session 1: AI Strategy Foundation
          </h2>

          {/* AI Icebreakers */}
          <ReportSection title="AI Icebreaker Responses" isEmpty={icebreakerResponses.length === 0}>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Participant</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Impact Score (0-4)</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Optimism Score (0-4)</th>
                </tr>
              </thead>
              <tbody>
                {icebreakerResponses.map((r) => (
                  <tr key={r.id}>
                    <td className="p-2 border border-gray-300">{r.participantName}</td>
                    <td className="p-2 border border-gray-300 text-center">{r.impactScore}</td>
                    <td className="p-2 border border-gray-300 text-center">{r.optimismScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>

          {/* Cognitive Biases Discussed */}
          <ReportSection title="Cognitive Biases Discussed" isEmpty={checkedBiases.length === 0}>
            <ul className="list-disc pl-6 space-y-2">
              {checkedBiases.map((bias) => (
                <li key={bias.id}>
                  <strong>{bias.name}:</strong> {bias.description}
                </li>
              ))}
            </ul>
          </ReportSection>

          {/* Working Principles */}
          <ReportSection title="AI Working Principles" isEmpty={workingPrinciples.length === 0}>
            {workingPrinciples.map((principle) => (
              <div key={principle.id} className="print-card mb-4 p-4 border border-gray-300 rounded">
                <h4 className="font-semibold text-gray-800 mb-2">{principleLabels[principle.principleType] || principle.principleType}</h4>
                {principle.dos.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium text-green-700">Do:</span>
                    <ul className="list-disc pl-6">
                      {principle.dos.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {principle.donts.length > 0 && (
                  <div>
                    <span className="font-medium text-red-700">Don't:</span>
                    <ul className="list-disc pl-6">
                      {principle.donts.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </ReportSection>

          {/* Tradeoff Navigator */}
          <ReportSection title="Tradeoff Navigator Results" isEmpty={!tradeoffs.some(t => t.rationale)}>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Tradeoff</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Position</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {tradeoffs.map((t) => {
                  const labels = tradeoffLabels[t.topic];
                  const position = t.sliderValue < 33 ? labels?.left : t.sliderValue > 66 ? labels?.right : "Balanced";
                  return (
                    <tr key={t.id}>
                      <td className="p-2 border border-gray-300 font-medium">{labels?.title || t.topic}</td>
                      <td className="p-2 border border-gray-300 text-center">{position} ({t.sliderValue}%)</td>
                      <td className="p-2 border border-gray-300">{t.rationale || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ReportSection>
        </section>

        {/* Session 2: Find the Friction */}
        <section className="print-page-break mb-12">
          <h2 className="print-section-title text-2xl font-bold mb-6 text-gray-900 border-b-2 border-[#437481] pb-2">
            Session 2: Find the Friction
          </h2>

          {/* Friction Points */}
          <ReportSection title="Friction Points" isEmpty={frictionPoints.length === 0}>
            {frictionPoints.map((fp) => (
              <div key={fp.id} className="print-card mb-3 p-3 border border-gray-300 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <span className="print-badge px-2 py-0.5 text-xs border border-gray-400 rounded">{fp.processArea}</span>
                  {fp.priority && (
                    <span className={`print-badge px-2 py-0.5 text-xs border rounded ${
                      fp.priority === "high" ? "border-red-400 text-red-700" :
                      fp.priority === "medium" ? "border-yellow-400 text-yellow-700" :
                      "border-green-400 text-green-700"
                    }`}>
                      {fp.priority}
                    </span>
                  )}
                </div>
                <p className="text-gray-800">{fp.description}</p>
              </div>
            ))}
          </ReportSection>

          {/* Scored Opportunities */}
          <ReportSection title="Scored Opportunities" isEmpty={scoredOpportunities.length === 0}>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Opportunity</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Value</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Complexity</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Quadrant</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Votes</th>
                </tr>
              </thead>
              <tbody>
                {scoredOpportunities.map((opp) => (
                  <tr key={opp.id} className={opp.selectedForPilot ? "bg-green-50" : ""}>
                    <td className="p-2 border border-gray-300">
                      <strong>{opp.title}</strong>
                      {opp.selectedForPilot && <span className="ml-2 text-green-600">(Selected for Pilot)</span>}
                      <br />
                      <span className="text-sm text-gray-600">{opp.description}</span>
                    </td>
                    <td className="p-2 border border-gray-300 text-center">{opp.valueScore}</td>
                    <td className="p-2 border border-gray-300 text-center">{opp.complexityScore}</td>
                    <td className="p-2 border border-gray-300 text-center capitalize">{opp.quadrant.replace("-", " ")}</td>
                    <td className="p-2 border border-gray-300 text-center">{opp.voteCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </section>

        {/* Session 3: Organize the Work */}
        <section className="print-page-break mb-12">
          <h2 className="print-section-title text-2xl font-bold mb-6 text-gray-900 border-b-2 border-[#437481] pb-2">
            Session 3: Organize the Work
          </h2>

          <ReportSection title="MVP Specifications" isEmpty={mvpSpecs.length === 0}>
            {mvpSpecs.map((spec) => (
              <div key={spec.id} className="print-card mb-4 p-4 border border-gray-300 rounded">
                <h4 className="font-semibold text-gray-800 mb-2">Scope</h4>
                <p className="mb-3">{spec.scope}</p>

                {spec.toolsToUse.length > 0 && (
                  <div className="mb-2">
                    <strong>Tools:</strong> {spec.toolsToUse.join(", ")}
                  </div>
                )}

                {spec.humanCheckpoints.length > 0 && (
                  <div className="mb-2">
                    <strong>Human Checkpoints:</strong>
                    <ul className="list-disc pl-6">
                      {spec.humanCheckpoints.map((cp, i) => <li key={i}>{cp}</li>)}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div><strong>Success Threshold:</strong> {spec.successThreshold}</div>
                  <div><strong>Timeframe:</strong> {spec.timeframe}</div>
                </div>
              </div>
            ))}
          </ReportSection>
        </section>

        {/* Session 4: Roadmap & Governance */}
        <section className="print-page-break mb-12">
          <h2 className="print-section-title text-2xl font-bold mb-6 text-gray-900 border-b-2 border-[#437481] pb-2">
            Session 4: Roadmap & Governance
          </h2>

          <ReportSection title="Pilot Plans" isEmpty={pilotPlans.length === 0}>
            {pilotPlans.map((plan) => (
              <div key={plan.id} className="print-card mb-4 p-4 border border-gray-300 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Test Users:</strong>
                    <ul className="list-disc pl-6">
                      {plan.testUsers.map((user, i) => <li key={i}>{user}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Metrics to Track:</strong>
                    <ul className="list-disc pl-6">
                      {plan.metricsToTrack.map((metric, i) => <li key={i}>{metric}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-3">
                  <strong>Duration:</strong> {plan.duration}
                </div>
                {plan.stopCriteria.length > 0 && (
                  <div className="mt-2">
                    <strong>Stop Criteria:</strong>
                    <ul className="list-disc pl-6">
                      {plan.stopCriteria.map((criteria, i) => <li key={i}>{criteria}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </ReportSection>

          <ReportSection title="90-Day Roadmap" isEmpty={roadmapMilestones.length === 0}>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Week</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Phase</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Activity</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Owner</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Success Criteria</th>
                </tr>
              </thead>
              <tbody>
                {roadmapMilestones.sort((a, b) => a.weekStart - b.weekStart).map((milestone) => (
                  <tr key={milestone.id}>
                    <td className="p-2 border border-gray-300">
                      {milestone.weekStart === milestone.weekEnd
                        ? `Week ${milestone.weekStart}`
                        : `Weeks ${milestone.weekStart}-${milestone.weekEnd}`}
                    </td>
                    <td className="p-2 border border-gray-300 capitalize">{milestone.phase}</td>
                    <td className="p-2 border border-gray-300">{milestone.activity}</td>
                    <td className="p-2 border border-gray-300">{milestone.owner}</td>
                    <td className="p-2 border border-gray-300">{milestone.successCriteria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </section>

        {/* Session 5: Empower Teams */}
        <section className="print-page-break mb-12">
          <h2 className="print-section-title text-2xl font-bold mb-6 text-gray-900 border-b-2 border-[#437481] pb-2">
            Session 5: Empower Teams
          </h2>

          <ReportSection title="Scaling Checklist" isEmpty={scalingChecklist.length === 0}>
            {["documentation", "training", "ownership", "feedback", "metrics"].map((category) => {
              const items = scalingChecklist.filter(item => item.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-4">
                  <h4 className="font-semibold capitalize mb-2">{category}</h4>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <span>{item.completed ? "✅" : "⬜"}</span>
                        <span>{item.item}</span>
                        {item.notes && <span className="text-gray-500 text-sm">({item.notes})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </ReportSection>

          <ReportSection title="Training Plan" isEmpty={trainingPlan.length === 0}>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Role</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Training Needs</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Champion</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Target Date</th>
                </tr>
              </thead>
              <tbody>
                {trainingPlan.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-2 border border-gray-300">{entry.role}</td>
                    <td className="p-2 border border-gray-300">
                      <ul className="list-disc pl-4">
                        {entry.trainingNeeds.map((need, i) => <li key={i}>{need}</li>)}
                      </ul>
                    </td>
                    <td className="p-2 border border-gray-300">{entry.champion}</td>
                    <td className="p-2 border border-gray-300">{entry.targetDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>

          <ReportSection title="Lessons Learned" isEmpty={lessonsLearned.length === 0}>
            {["success", "challenge", "surprise", "recommendation"].map((category) => {
              const items = lessonsLearned.filter(item => item.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mb-4">
                  <h4 className="font-semibold capitalize mb-2">{category === "recommendation" ? "Recommendations" : `${category}es`}</h4>
                  <ul className="list-disc pl-6">
                    {items.map((item) => (
                      <li key={item.id}>{item.description}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </ReportSection>

          <ReportSection title="Next Opportunities" isEmpty={nextOpportunities.length === 0}>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Priority</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Opportunity</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Domain</th>
                  <th className="text-left p-2 bg-gray-100 border border-gray-300">Pattern to Reuse</th>
                  <th className="text-center p-2 bg-gray-100 border border-gray-300">Est. Value</th>
                </tr>
              </thead>
              <tbody>
                {nextOpportunities.sort((a, b) => a.priority - b.priority).map((opp) => (
                  <tr key={opp.id}>
                    <td className="p-2 border border-gray-300 text-center">{opp.priority}</td>
                    <td className="p-2 border border-gray-300">{opp.title}</td>
                    <td className="p-2 border border-gray-300">{opp.domain}</td>
                    <td className="p-2 border border-gray-300">{opp.patternToReuse}</td>
                    <td className="p-2 border border-gray-300 text-center capitalize">{opp.estimatedValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-8 border-t border-gray-300">
          <p>Generated by AgentMapper Workshop Tool</p>
        </footer>
      </div>
    </div>
  );
}
