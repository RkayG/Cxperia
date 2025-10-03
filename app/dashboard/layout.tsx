// app/dashboard/layout.tsx (Server Component)
import Image from "next/image";
import MobileBottomNav from "@/components/MobileBottomNavbar";
import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import logo from '../../assets/logo.png'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems: SidebarItem[] = [
  {
    name: "Overview",
    href: "/overview",
    icon: "BarChart4", // Dashboard/analytics icon
    type: "item",
  },
  {
    name: "Home",
    href: "/",
    icon: "HomeIcon",
    type: "item",
  },
  {
    type: 'label',
    name: 'Manage',
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
    icon: "Book", // Content/writing icon
    type: "item",
  },

  {
    name: "Feedback",
    href: "/feedback",
    icon: "Users", // Feedback from users icon
    type: "item",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: "Settings2", // My Profile
    type: "item",
  },
  /*{
    name: "Chatbot",
    href: "/chatbot",
    icon: "MessageCircle", // Chat/message icon
    type: "item",
  },
   {
    type: 'label',
    name: 'Monetization',
  }, */
  /* {
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
  }, */
];

export default async function DashboardLayout({ children }: DashboardLayoutProps) {

  return (
    <SidebarLayout
      items={navigationItems}
      basePath="/dashboard"
      sidebarTop={
        <div className="px-4 py-6">
          <Image src={logo} alt="Cxperia Logo" className=" h-10 w-24" />
        </div>
      }
    >
      {children}
      <MobileBottomNav />
    </SidebarLayout>
  );
}