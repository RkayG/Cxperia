'use client';
import { useAuth } from '@/hooks/auth/useAuth';
import Loading from '@/components/Loading';
import HomePage from './home/index';

export default function DashboardPage() {
  const { user, loading, error, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <Loading />;
  }

  // Show error if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Only render dashboard if authenticated
  if (isAuthenticated && user) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <HomePage />  
      </div>
    );
  }

  // This shouldn't be reached due to middleware redirect, but just in case
  return <Loading />;
}