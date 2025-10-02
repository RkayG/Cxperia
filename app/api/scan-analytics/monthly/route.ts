import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/scan-analytics/monthly - Get monthly scan data for the authenticated brand
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user (brand)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = user.id;
    const url = new URL(request.url);
    const monthsBack = parseInt(url.searchParams.get('months') || '12');

    // Get monthly scan data using the enhanced database function
    const { data: monthlyData, error } = await supabase
      .rpc('get_brand_scan_analytics', {
        brand_uuid: brandId,
        months_back: monthsBack
      });

    if (error) {
      console.error('Error fetching monthly scan data:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch monthly scan data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    // Transform data for chart consumption
    const chartData = monthlyData.map((item: any) => ({
      name: item.month_year.split(' ')[0], // Just the month abbreviation
      total: parseInt(item.total_scans),
      unique: parseInt(item.unique_scans),
      returning: parseInt(item.returning_scans),
      experiences: parseInt(item.active_experiences),
      fullDate: item.month_year
    }));

    // Fill in missing months with zero data
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const currentDate = new Date();
    const filledData = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[targetDate.getMonth()];
      
      const existingData = chartData.find(item => 
        item.name === monthName && 
        item.fullDate.includes(targetDate.getFullYear().toString())
      );

      filledData.push({
        name: monthName,
        total: existingData?.total || 0,
        unique: existingData?.unique || 0,
        returning: existingData?.returning || 0,
        experiences: existingData?.experiences || 0,
        fullDate: `${monthName} ${targetDate.getFullYear()}`
      });
    }

    return NextResponse.json({
      success: true,
      data: filledData,
      metadata: {
        totalScans: filledData.reduce((sum, item) => sum + item.total, 0),
        uniqueScans: filledData.reduce((sum, item) => sum + item.unique, 0),
        returningScans: filledData.reduce((sum, item) => sum + item.returning, 0),
        totalExperiences: Math.max(...filledData.map(item => item.experiences), 0),
        monthsIncluded: monthsBack
      }
    });

  } catch (error) {
    console.error('Monthly scan analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch monthly scan data' },
      { status: 500 }
    );
  }
}

// Alternative endpoint for public access (by brand slug or experience slug)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandId, experienceId, months = 12 } = body;

    if (!brandId && !experienceId) {
      return NextResponse.json({ 
        error: 'Either brandId or experienceId is required' 
      }, { status: 400 });
    }

    const supabase = await createClient();

    let query = supabase
      .from('scan_events')
      .select(`
        scanned_at,
        experience_id,
        experiences!inner(id, brand_id)
      `)
      .gte('scanned_at', new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString());

    if (brandId) {
      query = query.eq('experiences.brand_id', brandId);
    } else if (experienceId) {
      query = query.eq('experience_id', experienceId);
    }

    const { data: scanEvents, error } = await query;

    if (error) {
      console.error('Error fetching scan events:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch scan events',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    // Group by month
    const monthlyGroups: { [key: string]: number } = {};
    
    scanEvents.forEach((event: any) => {
      const date = new Date(event.scanned_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyGroups[monthKey] = (monthlyGroups[monthKey] || 0) + 1;
    });

    // Convert to chart format
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const currentDate = new Date();
    const chartData = [];

    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      
      chartData.push({
        name: months[targetDate.getMonth()],
        total: monthlyGroups[monthKey] || 0,
        fullDate: `${months[targetDate.getMonth()]} ${targetDate.getFullYear()}`
      });
    }

    return NextResponse.json({
      success: true,
      data: chartData,
      metadata: {
        totalScans: Object.values(monthlyGroups).reduce((sum, count) => sum + count, 0),
        monthsIncluded: months
      }
    });

  } catch (error) {
    console.error('Scan analytics POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch scan analytics' },
      { status: 500 }
    );
  }
}
