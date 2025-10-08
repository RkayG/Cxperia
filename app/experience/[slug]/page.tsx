import React from "react";
import { notFound } from "next/navigation";
import UnifiedExperienceWrapper from "./components/UnifiedExperienceWrapper";
import { getExperienceBySlug } from "@/lib/data/experiences";
import { usePublicExpStore } from "@/store/public/usePublicExpStore"; 

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ExperiencePage: React.FC<ExperiencePageProps> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const urlParams = await searchParams;
  
  // Fetch experience data server-side
  const experience = await getExperienceBySlug(slug);
  
  if (!experience) {
    notFound();
  }

  // Extract data from experience
  // Check for color parameter first, then fall back to database value
  const urlColor = urlParams.color as string;
  const experienceData = experience && typeof experience === 'object' && 'data' in experience ? (experience as any).data : null;
  const color = urlColor || experienceData?.primary_color || "#6366f1";

  const product = experienceData?.product;
  const brandLogo = experienceData?.brand?.logo_url;
  const brandName = experienceData?.brand?.name;
  const customer_support_links_simple = experienceData?.customer_support_links_simple || [];

  return (
    <UnifiedExperienceWrapper
      slug={slug}
      color={color}
      product={product}
      brandLogo={brandLogo}
      brandName={brandName}
      customer_support_links_simple={customer_support_links_simple}
    />
  );
};

export default ExperiencePage;
