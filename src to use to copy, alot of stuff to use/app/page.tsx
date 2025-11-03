import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { WhyChooseUs } from '@/components/marketing/why-choose-us';
import { Pricing } from '@/components/marketing/pricing';
import { Trust } from '@/components/marketing/trust';
import { Testimonials } from '@/components/marketing/testimonials';
import { CTA } from '@/components/marketing/cta';
import { FAQ } from '@/components/marketing/faq';
import { LazyWrapper } from '@/components/common/lazy-wrapper';
import { OnlineChat } from '@/components/common/online-chat';
import { WhatsAppChatbot } from '@/components/common/whatsapp-chatbot';
import { ExitIntentPopup } from '@/components/marketing/exit-intent-popup';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
        <main>
          <LazyWrapper>
            <Hero />
          </LazyWrapper>
          <LazyWrapper>
            <Features />
          </LazyWrapper>
          <LazyWrapper>
            <WhyChooseUs />
          </LazyWrapper>
          <LazyWrapper>
            <Pricing />
          </LazyWrapper>
          <LazyWrapper>
            <Trust />
          </LazyWrapper>
          <LazyWrapper>
            <Testimonials />
          </LazyWrapper>
          <LazyWrapper>
            <CTA />
          </LazyWrapper>
          <LazyWrapper>
            <FAQ />
          </LazyWrapper>
        </main>
      <Footer />
      <OnlineChat />
      <WhatsAppChatbot />
      <ExitIntentPopup />
    </div>
  );
}