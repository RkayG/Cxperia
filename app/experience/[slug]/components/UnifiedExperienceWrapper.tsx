'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import YouHaveScanned from "./YouHaveScanned";
import FeatureGrid from "./homepage/FeatureGrid";
import ThemeAwareHeader from "./homepage/ThemeAwareHeader";
import SectionHeader from "./ThemeAwareSectionHeader";
import SectionNavigation from "./SectionNavigation";

// Import all the component sections
import IngredientsSection from "../ingredients/components/IngredientSection";
import ProductDisplay from "../usage-instructions/components/ProductDisplay";
import InstructionsSection from "../usage-instructions/components/InstructionsSection";
import RatingSection from "../feedback/components/RatingSection";
import FeedbackForm from "../feedback/components/FeedbackForm";
import ImageUpload from "../feedback/components/ImageUpload";
import ThankYouModal from "../feedback/components/ThankYouModal";
import ClientTutorialsWrapper from "../tutorials/components/ClientTutorialsWrapper";

// Import hooks for feedback functionality
import { useCreatePublicFeedback } from '@/hooks/public/usePublicFeedbackApi';
import { showToast } from '@/utils/toast';

interface UnifiedExperienceWrapperProps {
  slug: string;
  color: string;
  product: any;
  brandLogo?: string;
  brandName?: string;
  customer_support_links_simple: any[];
}

type ActiveSection = 'home' | 'ingredients' | 'feedback' | 'usage-instructions' | 'support-channels' | 'tutorials';

const UnifiedExperienceWrapper: React.FC<UnifiedExperienceWrapperProps> = ({
  slug,
  color,
  product,
  brandLogo,
  brandName,
  customer_support_links_simple,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNewCustomer, setIsNewCustomer] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Feedback form state
  const feedbackFormRef = React.useRef<HTMLTextAreaElement>(null);
  const createFeedbackMutation = useCreatePublicFeedback(slug);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  // Check URL params for section
  useEffect(() => {
    const section = searchParams.get('section') as ActiveSection;
    if (section && ['home', 'ingredients', 'feedback', 'usage-instructions', 'support-channels', 'tutorials'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Check if this is a new customer (first-time visitor to this specific experience)
  useEffect(() => {
    const checkNewCustomer = () => {
      // Check localStorage for previous visits to this specific experience
      const visitedExperiences = JSON.parse(localStorage.getItem('visitedExperiences') || '[]') as string[];
      const hasVisitedThisExperience = visitedExperiences.includes(slug);
      const isNewCustomer = !hasVisitedThisExperience;
      
   /*    console.log('🔍 UnifiedExperienceWrapper customer check:', { 
        slug, 
        visitedExperiences, 
        hasVisitedThisExperience, 
        isNewCustomer 
      }); */
      
      setIsNewCustomer(isNewCustomer);
      
      // Mark this experience as visited for future visits
      if (isNewCustomer && slug) {
        const updatedVisitedExperiences = [...visitedExperiences, slug] as string[];
        localStorage.setItem('visitedExperiences', JSON.stringify(updatedVisitedExperiences));
        //console.log('✅ UnifiedExperienceWrapper marked experience as visited:', slug);
      }
    };

    checkNewCustomer();
  }, [slug]);

  // Navigation functions
  const navigateToSection = (section: ActiveSection) => {
    setActiveSection(section);
    setHasInteracted(true); // Hide YouHaveScanned when user interacts
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('section', section);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Support channels mapping
  const SUPPORT_TYPE_MAP: Record<string, { icon: string; getLink: (v: string) => string; description: string }> = {
    whatsapp: {
      icon: "/icons/whatsapp.svg",
      getLink: (v) => `https://wa.me/${v.replace(/[^\d]/g, "")}`,
      description: "Chattez avec nous sur WhatsApp",
    },
    email: {
      icon: "/icons/email.png",
      getLink: (v) => `mailto:${v}`,
      description: "Envoyez-nous un email",
    },
    phone: {
      icon: "/icons/phone.png",
      getLink: (v) => `tel:${v}`,
      description: "Appelez-nous",
    },
    faq: {
      icon: "/icons/faq.png",
      getLink: (v) => v,
      description: "Trouvez des réponses instantanément",
    },
    instagram: {
      icon: "/icons/instagram.png",
      getLink: (v) => v,
      description: "Suivez-nous pour les mises à jour",
    },
    facebook: {
      icon: "/icons/facebook.svg",
      getLink: (v) => v,
      description: "Connectez-vous sur Facebook",
    },
    twitter: {
      icon: "/icons/twitter.png",
      getLink: (v) => v,
      description: "Restez connecté sur X",
    },
  };

  const supportOptions = customer_support_links_simple
    .map((item: any) => {
      const map = SUPPORT_TYPE_MAP[item.type?.toLowerCase()];
      if (!map) return null;
      return {
        type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        icon: map.icon,
        link: map.getLink(item.value),
        description: map.description,
      };
    })
    .filter(Boolean);

  // Feedback submission logic
  const handleRatingSelected = (selectedRating: number) => {
    setRating(selectedRating);
    setTimeout(() => {
      if (feedbackFormRef.current) {
        feedbackFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          feedbackFormRef.current?.focus();
        }, 600);
      }
    }, 150);
  };

  const handleSubmitFeedback = async () => {
    if (!slug) {
      // Experience not found
      showToast.error('Expérience non trouvée');
      return;
    }

    const hasRating = rating !== null && rating > 0;
    const hasComment = feedback.trim().length > 0;
    const hasImages = images.length > 0;

    if (!hasRating && !hasComment && !hasImages) {
      // Please provide a rating, comment, or upload an image to submit feedback
      showToast.error('Veuillez fournir une note, un commentaire, ou un upload d\'image pour envoyer le feedback');
      return;
    }

    try {
      await createFeedbackMutation.mutateAsync({
        customer_name: customerName.trim() || undefined,
        customer_email: customerEmail.trim() || undefined,
        overall_rating: rating || undefined,
        comment: feedback.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      });

      setShowThankYouModal(true);
      
      // Reset form
      setRating(null);
      setFeedback('');
      setCustomerName('');
      setCustomerEmail('');
      setImages([]);
      
    } catch (error) {
     // console.error('Error submitting feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Échec de la soumission du feedback. Veuillez réessayer.';
      // Failed to submit feedback. Please try again.
      showToast.error(errorMessage);
    }
  };

  // Show loading while determining customer status
  if (isNewCustomer === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: color }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show YouHaveScanned for new customers who haven't interacted yet
  if (isNewCustomer === true && !hasInteracted) {
    //console.log('🎉 UnifiedExperienceWrapper showing YouHaveScanned for new customer');
    return <YouHaveScanned onSectionChange={navigateToSection} slug={slug} />;
  }

  // Show regular home page for returning customers
  if (isNewCustomer === false) {
   // console.log('🏠 UnifiedExperienceWrapper showing home page for returning customer');
  }

  // Render the appropriate section
  const renderSection = () => {
    switch (activeSection) {
      case 'ingredients':
        return (
          <div className="min-h-screen bg-neutral-100 font-sans flex justify-center" style={{ backgroundColor: color }}>
            <div className="max-w-xl mx-auto w-full bg-white shadow-lg overflow-hidden">
              <SectionHeader title="Ingredients" subtitle="Découvrez les ingrédients qui rendent notre produit unique et efficace." color={color} />
              <main className="p-4 space-y-6 rounded-tl-3xl">
                <ProductDisplay color={color} product={product} />
                <IngredientsSection color={color} />
              </main>
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="min-h-screen font-sans flex justify-center scroll-smooth" style={{ backgroundColor: color }}>
            <div className="max-w-xl mx-auto pb-12 w-full bg-white shadow-lg overflow-hidden">
              <SectionHeader title="Feedback" subtitle="Partagez vos thoughts et aidez-nous à améliorer votre expérience." color={color} />
              <main className="p-4 space-y-6 rounded-tl-3xl bg-gray-50">
                <div data-rating-section>
                  <RatingSection 
                    onRatingSelected={handleRatingSelected}
                    selectedRating={rating}
                    color={color}
                  />
                </div>
                <FeedbackForm 
                  feedbackFormRef={feedbackFormRef}
                  feedback={feedback}
                  onFeedbackChange={setFeedback}
                  customerName={customerName}
                  onCustomerNameChange={setCustomerName}
                  customerEmail={customerEmail}
                  onCustomerEmailChange={setCustomerEmail}
                  color={color}
                />
                <ImageUpload 
                  images={images}
                  onImagesChange={setImages}
                  color={color}
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={createFeedbackMutation.status === 'pending'}
                  className="w-full py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ backgroundColor: color }}
                >
                  {createFeedbackMutation.status === 'pending' ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi...
                    </>
                  ) : (
                    'Envoyer Feedback'
                  )}
                </button>
              </main>
            </div>
          </div>
        );

      case 'usage-instructions':
        return (
          <div className="min-h-screen bg-gray-50 flex justify-center" style={{ backgroundColor: color }}>
            <div className="max-w-xl mx-auto w-full bg-white shadow-lg overflow-hidden">
              <SectionHeader title="Instructions" subtitle="Découvrez comment utiliser notre produit efficacement." color={color} />
              <main className="p-4 space-y-6 rounded-tl-3xl">
                <ProductDisplay color={color} product={product} />
                <InstructionsSection color={color} />
              </main>
            </div>
          </div>
        );

      case 'support-channels':
        return (
          <div className="flex min-h-screen justify-center bg-gray-50 font-sans" style={{ backgroundColor: color }}>
            <div className="w-full max-w-xl bg-gray-50">
              <SectionHeader title="Nous sommes ici pour vous aider" subtitle="Choisissez votre façon préférée de nous contacter" color={color} />
              <main className="mt-2 space-y-4 rounded-tl-3xl bg-gray-50">
                {supportOptions.length === 0 && (
                  <div className="py-8 text-center text-gray-500">Aucune option de support disponible.</div>
                )}
                {supportOptions.map((option: any) => (
                  <a
                    key={option.type}
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto flex max-w-xs border items-center gap-4 rounded-2xl bg-gray-200 p-4 text-center shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:max-w-md md:max-w-lg"
                    style={{ borderBottom: `4px solid ${color}` }}
                  >
                    <img src={option.icon} alt={option.type} className="h-10 w-10 object-contain" />
                    <div>
                      <div className="text-left font-semibold text-gray-800">{option.type}</div>
                      <div className="text-center text-sm text-gray-800">{option.description}</div>
                    </div>
                  </a>
                ))}
              </main>
            </div>
          </div>
        );

      case 'tutorials':
        return (
          <div className="min-h-screen" style={{ backgroundColor: color }}>
            <div className="max-w-xl mx-auto bg-gray-50 min-h-screen overflow-hidden">
              <ClientTutorialsWrapper slug={slug} color={color} />
            </div>
          </div>
        );

      case 'home':
      default:
        return (
          <div className="min-h-screen" style={{ backgroundColor: color }}>
            <div className="max-w-xl mx-auto bg-gray-50 min-h-screen overflow-hidden">
              <ThemeAwareHeader color={color} brandLogo={brandLogo} brandName={brandName} />
              <main className="rounded-3xl bg-gray-50 space-y-4">
                <FeatureGrid 
                  onSectionChange={navigateToSection}
                  color={color}
                />
              </main>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderSection()}
      <SectionNavigation 
        activeSection={activeSection}
        onSectionChange={navigateToSection}
        color={color}
        slug={slug}
      />
      
      {/* Thank You Modal */}
      <ThankYouModal 
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        customerName={customerName}
        slug={slug}
      />
    </>
  );
};

export default UnifiedExperienceWrapper;
