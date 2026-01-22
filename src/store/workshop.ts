import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Organization,
  AIIcebreakerResponse,
  CognitiveBias,
  AIWorkingPrinciple,
  AITradeoff,
  FrictionPoint,
  ScoredOpportunity,
  MVPSpec,
  PilotPlan,
  RoadmapMilestone,
  ScalingChecklistItem,
  TrainingPlanEntry,
  LessonLearned,
  NextOpportunity,
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

  // Session 1 - AI Icebreakers
  addIcebreakerResponse: (response: Omit<AIIcebreakerResponse, "id" | "createdAt">) => void;
  deleteIcebreakerResponse: (id: string) => void;
  toggleCognitiveBias: (biasId: string) => void;

  // Session 1 - AI Working Principles
  addWorkingPrinciple: (principle: Omit<AIWorkingPrinciple, "id" | "createdAt">) => void;
  updateWorkingPrinciple: (id: string, updates: Partial<AIWorkingPrinciple>) => void;

  // Session 1 - AI Tradeoff Navigator
  updateTradeoff: (topic: string, value: number, rationale: string) => void;

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

  // Session 3 - MVP Specs
  addMVPSpec: (spec: Omit<MVPSpec, "id" | "createdAt">) => void;
  updateMVPSpec: (id: string, updates: Partial<MVPSpec>) => void;
  deleteMVPSpec: (id: string) => void;

  // Session 4 - Pilot Plans
  addPilotPlan: (plan: Omit<PilotPlan, "id" | "createdAt">) => void;
  updatePilotPlan: (id: string, updates: Partial<PilotPlan>) => void;
  deletePilotPlan: (id: string) => void;

  // Session 4 - Roadmap
  addRoadmapMilestone: (milestone: Omit<RoadmapMilestone, "id" | "createdAt">) => void;
  updateRoadmapMilestone: (id: string, updates: Partial<RoadmapMilestone>) => void;
  deleteRoadmapMilestone: (id: string) => void;

  // Session 5 - Scaling Checklist
  addScalingChecklistItem: (item: Omit<ScalingChecklistItem, "id" | "createdAt">) => void;
  updateScalingChecklistItem: (id: string, updates: Partial<ScalingChecklistItem>) => void;
  deleteScalingChecklistItem: (id: string) => void;

  // Session 5 - Training Plan
  addTrainingPlanEntry: (entry: Omit<TrainingPlanEntry, "id" | "createdAt">) => void;
  updateTrainingPlanEntry: (id: string, updates: Partial<TrainingPlanEntry>) => void;
  deleteTrainingPlanEntry: (id: string) => void;

  // Session 5 - Lessons Learned
  addLessonLearned: (lesson: Omit<LessonLearned, "id" | "createdAt">) => void;
  updateLessonLearned: (id: string, updates: Partial<LessonLearned>) => void;
  deleteLessonLearned: (id: string) => void;

  // Session 5 - Next Opportunities
  addNextOpportunity: (opportunity: Omit<NextOpportunity, "id" | "createdAt">) => void;
  updateNextOpportunity: (id: string, updates: Partial<NextOpportunity>) => void;
  deleteNextOpportunity: (id: string) => void;

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
  currentSession: 1, // Start at Session 1

  // Session 1
  aiIcebreakerResponses: [],
  cognitiveBiases: [
    { id: "confirmation", name: "Confirmation Bias", description: "Seeking info that confirms existing beliefs", checked: false },
    { id: "status-quo", name: "Status Quo Bias", description: "Preferring current state over change", checked: false },
    { id: "availability", name: "Availability Bias", description: "Overvaluing recent/memorable information", checked: false },
    { id: "overconfidence", name: "Overconfidence Bias", description: "Overestimating abilities and predictions", checked: false },
    { id: "sunk-cost", name: "Sunk Cost Fallacy", description: "Continuing due to past investment", checked: false },
    { id: "groupthink", name: "Groupthink", description: "Conforming to group consensus", checked: false },
    { id: "negativity", name: "Negativity Bias", description: "Focusing on negative over positive", checked: false },
    { id: "bandwagon", name: "Bandwagon Effect", description: "Adopting beliefs because others do", checked: false },
  ],
  aiWorkingPrinciples: [],
  aiTradeoffs: [
    { id: "control", topic: "control", sliderValue: 50, rationale: "", createdAt: "" },
    { id: "priority", topic: "priority", sliderValue: 50, rationale: "", createdAt: "" },
    { id: "users", topic: "users", sliderValue: 50, rationale: "", createdAt: "" },
    { id: "external-comms", topic: "external-comms", sliderValue: 50, rationale: "", createdAt: "" },
    { id: "internal-comms", topic: "internal-comms", sliderValue: 50, rationale: "", createdAt: "" },
  ],

  // Session 2
  frictionPoints: [],
  scoredOpportunities: [],

  // Session 3
  mvpSpecs: [],

  // Session 4
  pilotPlans: [],
  roadmapMilestones: [],

  // Session 5 - Empower Teams
  scalingChecklist: [],
  trainingPlan: [],
  lessonsLearned: [],
  nextOpportunities: [],

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

      // Session 1 - AI Icebreakers
      addIcebreakerResponse: (response) =>
        set((state) => ({
          aiIcebreakerResponses: [
            ...state.aiIcebreakerResponses,
            { ...response, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      deleteIcebreakerResponse: (id) =>
        set((state) => ({
          aiIcebreakerResponses: state.aiIcebreakerResponses.filter((r) => r.id !== id),
          isDirty: true,
        })),

      toggleCognitiveBias: (biasId) =>
        set((state) => ({
          cognitiveBiases: state.cognitiveBiases.map((b) =>
            b.id === biasId ? { ...b, checked: !b.checked } : b
          ),
          isDirty: true,
        })),

      // Session 1 - AI Working Principles
      addWorkingPrinciple: (principle) =>
        set((state) => ({
          aiWorkingPrinciples: [
            ...state.aiWorkingPrinciples,
            { ...principle, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateWorkingPrinciple: (id, updates) =>
        set((state) => ({
          aiWorkingPrinciples: state.aiWorkingPrinciples.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          isDirty: true,
        })),

      // Session 1 - AI Tradeoff Navigator
      updateTradeoff: (topic, value, rationale) =>
        set((state) => ({
          aiTradeoffs: state.aiTradeoffs.map((t) =>
            t.topic === topic
              ? { ...t, sliderValue: value, rationale, createdAt: new Date().toISOString() }
              : t
          ),
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

      // Session 3 - MVP Specs
      addMVPSpec: (spec) =>
        set((state) => ({
          mvpSpecs: [
            ...state.mvpSpecs,
            { ...spec, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateMVPSpec: (id, updates) =>
        set((state) => ({
          mvpSpecs: state.mvpSpecs.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
          isDirty: true,
        })),

      deleteMVPSpec: (id) =>
        set((state) => ({
          mvpSpecs: state.mvpSpecs.filter((s) => s.id !== id),
          isDirty: true,
        })),

      // Session 4 - Pilot Plans
      addPilotPlan: (plan) =>
        set((state) => ({
          pilotPlans: [
            ...state.pilotPlans,
            { ...plan, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updatePilotPlan: (id, updates) =>
        set((state) => ({
          pilotPlans: state.pilotPlans.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          isDirty: true,
        })),

      deletePilotPlan: (id) =>
        set((state) => ({
          pilotPlans: state.pilotPlans.filter((p) => p.id !== id),
          isDirty: true,
        })),

      // Session 4 - Roadmap
      addRoadmapMilestone: (milestone) =>
        set((state) => ({
          roadmapMilestones: [
            ...state.roadmapMilestones,
            { ...milestone, id: generateId(), createdAt: new Date().toISOString() },
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

      // Session 5 - Scaling Checklist
      addScalingChecklistItem: (item) =>
        set((state) => ({
          scalingChecklist: [
            ...state.scalingChecklist,
            { ...item, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateScalingChecklistItem: (id, updates) =>
        set((state) => ({
          scalingChecklist: state.scalingChecklist.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
          isDirty: true,
        })),

      deleteScalingChecklistItem: (id) =>
        set((state) => ({
          scalingChecklist: state.scalingChecklist.filter((i) => i.id !== id),
          isDirty: true,
        })),

      // Session 5 - Training Plan
      addTrainingPlanEntry: (entry) =>
        set((state) => ({
          trainingPlan: [
            ...state.trainingPlan,
            { ...entry, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateTrainingPlanEntry: (id, updates) =>
        set((state) => ({
          trainingPlan: state.trainingPlan.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
          isDirty: true,
        })),

      deleteTrainingPlanEntry: (id) =>
        set((state) => ({
          trainingPlan: state.trainingPlan.filter((e) => e.id !== id),
          isDirty: true,
        })),

      // Session 5 - Lessons Learned
      addLessonLearned: (lesson) =>
        set((state) => ({
          lessonsLearned: [
            ...state.lessonsLearned,
            { ...lesson, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateLessonLearned: (id, updates) =>
        set((state) => ({
          lessonsLearned: state.lessonsLearned.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
          isDirty: true,
        })),

      deleteLessonLearned: (id) =>
        set((state) => ({
          lessonsLearned: state.lessonsLearned.filter((l) => l.id !== id),
          isDirty: true,
        })),

      // Session 5 - Next Opportunities
      addNextOpportunity: (opportunity) =>
        set((state) => ({
          nextOpportunities: [
            ...state.nextOpportunities,
            { ...opportunity, id: generateId(), createdAt: new Date().toISOString() },
          ],
          isDirty: true,
        })),

      updateNextOpportunity: (id, updates) =>
        set((state) => ({
          nextOpportunities: state.nextOpportunities.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
          isDirty: true,
        })),

      deleteNextOpportunity: (id) =>
        set((state) => ({
          nextOpportunities: state.nextOpportunities.filter((o) => o.id !== id),
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
            frictionPoints: state.frictionPoints.map(fp => ({
              ...fp,
              impactLevel: fp.impactLevel || 0,
              frequency: fp.frequency || "",
              affectedRoles: fp.affectedRoles || [],
            })),
            scoredOpportunities: state.scoredOpportunities,
            pilots: [],
            roadmapMilestones: state.roadmapMilestones.map(rm => ({
              id: rm.id,
              pilotId: rm.pilotPlanId,
              title: rm.activity,
              weekNumber: rm.weekStart,
              owner: rm.owner,
              deliverable: rm.successCriteria,
              dependencies: [],
              status: rm.phase,
            })),
            raciEntries: [],
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
            mvpSpecs: [],
            pilotPlans: [],
            roadmapMilestones: [],
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
            frictionPoints: state.frictionPoints.map(fp => ({
              ...fp,
              impactLevel: fp.impactLevel || 0,
              frequency: fp.frequency || "",
              affectedRoles: fp.affectedRoles || [],
            })),
            scoredOpportunities: state.scoredOpportunities,
            pilots: [],
            roadmapMilestones: state.roadmapMilestones.map(rm => ({
              id: rm.id,
              pilotId: rm.pilotPlanId,
              title: rm.activity,
              weekNumber: rm.weekStart,
              owner: rm.owner,
              deliverable: rm.successCriteria,
              dependencies: [],
              status: rm.phase,
            })),
            raciEntries: [],
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
        // Onboarding
        aiIcebreakerResponses: state.aiIcebreakerResponses,
        cognitiveBiases: state.cognitiveBiases,
        aiWorkingPrinciples: state.aiWorkingPrinciples,
        aiTradeoffs: state.aiTradeoffs,
        onboardingComplete: state.onboardingComplete,
        // Session 1
        futureHeadlines: state.futureHeadlines,
        opportunities: state.opportunities,
        designPrinciples: state.designPrinciples,
        frictionPoints: state.frictionPoints,
        scoredOpportunities: state.scoredOpportunities,
        mvpSpecs: state.mvpSpecs,
        pilotPlans: state.pilotPlans,
        roadmapMilestones: state.roadmapMilestones,
        // Session 5 - Empower Teams
        scalingChecklist: state.scalingChecklist,
        trainingPlan: state.trainingPlan,
        lessonsLearned: state.lessonsLearned,
        nextOpportunities: state.nextOpportunities,
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

// Session 1 selectors
export const useIcebreakerResponses = () => useWorkshopStore((state) => state.aiIcebreakerResponses);
export const useCognitiveBiases = () => useWorkshopStore((state) => state.cognitiveBiases);
export const useWorkingPrinciples = () => useWorkshopStore((state) => state.aiWorkingPrinciples);
export const useTradeoffs = () => useWorkshopStore((state) => state.aiTradeoffs);

// Session 2 selectors
export const useFrictionPoints = () => useWorkshopStore((state) => state.frictionPoints);
export const useScoredOpportunities = () => useWorkshopStore((state) => state.scoredOpportunities);
export const useMVPSpecs = () => useWorkshopStore((state) => state.mvpSpecs);
export const usePilotPlans = () => useWorkshopStore((state) => state.pilotPlans);
export const useRoadmapMilestones = () => useWorkshopStore((state) => state.roadmapMilestones);
export const useScalingChecklist = () => useWorkshopStore((state) => state.scalingChecklist);
export const useTrainingPlan = () => useWorkshopStore((state) => state.trainingPlan);
export const useLessonsLearned = () => useWorkshopStore((state) => state.lessonsLearned);
export const useNextOpportunities = () => useWorkshopStore((state) => state.nextOpportunities);
export const useIsDirty = () => useWorkshopStore((state) => state.isDirty);

// Cloud sync selectors
export const useCloudOrgId = () => useWorkshopStore((state) => state.cloudOrgId);
export const useSyncStatus = () => useWorkshopStore((state) => state.syncStatus);
export const useLastSyncedAt = () => useWorkshopStore((state) => state.lastSyncedAt);
export const useSyncError = () => useWorkshopStore((state) => state.syncError);
export const useIsConnectedToCloud = () => useWorkshopStore((state) => state.cloudOrgId !== null);
