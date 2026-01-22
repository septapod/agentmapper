// AI Summary caching utilities
// Caches AI-generated summaries in localStorage with TTL and data hash invalidation

const CACHE_PREFIX = "ai-summary-";
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedSummary {
  summary: string;
  timestamp: string;
  dataHash: string;
  expiresAt: number;
}

// Simple hash function for data comparison
function hashData(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Generate cache key
function getCacheKey(type: string, id?: string): string {
  return `${CACHE_PREFIX}${type}${id ? `-${id}` : ""}`;
}

// Check if cache entry is valid
function isValidCache(cached: CachedSummary, currentDataHash: string): boolean {
  // Check if expired
  if (Date.now() > cached.expiresAt) {
    return false;
  }

  // Check if data has changed
  if (cached.dataHash !== currentDataHash) {
    return false;
  }

  return true;
}

// Get cached summary
export function getCachedSummary(
  type: "exercise" | "session" | "workshop",
  id: string | undefined,
  data: unknown
): { summary: string; timestamp: string } | null {
  if (typeof window === "undefined") return null;

  try {
    const key = getCacheKey(type, id);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const parsedCache: CachedSummary = JSON.parse(cached);
    const currentDataHash = hashData(data);

    if (!isValidCache(parsedCache, currentDataHash)) {
      // Invalid cache, remove it
      localStorage.removeItem(key);
      return null;
    }

    return {
      summary: parsedCache.summary,
      timestamp: parsedCache.timestamp,
    };
  } catch {
    return null;
  }
}

// Set cached summary
export function setCachedSummary(
  type: "exercise" | "session" | "workshop",
  id: string | undefined,
  data: unknown,
  summary: string,
  timestamp: string,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  if (typeof window === "undefined") return;

  try {
    const key = getCacheKey(type, id);
    const dataHash = hashData(data);

    const cacheEntry: CachedSummary = {
      summary,
      timestamp,
      dataHash,
      expiresAt: Date.now() + ttlMs,
    };

    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

// Clear specific cache entry (for manual regeneration)
export function clearCachedSummary(
  type: "exercise" | "session" | "workshop",
  id?: string
): void {
  if (typeof window === "undefined") return;

  try {
    const key = getCacheKey(type, id);
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

// Clear all AI summary caches
export function clearAllSummaryCaches(): void {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Silently fail
  }
}

// Fetch AI summary with caching
export async function fetchAISummary(
  type: "exercise" | "session" | "workshop",
  id: string | undefined,
  data: unknown,
  forceRefresh: boolean = false
): Promise<{ summary: string; timestamp: string; cached: boolean } | null> {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getCachedSummary(type, id, data);
    if (cached) {
      return { ...cached, cached: true };
    }
  }

  // Fetch from API
  try {
    const body: {
      type: string;
      data: unknown;
      exerciseId?: string;
      sessionNumber?: number;
    } = { type, data };

    if (type === "exercise" && id) {
      body.exerciseId = id;
    } else if (type === "session" && id) {
      body.sessionNumber = parseInt(id, 10);
    }

    const response = await fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.fallback) {
        // API indicated to use fallback (no API key, etc.)
        return null;
      }
      throw new Error(errorData.error || "Failed to fetch summary");
    }

    const result = await response.json();

    // Cache the result
    setCachedSummary(type, id, data, result.summary, result.timestamp);

    return {
      summary: result.summary,
      timestamp: result.timestamp,
      cached: false,
    };
  } catch (error) {
    console.error("Failed to fetch AI summary:", error);
    return null;
  }
}
