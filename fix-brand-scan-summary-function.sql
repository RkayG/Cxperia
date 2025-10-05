-- Fix get_brand_scan_summary function to handle VARCHAR(150) to TEXT conversion
-- This fixes the type mismatch error in column 7

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
      COALESCE(p.name, 'Unnamed Experience')::TEXT as experience_name, -- Explicitly cast to TEXT
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
