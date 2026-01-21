import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Organization,
  FutureHeadline,
  Opportunity,
  DesignPrinciple,
  FrictionPoint,
  ScoredOpportunity,
  Pilot,
  RoadmapMilestone,
  RACIEntry,
  WorkshopState,
} from "@/types/workshop";
import { db, isSupabaseConfigured } from "@/lib/supabase";

// Cloud sync types
export type SyncStatus = "idle" | "syncing" | "error" | "offline";

interface CloudState {
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  cloudOrgId: string | null;
  syncError: string | null;
}

interface WorkshopActions {
  // Organization
  setOrganization: (org: Organization) => void;
  updateOrganization: (updates: Partial<Organization>) => void;

  // Session navigation
  setCurrentSession: (session: number) => void;

  // Session 1 - Future Headlines
  addFutureHeadline: (headline: Omit<FutureHeadline, "id" | "createdAt">) => void;
  updateFutureHeadline: (id: string, updates: Partial<FutureHeadline>) => void;
  deleteFutureHeadline: (id: string) => void;

  // Session 1 - Opportunities
  addOpportunity: (opportunity: Omit<Opportunity, "id" | "createdAt">) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;

  // Session 1 - Design Principles
  addDesignPrinciple: (principle: Omit<DesignPrinciple, "id" | "createdAt">) => void;
  updateDesignPrinciple: (id: string, updates: Partial<DesignPrinciple>) => void;
  deleteDesignPrinciple: (id: string) => void;

  // Session 2 - Friction Points
  addFrictionPoint: (friction: Omit<FrictionPoint, "id" | "createdAt">) => void;
  updateFrictionPoint: (id: string, updates: Partial<FrictionPoint>) => void;
  deleteFrictionPoint: (id: string) => void;

  // Session 2 - Scored Opportunities
  addScoredOpportunity: (opportunity: Omit<ScoredOpportunity, "id">) => void;
  updateScoredOpportunity: (id: string, updates: Partial<ScoredOpportunity>) => void;
  deleteScoredOpportunity: (id: string) => void;
  voteForOpportunity: (id: string) => void;
  togglePilotSelection: (id: string) => void;

  // Session 3 - Pilots
  addPilot: (pilot: Omit<Pilot, "id">) => void;
  updatePilot: (id: string, updates: Partial<Pilot>) => void;
  deletePilot: (id: string) => void;

  // Session 4 - Roadmap
  addRoadmapMilestone: (milestone: Omit<RoadmapMilestone, "id">) => void;
  updateRoadmapMilestone: (id: string, updates: Partial<RoadmapMilestone>) => void;
  deleteRoadmapMilestone: (id: string) => void;

  // Session 4 - RACI
  addRACIEntry: (entry: Omit<RACIEntry, "id">) => void;
  updateRACIEntry: (id: string, updates: Partial<RACIEntry>) => void;
  deleteRACIEntry: (id: string) => void;

  // Meta
  markDirty: () => void;
  markSaved: () => void;
  resetWorkshop: () => void;

  // Cloud sync actions
  connectToCloud: (orgName: string) => Promise<string>;
  loadFromCloud: (orgId: string) => Promise<void>;
  syncToCloud: () => Promise<void>;
  disconnectFromCloud: () => void;
  setSyncStatus: (status: SyncStatus) => void;
  clearSyncError: () => void;
}

const generateId = () => crypto.randomUUID();

const initialCloudState: CloudState = {
  syncStatus: "idle",
  lastSyncedAt: null,
  cloudOrgId: null,
  syncError: null,
};

const initialState: WorkshopState & CloudState = {
  organization: null,
  currentSession: 1,

  // Session 1
  futureHeadlines: [],
  opportunities: [],
  designPrinciples: [],

  // Session 2
  frictionPoints: [],
  scoredOpportunities: [],

  // Session 3
  pilots: [],

  // Session 4
  roadmapMilestones: [],
  raciEntries: [],

  // Meta
  isDirty: false,
  lastSaved: null,

  // Cloud sync
  ...initialCloudState,
};

export const useWorkshopStore = create<WorkshopState & CloudState & WorkshopActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Organization
      setOrganization: (org) =>
        set({ organization: org, isDirty: true }),

      updateOrganization: (updates) =>
        set((state) => ({
          organization: state.organization
            ? { ...state.organization, ...updates, updatedAt: new Date().toISOString() }
            : null,
          isDirty: true,
        })),

      // Session navigation
      setCurrentSession: (session) =>
        set((state) => {
          if (state.organization) {
            return {
              currentSession: session,
              organization: {
                ...state.organization,
                currentSession: session,
                updatedAt: new Date().toISOString(),
              },
              isDirty: true,
            };
          }
          return { currentSession: session };
        }),

      // Session 1 - Future Headlines
      addFutureHeadline: (headline) =>
        set((state) => ({
          futureHeadlines: [
            ...state.futureHeadlines,
            { ...headline, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateFutureHeadline: (id, updates) =>
        set((state) => ({
          futureHeadlines: state.futureHeadlines.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
          isDirty: true,
        })),

      deleteFutureHeadline: (id) =>
        set((state) => ({
          futureHeadlines: state.futureHeadlines.filter((h) => h.id !== id),
          isDirty: true,
        })),

      // Session 1 - Opportunities
      addOpportunity: (opportunity) =>
        set((state) => ({
          opportunities: [
            ...state.opportunities,
            { ...opportunity, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateOpportunity: (id, updates) =>
        set((state) => ({
          opportunities: state.opportunities.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
          isDirty: true,
        })),

      deleteOpportunity: (id) =>
        set((state) => ({
          opportunities: state.opportunities.filter((o) => o.id !== id),
          isDirty: true,
        })),

      // Session 1 - Design Principles
      addDesignPrinciple: (principle) =>
        set((state) => ({
          designPrinciples: [
            ...state.designPrinciples,
            { ...principle, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateDesignPrinciple: (id, updates) =>
        set((state) => ({
          designPrinciples: state.designPrinciples.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          isDirty: true,
        })),

      deleteDesignPrinciple: (id) =>
        set((state) => ({
          designPrinciples: state.designPrinciples.filter((p) => p.id !== id),
          isDirty: true,
        })),

      // Session 2 - Friction Points
      addFrictionPoint: (friction) =>
        set((state) => ({
          frictionPoints: [
            ...state.frictionPoints,
            { ...friction, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateFrictionPoint: (id, updates) =>
        set((state) => ({
          frictionPoints: state.frictionPoints.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
          isDirty: true,
        })),

      deleteFrictionPoint: (id) =>
        set((state) => ({
          frictionPoints: state.frictionPoints.filter((f) => f.id !== id),
          isDirty: true,
        })),

      // Session 2 - Scored Opportunities
      addScoredOpportunity: (opportunity) =>
        set((state) => ({
          scoredOpportunities: [
            ...state.scoredOpportunities,
            { ...opportunity, id: generateId() },
          ],
          isDirty: true,
        })),

      updateScoredOpportunity: (id, updates) =>
        set((state) => ({
          scoredOpportunities: state.scoredOpportunities.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
          isDirty: true,
        })),

      deleteScoredOpportunity: (id) =>
        set((state) => ({
          scoredOpportunities: state.scoredOpportunities.filter((o) => o.id !== id),
          isDirty: true,
        })),

      voteForOpportunity: (id) =>
        set((state) => ({
          scoredOpportunities: state.scoredOpportunities.map((o) =>
            o.id === id ? { ...o, voteCount: o.voteCount + 1 } : o
          ),
          isDirty: true,
        })),

      togglePilotSelection: (id) =>
        set((state) => ({
          scoredOpportunities: state.scoredOpportunities.map((o) =>
            o.id === id ? { ...o, selectedForPilot: !o.selectedForPilot } : o
          ),
          isDirty: true,
        })),

      // Session 3 - Pilots
      addPilot: (pilot) =>
        set((state) => ({
          pilots: [...state.pilots, { ...pilot, id: generateId() }],
          isDirty: true,
        })),

      updatePilot: (id, updates) =>
        set((state) => ({
          pilots: state.pilots.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          isDirty: true,
        })),

      deletePilot: (id) =>
        set((state) => ({
          pilots: state.pilots.filter((p) => p.id !== id),
          isDirty: true,
        })),

      // Session 4 - Roadmap
      addRoadmapMilestone: (milestone) =>
        set((state) => ({
          roadmapMilestones: [
            ...state.roadmapMilestones,
            { ...milestone, id: generateId() },
          ],
          isDirty: true,
        })),

      updateRoadmapMilestone: (id, updates) =>
        set((state) => ({
          roadmapMilestones: state.roadmapMilestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
          isDirty: true,
        })),

      deleteRoadmapMilestone: (id) =>
        set((state) => ({
          roadmapMilestones: state.roadmapMilestones.filter((m) => m.id !== id),
          isDirty: true,
        })),

      // Session 4 - RACI
      addRACIEntry: (entry) =>
        set((state) => ({
          raciEntries: [...state.raciEntries, { ...entry, id: generateId() }],
          isDirty: true,
        })),

      updateRACIEntry: (id, updates) =>
        set((state) => ({
          raciEntries: state.raciEntries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
          isDirty: true,
        })),

      deleteRACIEntry: (id) =>
        set((state) => ({
          raciEntries: state.raciEntries.filter((e) => e.id !== id),
          isDirty: true,
        })),

      // Meta
      markDirty: () => set({ isDirty: true }),

      markSaved: () =>
        set({ isDirty: false, lastSaved: new Date().toISOString() }),

      resetWorkshop: () => set(initialState),

      // Cloud sync actions
      connectToCloud: async (orgName: string) => {
        if (!isSupabaseConfigured()) {
          throw new Error("Supabase is not configured");
        }

        set({ syncStatus: "syncing", syncError: null });

        try {
          // Create organization in Supabase
          const org = await db.organizations.create({ name: orgName });

          // Update local state with cloud org ID
          const state = get();
          const localOrg: Organization = {
            id: org.id,
            name: org.name,
            createdAt: org.created_at,
            updatedAt: org.updated_at,
            currentSession: org.current_session,
            completionPercent: org.completion_percent,
          };

          set({
            organization: localOrg,
            cloudOrgId: org.id,
            syncStatus: "idle",
            lastSyncedAt: new Date().toISOString(),
          });

          // Sync existing local data to cloud
          await db.syncWorkshopData(org.id, {
            futureHeadlines: state.futureHeadlines,
            opportunities: state.opportunities,
            designPrinciples: state.designPrinciples,
            frictionPoints: state.frictionPoints,
            scoredOpportunities: state.scoredOpportunities,
            pilots: state.pilots,
            roadmapMilestones: state.roadmapMilestones,
            raciEntries: state.raciEntries,
          });

          return org.id;
        } catch (error) {
          set({
            syncStatus: "error",
            syncError: error instanceof Error ? error.message : "Failed to connect to cloud",
          });
          throw error;
        }
      },

      loadFromCloud: async (orgId: string) => {
        if (!isSupabaseConfigured()) {
          throw new Error("Supabase is not configured");
        }

        set({ syncStatus: "syncing", syncError: null });

        try {
          const data = await db.loadWorkshopData(orgId);

          set({
            organization: data.organization,
            futureHeadlines: data.futureHeadlines,
            opportunities: data.opportunities,
            designPrinciples: data.designPrinciples,
            frictionPoints: data.frictionPoints,
            scoredOpportunities: data.scoredOpportunities,
            pilots: data.pilots as Pilot[],
            roadmapMilestones: data.roadmapMilestones,
            raciEntries: data.raciEntries as RACIEntry[],
            currentSession: data.organization?.currentSession || 1,
            cloudOrgId: orgId,
            syncStatus: "idle",
            lastSyncedAt: new Date().toISOString(),
            isDirty: false,
          });
        } catch (error) {
          set({
            syncStatus: "error",
            syncError: error instanceof Error ? error.message : "Failed to load from cloud",
          });
          throw error;
        }
      },

      syncToCloud: async () => {
        const state = get();

        if (!state.cloudOrgId) {
          throw new Error("Not connected to cloud");
        }

        if (!isSupabaseConfigured()) {
          throw new Error("Supabase is not configured");
        }

        set({ syncStatus: "syncing", syncError: null });

        try {
          await db.syncWorkshopData(state.cloudOrgId, {
            futureHeadlines: state.futureHeadlines,
            opportunities: state.opportunities,
            designPrinciples: state.designPrinciples,
            frictionPoints: state.frictionPoints,
            scoredOpportunities: state.scoredOpportunities,
            pilots: state.pilots,
            roadmapMilestones: state.roadmapMilestones,
            raciEntries: state.raciEntries,
          });

          // Update organization in cloud
          if (state.organization) {
            await db.organizations.update(state.cloudOrgId, {
              name: state.organization.name,
              current_session: state.currentSession,
              completion_percent: state.organization.completionPercent,
            });
          }

          set({
            syncStatus: "idle",
            lastSyncedAt: new Date().toISOString(),
            isDirty: false,
          });
        } catch (error) {
          set({
            syncStatus: "error",
            syncError: error instanceof Error ? error.message : "Failed to sync to cloud",
          });
          throw error;
        }
      },

      disconnectFromCloud: () => {
        set({
          cloudOrgId: null,
          syncStatus: "idle",
          lastSyncedAt: null,
          syncError: null,
        });
      },

      setSyncStatus: (status: SyncStatus) => set({ syncStatus: status }),

      clearSyncError: () => set({ syncError: null }),
    }),
    {
      name: "forge-workshop-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        organization: state.organization,
        currentSession: state.currentSession,
        futureHeadlines: state.futureHeadlines,
        opportunities: state.opportunities,
        designPrinciples: state.designPrinciples,
        frictionPoints: state.frictionPoints,
        scoredOpportunities: state.scoredOpportunities,
        pilots: state.pilots,
        roadmapMilestones: state.roadmapMilestones,
        raciEntries: state.raciEntries,
        lastSaved: state.lastSaved,
        // Cloud sync state (persisted for reconnection)
        cloudOrgId: state.cloudOrgId,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);

// Selector hooks for common patterns
export const useOrganization = () => useWorkshopStore((state) => state.organization);
export const useCurrentSession = () => useWorkshopStore((state) => state.currentSession);
export const useFutureHeadlines = () => useWorkshopStore((state) => state.futureHeadlines);
export const useOpportunities = () => useWorkshopStore((state) => state.opportunities);
export const useDesignPrinciples = () => useWorkshopStore((state) => state.designPrinciples);
export const useFrictionPoints = () => useWorkshopStore((state) => state.frictionPoints);
export const useScoredOpportunities = () => useWorkshopStore((state) => state.scoredOpportunities);
export const usePilots = () => useWorkshopStore((state) => state.pilots);
export const useRoadmapMilestones = () => useWorkshopStore((state) => state.roadmapMilestones);
export const useRACIEntries = () => useWorkshopStore((state) => state.raciEntries);
export const useIsDirty = () => useWorkshopStore((state) => state.isDirty);

// Cloud sync selectors
export const useCloudOrgId = () => useWorkshopStore((state) => state.cloudOrgId);
export const useSyncStatus = () => useWorkshopStore((state) => state.syncStatus);
export const useLastSyncedAt = () => useWorkshopStore((state) => state.lastSyncedAt);
export const useSyncError = () => useWorkshopStore((state) => state.syncError);
export const useIsConnectedToCloud = () => useWorkshopStore((state) => state.cloudOrgId !== null);
