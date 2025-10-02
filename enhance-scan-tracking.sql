-- Enhance scan tracking to support unique vs total scans and better user identification

-- Add columns to scan_events for better user tracking
ALTER TABLE scan_events 
ADD COLUMN IF NOT EXISTS user_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS is_unique_scan BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS previous_scan_id UUID REFERENCES scan_events(id);

-- Create index for user fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_scan_events_user_fingerprint ON scan_events (user_fingerprint);
CREATE INDEX IF NOT EXISTS idx_scan_events_experience_fingerprint ON scan_events (experience_id, user_fingerprint);

-- Add unique and total scan counts to experiences table
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS unique_scan_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_scan_count INTEGER DEFAULT 0;

-- Update existing experiences to have proper counts (run once)
UPDATE experiences 
SET 
  total_scan_count = COALESCE(scan_count, 0),
  unique_scan_count = COALESCE(scan_count, 0)
WHERE total_scan_count = 0 AND unique_scan_count = 0;

-- Function to get comprehensive scan analytics for a brand
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

-- Function to get experience-level scan analytics
CREATE OR REPLACE FUNCTION get_experience_scan_analytics(
  experience_uuid UUID, 
  months_back INTEGER DEFAULT 12
)
RETURNS TABLE (
  month_year TEXT,
  total_scans BIGINT,
  unique_scans BIGINT,
  returning_scans BIGINT,
  sort_key TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH monthly_data AS (
    SELECT 
      TO_CHAR(date_trunc('month', scanned_at), 'Mon YYYY') as month_year,
      TO_CHAR(date_trunc('month', scanned_at), 'YYYY-MM') as sort_key,
      COUNT(*) as total_scans,
      COUNT(*) FILTER (WHERE is_unique_scan = true) as unique_scans,
      COUNT(*) FILTER (WHERE is_unique_scan = false) as returning_scans
    FROM scan_events 
    WHERE experience_id = experience_uuid
    AND scanned_at >= (CURRENT_DATE - INTERVAL '1 month' * months_back)
    GROUP BY date_trunc('month', scanned_at)
    ORDER BY sort_key DESC
  )
  SELECT 
    md.month_year,
    md.total_scans,
    md.unique_scans,
    md.returning_scans,
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
