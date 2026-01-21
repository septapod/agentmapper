export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          current_session: number;
          completion_percent: number;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
          current_session?: number;
          completion_percent?: number;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
          current_session?: number;
          completion_percent?: number;
        };
      };
      future_headlines: {
        Row: {
          id: string;
          org_id: string;
          headline: string;
          timeframe: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          headline: string;
          timeframe: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          headline?: string;
          timeframe?: string;
          category?: string;
          created_at?: string;
        };
      };
      opportunities: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          description: string;
          area: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          title: string;
          description: string;
          area: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          title?: string;
          description?: string;
          area?: string;
          created_at?: string;
        };
      };
      design_principles: {
        Row: {
          id: string;
          org_id: string;
          principle: string;
          is_guardrail: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          principle: string;
          is_guardrail: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          principle?: string;
          is_guardrail?: boolean;
          created_at?: string;
        };
      };
      friction_points: {
        Row: {
          id: string;
          org_id: string;
          process_area: string;
          description: string;
          impact_level: number;
          frequency: string;
          affected_roles: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          process_area: string;
          description: string;
          impact_level: number;
          frequency: string;
          affected_roles?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          process_area?: string;
          description?: string;
          impact_level?: number;
          frequency?: string;
          affected_roles?: string[];
          created_at?: string;
        };
      };
      scored_opportunities: {
        Row: {
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
        };
        Insert: {
          id?: string;
          org_id: string;
          friction_id?: string | null;
          title: string;
          description: string;
          value_score: number;
          complexity_score: number;
          quadrant: string;
          vote_count?: number;
          selected_for_pilot?: boolean;
        };
        Update: {
          id?: string;
          org_id?: string;
          friction_id?: string | null;
          title?: string;
          description?: string;
          value_score?: number;
          complexity_score?: number;
          quadrant?: string;
          vote_count?: number;
          selected_for_pilot?: boolean;
        };
      };
      pilots: {
        Row: {
          id: string;
          org_id: string;
          opportunity_id: string;
          ai_pattern: string;
          workflow_current: Json;
          workflow_future: Json;
          risk_scores: Json;
          charter_data: Json;
        };
        Insert: {
          id?: string;
          org_id: string;
          opportunity_id: string;
          ai_pattern: string;
          workflow_current?: Json;
          workflow_future?: Json;
          risk_scores?: Json;
          charter_data?: Json;
        };
        Update: {
          id?: string;
          org_id?: string;
          opportunity_id?: string;
          ai_pattern?: string;
          workflow_current?: Json;
          workflow_future?: Json;
          risk_scores?: Json;
          charter_data?: Json;
        };
      };
      roadmap_milestones: {
        Row: {
          id: string;
          org_id: string;
          pilot_id: string;
          title: string;
          week_number: number;
          owner: string;
          deliverable: string;
          dependencies: string[];
          status: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          pilot_id: string;
          title: string;
          week_number: number;
          owner: string;
          deliverable: string;
          dependencies?: string[];
          status?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          pilot_id?: string;
          title?: string;
          week_number?: number;
          owner?: string;
          deliverable?: string;
          dependencies?: string[];
          status?: string;
        };
      };
      raci_entries: {
        Row: {
          id: string;
          org_id: string;
          activity: string;
          role_assignments: Json;
        };
        Insert: {
          id?: string;
          org_id: string;
          activity: string;
          role_assignments?: Json;
        };
        Update: {
          id?: string;
          org_id?: string;
          activity?: string;
          role_assignments?: Json;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
