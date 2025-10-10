'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBrandStats, getCurrentUserBrand } from '@/lib/data/brands';
import { supabase } from '@/lib/supabase';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import Loading from '@/components/Loading';
import HomePage from './home/index';


export default function DashboardPage() {
  

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <HomePage />  
    </div>
  );
}