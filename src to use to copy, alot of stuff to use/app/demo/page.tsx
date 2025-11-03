import { DemoMode } from '@/components/demo/demo-mode';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20">
        <DemoMode />
      </div>
      <Footer />
    </div>
  );
}