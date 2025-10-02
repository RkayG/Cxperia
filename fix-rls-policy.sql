-- Fix Row Level Security policy for scan_events table
-- The issue is that public users need to be able to insert scan events

-- Drop existing policies
DROP POLICY IF EXISTS "Brands can view their own scan events." ON scan_events;
DROP POLICY IF EXISTS "Public users can insert scan events." ON scan_events;

-- Policy for authenticated users (brands) to view their own scan events
CREATE POLICY "Brands can view their own scan events."
ON scan_events FOR SELECT
TO authenticated
USING (brand_id IN ( SELECT brands.id FROM brands WHERE brands.id = auth.uid() ));

-- Policy for public users to insert scan events (more permissive)
CREATE POLICY "Public users can insert scan events."
ON scan_events FOR INSERT
TO public, anon
WITH CHECK (true); -- Allow anyone to insert

-- Alternative: If the above doesn't work, try this more specific policy
-- CREATE POLICY "Allow scan event insertion"
-- ON scan_events FOR INSERT
-- WITH CHECK (
--   experience_id IS NOT NULL 
--   AND brand_id IS NOT NULL 
--   AND scanned_at IS NOT NULL
-- );

-- Make sure RLS is enabled but not blocking public inserts
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to public role
GRANT INSERT ON scan_events TO public;
GRANT INSERT ON scan_events TO anon;
