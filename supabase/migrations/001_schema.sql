-- Create enum types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro');
CREATE TYPE theme_type AS ENUM ('classic', 'dark', 'warm', 'minimal');
CREATE TYPE button_style_type AS ENUM ('filled', 'outline', 'soft', 'shadow');
CREATE TYPE font_type AS ENUM ('inter', 'serif', 'poppins');
CREATE TYPE category_type AS ENUM ('salon', 'cafe', 'tutor', 'freelancer', 'coach', 'other');
CREATE TYPE link_type AS ENUM ('url', 'phone', 'whatsapp', 'instagram', 'maps', 'email', 'custom');
CREATE TYPE cover_type AS ENUM ('color', 'image');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  business_name TEXT NOT NULL DEFAULT '',
  category category_type,
  tagline TEXT,
  bio TEXT,
  logo_url TEXT,
  cover_type cover_type,
  cover_value TEXT,
  theme theme_type NOT NULL DEFAULT 'classic',
  button_style button_style_type NOT NULL DEFAULT 'filled',
  font font_type NOT NULL DEFAULT 'inter',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

-- Indexes
CREATE INDEX idx_links_profile_id ON links(profile_id);
CREATE INDEX idx_links_position ON links(position);
CREATE INDEX idx_page_views_profile_id ON page_views(profile_id);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_created_at ON link_clicks(created_at);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read public profiles"
  ON profiles FOR SELECT
  USING (username IS NOT NULL);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Links policies
CREATE POLICY "Users can read own links"
  ON links FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Anyone can read active links"
  ON links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert own links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own links"
  ON links FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own links"
  ON links FOR DELETE
  USING (auth.uid() = profile_id);

-- Page views policies
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own page views"
  ON page_views FOR SELECT
  USING (auth.uid() = profile_id);

-- Link clicks policies
CREATE POLICY "Anyone can insert link clicks"
  ON link_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own link clicks"
  ON link_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = link_clicks.link_id
      AND links.profile_id = auth.uid()
    )
  );

-- Storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can view logos
CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

-- Storage policy: authenticated users can upload logos
CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'logos'
    AND auth.role() = 'authenticated'
  );

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
