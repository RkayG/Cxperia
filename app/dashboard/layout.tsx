// app/s/[subdomain]/dashboard/layout.tsx
import { BadgePercent, BarChart4, Columns3, Globe, Locate, Settings2, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { getCurrentUserBrand, getBrandStats } from '@/lib/data/brands';

interface DashboardLayoutProps {
  children: React.ReactNode;
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


export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const brand = await getCurrentUserBrand();
  const brandName = brand?.name || "Your Brand";

  return (
    <SidebarLayout
      items={navigationItems}
      basePath="/dashboard"
      sidebarTop={
        <div className="px-4 py-6">
          <h1 className="text-xl font-semibold">{brandName} Dashboard</h1>
        </div>
      }
      baseBreadcrumb={[{
        title: brandName,
        href: "/dashboard",
      }]}
    >
      {children}
    </SidebarLayout>
  );
}