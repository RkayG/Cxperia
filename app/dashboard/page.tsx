import { getCurrentUserBrand, getBrandStats } from '@/lib/data/brands';
import { supabase } from '@/lib/supabase';

export default async function DashboardPage() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Not Verified</h1>
          <p className="text-gray-600 mb-4">
            Please check your email and click the verification link to access your dashboard.
          </p>
          <form action="/api/auth/resend-verification" method="POST">
            <input type="hidden" name="email" value={user.email!} />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
            >
              Resend Verification Email
            </button>
          </form>
        </div>
      </div>
    );
  }
  const brand = await getCurrentUserBrand();
  if (!brand) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }
  const stats = await getBrandStats(brand.id);
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
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalProducts}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Experiences</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.publishedExperiences}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Draft Experiences</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.draftExperiences}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">QR Scans Today</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.todayScans}</dd>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a 
                href="/dashboard/products"
                className="group p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
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
                className="group p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200"
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
                className="group p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600">⚙️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-500">Configure your brand</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent QR Code Scans</h2>
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">QR code analytics will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}