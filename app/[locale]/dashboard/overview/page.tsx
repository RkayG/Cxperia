"use client";

import { Activity, Eye, MessageSquare, Package } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { RecentSales } from "./recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBrand } from '@/contexts/BrandContext';
import { useNavigationProgressWithQuery } from '@/hooks/useNavigationProgressWithQuery';
import { 
  useOverviewExperiences, 
  useOverviewFeedbacks, 
  useOverviewMetrics, 
  useOverviewLoading, 
  useOverviewActions 
} from '@/store/overview/useOverviewStore';
import { Graph } from "./graph";
import Loading from '@/components/Loading';

export default function OverviewPage() {
  
  // Get brand from context
  const { brand, brandId, isLoading: brandLoading, error: brandError } = useBrand();
  
  
  // Subscribe to store state (no hooks, pure subscription)
  const experiences = useOverviewExperiences();
  const feedbacks = useOverviewFeedbacks();
  const metrics = useOverviewMetrics();
  const { isLoadingExperiences, isLoadingFeedbacks } = useOverviewLoading();
  
  
  // Use navigation progress with loading state
  const isLoading = isLoadingExperiences || isLoadingFeedbacks;
  useNavigationProgressWithQuery(isLoading, !!brandError);
  
  // Get actions from store
  const { fetchOverviewData } = useOverviewActions();
  
  // Track if we've fetched data for this brand to prevent duplicate calls
  const fetchedBrandId = useRef<string | null>(null);

  // Initialize data fetching only once when brandId is available
  useEffect(() => {
    if (brandId && fetchedBrandId.current !== brandId) {
      fetchedBrandId.current = brandId;
      fetchOverviewData(brandId);
    }
  }, [brandId]); // Only depend on brandId

  // Show loading state while brand is being fetched
  if (brandLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show error state if brand fetch failed
  if (brandError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading brand: {brandError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-col mb-24">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Experiences
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingExperiences ? "..." : metrics.totalExperiences.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.experienceChange} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Unique Scans
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingExperiences ? "..." : metrics.totalScans.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.scanChange} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingFeedbacks ? "..." : metrics.totalFeedbacks.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.feedbackChange} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Experiences
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingExperiences ? "..." : metrics.activeExperiences.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.activeChange} from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Scan Analytics</CardTitle>
                <CardDescription>
                  Monthly scan counts across all experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Graph experienceData={experiences} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Feedbacks</CardTitle>
                <CardDescription>
                  Latest feedback from your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales feedbackData={feedbacks} isLoading={isLoadingFeedbacks} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}