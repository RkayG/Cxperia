// app/s/[subdomain]/dashboard/layout.tsx

import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import { getTenantFromSubdomain } from '@/lib/tenant-utils';


interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { subdomain: string };
}

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/overview",
    icon: Globe,
    type: "item",
  },
  {
    type: 'label',
    name: 'Management',
  },
  {
    name: "Products",
    href: "/products",
    icon: ShoppingBag,
    type: "item",
  },
  {
    name: "People",
    href: "/people",
    icon: Users,
    type: "item",
  },
  {
    name: "Segments",
    href: "/segments",
    icon: Columns3,
    type: "item",
  },
  {
    name: "Regions",
    href: "/regions",
    icon: Locate,
    type: "item",
  },
  {
    type: 'label',
    name: 'Monetization',
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: BarChart4,
    type: "item",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    type: "item",
  },
  {
    name: "Discounts",
    href: "/discounts",
    icon: BadgePercent,
    type: "item",
  },
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: "Configuration",
    href: "/configuration",
    icon: Settings2,
    type: "item",
  },
];


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
    <SidebarLayout
      items={navigationItems}
      basePath={`/s/${params.subdomain}/dashboard`}
      sidebarTop={
        <div className="px-4 py-6">
          <h1 className="text-xl font-semibold">{tenant.name} Dashboard</h1>
          <span className="text-sm text-gray-500 block mt-1">
            {params.subdomain}.yourdomain.com
          </span>
        </div>
      }
      baseBreadcrumb={[{
        title: tenant.name,
        href: `/s/${params.subdomain}/dashboard`,
      }]}
    >
      {children}
    </SidebarLayout>
  );
}