"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { fetchAISummary, clearCachedSummary } from "@/lib/ai-summary-cache";

interface AISummaryCardProps {
  type: "exercise" | "session" | "workshop";
  id?: string;
  data: unknown;
  fallbackSummary?: string;
}

export function AISummaryCard({
  type,
  id,
  data,
  fallbackSummary,
}: AISummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const fetchSummary = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchAISummary(type, id, data, forceRefresh);

        if (result) {
          setSummary(result.summary);
          setIsCached(result.cached);
        } else {
          // Use fallback if AI summary not available
          if (fallbackSummary) {
            setSummary(fallbackSummary);
            setIsCached(false);
          } else {
            setSummary(null);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary");
        if (fallbackSummary) {
          setSummary(fallbackSummary);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [type, id, data, fallbackSummary]
  );

  useEffect(() => {
    // Only fetch if there's meaningful data
    if (data && Object.keys(data as object).length > 0) {
      fetchSummary();
    }
  }, [data, fetchSummary]);

  const handleRefresh = () => {
    clearCachedSummary(type, id);
    fetchSummary(true);
  };

  // Don't render if no data
  if (!data || Object.keys(data as object).length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-accent-teal)]/5 border border-[var(--color-accent)]/20 rounded-lg p-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            AI Insight
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1 rounded hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
          title="Regenerate insight"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[var(--color-text-muted)] ${
              isLoading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {/* Content */}
      {isLoading && !summary ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-[var(--color-surface)] rounded w-full" />
          <div className="h-4 bg-[var(--color-surface)] rounded w-5/6" />
          <div className="h-4 bg-[var(--color-surface)] rounded w-4/6" />
        </div>
      ) : error && !summary ? (
        <p className="text-sm text-[var(--color-text-muted)]">
          Unable to generate insight. {fallbackSummary || ""}
        </p>
      ) : summary ? (
        <div className="relative">
          <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
            {summary}
          </p>
          {isCached && (
            <span className="absolute -top-5 right-6 text-[10px] text-[var(--color-text-muted)]">
              cached
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
