import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Lazy-initialized Supabase client (only created when actually needed)
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Export getter for the client
export const supabase = {
  from: (table: string) => getSupabase().from(table),
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Database row types (what we get back from queries)
interface OrganizationRow {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  current_session: number;
  completion_percent: number;
}

interface FrictionPointRow {
  id: string;
  org_id: string;
  process_area: string;
  description: string;
  impact_level: number;
  frequency: string;
  affected_roles: string[];
  created_at: string;
}

interface ScoredOpportunityRow {
  id: string;
  org_id: string;
  friction_id: string | null;
  title: string;
  description: string;
  value_score: number;
  complexity_score: number;
  quadrant: string;
  vote_count: number;
  selected_for_pilot: boolean;
}

interface PilotRow {
  id: string;
  org_id: string;
  opportunity_id: string;
  ai_pattern: string;
  workflow_current: unknown;
  workflow_future: unknown;
  risk_scores: unknown;
  charter_data: unknown;
}

interface RoadmapMilestoneRow {
  id: string;
  org_id: string;
  pilot_id: string;
  title: string;
  week_number: number;
  owner: string;
  deliverable: string;
  dependencies: string[];
  status: string;
}

interface RaciEntryRow {
  id: string;
  org_id: string;
  activity: string;
  role_assignments: unknown;
}

// Type-safe database operations
export const db = {
  // Organizations
  organizations: {
    async create(data: { name: string }): Promise<OrganizationRow> {
      const { data: org, error } = await supabase
        .from("organizations")
        .insert({
          name: data.name,
          current_session: 1,
          completion_percent: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return org as OrganizationRow;
    },

    async get(id: string): Promise<OrganizationRow> {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as OrganizationRow;
    },

    async update(id: string, updates: Partial<{ name: string; current_session: number; completion_percent: number }>): Promise<OrganizationRow> {
      const { data, error } = await supabase
        .from("organizations")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as OrganizationRow;
    },
  },

  // Friction Points
  frictionPoints: {
    async create(orgId: string, data: {
      process_area: string;
      description: string;
      impact_level: number;
      frequency: string;
      affected_roles?: string[];
    }): Promise<FrictionPointRow> {
      const { data: friction, error } = await supabase
        .from("friction_points")
        .insert({
          org_id: orgId,
          process_area: data.process_area,
          description: data.description,
          impact_level: data.impact_level,
          frequency: data.frequency,
          affected_roles: data.affected_roles || [],
        })
        .select()
        .single();

      if (error) throw error;
      return friction as FrictionPointRow;
    },

    async list(orgId: string): Promise<FrictionPointRow[]> {
      const { data, error } = await supabase
        .from("friction_points")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data || []) as FrictionPointRow[];
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from("friction_points").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // Scored Opportunities
  scoredOpportunities: {
    async create(orgId: string, data: {
      friction_id?: string | null;
      title: string;
      description: string;
      value_score: number;
      complexity_score: number;
      quadrant: string;
      vote_count?: number;
      selected_for_pilot?: boolean;
    }): Promise<ScoredOpportunityRow> {
      const { data: opportunity, error } = await supabase
        .from("scored_opportunities")
        .insert({
          org_id: orgId,
          friction_id: data.friction_id || null,
          title: data.title,
          description: data.description,
          value_score: data.value_score,
          complexity_score: data.complexity_score,
          quadrant: data.quadrant,
          vote_count: data.vote_count || 0,
          selected_for_pilot: data.selected_for_pilot || false,
        })
        .select()
        .single();

      if (error) throw error;
      return opportunity as ScoredOpportunityRow;
    },

    async list(orgId: string): Promise<ScoredOpportunityRow[]> {
      const { data, error } = await supabase
        .from("scored_opportunities")
        .select("*")
        .eq("org_id", orgId);

      if (error) throw error;
      return (data || []) as ScoredOpportunityRow[];
    },

    async update(id: string, updates: Partial<{
      title: string;
      description: string;
      value_score: number;
      complexity_score: number;
      quadrant: string;
      vote_count: number;
      selected_for_pilot: boolean;
    }>): Promise<ScoredOpportunityRow> {
      const { data, error } = await supabase
        .from("scored_opportunities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ScoredOpportunityRow;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from("scored_opportunities").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // Pilots
  pilots: {
    async create(orgId: string, data: {
      opportunity_id: string;
      ai_pattern: string;
      workflow_current?: unknown;
      workflow_future?: unknown;
      risk_scores?: unknown;
      charter_data?: unknown;
    }): Promise<PilotRow> {
      const { data: pilot, error } = await supabase
        .from("pilots")
        .insert({
          org_id: orgId,
          opportunity_id: data.opportunity_id,
          ai_pattern: data.ai_pattern,
          workflow_current: data.workflow_current || {},
          workflow_future: data.workflow_future || {},
          risk_scores: data.risk_scores || {},
          charter_data: data.charter_data || {},
        })
        .select()
        .single();

      if (error) throw error;
      return pilot as PilotRow;
    },

    async list(orgId: string): Promise<PilotRow[]> {
      const { data, error } = await supabase
        .from("pilots")
        .select("*")
        .eq("org_id", orgId);

      if (error) throw error;
      return (data || []) as PilotRow[];
    },

    async update(id: string, updates: Partial<{
      ai_pattern: string;
      workflow_current: unknown;
      workflow_future: unknown;
      risk_scores: unknown;
      charter_data: unknown;
    }>): Promise<PilotRow> {
      const { data, error } = await supabase
        .from("pilots")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PilotRow;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from("pilots").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // Roadmap Milestones
  roadmapMilestones: {
    async create(orgId: string, data: {
      pilot_id: string;
      title: string;
      week_number: number;
      owner: string;
      deliverable: string;
      dependencies?: string[];
      status?: string;
    }): Promise<RoadmapMilestoneRow> {
      const { data: milestone, error } = await supabase
        .from("roadmap_milestones")
        .insert({
          org_id: orgId,
          pilot_id: data.pilot_id,
          title: data.title,
          week_number: data.week_number,
          owner: data.owner,
          deliverable: data.deliverable,
          dependencies: data.dependencies || [],
          status: data.status || "not-started",
        })
        .select()
        .single();

      if (error) throw error;
      return milestone as RoadmapMilestoneRow;
    },

    async list(orgId: string): Promise<RoadmapMilestoneRow[]> {
      const { data, error } = await supabase
        .from("roadmap_milestones")
        .select("*")
        .eq("org_id", orgId)
        .order("week_number", { ascending: true });

      if (error) throw error;
      return (data || []) as RoadmapMilestoneRow[];
    },

    async update(id: string, updates: Partial<{
      title: string;
      week_number: number;
      owner: string;
      deliverable: string;
      dependencies: string[];
      status: string;
    }>): Promise<RoadmapMilestoneRow> {
      const { data, error } = await supabase
        .from("roadmap_milestones")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as RoadmapMilestoneRow;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from("roadmap_milestones").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // RACI Entries
  raciEntries: {
    async create(orgId: string, data: {
      activity: string;
      role_assignments?: unknown;
    }): Promise<RaciEntryRow> {
      const { data: entry, error } = await supabase
        .from("raci_entries")
        .insert({
          org_id: orgId,
          activity: data.activity,
          role_assignments: data.role_assignments || {},
        })
        .select()
        .single();

      if (error) throw error;
      return entry as RaciEntryRow;
    },

    async list(orgId: string): Promise<RaciEntryRow[]> {
      const { data, error } = await supabase
        .from("raci_entries")
        .select("*")
        .eq("org_id", orgId);

      if (error) throw error;
      return (data || []) as RaciEntryRow[];
    },

    async update(id: string, updates: Partial<{
      activity: string;
      role_assignments: unknown;
    }>): Promise<RaciEntryRow> {
      const { data, error } = await supabase
        .from("raci_entries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as RaciEntryRow;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from("raci_entries").delete().eq("id", id);
      if (error) throw error;
    },
  },

  // Batch sync: Push all local data to Supabase
  async syncWorkshopData(orgId: string, workshopData: {
    frictionPoints: Array<{ id: string; processArea: string; description: string; impactLevel: number; frequency: string; affectedRoles: string[]; createdAt: string }>;
    scoredOpportunities: Array<{ id: string; frictionId?: string; title: string; description: string; valueScore: number; complexityScore: number; quadrant: string; voteCount: number; selectedForPilot: boolean }>;
    pilots: Array<{ id: string; opportunityId: string; aiPattern: string; workflowCurrent: unknown; workflowFuture: unknown; riskScores: unknown; charterData: unknown }>;
    roadmapMilestones: Array<{ id: string; pilotId: string; title: string; weekNumber: number; owner: string; deliverable: string; dependencies: string[]; status: string }>;
    raciEntries: Array<{ id: string; activity: string; roleAssignments: unknown }>;
  }): Promise<void> {
    // Use upsert instead of delete + insert to prevent data loss
    // This implements a merge-based sync strategy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertPromises: PromiseLike<any>[] = [];

    if (workshopData.frictionPoints.length > 0) {
      upsertPromises.push(
        supabase.from("friction_points").upsert(
          workshopData.frictionPoints.map((f) => ({
            id: f.id,
            org_id: orgId,
            process_area: f.processArea,
            description: f.description,
            impact_level: f.impactLevel,
            frequency: f.frequency,
            affected_roles: f.affectedRoles,
            created_at: f.createdAt,
          })),
          { onConflict: "id" }
        )
      );
    }

    if (workshopData.scoredOpportunities.length > 0) {
      upsertPromises.push(
        supabase.from("scored_opportunities").upsert(
          workshopData.scoredOpportunities.map((o) => ({
            id: o.id,
            org_id: orgId,
            friction_id: o.frictionId || null,
            title: o.title,
            description: o.description,
            value_score: o.valueScore,
            complexity_score: o.complexityScore,
            quadrant: o.quadrant,
            vote_count: o.voteCount,
            selected_for_pilot: o.selectedForPilot,
          })),
          { onConflict: "id" }
        )
      );
    }

    if (workshopData.pilots.length > 0) {
      upsertPromises.push(
        supabase.from("pilots").upsert(
          workshopData.pilots.map((p) => ({
            id: p.id,
            org_id: orgId,
            opportunity_id: p.opportunityId,
            ai_pattern: p.aiPattern,
            workflow_current: p.workflowCurrent,
            workflow_future: p.workflowFuture,
            risk_scores: p.riskScores,
            charter_data: p.charterData,
          })),
          { onConflict: "id" }
        )
      );
    }

    if (workshopData.roadmapMilestones.length > 0) {
      upsertPromises.push(
        supabase.from("roadmap_milestones").upsert(
          workshopData.roadmapMilestones.map((m) => ({
            id: m.id,
            org_id: orgId,
            pilot_id: m.pilotId,
            title: m.title,
            week_number: m.weekNumber,
            owner: m.owner,
            deliverable: m.deliverable,
            dependencies: m.dependencies,
            status: m.status,
          })),
          { onConflict: "id" }
        )
      );
    }

    if (workshopData.raciEntries.length > 0) {
      upsertPromises.push(
        supabase.from("raci_entries").upsert(
          workshopData.raciEntries.map((e) => ({
            id: e.id,
            org_id: orgId,
            activity: e.activity,
            role_assignments: e.roleAssignments,
          })),
          { onConflict: "id" }
        )
      );
    }

    const results = await Promise.all(upsertPromises);

    // Check for errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    // Update org's updated_at timestamp
    await this.organizations.update(orgId, {});
  },

  // Load all workshop data for an organization
  async loadWorkshopData(orgId: string) {
    const [
      org,
      frictionPoints,
      scoredOpportunities,
      pilots,
      roadmapMilestones,
      raciEntries,
    ] = await Promise.all([
      this.organizations.get(orgId),
      this.frictionPoints.list(orgId),
      this.scoredOpportunities.list(orgId),
      this.pilots.list(orgId),
      this.roadmapMilestones.list(orgId),
      this.raciEntries.list(orgId),
    ]);

    // Transform database format to local format
    return {
      organization: org ? {
        id: org.id,
        name: org.name,
        createdAt: org.created_at,
        updatedAt: org.updated_at,
        currentSession: org.current_session,
        completionPercent: org.completion_percent,
      } : null,
      frictionPoints: frictionPoints.map((f) => ({
        id: f.id,
        processArea: f.process_area,
        description: f.description,
        impactLevel: f.impact_level as 1 | 2 | 3 | 4 | 5,
        frequency: f.frequency as "daily" | "weekly" | "monthly" | "quarterly",
        affectedRoles: f.affected_roles,
        createdAt: f.created_at,
      })),
      scoredOpportunities: scoredOpportunities.map((o) => ({
        id: o.id,
        frictionId: o.friction_id || undefined,
        title: o.title,
        description: o.description,
        valueScore: o.value_score as 1 | 2 | 3 | 4 | 5,
        complexityScore: o.complexity_score as 1 | 2 | 3 | 4 | 5,
        quadrant: o.quadrant as "quick-win" | "strategic" | "fill-in" | "deprioritize",
        voteCount: o.vote_count,
        selectedForPilot: o.selected_for_pilot,
      })),
      pilots: pilots.map((p) => ({
        id: p.id,
        opportunityId: p.opportunity_id,
        aiPattern: p.ai_pattern as "copilot" | "autonomous" | "crew",
        workflowCurrent: p.workflow_current,
        workflowFuture: p.workflow_future,
        riskScores: p.risk_scores,
        charterData: p.charter_data,
      })),
      roadmapMilestones: roadmapMilestones.map((m) => ({
        id: m.id,
        pilotId: m.pilot_id,
        title: m.title,
        weekNumber: m.week_number,
        owner: m.owner,
        deliverable: m.deliverable,
        dependencies: m.dependencies,
        status: m.status as "not-started" | "in-progress" | "completed",
      })),
      raciEntries: raciEntries.map((e) => ({
        id: e.id,
        activity: e.activity,
        roleAssignments: e.role_assignments,
      })),
    };
  },
};
