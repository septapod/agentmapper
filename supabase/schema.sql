-- AgentMapper Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_session INTEGER DEFAULT 1,
  completion_percent INTEGER DEFAULT 0
);

-- Future Headlines (Session 1)
CREATE TABLE IF NOT EXISTS future_headlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('1-year', '2-year', '3-year')),
  category TEXT NOT NULL CHECK (category IN ('member', 'employee', 'business', 'risk')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities (Session 1)
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  area TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design Principles (Session 1)
CREATE TABLE IF NOT EXISTS design_principles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  principle TEXT NOT NULL,
  is_guardrail BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friction Points (Session 2)
CREATE TABLE IF NOT EXISTS friction_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  process_area TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_level INTEGER NOT NULL CHECK (impact_level BETWEEN 1 AND 5),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  affected_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scored Opportunities (Session 2)
CREATE TABLE IF NOT EXISTS scored_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  friction_id UUID REFERENCES friction_points(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value_score INTEGER NOT NULL CHECK (value_score BETWEEN 1 AND 5),
  complexity_score INTEGER NOT NULL CHECK (complexity_score BETWEEN 1 AND 5),
  quadrant TEXT NOT NULL CHECK (quadrant IN ('quick-win', 'strategic', 'fill-in', 'deprioritize')),
  vote_count INTEGER DEFAULT 0,
  selected_for_pilot BOOLEAN DEFAULT FALSE
);

-- Pilots (Session 3)
CREATE TABLE IF NOT EXISTS pilots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES scored_opportunities(id) ON DELETE CASCADE,
  ai_pattern TEXT NOT NULL CHECK (ai_pattern IN ('copilot', 'autonomous', 'crew')),
  workflow_current JSONB DEFAULT '[]',
  workflow_future JSONB DEFAULT '[]',
  risk_scores JSONB DEFAULT '{"govern": 0, "map": 0, "measure": 0, "manage": 0}',
  charter_data JSONB DEFAULT '{}'
);

-- Roadmap Milestones (Session 4)
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pilot_id UUID NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  owner TEXT NOT NULL,
  deliverable TEXT NOT NULL,
  dependencies TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed'))
);

-- RACI Entries (Session 4)
CREATE TABLE IF NOT EXISTS raci_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  role_assignments JSONB DEFAULT '{}'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_future_headlines_org ON future_headlines(org_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_org ON opportunities(org_id);
CREATE INDEX IF NOT EXISTS idx_design_principles_org ON design_principles(org_id);
CREATE INDEX IF NOT EXISTS idx_friction_points_org ON friction_points(org_id);
CREATE INDEX IF NOT EXISTS idx_scored_opportunities_org ON scored_opportunities(org_id);
CREATE INDEX IF NOT EXISTS idx_pilots_org ON pilots(org_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_org ON roadmap_milestones(org_id);
CREATE INDEX IF NOT EXISTS idx_raci_entries_org ON raci_entries(org_id);

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_headlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friction_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE scored_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE raci_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for MVP - tighten later with auth)
-- In production, you'd want proper authentication

CREATE POLICY "Allow all operations on organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all operations on future_headlines" ON future_headlines FOR ALL USING (true);
CREATE POLICY "Allow all operations on opportunities" ON opportunities FOR ALL USING (true);
CREATE POLICY "Allow all operations on design_principles" ON design_principles FOR ALL USING (true);
CREATE POLICY "Allow all operations on friction_points" ON friction_points FOR ALL USING (true);
CREATE POLICY "Allow all operations on scored_opportunities" ON scored_opportunities FOR ALL USING (true);
CREATE POLICY "Allow all operations on pilots" ON pilots FOR ALL USING (true);
CREATE POLICY "Allow all operations on roadmap_milestones" ON roadmap_milestones FOR ALL USING (true);
CREATE POLICY "Allow all operations on raci_entries" ON raci_entries FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for organizations table
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
