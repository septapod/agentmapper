"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  useWorkshopStore,
  useIsDirty,
  useCloudOrgId,
  useSyncStatus,
  useLastSyncedAt,
  useSyncError,
} from "@/store/workshop";
import { isSupabaseConfigured } from "@/lib/supabase";

const SYNC_DEBOUNCE_MS = 5000; // 5 seconds after last change

export interface UseCloudSyncReturn {
  // State
  isConnected: boolean;
  syncStatus: "idle" | "syncing" | "error" | "offline";
  lastSyncedAt: string | null;
  syncError: string | null;
  isDirty: boolean;
  isSupabaseAvailable: boolean;

  // Actions
  syncNow: () => Promise<void>;
  connectToCloud: (orgName: string) => Promise<string>;
  loadFromCloud: (orgId: string) => Promise<void>;
  disconnectFromCloud: () => void;
}

export function useCloudSync(): UseCloudSyncReturn {
  const cloudOrgId = useCloudOrgId();
  const syncStatus = useSyncStatus();
  const lastSyncedAt = useLastSyncedAt();
  const syncError = useSyncError();
  const isDirty = useIsDirty();

  const {
    syncToCloud,
    connectToCloud: storeConnectToCloud,
    loadFromCloud: storeLoadFromCloud,
    disconnectFromCloud: storeDisconnectFromCloud,
    setSyncStatus,
  } = useWorkshopStore();

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSupabaseAvailable = isSupabaseConfigured();
  const isConnected = cloudOrgId !== null;

  // Debounced auto-sync when data changes
  useEffect(() => {
    if (!isConnected || !isDirty || !isSupabaseAvailable) {
      return;
    }

    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Set new timeout for debounced sync
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await syncToCloud();
      } catch (error) {
        console.error("Auto-sync failed:", error);
      }
    }, SYNC_DEBOUNCE_MS);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isConnected, isDirty, isSupabaseAvailable, syncToCloud]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      if (syncStatus === "offline") {
        setSyncStatus("idle");
      }
    };

    const handleOffline = () => {
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial offline status if needed
    if (!navigator.onLine) {
      setSyncStatus("offline");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setSyncStatus, syncStatus]);

  const syncNow = useCallback(async () => {
    if (!isConnected) {
      throw new Error("Not connected to cloud");
    }

    // Clear any pending debounced sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    await syncToCloud();
  }, [isConnected, syncToCloud]);

  const connectToCloud = useCallback(
    async (orgName: string) => {
      if (!isSupabaseAvailable) {
        throw new Error("Supabase is not configured");
      }
      return storeConnectToCloud(orgName);
    },
    [isSupabaseAvailable, storeConnectToCloud]
  );

  const loadFromCloud = useCallback(
    async (orgId: string) => {
      if (!isSupabaseAvailable) {
        throw new Error("Supabase is not configured");
      }
      await storeLoadFromCloud(orgId);
    },
    [isSupabaseAvailable, storeLoadFromCloud]
  );

  const disconnectFromCloud = useCallback(() => {
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    storeDisconnectFromCloud();
  }, [storeDisconnectFromCloud]);

  return {
    isConnected,
    syncStatus,
    lastSyncedAt,
    syncError,
    isDirty,
    isSupabaseAvailable,
    syncNow,
    connectToCloud,
    loadFromCloud,
    disconnectFromCloud,
  };
}
