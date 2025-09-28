// app/dashboard/layout.tsx (Server Component)
import Image from "next/image";
import logo from '../../assets/logo.png'
import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { getCurrentUserBrand } from '@/lib/data/brands';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/overview",
    icon: "Globe", // String instead of component
    type: "item",
  },
  {
    type: 'label',
    name: 'Management',
  },
  {
    name: "Products",
    href: "/products",
    icon: "ShoppingBag",
    type: "item",
  },
  {
    name: "Content",
    href: "/content",
    icon: "Users",
    type: "item",
  },
  {
    name: "Feedback",
    href: "/feedback",
    icon: "Columns3",
    type: "item",
  },
  {
    name: "Regions",
    href: "/regions",
    icon: "Locate",
    type: "item",
  },
  {
    type: 'label',
    name: 'Monetization',
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: "BarChart4",
    type: "item",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: "ShoppingCart",
    type: "item",
  },
  {
    name: "Discounts",
    href: "/discounts",
    icon: "BadgePercent",
    type: "item",
  },
  {
    type: 'label',
    name: 'Settings',
  },
  {
    name: "Configuration",
    href: "/configuration",
    icon: "Settings2",
    type: "item",
  },
];

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const brand = await getCurrentUserBrand();
  console.log("Current Brand in Layout:", brand);
  const brandName = brand?.name || "Your Brand";

  return (
    <SidebarLayout
      items={navigationItems}
      basePath="/dashboard"
      sidebarTop={
        <div className="px-4 py-6">
          <Image src={logo} alt="Logo" className="h-10 w-24" />
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