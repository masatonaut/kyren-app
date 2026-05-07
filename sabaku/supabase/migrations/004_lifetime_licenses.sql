-- Gumroad Lifetime license tracking

CREATE TABLE IF NOT EXISTS lifetime_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  license_key TEXT NOT NULL UNIQUE,
  gumroad_purchase_id TEXT,
  gumroad_email TEXT,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lifetime_licenses_license_key ON lifetime_licenses(license_key);

ALTER TABLE lifetime_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lifetime_licenses_select_own" ON lifetime_licenses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
-- INSERT/UPDATE/DELETE service_role only (api/activate route)

CREATE TRIGGER trigger_lifetime_licenses_updated_at
  BEFORE UPDATE ON lifetime_licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

GRANT SELECT ON lifetime_licenses TO authenticated;
GRANT ALL ON lifetime_licenses TO service_role;
