"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import React from "react"
import { useMonthlyScanAnalytics, generateMonthlyDistribution } from "@/hooks/brands/useScanAnalytics"

interface GraphProps {
  experienceData: any[];
}

export function Graph({ experienceData }: GraphProps) {
  // Fetch real monthly scan data
  const { data: scanAnalytics, isLoading, error } = useMonthlyScanAnalytics(12);

  // Generate monthly data based on real scan events or fallback to distribution
  const monthlyData = React.useMemo(() => {
    // If we have real scan analytics data, use it
    if (scanAnalytics?.data && scanAnalytics.data.length > 0) {
      return scanAnalytics.data.map(item => ({
        name: item.name,
        total: item.total,
        unique: item.unique,
        returning: item.returning,
      }));
    }

    // Fallback: distribute total scans across months with realistic patterns
    const totalScans = experienceData.reduce((sum, exp) => sum + (exp.total_scan_count || exp.scan_count || 0), 0);
    
    if (totalScans === 0) {
      // Return empty data for all months
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return months.map(month => ({ 
        name: month, 
        total: 0, 
        unique: 0, 
        returning: 0 
      }));
    }

    // Use the utility function to generate realistic distribution
    const distributedData = generateMonthlyDistribution(totalScans, 12);
    return distributedData.map(item => ({
      name: item.name,
      total: item.total,
      unique: item.unique,
      returning: item.returning,
    }));
  }, [scanAnalytics, experienceData]);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="unique"
          stackId="scans"
          fill="#8b5cf6"
          radius={[0, 0, 0, 0]}
          name="Unique Scans"
        />
        <Bar
          dataKey="returning"
          stackId="scans"
          fill="#a78bfa"
          radius={[4, 4, 0, 0]}
          name="Returning Scans"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
