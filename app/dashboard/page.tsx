'use client';
import { getCurrentUserBrand, getBrandStats } from '@/lib/data/brands';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Brand {
  id: string;
  name: string;
}

interface Stats {
  totalProducts: number;
  publishedExperiences: number;
  draftExperiences: number;
  todayScans: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (!currentUser) {
          router.push('/auth/login');
          return;
        }

        // Check email confirmation
        if (currentUser && !currentUser.email_confirmed_at) {
          // User is logged in but email not verified - they can stay on dashboard
          // but you might want to show a warning
          console.log('Email not verified yet');
        }

        // Get brand data
        const brandData = await getCurrentUserBrand();
        if (!brandData) {
          console.log('No brand found, redirecting to setup');
          router.push('/setup');
          return;
        }
        setBrand(brandData);

        // Get stats
        const statsData = await getBrandStats(brandData.id);
        setStats(statsData);

      } catch (error) {
        console.error('Dashboard initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Brand Found</h1>
          <p className="text-gray-600 mb-4">
            You need to set up a brand before accessing the dashboard.
          </p>
          <button
            onClick={() => router.push('/setup')}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700"
          >
            Set Up Brand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back to {brand.name}</h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your brand today.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden border  rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.totalProducts || 0}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Experiences</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats?.publishedExperiences || 0}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Draft Experiences</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats?.draftExperiences || 0}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden border rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">QR Scans Today</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats?.todayScans || 0}</dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a 
                href="/dashboard/products"
                className="group p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-purple-600">📦</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Manage Products</h3>
                    <p className="text-sm text-gray-500">Add and edit your products</p>
                  </div>
                </div>
              </a>
              <a 
                href="/dashboard/experiences"
                className="group p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600">✨</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Create Experiences</h3>
                    <p className="text-sm text-gray-500">Build digital experiences</p>
                  </div>
                </div>
              </a>
              <a 
                href="/dashboard/settings"
                className="group p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600">⚙️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Create Tutorials</h3>
                    <p className="text-sm text-gray-500">Build and manage your tutorials</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}