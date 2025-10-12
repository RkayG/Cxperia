// app/dashboard/layout.tsx (Server Component)
import Image from "next/image";
import MobileBottomNav from "@/components/MobileBottomNavbar";
import SidebarLayout, { SidebarItem } from "@/components/sidebar-layout";
import { BrandProvider } from "@/contexts/BrandContext";
import DashboardNavigationProgress from "./components/DashboardNavigationProgress";
import logo from '@/assets/logo.png'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems: SidebarItem[] = [
  {
    name: "Aperçu",
    href: "/overview",
    icon: "BarChart4", // Dashboard/analytics icon
    type: "item",
  },
  {
    name: "Accueil",
    href: "/",
    icon: "HomeIcon",
    type: "item",
  },
  {
    type: 'label',
    name: 'Gérer',
  },
  {
    name: "Produits",
    href: "/products",
    icon: "ShoppingBag",
    type: "item",
  },
  {
    name: "Contenu",
    href: "/content",
    icon: "Book", // Content/writing icon
    type: "item",
  },

  {
    name: "Commentaires",
    href: "/feedback",
    icon: "Users", // Feedback from users icon
    type: "item",
  },
  {
    name: "Profil",
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
  // Add render tracking

  return (
    <BrandProvider>
      <DashboardNavigationProgress />
      <SidebarLayout
        items={navigationItems}
        basePath="/dashboard"
        sidebarTop={
          <div className="px-4 py-6" suppressHydrationWarning>
            <Image src={logo} alt="Cxperia Logo" className=" h-10 w-24" />
          </div>
        }
      >
        {children}
        <MobileBottomNav />
      </SidebarLayout>
    </BrandProvider>
  );
}