import React from "react";
import { notFound } from "next/navigation";
import UnifiedExperienceWrapper from "./components/UnifiedExperienceWrapper";
import { getExperienceBySlug } from "@/lib/data/experiences";

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
}

const ExperiencePage: React.FC<ExperiencePageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Fetch experience data server-side
  const experience = await getExperienceBySlug(slug);
  
  if (!experience) {
    notFound();
  }

  // Extract data from experience
  const color = experience.data?.primary_color || "#6366f1";
  const product = experience.data?.product;
  const brandLogo = experience.data?.brand?.logo_url;
  const brandName = experience.data?.brand?.name;
  const customer_support_links_simple = experience.data?.customer_support_links_simple || [];

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
