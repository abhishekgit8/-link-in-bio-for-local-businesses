-- Storage policy: Limit image uploads to allowed types
-- Run this in Supabase SQL Editor
-- Note: File size validation (2MB) is handled client-side.
-- Supabase Storage policies cannot check file size directly.

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload logo images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view logo images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view cover images" ON storage.objects;

-- Logo bucket policies
CREATE POLICY "Users can upload logo images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos'
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
);

CREATE POLICY "Public can view logo images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Cover bucket policies
CREATE POLICY "Users can upload cover images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers'
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
);

CREATE POLICY "Public can view cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');
