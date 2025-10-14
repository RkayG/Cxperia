'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/Loading';
import HomePage from './home/index';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Check email confirmation
        if (user && !user.email_confirmed_at) {
          // User is logged in but email not verified - they can stay on dashboard
          // but you might want to show a warning
          //console.log('Email not verified yet');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <Loading />;
  }

  // Only render dashboard if authenticated
  if (isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <HomePage />  
      </div>
    );
  }

  // This shouldn't be reached due to redirect, but just in case
  return <Loading />;
}