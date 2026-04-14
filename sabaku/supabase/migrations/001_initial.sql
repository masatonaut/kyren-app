-- SABAKU: Initial Schema
-- Flight strip task management with Obsidian Vault sync

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- strips: Core task strip table
-- ============================================================
CREATE TABLE strips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 500),
  status TEXT NOT NULL DEFAULT 'queue' CHECK (status IN ('active', 'queue', 'cleared')),
  priority TEXT NOT NULL DEFAULT 'nrm' CHECK (priority IN ('urg', 'nrm', 'low')),
  category TEXT NOT NULL DEFAULT 'manual' CHECK (category IN ('daily-top3', 'handoff', 'carryover', 'manual')),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('vault', 'manual')),
  vault_ref TEXT,
  timer_seconds INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cleared_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_strips_user_id ON strips(user_id);
CREATE INDEX idx_strips_user_status ON strips(user_id, status);
CREATE INDEX idx_strips_vault_ref ON strips(user_id, vault_ref) WHERE vault_ref IS NOT NULL;

-- ============================================================
-- time_logs: Timer session records
-- ============================================================
CREATE TABLE time_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strip_id UUID NOT NULL REFERENCES strips(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_time_logs_strip_id ON time_logs(strip_id);

-- ============================================================
-- sync_history: Vault file sync tracking
-- ============================================================
CREATE TABLE sync_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  strips_created INTEGER NOT NULL DEFAULT 0,
  strips_updated INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_sync_history_user_file ON sync_history(user_id, file_path);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE strips ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_history ENABLE ROW LEVEL SECURITY;

-- strips: users can only access their own
CREATE POLICY "strips_select" ON strips FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "strips_insert" ON strips FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "strips_update" ON strips FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "strips_delete" ON strips FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- time_logs: access via strip ownership
CREATE POLICY "time_logs_select" ON time_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM strips WHERE strips.id = time_logs.strip_id AND strips.user_id = auth.uid()));
CREATE POLICY "time_logs_insert" ON time_logs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM strips WHERE strips.id = time_logs.strip_id AND strips.user_id = auth.uid()));
CREATE POLICY "time_logs_update" ON time_logs FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM strips WHERE strips.id = time_logs.strip_id AND strips.user_id = auth.uid()));

-- sync_history: users can only access their own
CREATE POLICY "sync_history_select" ON sync_history FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "sync_history_insert" ON sync_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_strips_updated_at
  BEFORE UPDATE ON strips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Grants
-- ============================================================

GRANT ALL ON strips TO authenticated;
GRANT ALL ON time_logs TO authenticated;
GRANT ALL ON sync_history TO authenticated;
