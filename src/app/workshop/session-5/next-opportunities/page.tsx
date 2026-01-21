"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Repeat,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useNextOpportunities,
} from "@/store/workshop";

export default function NextOpportunitiesPage() {
  const nextOpportunities = useNextOpportunities();
  const { addNextOpportunity, deleteNextOpportunity } = useWorkshopStore();

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [patternToReuse, setPatternToReuse] = useState("");
  const [estimatedValue, setEstimatedValue] = useState<"low" | "medium" | "high">("medium");
  const [priority, setPriority] = useState(0);

  const handleSubmit = () => {
    if (!title.trim() || !domain.trim()) return;

    addNextOpportunity({
      title: title.trim(),
      domain: domain.trim(),
      patternToReuse: patternToReuse.trim(),
      estimatedValue,
      priority,
    });

    setTitle("");
    setDomain("");
    setPatternToReuse("");
    setEstimatedValue("medium");
    setPriority(0);
  };

  const sortedOpportunities = [...nextOpportunities].sort((a, b) => b.priority - a.priority);

  const getValueIcon = (value: string) => {
    if (value === "high") return <TrendingUp className="w-4 h-4" />;
    if (value === "low") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getValueColor = (value: string) => {
    if (value === "high") return "teal";
    if (value === "medium") return "yellow";
    return "coral";
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/workshop/session-5" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Session 5
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/20 flex items-center justify-center">
            <Repeat className="w-6 h-6 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Next Opportunities</h1>
            <p className="text-[var(--color-text-muted)]">Identify where to apply proven patterns next</p>
          </div>
        </div>
        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-2">Build Momentum</p>
              <p className="text-[var(--color-text-muted)]">Look for similar friction patterns in other areas. Reuse successful approaches from this pilot. Start small again - don't try to scale too fast. Build momentum with quick wins.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <Card>
          <CardHeader><CardTitle>Add Next Opportunity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Title" placeholder="What's the opportunity?" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input label="Domain/Area" placeholder="e.g., Operations, Customer Service, Finance" value={domain} onChange={(e) => setDomain(e.target.value)} />
            <TextArea label="Pattern to Reuse (optional)" placeholder="What patterns or approaches from this pilot can be applied?" value={patternToReuse} onChange={(e) => setPatternToReuse(e.target.value)} rows={3} />
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Value</label>
              <div className="flex gap-3">
                {[
                  { value: "high", label: "High", icon: TrendingUp },
                  { value: "medium", label: "Medium", icon: Minus },
                  { value: "low", label: "Low", icon: TrendingDown },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setEstimatedValue(value as "low" | "medium" | "high")}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center gap-2 ${estimatedValue === value ? `bg-[var(--color-accent-${getValueColor(value)})]/20 border-[var(--color-accent-${getValueColor(value)})] text-[var(--color-accent-${getValueColor(value)})]` : "border-white/[0.1] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority (0-10)</label>
              <Input type="number" min={0} max={10} value={priority} onChange={(e) => setPriority(Number(e.target.value))} placeholder="0 = lowest, 10 = highest" />
            </div>
            <Button onClick={handleSubmit} variant="primary" disabled={!title.trim() || !domain.trim()} leftIcon={<Plus className="w-4 h-4" />} className="w-full">Add Opportunity</Button>
          </CardContent>
        </Card>
      </motion.div>

      {sortedOpportunities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-xl font-bold">Your Pipeline ({sortedOpportunities.length})</h2>
          {sortedOpportunities.map((opp) => (
            <Card key={opp.id} className="group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{opp.title}</h3>
                    <Badge variant="default">{opp.domain}</Badge>
                    <Badge variant={getValueColor(opp.estimatedValue) as any} className="flex items-center gap-1">{getValueIcon(opp.estimatedValue)}{opp.estimatedValue}</Badge>
                    {opp.priority > 0 && (<Badge variant="coral">P{opp.priority}</Badge>)}
                  </div>
                  {opp.patternToReuse && (<p className="text-sm text-[var(--color-text-muted)] mb-2">Pattern: {opp.patternToReuse}</p>)}
                </div>
                <button onClick={() => deleteNextOpportunity(opp.id)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 flex justify-between items-center">
        <Link href="/workshop/session-5/lessons-learned"><Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Lessons Learned</Button></Link>
        <Link href="/workshop"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Complete Workshop</Button></Link>
      </motion.div>
    </div>
  );
}
