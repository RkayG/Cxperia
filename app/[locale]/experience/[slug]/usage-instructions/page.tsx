import { redirect } from 'next/navigation';

interface UsageInstructionsPageProps {
  params: Promise<{ slug: string }>;
}

const DigitalInstructionsPage: React.FC<UsageInstructionsPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Redirect to main experience page with usage-instructions section
  redirect(`/experience/${slug}?section=usage-instructions`);
};

export default DigitalInstructionsPage;
