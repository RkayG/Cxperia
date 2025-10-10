import { redirect } from 'next/navigation';

interface SupportChannelsPageProps {
  params: Promise<{ slug: string }>;
}

const CustomerSupportPage: React.FC<SupportChannelsPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Redirect to main experience page with support-channels section
  redirect(`/experience/${slug}?section=support-channels`);
};

export default CustomerSupportPage;
