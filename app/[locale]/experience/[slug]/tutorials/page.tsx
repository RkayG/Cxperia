import React from 'react';
import { notFound } from 'next/navigation';
import ClientTutorialsWrapper from './components/ClientTutorialsWrapper';
import { getExperienceBySlug } from '@/lib/data/experiences';


interface TutorialsPageProps {
  params: Promise<{ slug: string }>;
}

const TutorialPage: React.FC<TutorialsPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Fetch experience data server-side
  const experience = await getExperienceBySlug(slug);
  
  if (!experience) {
    notFound();
  }

  // Extract data from experience
  const color = experience.data?.primary_color || "#6366f1";

  return (
    <ClientTutorialsWrapper
      slug={slug}
      color={color}
    />
  );
};

export default TutorialPage
