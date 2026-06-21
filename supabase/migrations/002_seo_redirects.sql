-- Add updated_at column to profiles for sitemap lastModified
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Auto-update updated_at on profile changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Username redirects for SEO (301 redirect old → new for 90 days)
CREATE TABLE IF NOT EXISTS username_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_username TEXT NOT NULL,
  new_username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_username_redirects_old ON username_redirects(old_username);

ALTER TABLE username_redirects ENABLE ROW LEVEL SECURITY;

-- Anyone can read redirects (needed for the 301 lookup)
CREATE POLICY "Anyone can read redirects"
  ON username_redirects FOR SELECT
  USING (true);

-- Only profile owner can insert redirects
CREATE POLICY "Users can insert own redirects"
  ON username_redirects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.username = new_username
    )
  );

-- Username validation: lowercase, alphanumeric + hyphens, 3-30 chars
-- Enforced at the application level, but add a DB-level check
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_length_check;
ALTER TABLE profiles ADD CONSTRAINT username_length_check
  CHECK (username IS NULL OR (char_length(username) >= 3 AND char_length(username) <= 30));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE profiles ADD CONSTRAINT username_format_check
  CHECK (username IS NULL OR username ~ '^[a-z0-9-]+$');

-- Clean up old redirects after 90 days
CREATE OR REPLACE FUNCTION cleanup_old_redirects()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM username_redirects
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;
