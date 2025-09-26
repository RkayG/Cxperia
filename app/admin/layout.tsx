// app/admin/layout.tsx
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();
  
  // Only super admins and sales can access admin panel
  if (!user || !['super_admin', 'sales_admin'].includes(user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav user={user} />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}