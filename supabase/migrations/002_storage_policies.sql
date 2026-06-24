-- Storage policy: Limit image uploads to 2MB and allowed types
-- Run this in Supabase SQL Editor

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
  AND octet_length(content) <= 2097152  -- 2MB
);

CREATE POLICY "Public can view logo images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Cover bucket policies (if separate bucket exists)
CREATE POLICY "Users can upload cover images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers'
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
  AND octet_length(content) <= 2097152  -- 2MB
);

CREATE POLICY "Public can view cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'covers');
