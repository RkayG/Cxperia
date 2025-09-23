// hooks/use-tenant-data.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getTenantStats, getTenantProducts, getTenantExperiences } from '@/lib/tenant-data';

export function useTenantStats(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-stats', tenantId],
    queryFn: () => getTenantStats(tenantId),
    enabled: !!tenantId,
  });
}

export function useTenantProducts(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-products', tenantId],
    queryFn: () => getTenantProducts(tenantId),
    enabled: !!tenantId,
  });
}

export function useTenantExperiences(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-experiences', tenantId],
    queryFn: () => getTenantExperiences(tenantId),
    enabled: !!tenantId,
  });
}