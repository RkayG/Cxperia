import HeroSection from '@/components/hero';
import PostPurchaseSection from '@/components/post-purchase';
import QRCodeSection from '@/components/qr-code-section';
import GainFeedbackSection from '@/components/gain-feedback';
import DesignedForSection from '@/components/designed-for';
import { PricingCard } from '@/components/pricing';
import { Footer } from '@/components/footer';

export default async function IndexPage() {

  return (
    <>
      <HeroSection />
      <PostPurchaseSection />
      <QRCodeSection />
      <GainFeedbackSection />
      <DesignedForSection />
      <PricingCard  />
      <Footer />
    </>
  );
}
