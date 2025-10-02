import { useQuery } from '@tanstack/react-query';

interface MonthlyScanData {
  name: string;
  total: number;
  unique: number;
  returning: number;
  experiences: number;
  fullDate: string;
}

interface ScanAnalyticsResponse {
  success: boolean;
  data: MonthlyScanData[];
  metadata: {
    totalScans: number;
    uniqueScans: number;
    returningScans: number;
    totalExperiences: number;
    monthsIncluded: number;
  };
}

interface BrandScanSummary {
  success: boolean;
  data: {
    totalExperiences: number;
    totalScans: number;
    uniqueScans: number;
    returningScans: number;
    avgScansPerExperience: string;
    uniqueRate: string;
    returningRate: string;
    topExperience: {
      id: string | null;
      name: string;
      scanCount: number;
    };
  };
}

// Hook to fetch monthly scan analytics for the authenticated brand
export function useMonthlyScanAnalytics(months: number = 12) {
  return useQuery({
    queryKey: ['scan-analytics', 'monthly', months],
    queryFn: async (): Promise<ScanAnalyticsResponse> => {
      const response = await fetch(`/api/scan-analytics/monthly?months=${months}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch monthly scan analytics');
      }
      
      return await response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to fetch scan analytics for a specific brand or experience (public access)
export function useScanAnalytics(options: {
  brandId?: string;
  experienceId?: string;
  months?: number;
}) {
  const { brandId, experienceId, months = 12 } = options;
  
  return useQuery({
    queryKey: ['scan-analytics', brandId, experienceId, months],
    queryFn: async (): Promise<ScanAnalyticsResponse> => {
      const response = await fetch('/api/scan-analytics/monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandId,
          experienceId,
          months,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch scan analytics');
      }
      
      return await response.json();
    },
    enabled: !!(brandId || experienceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to fetch brand scan summary statistics
export function useBrandScanSummary() {
  return useQuery({
    queryKey: ['scan-analytics', 'summary'],
    queryFn: async (): Promise<BrandScanSummary> => {
      const response = await fetch('/api/scan-analytics/summary');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch brand scan summary');
      }
      
      return await response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Utility function to generate realistic monthly distribution from total scans
// (Fallback for when detailed scan events are not available)
export function generateMonthlyDistribution(totalScans: number, months: number = 12): MonthlyScanData[] {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentDate = new Date();
  const data: MonthlyScanData[] = [];

  // Create a more realistic distribution pattern
  const patterns = {
    // Higher activity in recent months
    recency: (monthsAgo: number) => Math.max(0.3, 1 - (monthsAgo * 0.1)),
    // Seasonal patterns (higher in certain months)
    seasonal: (month: number) => {
      const seasonalMultipliers = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 0.8, 1.0, 1.1, 1.2, 1.0];
      return seasonalMultipliers[month] || 1.0;
    },
    // Random variation
    random: () => 0.7 + (Math.random() * 0.6), // 0.7 to 1.3 multiplier
  };

  let distributedTotal = 0;
  const monthlyValues: number[] = [];

  // Calculate base distribution
  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthIndex = targetDate.getMonth();
    
    const recencyFactor = patterns.recency(i);
    const seasonalFactor = patterns.seasonal(monthIndex);
    const randomFactor = patterns.random();
    
    const baseValue = (totalScans / months) * recencyFactor * seasonalFactor * randomFactor;
    monthlyValues.push(Math.max(0, Math.round(baseValue)));
    distributedTotal += monthlyValues[monthlyValues.length - 1];
  }

  // Adjust to match total scans exactly
  const adjustment = totalScans / distributedTotal;
  let adjustedTotal = 0;

  for (let i = 0; i < monthlyValues.length; i++) {
    monthlyValues[i] = Math.round(monthlyValues[i] * adjustment);
    adjustedTotal += monthlyValues[i];
  }

  // Handle any rounding differences
  const difference = totalScans - adjustedTotal;
  if (difference !== 0) {
    // Add/subtract the difference to the most recent month
    monthlyValues[monthlyValues.length - 1] += difference;
  }

  // Generate final data
  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = monthNames[targetDate.getMonth()];
    const dataIndex = months - 1 - i;
    
    const totalScansForMonth = Math.max(0, monthlyValues[dataIndex]);
    // Estimate unique vs returning split (typically 60-70% unique for new products)
    const uniqueScans = Math.round(totalScansForMonth * 0.65);
    const returningScans = totalScansForMonth - uniqueScans;

    data.push({
      name: monthName,
      total: totalScansForMonth,
      unique: uniqueScans,
      returning: returningScans,
      experiences: 1, // Placeholder
      fullDate: `${monthName} ${targetDate.getFullYear()}`
    });
  }

  return data;
}
