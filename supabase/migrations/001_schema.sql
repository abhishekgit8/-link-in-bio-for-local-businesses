-- Idempotent migration: safe to re-run

-- Create enum types (drop first to make idempotent)
DO $$ BEGIN
  DROP TYPE IF EXISTS subscription_tier CASCADE;
  DROP TYPE IF EXISTS theme_type CASCADE;
  DROP TYPE IF EXISTS button_style_type CASCADE;
  DROP TYPE IF EXISTS font_type CASCADE;
  DROP TYPE IF EXISTS category_type CASCADE;
  DROP TYPE IF EXISTS link_type CASCADE;
  DROP TYPE IF EXISTS cover_type CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TYPE subscription_tier AS ENUM ('free', 'pro');
CREATE TYPE theme_type AS ENUM ('classic', 'dark', 'warm', 'minimal');
CREATE TYPE button_style_type AS ENUM ('filled', 'outline', 'soft', 'shadow');
CREATE TYPE font_type AS ENUM ('inter', 'serif', 'poppins');
CREATE TYPE category_type AS ENUM ('salon', 'cafe', 'tutor', 'freelancer', 'coach', 'other');
CREATE TYPE link_type AS ENUM ('url', 'phone', 'whatsapp', 'instagram', 'maps', 'email', 'custom');
CREATE TYPE cover_type AS ENUM ('color', 'image');

-- Profiles table
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS link_clicks CASCADE;
DROP TABLE IF EXISTS username_redirects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  business_name TEXT NOT NULL DEFAULT '',
  category category_type,
  tagline TEXT,
  bio TEXT CHECK (char_length(bio) <= 150),
  logo_url TEXT,
  cover_type cover_type DEFAULT 'color',
  cover_value TEXT DEFAULT '#1A1A1A',
  theme theme_type NOT NULL DEFAULT 'classic',
  button_style button_style_type NOT NULL DEFAULT 'filled',
  font font_type NOT NULL DEFAULT 'inter',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  subscription_end_date TIMESTAMPTZ,
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type link_type NOT NULL DEFAULT 'url',
  label TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  icon TEXT,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Page views table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link clicks table
CREATE TABLE link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Username redirects for SEO
CREATE TABLE username_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_username TEXT NOT NULL,
  new_username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_links_profile_id ON links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
CREATE INDEX IF NOT EXISTS idx_page_views_profile_id ON page_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_created_at ON link_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_username_redirects_old ON username_redirects(old_username);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE username_redirects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read by username" ON profiles;
  DROP POLICY IF EXISTS "Owner full access" ON profiles;
  DROP POLICY IF EXISTS "Public read active links" ON links;
  DROP POLICY IF EXISTS "Owner full access" ON links;
  DROP POLICY IF EXISTS "Anyone can insert" ON page_views;
  DROP POLICY IF EXISTS "Owner can read" ON page_views;
  DROP POLICY IF EXISTS "Anyone can insert" ON link_clicks;
  DROP POLICY IF EXISTS "Owner can read" ON link_clicks;
  DROP POLICY IF EXISTS "Public read" ON username_redirects;
  DROP POLICY IF EXISTS "Service role insert" ON username_redirects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Profiles policies
CREATE POLICY "Public read by username"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Owner full access"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- Links policies
CREATE POLICY "Public read active links"
  ON links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owner full access"
  ON links FOR ALL
  USING (
    auth.uid() = (SELECT id FROM profiles WHERE id = profile_id)
  );

-- Page views policies
CREATE POLICY "Anyone can insert"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owner can read"
  ON page_views FOR SELECT
  USING (
    auth.uid() = (SELECT id FROM profiles WHERE id = profile_id)
  );

-- Link clicks policies
CREATE POLICY "Anyone can insert"
  ON link_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owner can read"
  ON link_clicks FOR SELECT
  USING (
    auth.uid() = (
      SELECT p.id FROM profiles p
      JOIN links l ON l.profile_id = p.id
      WHERE l.id = link_id
    )
  );

-- Username redirects policies
CREATE POLICY "Public read"
  ON username_redirects FOR SELECT
  USING (true);

CREATE POLICY "Service role insert"
  ON username_redirects FOR INSERT
  WITH CHECK (true);

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload covers" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'logos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers'
    AND auth.role() = 'authenticated'
  );

-- Username validation constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_length_check;
ALTER TABLE profiles ADD CONSTRAINT username_length_check
  CHECK (username IS NULL OR (char_length(username) >= 3 AND char_length(username) <= 30));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS username_format_check;
ALTER TABLE profiles ADD CONSTRAINT username_format_check
  CHECK (username IS NULL OR username ~ '^[a-z0-9-]+$');

-- Helper function to delete user account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

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
