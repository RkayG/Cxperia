import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/scan-analytics/summary - Get brand scan summary statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user (brand)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = user.id;

    // Get brand summary statistics
    const { data: summaryData, error } = await supabase
      .rpc('get_brand_scan_summary', {
        brand_uuid: brandId
      });

    if (error) {
      console.error('Error fetching brand scan summary:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch brand scan summary',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    const summary = summaryData[0] || {
      total_experiences: 0,
      total_scans: 0,
      unique_scans: 0,
      returning_scans: 0,
      avg_scans_per_experience: 0,
      most_scanned_experience_id: null,
      most_scanned_experience_name: null,
      most_scanned_count: 0
    };

    // Calculate additional metrics
    const uniqueRate = summary.total_scans > 0 
      ? ((summary.unique_scans / summary.total_scans) * 100).toFixed(1)
      : '0';

    const returningRate = summary.total_scans > 0 
      ? ((summary.returning_scans / summary.total_scans) * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      success: true,
      data: {
        totalExperiences: parseInt(summary.total_experiences),
        totalScans: parseInt(summary.total_scans),
        uniqueScans: parseInt(summary.unique_scans),
        returningScans: parseInt(summary.returning_scans),
        avgScansPerExperience: parseFloat(summary.avg_scans_per_experience).toFixed(1),
        uniqueRate: `${uniqueRate}%`,
        returningRate: `${returningRate}%`,
        topExperience: {
          id: summary.most_scanned_experience_id,
          name: summary.most_scanned_experience_name || 'No experiences yet',
          scanCount: parseInt(summary.most_scanned_count)
        }
      }
    });

  } catch (error) {
    console.error('Brand scan summary error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch brand scan summary' },
      { status: 500 }
    );
  }
}
