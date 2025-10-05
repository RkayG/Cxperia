
import DesignedForSection from '@/components/designed-for';
import { Footer } from '@/components/footer';
import GainFeedbackSection from '@/components/gain-feedback';
import HeroSection from '@/components/hero';
import PostPurchaseSection from '@/components/post-purchase';
import { PricingCard } from '@/components/pricing';
import QRCodeSection from '@/components/qr-code-section';
import { redirect } from 'next/navigation';


export default async function IndexPage() {

  redirect('/dashboard');
/* 
  return (
    <>
       <div className='bg-[#e9c0e9]'>
      <HeroSection />
      <PostPurchaseSection />
      <QRCodeSection />
      <GainFeedbackSection />
      <DesignedForSection />
      <PricingCard  />
      <Footer />
      </div> *
   
    </> 
  );*/
}
