// app/s/[subdomain]/dashboard/layout.tsx
import { getTenantFromSubdomain } from '@/lib/tenant-utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { subdomain: string };
}

export default async function DashboardLayout({ 
  children, 
  params 
}: DashboardLayoutProps) {
  const tenant = await getTenantFromSubdomain(params.subdomain);
  
  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tenant Not Found</h1>
          <p className="text-gray-600">This subdomain does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{tenant.name} Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {params.subdomain}.yourdomain.com
              </span>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}