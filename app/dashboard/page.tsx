// app/s/[subdomain]/dashboard/page.tsx
import { getTenantBySubdomain, getTenantStats } from '@/lib/tenant-data';

interface DashboardPageProps {
  params: { subdomain: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const tenant = await getTenantBySubdomain(params.subdomain);
  
  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tenant Not Found</h1>
          <p className="text-gray-600">This subdomain does not exist or is inactive.</p>
        </div>
      </div>
    );
  }

  const stats = await getTenantStats(tenant.id);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back to {tenant.name}</h1>
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
              <dt className="text-sm font-medium text-gray-500 truncate">Tenant Status</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600 capitalize">{tenant.status}</dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a 
                href={`/s/${params.subdomain}/dashboard/products`}
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
                href={`/s/${params.subdomain}/dashboard/experiences`}
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
                href={`/s/${params.subdomain}/dashboard/settings`}
                className="group p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600">⚙️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-500">Configure your tenant</p>
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