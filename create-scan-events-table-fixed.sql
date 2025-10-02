-- Create scan_events table to track individual scan timestamps
-- Fixed version that avoids IMMUTABLE function errors

CREATE TABLE IF NOT EXISTS scan_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    user_agent TEXT,
    ip_address INET,
    session_id TEXT, -- For deduplication
    user_fingerprint TEXT, -- For unique user identification
    is_unique_scan BOOLEAN DEFAULT true, -- First time scanning this experience
    previous_scan_id UUID REFERENCES scan_events(id), -- Links to previous scan by same user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for performance (avoiding date_trunc in indexes to prevent IMMUTABLE errors)
CREATE INDEX IF NOT EXISTS idx_scan_events_experience_id ON scan_events (experience_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_brand_id ON scan_events (brand_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_scanned_at ON scan_events (scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_events_session_id ON scan_events (session_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_user_fingerprint ON scan_events (user_fingerprint);
CREATE INDEX IF NOT EXISTS idx_scan_events_experience_fingerprint ON scan_events (experience_id, user_fingerprint);

-- Composite indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_scan_events_brand_date ON scan_events (brand_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_events_experience_date ON scan_events (experience_id, scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_events_unique_flag ON scan_events (is_unique_scan, scanned_at DESC);

-- Enable Row Level Security
ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (brands) to view their own scan events
DROP POLICY IF EXISTS "Brands can view their own scan events." ON scan_events;
CREATE POLICY "Brands can view their own scan events."
ON scan_events FOR SELECT
TO authenticated
USING (brand_id IN ( SELECT brands.id FROM brands WHERE brands.id = auth.uid() ));

-- Policy for public users to insert scan events (no authentication needed)
DROP POLICY IF EXISTS "Public users can insert scan events." ON scan_events;
CREATE POLICY "Public users can insert scan events."
ON scan_events FOR INSERT
TO public
WITH CHECK (true); -- Allow anyone to insert, validation handled in API route

-- Add columns to experiences table for tracking scan counts
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS unique_scan_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_scan_count INTEGER DEFAULT 0;

-- Update existing experiences to have proper counts (run once)
UPDATE experiences 
SET 
  total_scan_count = COALESCE(scan_count, 0),
  unique_scan_count = COALESCE(scan_count, 0)
WHERE total_scan_count = 0 AND unique_scan_count = 0;

-- Function to get monthly scan data for a brand (avoiding IMMUTABLE issues)
CREATE OR REPLACE FUNCTION get_brand_scan_analytics(
  brand_uuid UUID, 
  months_back INTEGER DEFAULT 12
)
RETURNS TABLE (
  month_year TEXT,
  total_scans BIGINT,
  unique_scans BIGINT,
  returning_scans BIGINT,
  active_experiences BIGINT,
  sort_key TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH monthly_data AS (
    SELECT 
      TO_CHAR(date_trunc('month', se.scanned_at), 'Mon YYYY') as month_year,
      TO_CHAR(date_trunc('month', se.scanned_at), 'YYYY-MM') as sort_key,
      COUNT(*) as total_scans,
      COUNT(*) FILTER (WHERE se.is_unique_scan = true) as unique_scans,
      COUNT(*) FILTER (WHERE se.is_unique_scan = false) as returning_scans,
      COUNT(DISTINCT se.experience_id) as active_experiences
    FROM scan_events se
    INNER JOIN experiences e ON se.experience_id = e.id
    WHERE e.brand_id = brand_uuid
    AND se.scanned_at >= (CURRENT_DATE - INTERVAL '1 month' * months_back)
    GROUP BY date_trunc('month', se.scanned_at)
    ORDER BY sort_key DESC
  )
  SELECT 
    md.month_year,
    md.total_scans,
    md.unique_scans,
    md.returning_scans,
    md.active_experiences,
    md.sort_key
  FROM monthly_data md;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get brand summary stats
CREATE OR REPLACE FUNCTION get_brand_scan_summary(brand_uuid UUID)
RETURNS TABLE (
  total_experiences BIGINT,
  total_scans BIGINT,
  unique_scans BIGINT,
  returning_scans BIGINT,
  avg_scans_per_experience NUMERIC,
  most_scanned_experience_id UUID,
  most_scanned_experience_name TEXT,
  most_scanned_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH brand_stats AS (
    SELECT 
      COUNT(DISTINCT e.id) as total_experiences,
      COALESCE(SUM(e.total_scan_count), 0) as total_scans,
      COALESCE(SUM(e.unique_scan_count), 0) as unique_scans,
      COALESCE(SUM(e.total_scan_count) - SUM(e.unique_scan_count), 0) as returning_scans,
      CASE 
        WHEN COUNT(DISTINCT e.id) > 0 
        THEN COALESCE(SUM(e.total_scan_count), 0)::NUMERIC / COUNT(DISTINCT e.id)
        ELSE 0 
      END as avg_scans_per_experience
    FROM experiences e
    WHERE e.brand_id = brand_uuid
    AND e.is_published = true
  ),
  top_experience AS (
    SELECT 
      e.id,
      p.name as experience_name,
      e.total_scan_count
    FROM experiences e
    LEFT JOIN products p ON e.product_id = p.id
    WHERE e.brand_id = brand_uuid
    AND e.is_published = true
    ORDER BY e.total_scan_count DESC
    LIMIT 1
  )
  SELECT 
    bs.total_experiences,
    bs.total_scans,
    bs.unique_scans,
    bs.returning_scans,
    bs.avg_scans_per_experience,
    te.id,
    te.experience_name,
    te.total_scan_count
  FROM brand_stats bs
  CROSS JOIN top_experience te;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
