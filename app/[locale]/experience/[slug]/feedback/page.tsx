import { redirect } from 'next/navigation';

interface FeedbackPageProps {
  params: Promise<{ slug: string }>;
}

const FeedbackPage: React.FC<FeedbackPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Redirect to main experience page with feedback section
  redirect(`/experience/${slug}?section=feedback`);
};

export default FeedbackPage;
