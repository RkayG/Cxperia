import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/scan-analytics/summary - Get brand scan summary statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the actual brand_id from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('brand_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const brandId = profile.brand_id;

    let summary;

    // Get brand summary statistics
    const { data: summaryData, error } = await supabase
      .rpc('get_brand_scan_summary', {
        brand_uuid: brandId
      });

    if (error) {
      
      // Fallback: Get basic stats directly from tables
      const { data: experiences, error: expError } = await supabase
        .from('experiences')
        .select('id, total_scan_count, unique_scan_count, products(name)')
        .eq('brand_id', brandId)
        .eq('is_published', true);

      if (expError) {
        return NextResponse.json({ 
          error: 'Failed to fetch brand scan summary',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
      }

      // Calculate stats manually
      const totalExperiences = experiences?.length || 0;
      const totalScans = experiences?.reduce((sum, exp) => sum + (exp.total_scan_count || 0), 0) || 0;
      const uniqueScans = experiences?.reduce((sum, exp) => sum + (exp.unique_scan_count || 0), 0) || 0;
      const returningScans = totalScans - uniqueScans;
      const avgScansPerExperience = totalExperiences > 0 ? (totalScans / totalExperiences).toFixed(1) : '0';
      
      // Find top experience
      const topExp = experiences?.reduce((top, exp) => 
        (exp.total_scan_count || 0) > (top.total_scan_count || 0) ? exp : top, 
        experiences[0] || { total_scan_count: 0 }
      );

      summary = {
        total_experiences: totalExperiences,
        total_scans: totalScans,
        unique_scans: uniqueScans,
        returning_scans: returningScans,
        avg_scans_per_experience: avgScansPerExperience,
        most_scanned_experience_id: topExp?.id || null,
        most_scanned_experience_name: topExp?.products?.name || 'No experiences yet',
        most_scanned_count: topExp?.total_scan_count || 0
      };
    } else {
      summary = summaryData[0] || {
        total_experiences: 0,
        total_scans: 0,
        unique_scans: 0,
        returning_scans: 0,
        avg_scans_per_experience: 0,
        most_scanned_experience_id: null,
        most_scanned_experience_name: null,
        most_scanned_count: 0
      };
    }

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch brand scan summary' },
      { status: 500 }
    );
  }
}
