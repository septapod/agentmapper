"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Lightbulb as LightbulbIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea, Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  useWorkshopStore,
  useLessonsLearned,
} from "@/store/workshop";

const categories = [
  { value: "success", label: "Success", icon: CheckCircle2, color: "teal" },
  { value: "challenge", label: "Challenge", icon: AlertTriangle, color: "coral" },
  { value: "surprise", label: "Surprise", icon: Sparkles, color: "purple" },
  { value: "recommendation", label: "Recommendation", icon: MessageSquare, color: "yellow" },
] as const;

export default function LessonsLearnedPage() {
  const lessonsLearned = useLessonsLearned();
  const { addLessonLearned, deleteLessonLearned } = useWorkshopStore();

  const [category, setCategory] = useState<"success" | "challenge" | "surprise" | "recommendation">("success");
  const [description, setDescription] = useState("");
  const [applicableTo, setApplicableTo] = useState("");

  const handleSubmit = () => {
    if (!description.trim()) return;

    addLessonLearned({
      category,
      description: description.trim(),
      applicableTo: applicableTo.split(",").map((a) => a.trim()).filter(Boolean),
    });

    setDescription("");
    setApplicableTo("");
  };

  const lessonsByCategory = categories.map((cat) => ({
    ...cat,
    lessons: lessonsLearned.filter((l) => l.category === cat.value),
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/workshop/session-5" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Session 5
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-purple)]/20 flex items-center justify-center">
            <LightbulbIcon className="w-6 h-6 text-[var(--color-accent-purple)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Lessons Learned</h1>
            <p className="text-[var(--color-text-muted)]">Capture what worked, challenges, and recommendations</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <Card>
          <CardHeader><CardTitle>Add Lesson Learned</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${category === cat.value ? `border-[var(--color-accent-${cat.color})] bg-[var(--color-accent-${cat.color})]/10` : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"}`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${category === cat.value ? `text-[var(--color-accent-${cat.color})]` : "text-[var(--color-text-muted)]"}`} />
                      <div className="text-sm font-medium">{cat.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <TextArea label="Description" placeholder="What did you learn?" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            <Input label="Applicable To (comma-separated, optional)" placeholder="e.g., future AI pilots, other departments, similar use cases" value={applicableTo} onChange={(e) => setApplicableTo(e.target.value)} />
            <Button onClick={handleSubmit} variant="primary" disabled={!description.trim()} leftIcon={<Plus className="w-4 h-4" />} className="w-full">Add Lesson</Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
        {lessonsByCategory.map((cat) => cat.lessons.length > 0 && (
          <div key={cat.value}>
            <div className="flex items-center gap-2 mb-3">
              <cat.icon className={`w-5 h-5 text-[var(--color-accent-${cat.color})]`} />
              <h3 className="text-lg font-semibold">{cat.label}</h3>
              <Badge color={cat.color as any} size="sm">{cat.lessons.length}</Badge>
            </div>
            <div className="space-y-3">
              {cat.lessons.map((lesson) => (
                <Card key={lesson.id} accent={cat.color} className="group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[var(--color-text)]">{lesson.description}</p>
                      {lesson.applicableTo.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {lesson.applicableTo.map((app, i) => (<Badge key={i} variant="default" size="sm">{app}</Badge>))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => deleteLessonLearned(lesson.id)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-coral)] opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {lessonsLearned.length === 0 && (<div className="text-center py-12 text-[var(--color-text-muted)]"><LightbulbIcon className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No lessons learned yet. Add your first lesson above!</p></div>)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 flex justify-between items-center">
        <Link href="/workshop/session-5/training-plan"><Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Training Plan</Button></Link>
        {lessonsLearned.length > 0 && (<Link href="/workshop/session-5/next-opportunities"><Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>Continue to Next Opportunities</Button></Link>)}
      </motion.div>
    </div>
  );
}
