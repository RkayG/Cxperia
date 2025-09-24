import HeroSection from '@/components/hero';
import PostPurchaseSection from '@/components/post-purchase';
import QRCodeSection from '@/components/qr-code-section';
import GainFeedbackSection from '@/components/gain-feedback';
export default async function IndexPage() {

  return (
    <>
    
        <HeroSection />
        <PostPurchaseSection />
        <QRCodeSection />
        <GainFeedbackSection />
    </>
  );
}
