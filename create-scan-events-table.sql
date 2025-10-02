-- Create scan_events table to track individual scan timestamps
CREATE TABLE IF NOT EXISTS scan_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    user_agent TEXT,
    ip_address INET,
    session_id TEXT, -- For deduplication
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scan_events_experience_id ON scan_events (experience_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_brand_id ON scan_events (brand_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_scanned_at ON scan_events (scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_events_session_id ON scan_events (session_id);

-- Composite index for monthly aggregation queries
CREATE INDEX IF NOT EXISTS idx_scan_events_brand_month ON scan_events (brand_id, date_trunc('month', scanned_at));

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

-- Function to get monthly scan data for a brand
CREATE OR REPLACE FUNCTION get_monthly_scan_data(brand_uuid UUID, months_back INTEGER DEFAULT 12)
RETURNS TABLE (
    month_year TEXT,
    scan_count BIGINT,
    experience_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH monthly_data AS (
        SELECT 
            TO_CHAR(date_trunc('month', scanned_at), 'Mon YYYY') as month_year,
            TO_CHAR(date_trunc('month', scanned_at), 'YYYY-MM') as sort_key,
            COUNT(*) as scan_count,
            COUNT(DISTINCT experience_id) as experience_count
        FROM scan_events 
        WHERE brand_id = brand_uuid
        AND scanned_at >= (CURRENT_DATE - INTERVAL '1 month' * months_back)
        GROUP BY date_trunc('month', scanned_at)
        ORDER BY sort_key DESC
    )
    SELECT 
        md.month_year,
        md.scan_count,
        md.experience_count
    FROM monthly_data md;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
