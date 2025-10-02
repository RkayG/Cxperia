"use client";

import { RecentSales } from "@/app/dashboard/overview/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Graph } from "./graph";
import { useExperiences } from '@/hooks/brands/useExperienceApi';
import { useFeedbacks } from '@/hooks/brands/useFeedbackApi';
import { Activity, Eye, MessageSquare, Package } from 'lucide-react';
import React from 'react';

export default function DashboardPage() {
  // Fetch experiences and feedbacks
  const { data: experiencesRaw, isLoading: isLoadingExperiences } = useExperiences();
  const { data: feedbacksRaw, isLoading: isLoadingFeedbacks } = useFeedbacks();

  // Process experiences data
  const experienceArr: any[] = React.useMemo(() => {
    if (!experiencesRaw) return [];
    if (experiencesRaw.error || (experiencesRaw.data && !Array.isArray(experiencesRaw.data))) {
      return [];
    }
    if (Array.isArray(experiencesRaw)) return experiencesRaw;
    if (Array.isArray(experiencesRaw.data)) return experiencesRaw.data;
    return [];
  }, [experiencesRaw]);

  // Process feedbacks data
  const feedbackArr: any[] = React.useMemo(() => {
    if (!feedbacksRaw) return [];
    if (feedbacksRaw.error || (feedbacksRaw.data && !Array.isArray(feedbacksRaw.data))) {
      return [];
    }
    if (Array.isArray(feedbacksRaw)) return feedbacksRaw;
    if (Array.isArray(feedbacksRaw.data)) return feedbacksRaw.data;
    return [];
  }, [feedbacksRaw]);

  // Calculate metrics
  const totalExperiences = experienceArr.length;
  const activeExperiences = experienceArr.filter(exp => exp.is_published).length;
  const totalScans = experienceArr.reduce((sum, exp) => sum + (exp.scan_count || 0), 0);
  const totalFeedbacks = feedbackArr.length;

  // Calculate percentage changes (mock for now - you can implement actual historical comparison)
  const experienceChange = totalExperiences > 0 ? "+12.5%" : "0%";
  const scanChange = totalScans > 0 ? "+23.1%" : "0%";
  const feedbackChange = totalFeedbacks > 0 ? "+8.7%" : "0%";
  const activeChange = activeExperiences > 0 ? "+5.2%" : "0%";

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
                  {isLoadingExperiences ? "..." : totalExperiences.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {experienceChange} from last month
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
                  {isLoadingExperiences ? "..." : totalScans.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {scanChange} from last month
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
                  {isLoadingFeedbacks ? "..." : totalFeedbacks.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {feedbackChange} from last month
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
                  {isLoadingExperiences ? "..." : activeExperiences.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeChange} from last month
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
                <Graph experienceData={experienceArr} />
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
                <RecentSales feedbackData={feedbackArr} isLoading={isLoadingFeedbacks} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
