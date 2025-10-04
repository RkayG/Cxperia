"use client";

import { Activity, Eye, MessageSquare, Package } from 'lucide-react';
import React, { useEffect } from 'react';
import { RecentSales } from "@/app/dashboard/overview/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { 
  useOverviewExperiences, 
  useOverviewFeedbacks, 
  useOverviewMetrics, 
  useOverviewLoading, 
  useOverviewActions 
} from '@/store/overview/useOverviewStore';
import { Graph } from "./graph";

export default function OverviewPage() {
  // Get brand from store
  const brand = useExperienceStore((state) => state.brand);
  const brandId = brand?.id;

  // Subscribe to store state (no hooks, pure subscription)
  const experiences = useOverviewExperiences();
  const feedbacks = useOverviewFeedbacks();
  const metrics = useOverviewMetrics();
  const { isLoadingExperiences, isLoadingFeedbacks } = useOverviewLoading();
  
  // Get actions from store
  const { fetchOverviewData } = useOverviewActions();

  // Initialize data fetching
  useEffect(() => {
    if (brandId) {
      fetchOverviewData(brandId);
    }
  }, [brandId, fetchOverviewData]);

  return (
    <>
      <div className="flex-col">
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