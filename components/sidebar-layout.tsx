"use client";

import { 
  BadgePercent, 
  BarChart4, 
  Book,
  Columns3, 
  Globe, 
  Locate, 
  LucideIcon,
  Menu, 
  MessageCircle, 
  Settings2, 
  ShoppingBag,
  ShoppingCart,
  Users,
  HomeIcon,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import PlatformFeedbackModal from "./ui/platform-feedback-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

// Create an icon map
const iconMap: Record<string, LucideIcon> = {
  Globe,
  ShoppingBag,
  Users,
  Columns3,
  Locate,
  BarChart4,
  ShoppingCart,
  BadgePercent,
  Settings2,
  Book,
  MessageCircle,
  HomeIcon,
  MessageSquare,
};

function useSegment(basePath: string) {
  const path = usePathname();
  const result = path.slice(basePath.length, path.length);
  return result ? result : "/";
}

type Item = {
  name: React.ReactNode;
  href: string;
  icon: string; // Change from LucideIcon to string
  type: "item";
};

type Sep = {
  type: "separator";
};

type Label = {
  name: React.ReactNode;
  type: "label";
};

export type SidebarItem = Item | Sep | Label;

function NavItem(props: {
  item: Item;
  onClick?: () => void;
  basePath: string;
}) {
  const segment = useSegment(props.basePath);
  const selected = segment === props.item.href;
  const IconComponent = iconMap[props.item.icon];

  return (
    <Link
      href={props.basePath + props.item.href}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        selected && "bg-purple-200",
        "flex-grow justify-start text-md bricolage-grotesque-light text-black dark:text-zinc-300 px-2"
      )}
      onClick={props.onClick}
      prefetch={true}
    >
      {/* Remove the fragment and put all children directly under Link */}
      {IconComponent && <IconComponent className="mr-2 h-5 w-5" />}
      {props.item.name}
    </Link>
  );
}

function SidebarContent(props: {
  onNavigate?: () => void;
  items: SidebarItem[];
  sidebarTop?: React.ReactNode;
  basePath: string;
  onFeedbackClick?: () => void;
}) {
  //const path = usePathname();
  //const segment = useSegment(props.basePath);

  return (
    <div className="flex flex-col h-full items-stretch">
      
      <div className="h-14 flex items-center px-2 shrink-0 mr-10 md:mr-0 border-b">
        {props.sidebarTop}
      </div>
      {/* Add Create button here */}
      <div className="p-4 space-y-3 shrink-0">
        <Link
          href="/dashboard/experience/create?step=product-details&new=true"
          className={cn(buttonVariants({ variant: 'default' }), "w-full")}
        >
          Create
        </Link>
        <button
          onClick={props.onFeedbackClick}
          className={cn(buttonVariants({ variant: 'outline' }), "w-full flex items-center gap-2")}
        >
          <MessageSquare size={16} />
          Send Feedback
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-2 pt-4 overflow-y-auto">
        {props.items.map((item, index) => {
          if (item.type === "separator") {
            return <Separator key={index} className="my-2" />;
          } else if (item.type === "item") {
            return (
              <div key={index} className="flex px-2">
                <NavItem
                  item={item}
                  onClick={props.onNavigate}
                  basePath={props.basePath}
                />
              </div>
            );
          } else {
            return (
              <div key={index} className="flex my-2">
                <div className="flex-grow justify-start text-sm font-medium text-zinc-500 px-2">
                  {item.name}
                </div>
              </div>
            );
          }
        })}

        <div className="flex-grow" />
      </div>
      
    </div>
  );
}

export type HeaderBreadcrumbItem = { title: string; href: string };

function HeaderBreadcrumb(props: { items: SidebarItem[], baseBreadcrumb?: HeaderBreadcrumbItem[], basePath: string }) {
  const segment = useSegment(props.basePath);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const item = props.items.find((item) => item.type === 'item' && item.href === segment);
  const title: string | undefined = (item as any)?.name;
  // Get brand from store
  const brand = require('@/store/brands/useExperienceStore').useExperienceStore((state: any) => state.brand);

  // Get brand name with proper validation
  const brandName = brand?.name?.trim();
  const hasValidBrand = brandName && brandName.length > 0;

  // Custom route handling for specific paths
  const getCustomBreadcrumb = () => {
    const mode = searchParams.get('mode');

    // Handle experience routes
    if (pathname.includes('/dashboard/experience/create')) {
      return {
        items: [
          { title: 'Create Experience', href: '/dashboard/experience/create' }
        ]
      };
    }
    
    if (pathname.includes('/dashboard/experience/edit')) {
      return {
        items: [
          { title: 'Edit Experience', href: '/dashboard/experience/edit' }
        ]
      };
    }
    
    if (pathname.includes('/dashboard/experience/preview')) {
      return {
        items: [
          { title: 'Preview Experience', href: '/dashboard/experience/preview' }
        ]
      };
    }

    // Handle tutorial routes
    if (pathname.includes('/dashboard/content/tutorial')) {
      const tutorialItems = [
        { title: 'Content', href: '/dashboard/content' }
      ];
      
      if (mode === 'create') {
        tutorialItems.push({ title: 'Create Tutorial', href: '/dashboard/content/tutorial?mode=create' });
      } else if (mode === 'edit') {
        tutorialItems.push({ title: 'Edit Tutorial', href: '/dashboard/content/tutorial?mode=edit' });
      } else {
        tutorialItems.push({ title: 'Tutorial', href: '/dashboard/content/tutorial' });
      }
      
      return { items: tutorialItems };
    }

    return null;
  };

  const customBreadcrumb = getCustomBreadcrumb();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {hasValidBrand && (
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/home">{brandName}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        
        {/* Render custom breadcrumb items if available */}
        {customBreadcrumb?.items.map((item, index) => (
          <React.Fragment key={index}>
            {hasValidBrand && index === 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < customBreadcrumb.items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
        
        {/* Fallback to default title if no custom breadcrumb */}
        {!customBreadcrumb && (
          <>
            {hasValidBrand && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function SidebarLayout(props: {
  children?: React.ReactNode;
  baseBreadcrumb?: HeaderBreadcrumbItem[];
  items: SidebarItem[];
  sidebarTop?: React.ReactNode;
  basePath: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <div className="w-full flex min-h-screen">
      <div className="fixed left-0 top-0 flex-col border-r w-[240px] bg-[#ede8f3] h-screen hidden lg:flex z-30">
        <SidebarContent 
          items={props.items} 
          sidebarTop={props.sidebarTop} 
          basePath={props.basePath}
          onFeedbackClick={() => setFeedbackModalOpen(true)}
        />
      </div>
      <div className="flex flex-col flex-grow w-0 lg:ml-[240px]">
        <div className="h-14 border-b flex items-center justify-between bg-white dark:bg-black px-4 md:px-6">
          <div className="hidden lg:flex">
            <Suspense fallback={<div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>}>
              <HeaderBreadcrumb baseBreadcrumb={props.baseBreadcrumb} basePath={props.basePath} items={props.items} />
            </Suspense>
          </div>

          <div className="flex items-center lg:hidden">
            <Sheet
              onOpenChange={(open) => setSidebarOpen(open)}
              open={sidebarOpen}
            >
              <SheetTrigger>
                <Menu />
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <SidebarContent
                  onNavigate={() => setSidebarOpen(false)}
                  items={props.items}
                  sidebarTop={props.sidebarTop}
                  basePath={props.basePath}
                  onFeedbackClick={() => {
                    setSidebarOpen(false);
                    setFeedbackModalOpen(true);
                  }}
                />
              </SheetContent>
            </Sheet>

            <div className="ml-4 flex lg:hidden">
              <Suspense fallback={<div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>}>
                <HeaderBreadcrumb baseBreadcrumb={props.baseBreadcrumb} basePath={props.basePath} items={props.items} />
              </Suspense>
            </div>
          </div>

          {/* Feedback Button - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare size={16} />
              Send Feedback
            </button>
          </div>
        </div>
        <div className="flex-grow bg-gray-50">{props.children}</div>
      </div>
      
      {/* Feedback Modal */}
      <PlatformFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </div>
  );
}
