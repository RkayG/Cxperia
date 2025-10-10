import { redirect } from 'next/navigation';

interface IngredientsPageProps {
  params: Promise<{ slug: string }>;
}

const IngredientsPage: React.FC<IngredientsPageProps> = async ({ params }) => {
  const { slug } = await params;
  
  // Redirect to main experience page with ingredients section
  redirect(`/experience/${slug}?section=ingredients`);
};

export default IngredientsPage;
