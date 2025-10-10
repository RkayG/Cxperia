// app/admin/layout.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Create a Supabase client with SSR context
  const cookieStore = await cookies(); 
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        }
      },
    }
  );

  // Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    //console.error('Session error:', sessionError);
    redirect('/auth/login?redirect=/admin');
  }

  if (!session?.user) {
    redirect('/auth/login?redirect=/admin');
  }

  // Get user's profile with role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    redirect('/auth/login?redirect=/admin');
  }

  // Only specific roles can access admin panel
  const allowedRoles = ['super_admin', 'sales_admin'];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/dashboard');
  }

  // Combine user and profile data for the nav
  const userData = {
    ...session.user,
    ...profile
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav user={userData} />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}